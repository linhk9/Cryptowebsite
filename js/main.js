//função para a barra de pesquisa
function barraDePesquisa() {
  // Declarar variaveis
  const favoritos = obterLink('favoritos');
  let td, txtValue;
  let lista = $('#cryptoList');
  if (favoritos == 'true') lista = $('#cryptoListFavoritos')
  let tr = lista.find('tr');

  // loop por todas as linhas da tabela e esconder aquelas que não correspondem à consulta da pesquisa
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

// Esta função serve para obter informação do url e retornar o valor obtido
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
  // definir variavel com o url atual
  const url = location.origin + location.pathname;

  // definir variaveis com os valores do localstorage se existirem
  let toggleExtra = JSON.parse(localStorage.getItem('toggle_extra')) || false;
  let order = localStorage.getItem('order') || "market_cap_desc";
  let moeda = localStorage.getItem('tipo_de_moeda') || "usd";
  let limiteLista = localStorage.getItem('limite_de_moedas') || 100;
  let api = "https://api.coingecko.com/api/v3/coins/markets?vs_currency="+moeda+"&order="+order+"&per_page="+limiteLista+"&page=1&sparkline=false";
  // definir a página atual
  let currentPage = 'conteudo_principal';

  // formatar o número para moeda
  const formatador = new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: moeda.toUpperCase(),
    maximumFractionDigits: 6,
    minimumFractionDigits: 2
  });

  // Ativar/Desativar o extra
  if (toggleExtra) { api = "https://api.coingecko.com/api/v3/coins/markets?vs_currency="+moeda+"&category=smart-contract-platform&order="+order+"&per_page="+limiteLista+"&page=1&sparkline=false" }
  $('#extra-toggler-input').prop("checked", toggleExtra);
  $('#extra-toggler-input').click(function() {
    toggleExtra = !toggleExtra;

    order = order == 'market_cap_desc' ? 'volume_desc' : 'market_cap_desc';
    moeda = moeda == 'usd' ? 'eur' : 'usd';
    limiteLista = limiteLista == 100 ? 10 : 100;

    localStorage.setItem('tipo_de_moeda', moeda);
    localStorage.setItem('limite_de_moedas', limiteLista);
    localStorage.setItem('order', order);

    localStorage.setItem('toggle_extra', toggleExtra);
  });

  //obtem informação da API da Coingecko
  $.ajax({
      method: 'GET',
      url: api,
      success: function(resposta) {
        // definição de variaveis
        const pagDetalhes = obterLink('detalhes');
        const pagFavoritos = obterLink('favoritos');
        const pagDefinicoes = obterLink('definicoes');

        // definir a lista/tabela a usar
        let tabela = $('#cryptoList');
        if (pagFavoritos == 'true') tabela = $('#cryptoListFavoritos')
        let tr = "";

        // limpar tabela
        tabela.html("");

        // loop por todos os valores obtidos na API
        resposta.forEach(function(elem, i, arr) {
          if (toggleExtra && i < 10 || !toggleExtra) {
            // definição variaveis
            const localStorageFavKey = 'fav_'+i;
            let localStorageData = JSON.parse(localStorage.getItem(localStorageFavKey));
            let isFavorite = localStorageData;
            // criação da lista das merdas
            if (pagFavoritos == 'true' && isFavorite || !pagFavoritos) {
              tr+='<tr id="tr_'+i+'">'+
              '<td>'+(i+1)+'</td>'+
              '<td><img src="'+elem.image+'" style="width: 18px; height: 18px;" alt="Logo"> <a type="button" id="btnDetalhes_'+elem.id+'"> '+elem.name+'</a></td>'+
              '<td>'+formatador.format(elem.current_price)+'</td>'+
              '<td>'+formatador.format(elem.market_cap)+'</td>'+
              '<td><div id="fav_'+i+'"><i class="far fa-star"></i></div></td>'+
              '</tr>';
            }
            
            //informação fornecida pela API que é metida nos detalhes
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
          }
        });

        // enviar a tabela para o html
        tabela.html(tr);

        // adicionar ou retirar a moeda dos favoritos e mudar o icon de favoritos na página principal
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
      
        // adicionar ou retirar a moeda dos favoritos e mudar o icon de favoritos na página de detalhes
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

        // mostrar a página detalhes da criptomoeda clicada
        $("[id^='btnDetalhes_']").each(function(i) {          
          $(this).click(function(evento) {
            evento.preventDefault();

            const criptoMoeda = $(this).attr('id').split('_')[1];
            location.href = url + '?detalhes='+criptoMoeda;
            $('#conteudo_principal').hide();
            $('#detalhes_'+criptoMoeda).show();
          });
        });

        // Ao clicar ENTER ir para os detalhes da moeda ou sair dos detalhes
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

        // esconder ou mostrar a página indicada quando a informação do url é igual a do código
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
      
      // se a API não disponibilizar informação mostrar erro
      error: function(resposta) {
        console.log(resposta);
      }
  });
});