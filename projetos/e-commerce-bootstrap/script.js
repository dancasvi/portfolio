$(document).ready(function() {
  const products = {
    'Camiseta Básica': 59.90,
    'Calça Jeans': 129.90,
    'Tênis Esportivo': 249.90,
    'Jaqueta Corta-Vento': 189.90
  };

  let cart = [];

  function updateCart() {
    const cartList = $('#cart-items');
    const cartCount = $('#cart-count');
    const cartTotal = $('#cart-total');

    cartList.empty();

    if (cart.length === 0) {
      cartList.append('<li class="list-group-item">Seu carrinho está vazio.</li>');
      cartTotal.text('R$ 0,00');
      cartCount.text('0');
      return;
    }

    const grouped = {};
    cart.forEach(item => {
      grouped[item] = (grouped[item] || 0) + 1;
    });

    let total = 0;
    for (let name in grouped) {
      const quantity = grouped[name];
      const price = products[name];
      const subtotal = quantity * price;
      total += subtotal;

      cartList.append(`
        <li class="list-group-item d-flex justify-content-between align-items-center">
          ${name} (${quantity}x) - R$ ${subtotal.toFixed(2)}
          <button class="btn btn-sm btn-outline-danger remove-item" data-name="${name}">Remover</button>
        </li>
      `);
    }

    cartTotal.text(`R$ ${total.toFixed(2)}`);
    cartCount.text(cart.length);
  }

  function showToast(message) {
    const toast = $('#toast');
    $('#toast-message').text(message);
    toast.fadeIn(200);

    setTimeout(() => {
      toast.fadeOut(400);
    }, 2500);
  }


  $('.add-to-cart').click(function() {
    const name = $(this).data('name');
    cart.push(name);
    updateCart();
    showToast(`${name} adicionado ao carrinho!`);

  });

  $('#cart-button').click(function() {
    const modal = new bootstrap.Modal(document.getElementById('cartModal'));
    modal.show();
  });

  $('#cart-items').on('click', '.remove-item', function() {
    const name = $(this).data('name');
    const index = cart.indexOf(name);
    if (index > -1) {
      cart.splice(index, 1);
    }
    updateCart();
  });

  $('#clear-cart').click(function() {
    cart = [];
    updateCart();
  });

  $('#checkout').click(function() {
    if (cart.length === 0) {
      alert('Seu carrinho está vazio!');
      return;
    }

    const grouped = {};
    cart.forEach(item => {
      grouped[item] = (grouped[item] || 0) + 1;
    });

    let message = '🛍️ *Meu Pedido:*\n\n';
    let total = 0;

    for (let name in grouped) {
      const quantity = grouped[name];
      const price = products[name];
      const subtotal = price * quantity;
      total += subtotal;
      message += `• ${name} - ${quantity}x R$ ${price.toFixed(2)} = R$ ${subtotal.toFixed(2)}\n`;
    }

    message += `\n💰 *Total:* R$ ${total.toFixed(2)}`;
    message += `\n\n📦 Pedido realizado via *Minha Loja*!`;

    const phone = '5527997909923';
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    window.open(url, '_blank');
  });
});
