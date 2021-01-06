var apikey = "tnhvfU9OIY1teX1ibWfLTLADZ1G5fggu";
var locationid = 0;
var thelocation = "";
var cityname = "";

function getcityname() {
  var getcityname = {
    url:
      "https://dataservice.accuweather.com/locations/v1/" +
      locationid +
      "?apikey=" +
      apikey,
    method: "GET",
    timeout: 0,
  };

  $.ajax(getcityname).done(function (response) {
    var tempname = response.LocalizedName;
    cityname = tempname;
  });
}

function getcurrentconditions() {
  var getcondition = {
    url:
      "https://dataservice.accuweather.com/currentconditions/v1/" +
      locationid +
      "?apikey=" +
      apikey,
    method: "GET",
    timeout: 0,
  };
  getcityname();
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
    $("div.content-left").html(
      "Name: " +
        cityname +
        "<br>" +
        "Weather: " +
        CurrentWeather +
        "<br>" +
        "Rain/No Rain: " +
        CheckRain +
        "<br>" +
        "Day/Night: " +
        IsDay +
        "<br>" +
        "Temperature: " +
        TempInCelsius
    );
    locationid = localStorage.removeItem("locationid");
  });
}
function getforecast() {
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

    $("div.content-right").html(
      "Start date: " +
        dateStart +
        "<br>" +
        "Description: " +
        description +
        "<br>" +
        "Weather: " +
        catergoryType +
        "<br>" +
        "End date: " +
        dateEnd
    );
    $("div.content-btm").html(
      dailydate +
        "<br>" +
        "Min Temperature: " +
        minTempCel +
        "<br>" +
        "Max Temperature: " +
        maxTempCel +
        "<br>" +
        "<br>" +
        "<h4>Day Time</h4>" +
        "Weather: " +
        dayweathertype +
        "<br>" +
        "Rain/No Rain: " +
        dayweatherconditon +
        "<br>" +
        "<br>" +
        "<h4>Night Time</h4>" +
        "Weather: " +
        nightweathertype +
        "<br>" +
        "Rain/No Rain: " +
        nightweatherconditon
    );
  });
}
function getLocation() {
  navigator.geolocation.getCurrentPosition(getcoordinates);
}

function getcoordinates(position) {
  if (locationid == 0) {
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

    $.ajax(getlocation).done(function (response) {
      var tempid = response.Key;
      locationid = tempid;
    });
    getcurrentconditions();
    getforecast();
  } else {
    getcurrentconditions();
    getforecast();
  }
}

function getcurrentdate() {
  var date = new Date();
  $("div.content-top").html(date);
}
function searchforcity() {
  if (localStorage.getItem("thelocation") != null) {
    thelocation = localStorage.getItem("thelocation");
  }
  var searchlocation = {
    url:
      "https://dataservice.accuweather.com/locations/v1/cities/search?apikey=" +
      apikey +
      "&q=" +
      thelocation,
    method: "GET",
    timeout: 0,
  };

  $.ajax(searchlocation).done(function (response) {
    let tempid = response[0].Key;
    locationid = tempid;
    localStorage.setItem("locationid", locationid);

    getcoordinates();
  });
}

var getadminlocation = {
  url:
    "https://dataservice.accuweather.com/locations/v1/adminareas/SG?apikey=" +
    apikey,
  method: "GET",
  timeout: 0,
};

$.ajax(getadminlocation).done(function (response) {
  var x1 = response[0].LocalizedName;
  var x2 = response[1].LocalizedName;
  var x3 = response[2].LocalizedName;
  var x4 = response[3].LocalizedName;
  var x5 = response[4].LocalizedName;

  $("#CS").html(x1);
  $("#NE").html(x2);
  $("#NW").html(x3);
  $("#SE").html(x4);
  $("#SW").html(x5);
});

$(document).ready(function () {
  $("#refresh-button").click(function () {
    getcurrentdate();
    getLocation();
  });
});

$(document).ready(function () {
  $("#CS").click(function () {
    document.getElementById("outerlist").style.display = "none";
    document.getElementById("CSlist").style.display = "block";
  });
});

$(document).ready(function () {
  $("#NE").click(function () {
    document.getElementById("outerlist").style.display = "none";
    document.getElementById("NElist").style.display = "block";
  });
});

$(document).ready(function () {
  $("#NW").click(function () {
    document.getElementById("outerlist").style.display = "none";
    document.getElementById("NWlist").style.display = "block";
  });
});

