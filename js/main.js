const cryptoApi = "https://api.coingecko.com/api/v3";

const moeda = "eur";
const limiteLista = 10;

$.getJSON(cryptoApi+"/coins/markets?vs_currency="+moeda+"&order=market_cap_desc&per_page="+limiteLista+"&page=1&sparkline=false", function(data){
    data.forEach(cur => {
        console.log(cur);
    });
}).fail(function(dat, textStatus, error ) {
    console.log("API: /coins/list > falhou")
});