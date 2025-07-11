let selected = [];

$(document).ready(function () {
  $.getJSON("pokemons.json", function (data) {
    data.forEach((pokemon, index) => {
      console.log(index, pokemon);
      const card = `
        <div class="col-md-3">
          <div class="card pokemon" data-id="${pokemon.id}">
           <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${pokemon.id}.gif" style="width: 60px; margin:auto">
            <div class="card-body text-center">
              <h5 class="card-title">${pokemon.name}</h5>
              <p>Type: ${pokemon.type}</p>
              <p>HP: ${pokemon.hp} | Atk: ${pokemon.atk} | Def: ${pokemon.def} | Spe: ${pokemon.spe}</p>
            </div>
          </div>
        </div>
      `;
      $('#pokemon-list').append(card);
    });

    // Clique em Pokémon
    $('.pokemon').on('click', function () {
      const name = $(this).data('id');

      if ($(this).hasClass('selected')) {
        $(this).removeClass('selected');
        selected = selected.filter(p => p !== name);
      } else if (selected.length < 6) {
        $(this).addClass('selected');
        selected.push(name);
      }

      $('#confirm-btn').prop('disabled', selected.length !== 6);
    });
  });

  $('#confirm-btn').on('click', function () {
    localStorage.setItem('playerTeam', JSON.stringify(selected));
    alert("Pokémon selecionados: " + selected.join(", "));
    window.location.href = "../index.html";
  });
});