$(document).ready(function () {
  $("#SE").click(function () {
    document.getElementById("outerlist").style.display = "none";
    document.getElementById("SElist").style.display = "block";
  });
});

$(document).ready(function () {
  $("#SW").click(function () {
    document.getElementById("outerlist").style.display = "none";
    document.getElementById("SWlist").style.display = "block";
  });
});

///// For CS LIST
$(document).ready(function () {
  $("#AMKNT").click(function () {
    thelocation = document.getElementById("AMKNT").innerHTML;
    localStorage.setItem("thelocation", thelocation);
    searchforcity();
  });

  $("#BNT").click(function () {
    thelocation = document.getElementById("BNT").innerHTML;
    localStorage.setItem("thelocation", thelocation);
    searchforcity();
  });

  $("#CG").click(function () {
    thelocation = document.getElementById("CG").innerHTML;
    localStorage.setItem("thelocation", thelocation);
    searchforcity();
  });

  $("#KL").click(function () {
    thelocation = document.getElementById("KL").innerHTML;
    localStorage.setItem("thelocation", thelocation);
    searchforcity();
  });

  $("#QT").click(function () {
    thelocation = document.getElementById("QT").innerHTML;
    localStorage.setItem("thelocation", thelocation);
    searchforcity();
  });

  $("#TPNT").click(function () {
    thelocation = document.getElementById("TPNT").innerHTML;
    localStorage.setItem("thelocation", thelocation);
    searchforcity();
  });

  $("#TP").click(function () {
    thelocation = document.getElementById("TP").innerHTML;
    localStorage.setItem("thelocation", thelocation);
    searchforcity();
  });

  $("#YCK").click(function () {
    thelocation = document.getElementById("YCK").innerHTML;
    localStorage.setItem("thelocation", thelocation);
    searchforcity();
  });
});

///// For NE LIST
$(document).ready(function () {
  $("#BSWE").click(function () {
    thelocation = document.getElementById("BSWE").innerHTML;
    localStorage.setItem("thelocation", thelocation);
    searchforcity();
  });

  $("#CK").click(function () {
    thelocation = document.getElementById("CK").innerHTML;
    localStorage.setItem("thelocation", thelocation);
    searchforcity();
  });

  $("#HG").click(function () {
    thelocation = document.getElementById("HG").innerHTML;
    localStorage.setItem("thelocation", thelocation);
    searchforcity();
  });

  $("#PSR").click(function () {
    thelocation = document.getElementById("PSR").innerHTML;
    localStorage.setItem("thelocation", thelocation);
    searchforcity();
  });

  $("#PGG").click(function () {
    thelocation = document.getElementById("PGG").innerHTML;
    localStorage.setItem("thelocation", thelocation);
    searchforcity();
  });

  $("#SRG").click(function () {
    thelocation = document.getElementById("SRG").innerHTML;
    localStorage.setItem("thelocation", thelocation);
    searchforcity();
  });

  $("#TPN").click(function () {
    thelocation = document.getElementById("TPN").innerHTML;
    localStorage.setItem("thelocation", thelocation);
    searchforcity();
  });

  $("#TS").click(function () {
    thelocation = document.getElementById("TS").innerHTML;
    localStorage.setItem("thelocation", thelocation);
    searchforcity();
  });
});

///// For NW LIST
$(document).ready(function () {
  $("#BPJNT").click(function () {
    thelocation = document.getElementById("BPJNT").innerHTML;
    localStorage.setItem("thelocation", thelocation);
    searchforcity();
  });

  $("#BTM").click(function () {
    thelocation = document.getElementById("BTM").innerHTML;
    localStorage.setItem("thelocation", thelocation);
    searchforcity();
  });

  $("#HLGP").click(function () {
    thelocation = document.getElementById("HLGP").innerHTML;
    localStorage.setItem("thelocation", thelocation);
    searchforcity();
  });

  $("#RFP").click(function () {
    thelocation = document.getElementById("RFP").innerHTML;
    localStorage.setItem("thelocation", thelocation);
    searchforcity();
  });

  $("#VTRP").click(function () {
    thelocation = document.getElementById("VTRP").innerHTML;
    localStorage.setItem("thelocation", thelocation);
    searchforcity();
  });

  $("#YT").click(function () {
    thelocation = document.getElementById("YT").innerHTML;
    localStorage.setItem("thelocation", thelocation);
    searchforcity();
  });

  $("#YS").click(function () {
    thelocation = document.getElementById("YS").innerHTML;
    localStorage.setItem("thelocation", thelocation);
    searchforcity();
  });

  $("#WLNT").click(function () {
    thelocation = document.getElementById("WLNT").innerHTML;
    localStorage.setItem("thelocation", thelocation);
    searchforcity();
  });
});

