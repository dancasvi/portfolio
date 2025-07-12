let selected = [];
let pokes;

$(document).ready(function () {
  $.getJSON("../db/pokemons.json", function (data) {
    
    pokes = data;

    data.forEach((pokemon, index) => {
      const card = `
        <div class="col-md-3">
          <div class="card pokemon" data-id="${pokemon.id}">
            
           <p>Lv: <span id="player-lvl">1</span></p> 
            <div class="sprite-wrapper justify-content-center align-items-center">
              <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${pokemon.id}.gif" class="pokemon-sprite">
            </div>
            
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
    let listPokes = pokes.filter(p => selected.includes(p.id));
    listPokes = listPokes.map(p => p.name)
    // return console.log("")
    alert("Pokémon selecionados: " + listPokes.join(", "));
    window.location.href = "../index.html";
  });
});
