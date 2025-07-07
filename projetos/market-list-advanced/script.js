let net;
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const resultDiv = document.getElementById('result');
const priceSection = document.getElementById('price-section');
const priceInput = document.getElementById('price-input');
const shoppingList = document.getElementById('shopping-list');
const ctx = canvas.getContext('2d');

let currentItemName = '';

// Inicializa a câmera
async function setupCamera() {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: { exact: "environment" } }, // Força a câmera traseira
    audio: false
  });
  video.srcObject = stream;
}

// Carrega o modelo e inicia a câmera
async function init() {
  resultDiv.textContent = 'Carregando modelo...';
  net = await mobilenet.load();
  resultDiv.textContent = 'Modelo carregado. Aponte a câmera para o item.';
  await setupCamera();
}

document.getElementById('capture-btn').addEventListener('click', async () => {
  // Desenha o frame do vídeo no canvas
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  const prediction = await net.classify(canvas);
  if (prediction.length > 0) {
    currentItemName = prediction[0].className.split(',')[0]; // pega o primeiro nome
    resultDiv.innerHTML = `Item detectado: <strong>${currentItemName}</strong>`;
    priceSection.style.display = 'block';
  } else {
    resultDiv.textContent = 'Não foi possível reconhecer o item.';
    priceSection.style.display = 'none';
  }
});

// Adiciona à lista
document.getElementById('add-btn').addEventListener('click', () => {
  const price = parseFloat(priceInput.value);
  if (!currentItemName || isNaN(price) || price <= 0) {
    alert('Informe um valor válido.');
    return;
  }

  const li = document.createElement('li');
  li.className = 'list-group-item';
  li.textContent = `${capitalize(currentItemName)} - R$${price.toFixed(2)}`;
  shoppingList.appendChild(li);

  // Reset
  priceInput.value = '';
  priceSection.style.display = 'none';
  resultDiv.textContent = '';
});

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

init();
