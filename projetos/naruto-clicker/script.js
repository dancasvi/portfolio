// Exemplo básico de alternância entre abas
$('nav ul li').on('click', function () {
    const index = $(this).index(); // Posição do menu clicado

    $('#main-container > div').removeClass('active')  // Esconde todos
        .eq(index).addClass('active');                 // Mostra a aba correspondente
});

$(document).ready(function() {
    let ninjaArray = [];
    loadNinjas()

    function loadNinjas() {
        controllerNinja.getNinjas().done(function(ninjas) {
            console.log(ninjas);
            ninjaArray = ninjas; 
            renderNinjas(ninjas);
        }).fail(function() {
            alert('Fail loading ninjas');
        });
    }

    function renderNinjas(ninjas) {
        const $container = $('#ninja-list-container');
        $container.empty(); // limpa conteúdo anterior se houver

        let $row;

        ninjas.forEach((ninja, index) => {
            // Cria uma nova linha a cada 4 ninjas
            if (index % 4 === 0) {
                $row = $('<div class="row mb-4"></div>');
                $container.append($row);
            }

            const $col = $('<div class="col-3"></div>');
            const $card = $(`
                <div class="card" style="width: 18rem;">
                    <div class="card-header">
                        ${ninja.ninja}
                    </div>
                    <div class="card-body">
                        <img src="https://static.wikia.nocookie.net/anicrossbr/images/9/94/3Render_naruto_by_zatrenders.png/revision/latest?cb=20160828083842&path-prefix=pt-br" class="card-img-top">
                        <a href="#" class="btn btn-primary btn-info-ninja" data-id="${ninja.idninja}">Info</a>
                    </div>
                </div>
            `);

            $col.append($card);
            $row.append($col);
        });

        // Espaço extra ao fim da lista
        $container.append('<div style="height: 40px;"></div>');
    }

    function mostrarFormasDoNinja(ninja) {
        $('#ninjaModalLabel').text(`${ninja.ninja} Forms`);
        const $container = $('#ninjaFormsContainer');
        $container.empty();

        ninja.forms.forEach(form => {
            const isSecret = form.secret_form === "1";

            const nomeExibido = isSecret ? `????` : `${ninja.ninja} ${form.form_name}`;
            const imagem = isSecret ? '' : form.url_image;
            const poder = isSecret ? '????' : form.base_power;

            const $col = $(`
            <div class="col-6 col-md-4 col-lg-3 mb-3">
                <div class="card mini-form-card">
                <div class="card-header text-center p-2">
                    <small><strong>${nomeExibido}</strong></small>
                </div>
                <div class="card-body text-center p-2">
                    ${imagem 
                    ? `<img src="${imagem}" class="img-fluid" style="max-height: 100px;">`
                    : '<div style="height: 100px;"></div>'}
                    <p class="mt-1 mb-0"><small>Base Power: ${poder}</small></p>
                </div>
                </div>
            </div>
            `);

            $container.append($col);
        });

        const modal = new bootstrap.Modal(document.getElementById('ninjaModal'));
        modal.show();
    }



    $(document).on('click', '.btn-info-ninja', function (e) {
        e.preventDefault();

        const id = $(this).data('id');
        console.log(id);
        // Busca o ninja correspondente
        const ninja = ninjaArray.find(n => n.idninja === id);

        if (ninja) {
            mostrarFormasDoNinja(ninja);
        }
    });
});

