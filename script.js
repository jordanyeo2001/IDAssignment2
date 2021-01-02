var apikey = "DcZrn3Qnzs3x1YPpKVlBT4H6RuMcf7Bc";
function getLocation() {
  navigator.geolocation.getCurrentPosition(getcoordinates);
}

function getcoordinates(position) {
  var currentlatitude = position.coords.latitude;
  var currentlongitude = position.coords.longitude;
  var getlocation = {
    url:
      "https://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=" +
      apikey +
      "&q=" +
      currentlatitude +
      "%2C" +
      currentlongitude,
    method: "GET",
    timeout: 0,
    async: false,
  };

  var locationid = 0;

  $.ajax(getlocation).done(function (response) {
    var tempid = response.Key;
    locationid = tempid;
  });

  var getcondition = {
    url:
      "https://dataservice.accuweather.com/currentconditions/v1/" +
      locationid +
      "?apikey=" +
      apikey,
    method: "GET",
    timeout: 0,
  };

  $.ajax(getcondition).done(function (response) {
    var CurrentWeather = response[0].WeatherText;
    var CheckRain = response[0].PrecipitationType;
    var IsDay = response[0].IsDayTime;
    var TempInCelsius = response[0].Temperature.Metric.Value;
    if (IsDay == true) {
      IsDay = "Day";
    } else {
      IsDay = "Night";
    }
    $("p.content-left").append(
      CurrentWeather +
        "<br>" +
        CheckRain +
        "<br>" +
        IsDay +
        "<br>" +
        TempInCelsius
    );
  });

  var getforecast = {
    url:
      "https://dataservice.accuweather.com/forecasts/v1/daily/1day/" +
      locationid +
      "?apikey=" +
      apikey,
    method: "GET",
    timeout: 0,
  };

  $.ajax(getforecast).done(function (response) {
    var start_date = new Date(response.Headline.EffectiveDate);
    var dateStart =
      start_date.toDateString() + " " + start_date.toLocaleTimeString();
    var description = response.Headline.Text;
    var catergoryType = response.Headline.Category;
    catergoryType = catergoryType[0].toUpperCase() + catergoryType.substring(1);
    var end_date = new Date(response.Headline.EndDate);
    var dateEnd = end_date.toDateString() + " " + end_date.toLocaleTimeString();

    $("p.content-right").append(
      dateStart +
        "<br>" +
        description +
        "<br>" +
        catergoryType +
        "<br>" +
        dateEnd
    );
  });
}

getLocation();

var date = new Date();
$("p.content-left1").append(date);
