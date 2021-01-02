var apikey = "SyWNBgmtyXXfWKNvrvTRvHqzK5aYVPwr";
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

    var dailydate = new Date(response.DailyForecasts[0].Date);
    var dailydate =
      dailydate.toDateString() + " " + dailydate.toLocaleTimeString();
    var minTemp = response.DailyForecasts[0].Temperature.Minimum.Value;
    var minTempCel = ((5 / 9) * (minTemp - 32)).toFixed(1);
    var maxTemp = response.DailyForecasts[0].Temperature.Maximum.Value;
    var maxTempCel = ((5 / 9) * (maxTemp - 32)).toFixed(1);
    var dayweathertype = response.DailyForecasts[0].Day.IconPhrase;
    var dayweatherconditon = response.DailyForecasts[0].Day.PrecipitationType;
    var nightweathertype = response.DailyForecasts[0].Night.IconPhrase;
    var nightweatherconditon =
      response.DailyForecasts[0].Night.PrecipitationType;

    $("p.content-right").append(
      dateStart +
        "<br>" +
        description +
        "<br>" +
        catergoryType +
        "<br>" +
        dateEnd
    );
    $("p.content-btm").append(
      dailydate +
        "<br>" +
        minTempCel +
        "<br>" +
        maxTempCel +
        "<br>" +
        dayweathertype +
        "<br>" +
        dayweatherconditon +
        "<br>" +
        nightweathertype +
        "<br>" +
        nightweatherconditon
    );
  });
}

getLocation();

var date = new Date();
$("p.content-top").append(date);
