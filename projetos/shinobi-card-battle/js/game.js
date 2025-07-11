let playerChakra = 20;
let enemyChakra = 20;
let playerHand = [];
let playerField = [];

$(document).ready(function () {
  $.getJSON('data/cards.json', function (data) {
    // Pega 5 cartas aleatórias para a mão inicial
    playerHand = data.cards.sort(() => 0.5 - Math.random()).slice(0, 5);
    renderHand();
  });

  $('#end-turn').click(function () {
    alert('Turno encerrado. (Exemplo)');
    // Chakra regeneração
    if (playerChakra < 20) playerChakra += 2;
    $('#player-chakra').text(playerChakra);
  });
});

function renderHand() {
  $('#player-hand').empty();
  playerHand.forEach((card, index) => {
    const cardHtml = `
      <div class="card" onclick="playCard(${index})">
        <img src="${card.image}" alt="${card.name}">
        <div class="card-body">
          <strong>${card.name}</strong><br>
          ATK: ${card.atk} | DEF: ${card.def}<br>
          Tipo: ${card.type}<br>
          Custo: ${card.cost}
        </div>
      </div>`;
    $('#player-hand').append(cardHtml);
  });
}

function playCard(index) {
  const card = playerHand[index];
  if (playerChakra < card.cost) {
    alert("Chakra insuficiente!");
    return;
  }
  playerChakra -= card.cost;
  $('#player-chakra').text(playerChakra);
  playerField.push(card);
  playerHand.splice(index, 1);
  renderHand();
  renderField();
}

function renderField() {
  $('#player-field').empty();
  playerField.forEach(card => {
    const cardHtml = `
      <div class="card">
        <img src="${card.image}" alt="${card.name}">
        <div class="card-body">
          <strong>${card.name}</strong><br>
          ATK: ${card.atk} | DEF: ${card.def}<br>
          Tipo: ${card.type}
        </div>
      </div>`;
    $('#player-field').append(cardHtml);
  });
}
