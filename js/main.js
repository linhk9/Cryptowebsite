const cryptoApi = "https://api.coingecko.com/api/v3";

const moeda = "eur";
const limiteLista = 100;

const formatter = new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: moeda.toUpperCase(),
  
    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    maximumFractionDigits: 2, // (causes 2500.99 to be printed as $2,501)
});

function searchBar() {
    // Declare variables
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

$(function() {
    $.ajax({
        method: 'GET',
        url: cryptoApi+"/coins/markets?vs_currency="+moeda+"&order=market_cap_desc&per_page="+limiteLista+"&page=1&sparkline=false",
        success: function(response) {
            let tabela = $('#cryptoList');
            let tr = "";

            tabela.html("");

            response.forEach(function(element, index, arr) {
                // console.log(element);
                tr+='<tr>';
                tr+='<td>'+(index+1)+'</td>'+'<td><img src="'+element.image+'" style="width: 18px; height: 18px;" alt="Logo"> '+element.name+'</td>'+'<td>'+formatter.format(element.current_price)+'</td>'+'<td>'+formatter.format(element.market_cap)+'</td>'+'<td><span data-feather="star" id="fav_'+(index+1)+'"></span></td>'
                tr+='</tr>'
            });

            tabela.html(tr);
            feather.replace()
        },
        error: function(response) {
            console.log(response);
        }
    });

});