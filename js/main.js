function barraDePesquisa() {
  // Declarar variaveis
  let td, txtValue;
  let tr = $('#cryptoList').find('tr')

  // Loop through all table rows, and hide those who don't match the search query
  for (let i = 0; i < tr.length; i++) {
    td = $(tr[i]).find('td')[1];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf($('#searchInput').val().toUpperCase()) > -1) {
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
  const moeda = "eur";
  const limiteLista = 100;
  const url = location.origin + location.pathname;
  let currentPage = 'conteudo_principal';

  const formatador = new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: moeda.toUpperCase(),
  
    //These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    maximumFractionDigits: 2, // (causes 2500.99 to be printed as $2,501)
  });
  
  $.ajax({
      method: 'GET',
      url: "https://api.coingecko.com/api/v3/coins/markets?vs_currency="+moeda+"&order=market_cap_desc&per_page="+limiteLista+"&page=1&sparkline=false",
      success: function(resposta) {
        let tabela = $('#cryptoList');
        let tr = "";

        tabela.html("");

        resposta.forEach(function(elem, i, arr) {
            // console.log(elem);
            tr+='<tr>';
            tr+='<td>'+(i+1)+'</td>'+
            '<td><img src="'+elem.image+'" style="width: 18px; height: 18px;" alt="Logo"> '+elem.name+'</td>'+
            '<td>'+formatador.format(elem.current_price)+'</td>'+
            '<td>'+formatador.format(elem.market_cap)+'</td>'+
            '<td><div id="fav_'+elem.index+'"><i class="far fa-star"></i></div></td>'+
            '<td><div id="btnDetalhes_'+elem.id+'"><i class="fas fa-plus"></i></div></td>'
            tr+='</tr>';

            $('#paginas').append("<div id='detalhes_"+elem.id+"' class='detalhes-conteudo'></div>");
            $('#detalhes_'+elem.id).html('Moeda '+elem.id);
        });

        tabela.html(tr);

        $("[id^='fav_']").each(function(index) {
          const localStorageFavKey = 'fav_'+index;
          let localStorageData = JSON.parse(localStorage.getItem(localStorageFavKey));
          let isFavorite = localStorageData;

          if (isFavorite) { $(this).html('<span style="font-size: 1em; color: #DBA800;"><i class="fas fa-star"></i></span>') }

          $(this).click(function(evento) {
            evento.preventDefault();

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

        $("[id^='btnDetalhes_']").each(function(i) {          
          $(this).click(function(evento) {
            evento.preventDefault();
            const moeda = $(this).attr('id').split('_')[1];
            location.href = url + '?detalhes='+moeda;
            $('#conteudo_principal').hide();
            $('#detalhes_'+moeda).show();
          });
        });

        $("#searchInput").keyup(function(evento) {
          if (evento.key === 'Enter') {
            const moeda = $('#searchInput').val().toLowerCase();
            if ($('#detalhes_'+moeda).length) {
              location.href = url + '?detalhes='+moeda;
              $('#conteudo_principal').hide();
              $('#detalhes_'+moeda).show();
              currentPage = 'detalhes_'+moeda;
            } else if (moeda == '') {
              location.href = url;
              $('#'+currentPage).hide();
              $('#conteudo_principal').show();
            }
          }
        });

        const detalhes = obterLink('detalhes');
        const favoritos = obterLink('favoritos');
        const definicoes = obterLink('definicoes');
        if (favoritos == 'true') {
          $('#conteudo_principal').hide();
          $('#favoritos').show();
        } else if (definicoes == 'true') {
          $('#conteudo_principal').hide();
          $('#definicoes').show();
        } else if (detalhes && $('#detalhes_'+detalhes).length) {
          $('#conteudo_principal').hide();
          $('#detalhes_'+detalhes).show();
        } else {
          $('#conteudo_principal').show();
        }
      },
      error: function(resposta) {
        console.log(resposta);
      }
  });
});
