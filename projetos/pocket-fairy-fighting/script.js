$(document).ready(function () {
  let playerHP = 100;
  let enemyHP = 100;

  $('#attack-btn').click(function () {
    if (playerHP <= 0 || enemyHP <= 0) return;

    // Dano aleatório entre 10 e 20
    const playerAttack = Math.floor(Math.random() * 11) + 10;
    const enemyAttack = Math.floor(Math.random() * 11) + 10;

    // Reduz vida
    enemyHP -= playerAttack;
    if (enemyHP < 0) enemyHP = 0;

    $('#enemy-hp').text(enemyHP);
    $('#log').text(`Pikachu usou Choque do Trovão e causou ${playerAttack} de dano!`);

    if (enemyHP <= 0) {
      $('#log').text("🎉 Pikachu venceu a batalha!");
      return;
    }

    setTimeout(function () {
      playerHP -= enemyAttack;
      if (playerHP < 0) playerHP = 0;

      $('#player-hp').text(playerHP);
      $('#log').text(`Charmander contra-atacou com Brasas e causou ${enemyAttack} de dano!`);

      if (playerHP <= 0) {
        $('#log').text("💀 Charmander venceu a batalha!");
      }
    }, 1000);
  });
});
