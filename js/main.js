const moeda = "eur";
const limiteLista = 100;

const formatter = new Intl.NumberFormat('pt-PT', {
  style: 'currency',
  currency: moeda.toUpperCase(),

  //These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  maximumFractionDigits: 2, // (causes 2500.99 to be printed as $2,501)
});

function searchBar() {
  // Declarar variaveis
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("searchInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("cryptoList");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[1];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

// Parse the URL parameter
function obterLink(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

$(function() {
  $.ajax({
      method: 'GET',
      url: "https://api.coingecko.com/api/v3/coins/markets?vs_currency="+moeda+"&order=market_cap_desc&per_page="+limiteLista+"&page=1&sparkline=false",
      success: function(response) {
        let tabela = $('#cryptoList');
        let tr = "";

        tabela.html("");

        response.forEach(function(element, index, arr) {
            // console.log(element);
            tr+='<tr>';
            tr+='<td>'+(index+1)+'</td>'+
            '<td><img src="'+element.image+'" style="width: 18px; height: 18px;" alt="Logo"> '+element.name+'</td>'+
            '<td>'+formatter.format(element.current_price)+'</td>'+
            '<td>'+formatter.format(element.market_cap)+'</td>'+
            '<td><div id="fav_'+element.index+'"><i class="far fa-star"></i></div></td>'+
            '<td><div id="detalhes_'+element.id+'"><i class="fas fa-plus"></i></div></td>'
            tr+='</tr>'
        });

        tabela.html(tr);

        $("[id^='fav_']").each(function(index) {
          const localStorageFavKey = 'fav_'+index;
          let localStorageData = JSON.parse(localStorage.getItem(localStorageFavKey));
          let isFavorite = localStorageData;

          if (isFavorite) { $(this).html('<i class="fas fa-star"></i>') }

          $(this).click(function(event) {
            event.preventDefault();
            localStorageData = JSON.parse(localStorage.getItem(localStorageFavKey));
            isFavorite = localStorageData;

            if (isFavorite) {
              localStorage.setItem(localStorageFavKey, false);
              $(this).html('<i class="far fa-star"></i>');
            } else {
              localStorage.setItem(localStorageFavKey, true);
              $(this).html('<span style="font-size: 1em; color: #DBA800;"><i class="fas fa-star"></i></span>');
            }
          });
        });

        $("#searchInput").keyup(function(event) {
          if (event.key === 'Enter') {
              console.log('ola');
              location.href = location.origin + location.pathname + '?moeda='+document.getElementById("searchInput").value.toLowerCase();
          }
      });
      },
      error: function(response) {
        console.log(response);
      }
  });

  // Obtem do link a variavel no parametro moeda | ex: index.html?moeda=bitcoin
  // Isto é apenas um teste
  // Quando acabar is favoritos vou passar para os detalhes e terminar o que começei aqui
  const detalhes = obterLink('moeda');
  if (detalhes == 'bitcoin') {
    $('#conteudo_principal').hide();
    $('#bitcoin').show();
  } 
  else {
    $('#conteudo_principal').show();
  }
});