let playerTeam = [];
let pcTeam = [];
let playerIndex = 0;
let pcIndex = 0;
let player, pc;
let movesData = {};
let playerHPMap = {};
let pcHPMap = {};
let effectivenessChart = {};

const attackSound = new Audio("sounds/attack.mp3");
const faintSound = new Audio("sounds/faint.mp3");
const superEffectiveSound = new Audio("sounds/super-effective.mp3");
const battleMusic = new Audio("sounds/battle-theme.mp3");
battleMusic.loop = true;

function getEffectiveness(attackType, targetType) {
  return effectivenessChart[attackType]?.[targetType] ?? 1;
}

function calcDamage(attacker, defender, move) {
  const power = move.power;
  debugger;
  const effective = getEffectiveness(move.type, defender.type);
  const base = attacker.atk + power;
  const rawDamage = base * effective - defender.def;
  return {
    damage: Math.max(Math.floor(rawDamage), 0),
    effective
  };
}

function updateUI() {
  const currentPlayerHP = playerHPMap[playerIndex];
  const currentPcHP = pcHPMap[pcIndex];

  $('#player-pokemon').text(player.name);
  $('#pc-pokemon').text(pc.name);
  $('#player-hp').text(Math.max(currentPlayerHP, 0));
  $('#pc-hp').text(Math.max(currentPcHP, 0));
  updateBar($('#player-hp-bar'), currentPlayerHP, player.hp);
  updateBar($('#pc-hp-bar'), currentPcHP, pc.hp);
  $('#player-sprite').attr('src', `sprites/back/${player.name}.png`);
  $('#pc-sprite').attr('src', `sprites/front/${pc.name}.png`);
}

