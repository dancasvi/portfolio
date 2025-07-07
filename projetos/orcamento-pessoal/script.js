$(document).ready(function () {
  let receitas = JSON.parse(localStorage.getItem("receitas")) || [];
  let despesas = JSON.parse(localStorage.getItem("despesas")) || [];
  let graficoColuna, graficoPizza;

  const formatarData = data => new Date(data).toLocaleDateString("pt-BR");

  function atualizarSaldo() {
    const totalReceitas = receitas.reduce((sum, r) => sum + r.valor, 0);
    const totalDespesas = despesas.reduce((sum, d) => sum + d.valor, 0);
    const saldo = totalReceitas - totalDespesas;
    const el = $('#saldo');

    el.text('R$ ' + saldo.toFixed(2));
    el.removeClass('positivo negativo zerado');
    if (saldo > 0) el.addClass('positivo');
    else if (saldo < 0) el.addClass('negativo');
    else el.addClass('zerado');
  }

  function atualizarListas() {
    $('#lista-receitas, #lista-despesas').empty();

    receitas.forEach((r, i) => {
      $('#lista-receitas').append(`<li class="list-group-item">
        ${formatarData(r.dia)} - ${r.descricao}: R$ ${r.valor.toFixed(2)}
        <button class="btn btn-sm btn-warning me-1 editar-receita" data-id="${i}">✏️</button>
        <button class="btn btn-sm btn-danger remover-receita" data-id="${i}">🗑️</button>
      </li>`);
    });

    despesas.forEach((d, i) => {
      $('#lista-despesas').append(`<li class="list-group-item">
        ${formatarData(d.dia)} - ${d.descricao} (${d.categoria}): R$ ${d.valor.toFixed(2)}
        <button class="btn btn-sm btn-warning me-1 editar-despesa" data-id="${i}">✏️</button>
        <button class="btn btn-sm btn-danger remover-despesa" data-id="${i}">🗑️</button>
      </li>`);
    });

    atualizarSaldo();
    atualizarDashboards();
  }

  function atualizarDashboards() {
    const porCategoria = {};
    despesas.forEach(d => {
      porCategoria[d.categoria] = (porCategoria[d.categoria] || 0) + d.valor;
    });

    const categorias = Object.keys(porCategoria);
    const valores = Object.values(porCategoria);

    if (graficoColuna) graficoColuna.destroy();
    if (graficoPizza) graficoPizza.destroy();

    graficoColuna = new Chart($('#graficoColuna'), {
      type: 'bar',
      data: {
        labels: categorias,
        datasets: [{ label: 'Despesas por Categoria', data: valores }]
      }
    });

    graficoPizza = new Chart($('#graficoPizza'), {
      type: 'pie',
      data: {
        labels: categorias,
        datasets: [{ data: valores }]
      }
    });
  }

  $('#login-form').submit(function (e) {
    e.preventDefault();
    $('#login-section').hide();
    $('#main-app').removeClass('d-none');
  });

  $('#form-receita').submit(function (e) {
    e.preventDefault();
    const id = $('#edit-receita-id').val();
    const receita = {
      descricao: $('#descricao-receita').val(),
      valor: parseFloat($('#valor-receita').val()),
      dia: $('#dia-receita').val()
    };

    if (id) receitas[id] = receita;
    else receitas.push(receita);

    localStorage.setItem("receitas", JSON.stringify(receitas));
    this.reset();
    $('#edit-receita-id').val('');
    $('#modalReceita').modal('hide');
    atualizarListas();
  });

  $('#form-despesa').submit(function (e) {
    e.preventDefault();
    const id = $('#edit-despesa-id').val();
    const valor = parseFloat($('#valor-despesa').val());
    const descricao = $('#descricao-despesa').val();
    const dia = $('#dia-despesa').val();
    const recorrencia = parseInt($('#recorrencia-despesa').val()) || 0;
    const categoria = $('#categoria-despesa').val();

    if (id) {
      despesas[id] = { descricao, valor, dia, categoria };
    } else {
      for (let i = 0; i <= recorrencia; i++) {
        const novaData = new Date(dia);
        novaData.setMonth(novaData.getMonth() + i);
        despesas.push({ descricao, valor, dia: novaData.toISOString().split("T")[0], categoria });
      }
    }

    localStorage.setItem("despesas", JSON.stringify(despesas));
    this.reset();
    $('#edit-despesa-id').val('');
    $('#modalDespesa').modal('hide');
    atualizarListas();
  });

  $(document).on('click', '.remover-receita', function () {
    receitas.splice($(this).data('id'), 1);
    localStorage.setItem("receitas", JSON.stringify(receitas));
    atualizarListas();
  });

  $(document).on('click', '.remover-despesa', function () {
    despesas.splice($(this).data('id'), 1);
    localStorage.setItem("despesas", JSON.stringify(despesas));
    atualizarListas();
  });

  $(document).on('click', '.editar-receita', function () {
    const r = receitas[$(this).data('id')];
    $('#edit-receita-id').val($(this).data('id'));
    $('#descricao-receita').val(r.descricao);
    $('#valor-receita').val(r.valor);
    $('#dia-receita').val(r.dia);
    $('#modalReceita').modal('show');
  });

  $(document).on('click', '.editar-despesa', function () {
    const d = despesas[$(this).data('id')];
    $('#edit-despesa-id').val($(this).data('id'));
    $('#descricao-despesa').val(d.descricao);
    $('#valor-despesa').val(d.valor);
    $('#dia-despesa').val(d.dia);
    $('#categoria-despesa').val(d.categoria);
    $('#modalDespesa').modal('show');
  });

  $('#btnBackup').click(() => {
    const data = { receitas, despesas };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = $('<a>').attr({ href: url, download: "orcamento_backup.txt" }).appendTo("body");
    a[0].click();
    a.remove();
  });

  $('#btnImportar').click(() => {
    try {
      const json = JSON.parse($('#importarTexto').val());
      receitas = json.receitas || [];
      despesas = json.despesas || [];
      localStorage.setItem("receitas", JSON.stringify(receitas));
      localStorage.setItem("despesas", JSON.stringify(despesas));
      $('#modalImportar').modal('hide');
      atualizarListas();
    } catch (e) {
      alert("Erro ao importar. Verifique o conteúdo.");
    }
  });

  atualizarListas();
});