///// For SE LIST
$(document).ready(function () {
  $("#BDNT").click(function () {
    thelocation = document.getElementById("BDNT").innerHTML;
    localStorage.setItem("thelocation", thelocation);
    searchforcity();
  });

  $("#CIVL").click(function () {
    thelocation = document.getElementById("CIVL").innerHTML;
    localStorage.setItem("thelocation", thelocation);
    searchforcity();
  });

  $("#EVG").click(function () {
    thelocation = document.getElementById("EVG").innerHTML;
    localStorage.setItem("thelocation", thelocation);
    searchforcity();
  });

  $("#GLS").click(function () {
    thelocation = document.getElementById("GLS").innerHTML;
    localStorage.setItem("thelocation", thelocation);
    searchforcity();
  });

  $("#KPUB").click(function () {
    thelocation = document.getElementById("KPUB").innerHTML;
    localStorage.setItem("thelocation", thelocation);
    searchforcity();
  });

  $("#LH").click(function () {
    thelocation = document.getElementById("LH").innerHTML;
    localStorage.setItem("thelocation", thelocation);
    searchforcity();
  });

  $("#SMNT").click(function () {
    thelocation = document.getElementById("SMNT").innerHTML;
    localStorage.setItem("thelocation", thelocation);
    searchforcity();
  });

  $("#SRGNT").click(function () {
    thelocation = document.getElementById("SRGNT").innerHTML;
    localStorage.setItem("thelocation", thelocation);
    searchforcity();
  });
});

///// For SW LIST
$(document).ready(function () {
  $("#ARNT").click(function () {
    thelocation = document.getElementById("ARNT").innerHTML;
    localStorage.setItem("thelocation", thelocation);
    searchforcity();
  });

  $("#BL").click(function () {
    thelocation = document.getElementById("BL").innerHTML;
    localStorage.setItem("thelocation", thelocation);
    searchforcity();
  });

  $("#BBNT").click(function () {
    thelocation = document.getElementById("BBNT").innerHTML;
    localStorage.setItem("thelocation", thelocation);
    searchforcity();
  });

  $("#BV").click(function () {
    thelocation = document.getElementById("BV").innerHTML;
    localStorage.setItem("thelocation", thelocation);
    searchforcity();
  });

  $("#CNT").click(function () {
    thelocation = document.getElementById("CNT").innerHTML;
    localStorage.setItem("thelocation", thelocation);
    searchforcity();
  });

  $("#CCK").click(function () {
    thelocation = document.getElementById("CCK").innerHTML;
    localStorage.setItem("thelocation", thelocation);
    searchforcity();
  });

  $("#JW").click(function () {
    thelocation = document.getElementById("JW").innerHTML;
    localStorage.setItem("thelocation", thelocation);
    searchforcity();
  });

  $("#JE").click(function () {
    thelocation = document.getElementById("JE").innerHTML;
    localStorage.setItem("thelocation", thelocation);
    searchforcity();
  });

  $("#T").click(function () {
    thelocation = document.getElementById("T").innerHTML;
    localStorage.setItem("thelocation", thelocation);
    searchforcity();
  });

  $("#PSPJ").click(function () {
    thelocation = document.getElementById("PSPJ").innerHTML;
    localStorage.setItem("thelocation", thelocation);
    searchforcity();
  });

  $("#KR").click(function () {
    thelocation = document.getElementById("KR").innerHTML;
    localStorage.setItem("thelocation", thelocation);
    searchforcity();
  });
});

document.addEventListener("submit", function (event) {
  //prevent default action of the form from actually submitting
  event.preventDefault();

  var templocation = document.getElementById("location_name").value;
  thelocation = templocation;
  searchforcity();
});

if (thelocation == "") {
  searchforcity();
  thelocation = localStorage.removeItem("thelocation");
}

getcurrentdate();
if (
  localStorage.getItem("locationid") == null &&
  localStorage.getItem("thelocation") == null
) {
  getLocation();
} else if (localStorage.getItem("locationid") == null) {
  getLocation();
} else if (localStorage.getItem("locationid") == 0) {
  getLocation();
} else {
  locationid = localStorage.getItem("locationid");
  getcoordinates();
  locationid = localStorage.removeItem("locationid");
  thelocation = localStorage.removeItem("thelocation");
}
