$(document).ready(function () {
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function generateWhatsAppMessage() {
    let text = '🛒 *Minha Lista de Compras:*\n\n';
    $('#shopping-list li').each(function () {
      const name = capitalizeFirstLetter($(this).data('name'));
      const qty = $(this).data('qty');
      const unit = $(this).data('unit');
      const price = $(this).data('price');
      const checked = $(this).hasClass('checked') ? '✅' : '⬜';
      text += `${checked} ${name} - ${qty} ${unit} x R$${parseFloat(price).toFixed(2)}\n`;
    });
    return encodeURIComponent(text);
  }

  $('#item-form').on('submit', function (e) {
    e.preventDefault();
    const name = $('#item-name').val().trim();
    const qty = parseFloat($('#item-qty').val());
    const unit = $('#item-unit').val().trim();
    const price = parseFloat($('#item-price').val());

    if (!name || qty <= 0 || price <= 0 || !unit) return;

    const capitalizedName = capitalizeFirstLetter(name);

    const li = $(`
      <li class="list-group-item d-flex justify-content-between align-items-center">
        <div class="form-check">
          <input class="form-check-input me-2" type="checkbox">
          <span class="item-text">${capitalizedName} - ${qty} ${unit} x R$${price.toFixed(2)}</span>
        </div>
        <button class="btn btn-sm btn-outline-danger delete-btn">🗑</button>
      </li>
    `);

    li.data({ name, qty, unit, price });

    $('#shopping-list').append(li);
    $('#item-name').val('');
    $('#item-qty').val('');
    $('#item-unit').val('');
    $('#item-price').val('');
  });

  $('#shopping-list').on('change', 'input[type=checkbox]', function () {
    $(this).closest('li').toggleClass('checked');
  });

  $('#shopping-list').on('click', '.delete-btn', function () {
    $(this).closest('li').remove();
  });

  $('#clear-list').on('click', function () {
    $('#shopping-list').empty();
  });

  $('#send-whats-btn').on('click', function () {
    const number = $('#whats-number').val().trim();
    if (!number.match(/^\d{10,13}$/)) {
      alert('Digite um número válido com DDD (ex: 11999999999)');
      return;
    }

    const message = generateWhatsAppMessage();
    const url = `https://wa.me/${number}?text=${message}`;
    window.open(url, '_blank');

    $('#whats-number').val('');
    const modal = bootstrap.Modal.getInstance(document.getElementById('whatsModal'));
    modal.hide();
  });

  $('#import-btn').on('click', function () {
    const text = $('#import-text').val().trim();
    if (text) {
      parseImportedText(text);
      $('#import-text').val('');
    }
  });

  function parseImportedText(text) {
    $('#shopping-list').empty();

    const lines = text.split('\n').filter(line => line.trim().match(/^[✅⬜]/));
    lines.forEach(line => {
      const checked = line.startsWith('✅');
      const cleanLine = line.slice(2).trim();

      const match = cleanLine.match(/^(.+?) - ([\d,.]+)\s*(\w+)\s*x\s*R\$(\d+,\d+|\d+\.\d+|\d+)$/i);

      if (match) {
        const name = match[1].trim();
        const qty = parseFloat(match[2].replace(',', '.'));
        const unit = match[3].trim();
        const price = parseFloat(match[4].replace(',', '.'));

        const li = $(`
          <li class="list-group-item d-flex justify-content-between align-items-center">
            <div class="form-check">
              <input class="form-check-input me-2" type="checkbox" ${checked ? 'checked' : ''}>
              <span class="item-text">${capitalizeFirstLetter(name)} - ${qty} ${unit} x R$${price.toFixed(2)}</span>
            </div>
            <button class="btn btn-sm btn-outline-danger delete-btn">🗑</button>
          </li>
        `);

        li.data({ name, qty, unit, price });
        if (checked) li.addClass('checked');
        $('#shopping-list').append(li);
      }
    });
  }
});
