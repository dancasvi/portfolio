let cartCount = 0;
let cartItems = [];

// Banco de produtos com nome e preço
const products = {
  'Camiseta Básica': 59.90,
  'Calça Jeans': 129.90,
  'Tênis Esportivo': 249.90,
  'Jaqueta Corta-Vento': 189.90
};

function addToCart(productName) {
  cartCount++;
  cartItems.push({
    name: productName,
    price: products[productName]
  });
  document.getElementById('cart-count').innerText = cartCount;
  showAddedModal(`${productName} foi adicionado ao carrinho!`);
}

function showCart() {
  const cartModal = document.getElementById('cart-modal');
  const cartList = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');

  // Limpar lista anterior
  cartList.innerHTML = '';

  if (cartItems.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'Seu carrinho está vazio.';
    cartList.appendChild(li);
    cartTotal.innerText = '';
  } else {
    // Agrupar itens
    const groupedItems = {};
    cartItems.forEach(item => {
      if (groupedItems[item.name]) {
        groupedItems[item.name].quantity += 1;
      } else {
        groupedItems[item.name] = {
          price: item.price,
          quantity: 1
        };
      }
    });

    let total = 0;

    // Mostrar itens agrupados
    for (const itemName in groupedItems) {
      const item = groupedItems[itemName];
      const subtotal = item.price * item.quantity;
      total += subtotal;

      const li = document.createElement('li');
      li.innerHTML = `
        ${itemName} - ${item.quantity}x R$ ${item.price.toFixed(2)} = R$ ${subtotal.toFixed(2)}
        <button class="remove-btn" onclick="removeItem('${itemName}')">Remover</button>
      `;
      cartList.appendChild(li);
    }

    cartTotal.innerHTML = `
      <strong>Total: R$ ${total.toFixed(2)}</strong>
      <button class="clear-btn" onclick="clearCart()">Esvaziar Carrinho</button>
    `;
  }

  cartModal.style.display = 'block';
}

function closeCart() {
  document.getElementById('cart-modal').style.display = 'none';
}

function removeItem(productName) {
  // Remove uma ocorrência do item
  const index = cartItems.findIndex(item => item.name === productName);
  if (index !== -1) {
    cartItems.splice(index, 1);
    cartCount--;
    document.getElementById('cart-count').innerText = cartCount;
  }
  showCart(); // Atualiza o modal
}

function clearCart() {
  cartItems = [];
  cartCount = 0;
  document.getElementById('cart-count').innerText = cartCount;
  showCart(); // Atualiza o modal
}

function finalizePurchase() {
  if (cartItems.length === 0) {
    alert('Seu carrinho está vazio!');
    return;
  }

  // Agrupar itens
  const groupedItems = {};
  cartItems.forEach(item => {
    if (groupedItems[item.name]) {
      groupedItems[item.name].quantity += 1;
    } else {
      groupedItems[item.name] = {
        price: item.price,
        quantity: 1
      };
    }
  });

  let total = 0;
  let message = '🛍️ *Meu Pedido:*\n\n';

  for (const itemName in groupedItems) {
    const item = groupedItems[itemName];
    const subtotal = item.price * item.quantity;
    total += subtotal;

    message += `• ${itemName} - ${item.quantity}x R$ ${item.price.toFixed(2)} = R$ ${subtotal.toFixed(2)}\n`;
  }

  message += `\n💰 *Total:* R$ ${total.toFixed(2)}`;
  message += `\n\n📦 Pedido realizado via *Minha Loja*!`;

  const phoneNumber = '5527997909923'; // ➕ Coloque seu número no formato 55DDDNUMERO (Ex: 5511999999999)

  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  window.open(url, '_blank');
}

function showAddedModal(message) {
  const modal = document.getElementById('added-modal');
  const messageElement = document.getElementById('added-message');

  messageElement.innerText = message;
  modal.style.display = 'block';

  // Fecha sozinho após 3 segundos
  setTimeout(() => {
    modal.style.display = 'none';
  }, 2000);
}


function closeAddedModal() {
  document.getElementById('added-modal').style.display = 'none';
}
