var code = 1603557;
var settings = {
  url:
    "https://dataservice.accuweather.com/currentconditions/v1/" +
    code +
    "?apikey=l7yD67GEHm5gdjIs5Wj9AL5fnGs34wLS",
  method: "GET",
  timeout: 0,
};

$.ajax(settings).done(function (response) {
  console.log(response);
  var date = new Date();
  $("p.content-left1").append(date);
});