function updateBar($bar, current, max) {
  const percent = Math.max((current / max) * 100, 0);
  let color = percent > 60 ? 'green' : percent > 30 ? 'yellow' : 'red';
  $bar.removeClass('green yellow red').addClass(color).css('width', percent + '%');
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function checkFaintAndSwitch() {
  if (playerHPMap[playerIndex] <= 0) {
    const available = playerTeam
      .map((poke, idx) => ({ ...poke, index: idx }))
      .filter(p => playerHPMap[p.index] > 0 && p.index !== playerIndex);

    if (available.length === 0) {
      $('#log').append("<br>💀 Você perdeu todos os seus Pokémon!");
      $('.move-btn').prop('disabled', true);
      battleMusic.pause();
      return;
    }

    $('#switch-options').empty();
    playerTeam.forEach((poke, idx) => {
      if (idx === playerIndex) return;
      const hp = playerHPMap[idx];
      const disabled = hp <= 0 ? 'disabled' : '';
      const percent = Math.max((hp / poke.hp) * 100, 0);
      const color = hp <= 0 ? 'red' : percent > 60 ? 'green' : percent > 30 ? 'yellow' : 'red';

      $('#switch-options').append(`
        <div class="col-md-4 mb-3">
          <button class="btn btn-outline-${hp <= 0 ? 'secondary' : 'success'} w-100 switch-btn" data-index="${idx}" ${disabled}>
            ${poke.name}
            <div class="hp-bar-container mt-2">
              <div class="hp-bar ${color}" style="width: ${percent}%;"></div>
            </div>
          </button>
        </div>
      `);
    });

    const modal = new bootstrap.Modal(document.getElementById('switchModal'));
    modal.show();

    $('.switch-btn').on('click', function () {
      const chosen = parseInt($(this).data('index'));
      playerIndex = chosen;
      player = playerTeam[playerIndex];
      updateUI();

      $('#move-options').empty();
      player.moves.forEach(move => {
        $('#move-options').append(`<button class="btn btn-primary move-btn">${move}</button>`);
      });

      $('.move-btn').on('click', function () {
        if (playerHPMap[playerIndex] <= 0 || pcHPMap[pcIndex] <= 0) return;
        const move = $(this).text();
        executeTurn(move);
      });

      $('#log').append(`<br>⚠️ Você enviou ${player.name}!`);
      modal.hide();
    });

    return;
  }

  if (pcHPMap[pcIndex] <= 0) {
    pcIndex++;
    while (pcIndex < pcTeam.length && pcHPMap[pcIndex] <= 0) {
      pcIndex++;
    }

    if (pcIndex >= pcTeam.length) {
      $('#log').append("<br>🏆 Você venceu! O PC ficou sem Pokémon!");
      $('.move-btn').prop('disabled', true);
      battleMusic.pause();
      return;
    }

    pc = pcTeam[pcIndex];
    updateUI();
    $('#log').append(`<br>⚠️ O PC enviou ${pc.name}!`);
  }
}

async function executeTurn(playerMoveName) {
  $('.move-btn').prop('disabled', true);

  const playerMove = movesData[playerMoveName];
  const pcMoveName = pc.moves[Math.floor(Math.random() * 4)];
  const pcMove = movesData[pcMoveName];

  const pPriority = playerMove.priority;
  const cPriority = pcMove.priority;

  const playerFirst = (
    pPriority > cPriority ||
    (pPriority === cPriority && player.spe >= pc.spe)
  );

  if (playerFirst) {
    let { damage, effective } = calcDamage(player, pc, playerMove);
    pcHPMap[pcIndex] -= damage;
    const sound = effective > 1 ? superEffectiveSound : attackSound;
    sound.currentTime = 0; sound.play();

    $('#log').html(`${player.name} usou ${playerMove.name} causando ${damage} de dano.`);
    if (effective > 1) $('#log').append("<br><strong>É super efetivo!</strong>");
    if (effective < 1) $('#log').append("<br><em>O ataque não foi muito efetivo...</em>");
    updateUI();
    await delay(1000);

    if (pcHPMap[pcIndex] <= 0) {
      $('#log').append(`<br>${pc.name} desmaiou!`);
      faintSound.currentTime = 0; faintSound.play();
      updateUI();
      await delay(1000);
      checkFaintAndSwitch();
      $('.move-btn').prop('disabled', false);
      return;
    }

    let res = calcDamage(pc, player, pcMove);
    playerHPMap[playerIndex] -= res.damage;
    const pcSound = res.effective > 1 ? superEffectiveSound : attackSound;
    pcSound.currentTime = 0; pcSound.play();

    $('#log').append(`<br>${pc.name} usou ${pcMove.name} causando ${res.damage} de dano.`);
    if (res.effective > 1) $('#log').append("<br><strong>É super efetivo!</strong>");
    if (res.effective < 1) $('#log').append("<br><em>O ataque não foi muito efetivo...</em>");
    updateUI();
    await delay(1000);
  } else {
    let res = calcDamage(pc, player, pcMove);
    playerHPMap[playerIndex] -= res.damage;
    const pcSound = res.effective > 1 ? superEffectiveSound : attackSound;
    pcSound.currentTime = 0; pcSound.play();

    $('#log').html(`${pc.name} usou ${pcMove.name} causando ${res.damage} de dano.`);
    if (res.effective > 1) $('#log').append("<br><strong>É super efetivo!</strong>");
    if (res.effective < 1) $('#log').append("<br><em>O ataque não foi muito efetivo...</em>");
    updateUI();
    await delay(1000);

    if (playerHPMap[playerIndex] <= 0) {
      $('#log').append(`<br>${player.name} desmaiou!`);
      faintSound.currentTime = 0; faintSound.play();
      updateUI();
      await delay(1000);
      checkFaintAndSwitch();
      $('.move-btn').prop('disabled', false);
      return;
    }

    let { damage, effective } = calcDamage(player, pc, playerMove);
    pcHPMap[pcIndex] -= damage;
    const sound = effective > 1 ? superEffectiveSound : attackSound;
    sound.currentTime = 0; sound.play();

    $('#log').append(`<br>${player.name} usou ${playerMove.name} causando ${damage} de dano.`);
    if (effective > 1) $('#log').append("<br><strong>É super efetivo!</strong>");
    if (effective < 1) $('#log').append("<br><em>O ataque não foi muito efetivo...</em>");
    updateUI();
    await delay(1000);
  }

  checkFaintAndSwitch();
  $('.move-btn').prop('disabled', false);
}

$(document).ready(function () {
  $.when(
    $.getJSON("../pokemons.json"),
    $.getJSON("../moves.json"),
    $.getJSON("../effectiveness.json")
  ).done(function (pokeRes, moveRes, effectivenessRes) {
    const pokemons = pokeRes[0];
    const moves = moveRes[0];
    effectivenessChart = effectivenessRes[0];

    moves.forEach(m => {
      movesData[m.name] = m;
    });

    const playerTeamNames = JSON.parse(localStorage.getItem('playerTeam') || "[]");
    if (!playerTeamNames || playerTeamNames.length !== 6) {
      alert("Você precisa escolher 6 Pokémon antes de batalhar.");
      window.location.href = "../choose/index.html";
      return;
    }

    playerTeam = pokemons.filter(p => playerTeamNames.includes(p.name));

    while (pcTeam.length < 6) {
      const rand = pokemons[Math.floor(Math.random() * pokemons.length)];
      if (!playerTeamNames.includes(rand.name) && !pcTeam.includes(rand)) {
        pcTeam.push(rand);
      }
    }

    // Inicializa mapas de HP
    playerTeam.forEach((p, i) => playerHPMap[i] = p.hp);
    pcTeam.forEach((p, i) => pcHPMap[i] = p.hp);

    player = playerTeam[playerIndex];
    pc = pcTeam[pcIndex];

    updateUI();

    player.moves.forEach(move => {
      $('#move-options').append(`<button class="btn btn-primary move-btn">${move}</button>`);
    });

    $('.move-btn').on('click', function () {
      if (playerHPMap[playerIndex] <= 0 || pcHPMap[pcIndex] <= 0) return;
      const move = $(this).text();
      executeTurn(move);
    });

    $('body').one('click', () => {
      battleMusic.play().catch(() => {});
    });
  });
});
