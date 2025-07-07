const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const resetButton = document.getElementById('reset');
const strike = document.querySelector('.strike');

let currentPlayer = 'X';
let board = ["", "", "", "", "", "", "", "", ""];
let isGameActive = true;

const winningConditions = [
  [0,1,2], // Linha 1
  [3,4,5], // Linha 2
  [6,7,8], // Linha 3
  [0,3,6], // Coluna 1
  [1,4,7], // Coluna 2
  [2,5,8], // Coluna 3
  [0,4,8], // Diagonal \
  [2,4,6]  // Diagonal /
];

function handleClick(event) {
  const cell = event.target;
  const index = cell.getAttribute('data-index');

  if (board[index] !== "" || !isGameActive) {
    return;
  }

  updateCell(cell, index);
  checkResult();
}

function updateCell(cell, index) {
  board[index] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.classList.add('taken');
}

function changePlayer() {
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusText.textContent = `Vez de: ${currentPlayer}`;
}

function checkResult() {
  let roundWon = false;

  winningConditions.forEach((condition, index) => {
    const [a, b, c] = condition;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      roundWon = true;
      showStrike(index);
    }
  });

  if (roundWon) {
    statusText.textContent = `Jogador ${currentPlayer} venceu!`;
    isGameActive = false;
    return;
  }

  if (!board.includes("")) {
    statusText.textContent = 'Empate!';
    isGameActive = false;
    return;
  }

  changePlayer();
}

function showStrike(index) {
  const positions = [
    { top: 50, left: 0, width: 310, rotate: 0 },     // Linha 1
    { top: 155, left: 0, width: 310, rotate: 0 },    // Linha 2
    { top: 260, left: 0, width: 310, rotate: 0 },    // Linha 3
    { top: 0, left: 50, width: 310, rotate: 90 },    // Coluna 1
    { top: 0, left: 155, width: 310, rotate: 90 },   // Coluna 2
    { top: 0, left: 260, width: 310, rotate: 90 },   // Coluna 3
    { top: 0, left: 0, width: 440, rotate: 45 },     // Diagonal \
    { top: 0, left: 0, width: 440, rotate: -45 }     // Diagonal /
  ];

  const pos = positions[index];
  strike.style.top = `${pos.top}px`;
  strike.style.left = `${pos.left}px`;
  strike.style.width = `${pos.width}px`;
  strike.style.transform = `rotate(${pos.rotate}deg)`;
  strike.style.opacity = 1;
}

function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  isGameActive = true;
  currentPlayer = 'X';
  statusText.textContent = `Vez de: ${currentPlayer}`;
  strike.style.opacity = 0;
  strike.style.width = 0;
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('taken');
  });
}

cells.forEach(cell => cell.addEventListener('click', handleClick));
resetButton.addEventListener('click', resetGame);
