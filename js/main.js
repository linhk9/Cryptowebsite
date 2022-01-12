function barraDePesquisa() {
  // Declarar variaveis
  const favoritos = obterLink('favoritos');
  let td, txtValue;
  let lista = $('#cryptoList');
  if (favoritos == 'true') lista = $('#cryptoListFavoritos')
  let tr = lista.find('tr');

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
  const url = location.origin + location.pathname;

  let moeda = localStorage.getItem('tipo_de_moeda') || "eur";
  let limiteLista = localStorage.getItem('limite_de_moedas') || 100;
  let currentPage = 'conteudo_principal';

  const formatador = new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: moeda.toUpperCase(),
    maximumFractionDigits: 2
  });

  $('#tipoMoeda').val(moeda);
  $('#tipoMoeda').change(function() { localStorage.setItem('tipo_de_moeda', $('#tipoMoeda').val()) });
  $('#limiteMoedas').val(limiteLista);
  $('#limiteMoedas').change(function() { 
    const limiteMoeda = $('#limiteMoedas');
    if (limiteMoeda.val() >= 1 && limiteMoeda.val() <= 100)
      localStorage.setItem('limite_de_moedas', limiteMoeda.val());
    else
      limiteMoeda.val(limiteLista);
  });

  $.ajax({
      method: 'GET',
      url: "https://api.coingecko.com/api/v3/coins/markets?vs_currency="+moeda+"&order=market_cap_desc&per_page="+limiteLista+"&page=1&sparkline=false",
      success: function(resposta) {
        const pagDetalhes = obterLink('detalhes');
        const pagFavoritos = obterLink('favoritos');
        const pagDefinicoes = obterLink('definicoes');

        let lista = $('#cryptoList');
        if (pagFavoritos == 'true') lista = $('#cryptoListFavoritos')
        let tabela = lista;
        let tr = "";

        tabela.html("");

        resposta.forEach(function(elem, i, arr) {
          const localStorageFavKey = 'fav_'+i;
          let localStorageData = JSON.parse(localStorage.getItem(localStorageFavKey));
          let isFavorite = localStorageData;
          if (pagFavoritos == 'true' && isFavorite || !pagFavoritos) {
            tr+='<tr id="tr_'+i+'">'+
            '<td>'+(i+1)+'</td>'+
            '<td><img src="'+elem.image+'" style="width: 18px; height: 18px;" alt="Logo"> <a type="button" id="btnDetalhes_'+elem.id+'"> '+elem.name+'</a></td>'+
            '<td>'+formatador.format(elem.current_price)+'</td>'+
            '<td>'+formatador.format(elem.market_cap)+'</td>'+
            '<td><div id="fav_'+i+'"><i class="far fa-star"></i></div></td>'+
            '</tr>';
          }

          $('#paginas').append("<div id='detalhes_"+elem.id+"' class='detalhes-conteudo'></div>");
          $('#detalhes_'+elem.id).html(
            '<h2 class="text-center">Moeda: '+elem.name+'</h2>'+
            '<div class="row"><div class="col-md-8">'+
            '<img class="text-center" src="'+elem.image+'" alt="Logo"><br><br>'+
            '<br><div id="favDetalhes_'+i+'">Favoritos: <i class="far fa-star"></i></div>'+
            'Ranking: '+(i+1)+
            '<br>Valor Atual: '+formatador.format(elem.current_price)+
            '<br>Mudança de Preço nas Últimas 24H: '+formatador.format(elem.price_change_24h)+
            '</div></div>'
          );
        });

        tabela.html(tr);

        $("[id^='fav_']").each(function(index) {
          const localStorageFavKey = this.id;
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

              if (pagFavoritos == 'true') {
                $('#tr_'+this.id.split('_')[1]).fadeOut();
              }
            } else {
              localStorage.setItem(localStorageFavKey, true);
              $(this).html('<span style="font-size: 1em; color: #DBA800;"><i class="fas fa-star"></i></span>');
            }
          });
        });
      
        $("[id^='favDetalhes_']").each(function(index) {
          const localStorageFavKey = 'fav_'+this.id.split('_')[1];
          let localStorageData = JSON.parse(localStorage.getItem(localStorageFavKey));
          let isFavorite = localStorageData;

          if (isFavorite) { $(this).html('Favoritos: <span style="font-size: 1em; color: #DBA800;"><i class="fas fa-star"></i></span>') }

          $(this).click(function(evento) {
            evento.preventDefault();

            localStorageData = JSON.parse(localStorage.getItem(localStorageFavKey));
            isFavorite = localStorageData;

            if (isFavorite) {
              localStorage.setItem(localStorageFavKey, false);
              $(this).html('Favoritos: <i class="far fa-star"></i>');
            } else {
              localStorage.setItem(localStorageFavKey, true);
              $(this).html('Favoritos: <span style="font-size: 1em; color: #DBA800;"><i class="fas fa-star"></i></span>');
            }
          });
        });

        $("[id^='btnDetalhes_']").each(function(i) {          
          $(this).click(function(evento) {
            evento.preventDefault();

            const criptoMoeda = $(this).attr('id').split('_')[1];
            location.href = url + '?detalhes='+criptoMoeda;
            $('#conteudo_principal').hide();
            $('#detalhes_'+criptoMoeda).show();
          });
        });

        $("#searchInput").keyup(function(evento) {
          if (evento.key === 'Enter') {
            const criptoMoeda = $('#searchInput').val().toLowerCase();
            if ($('#detalhes_'+criptoMoeda).length) {
              location.href = url + '?detalhes='+criptoMoeda;              
              $('#conteudo_principal').hide();
              $('#detalhes_'+criptoMoeda).show();
              currentPage = 'detalhes_'+criptoMoeda;
            } else if (criptoMoeda == '') {
              location.href = url;
              $('#'+currentPage).hide();
              $('#conteudo_principal').show();
            }
          }
        });

        if (pagFavoritos == 'true') {
          $('#conteudo_principal').hide();
          $('#favoritos').show();
        } else if (pagDefinicoes == 'true') {
          $('#conteudo_principal').hide();
          $('#definicoes').show();
        } else if (pagDetalhes && $('#detalhes_'+pagDetalhes).length) {
          $('#conteudo_principal').hide();
          $('#detalhes_'+pagDetalhes).show();
        } else {
          $('#conteudo_principal').show();
        }
      },
      error: function(resposta) {
        console.log(resposta);
      }
  });
});