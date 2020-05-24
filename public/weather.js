// geolocate user
if('geolocation' in navigator) {
  console.log('geolocation available');
  navigator.geolocation.getCurrentPosition(async pos => {
    lat = pos.coords.latitude;
    lng = pos.coords.longitude;
    const $ = function( id ) { return document.getElementById( id ); };
    const degree = '&deg;';
    const dsUrl = `weather/${lat},${lng}`;
    const dsResponse = await fetch(dsUrl);
    const json = await dsResponse.json();
    const data = json.weather;
    const location = json.current_location;
    console.log(data);

  // populate location, summary, temperature & high/low, weeklyForecast
    $('day').textContent = location.Response.View[0].Result[0].Location.Address.Label;
    $('summary').textContent = data.currently.summary;
    $('temp').innerHTML = data.currently.temperature.toFixed(0) + degree + " F";
    $('currentHigh').innerHTML = data.daily.data[0].apparentTemperatureHigh.toFixed(0) + degree +" F";
    $('currentLow').innerHTML = data.daily.data[0].apparentTemperatureLow.toFixed(0) + degree +" F";
    $('weeklyForecast').textContent = data.daily.summary;

  // temperature format buttons and operations
    const f = $('fahrenheit');
    const c = $('celsius');
    const k = $('kelvin');

    f.onclick = function() {
        $('temp').innerHTML = data.currently.temperature.toFixed(0) + degree + " F";
        $('currentHigh').innerHTML = data.daily.data[0].apparentTemperatureHigh.toFixed(0) + degree +" F";
        $('currentLow').innerHTML = data.daily.data[0].apparentTemperatureLow.toFixed(0) + degree +" F";
        for(i = 1; i <= 6; i++){
          $('fcHigh'+i).innerHTML = data.daily.data[i].apparentTemperatureHigh.toFixed(0) + degree +" F";
          $('fcLow'+i).innerHTML = data.daily.data[i].apparentTemperatureLow.toFixed(0) + degree +" F";
        }
    };
    c.onclick = function() {
        $('temp').innerHTML = ((data.currently.temperature-32)*5/9).toFixed(0) + degree + " C";
        $('currentHigh').innerHTML = ((data.daily.data[0].apparentTemperatureHigh-32)*5/9).toFixed(0) + degree +" C";
        $('currentLow').innerHTML = ((data.daily.data[0].apparentTemperatureLow-32)*5/9).toFixed(0) + degree +" C";
        for(i = 1; i <= 6; i++){
          $('fcHigh'+i).innerHTML = ((data.daily.data[i].apparentTemperatureHigh-32)*5/9).toFixed(0) + degree +" C";
          $('fcLow'+i).innerHTML = ((data.daily.data[i].apparentTemperatureLow-32)*5/9).toFixed(0) + degree +" C";
        }
    };
    k.onclick = function() {
        $('temp').innerHTML = (((data.currently.temperature-32)*5/9)+273).toFixed(0) + degree + " K";
        $('currentHigh').innerHTML = (((data.daily.data[0].apparentTemperatureHigh-32)*5/9)+273).toFixed(0) + degree +" K";
        $('currentLow').innerHTML = (((data.daily.data[0].apparentTemperatureLow-32)*5/9)+273).toFixed(0) + degree +" K";
        for(i = 1; i <= 6; i++){
          $('fcHigh'+i).innerHTML = (((data.daily.data[i].apparentTemperatureHigh-32)*5/9)+273).toFixed(0) + degree +" K";
          $('fcLow'+i).innerHTML = (((data.daily.data[i].apparentTemperatureLow-32)*5/9)+273).toFixed(0) + degree +" K";
        }
    };

  // handles current day skycon selection
    const icon = data.currently.icon;
    const skycon = new Skycons({'color':'orange'});
    switch(icon){
        case "clear-day":
            skycon.set("icon", Skycons.CLEAR_DAY);
            skycon.play();
            break;
        case "clear-night":
            skycon.set("icon", Skycons.CLEAR_NIGHT);
            skycon.play();
            break;
        case "rain":
            skycon.set("icon", Skycons.RAIN);
            skycon.play();
            break;
        case "snow":
            skycon.set("icon", Skycons.SNOW);
            skycon.play();
            break;
        case "sleet":
            skycon.set("icon", Skycons.SLEET);
            skycon.play();
            break;
        case "wind":
            skycon.set("icon", Skycons.WIND);
            skycon.play();
            break;
        case "fog":
            skycon.set("icon", Skycons.FOG);
            skycon.play();
            break;
        case "cloudy":
            skycon.set("icon", Skycons.CLOUDY);
            skycon.play();
            break;
        case "partly-cloudy-day":
            skycon.set("icon", Skycons.PARTLY_CLOUDY_DAY);
            skycon.play();
            break;
        case "partly-cloudy-night":
            skycon.set("icon", Skycons.PARTLY_CLOUDY_NIGHT);
            skycon.play();
            break;
    }

  // retrieve forecast summary, day names, summaries, high/low, skycons
    for(let i = 1; i <= 6; i++){
        let iconi = data.daily.data[i].icon;
        let high = data.daily.data[i].apparentTemperatureHigh;
        let low = data.daily.data[i].apparentTemperatureLow;
        let fcTime = data.daily.data[i].time;

      // assign name of day to forecasts
        let date = new Date(fcTime * 1000);
        let dateStr = date.toDateString();
        $('dayName'+i).innerHTML = dateStr;
      // populate summaries
        $('fcSpan'+i).textContent = data.daily.data[i].summary;
      // highs and lows
        $('fcHigh'+i).innerHTML = data.daily.data[i].apparentTemperatureHigh.toFixed(0) + degree +" F";
        $('fcLow'+i).innerHTML = data.daily.data[i].apparentTemperatureLow.toFixed(0) + degree +" F";

      // handles assigning skycon
        let skyconi = new Skycons({"color":"orange"});
        switch(iconi){
          case "clear-day":
            skyconi.set("icon"+i, Skycons.CLEAR_DAY);
            skyconi.play();
            break;
          case "clear-night":
            skyconi.set("icon"+i, Skycons.CLEAR_NIGHT);
            skyconi.play();
            break;
          case "rain":
            skyconi.set("icon"+i, Skycons.RAIN);
            skyconi.play();
            break;
          case "snow":
            skyconi.set("icon"+i, Skycons.SNOW);
            skyconi.play();
            break;
          case "sleet":
            skyconi.set("icon"+i, Skycons.SLEET);
            skyconi.play();
            break;
          case "wind":
            skyconi.set("icon"+i, Skycons.WIND);
            skyconi.play();
            break;
          case "fog":
            skyconi.set("icon"+i, Skycons.FOG);
            skyconi.play();
            break;
          case "cloudy":
            skyconi.set("icon"+i, Skycons.CLOUDY);
            skyconi.play();
            break;
          case "partly-cloudy-day":
            skyconi.set("icon"+i, Skycons.PARTLY_CLOUDY_DAY);
            skyconi.play();
            break;
          case "partly-cloudy-night":
            skyconi.set("icon"+i, Skycons.PARTLY_CLOUDY_NIGHT);
            skyconi.play();
            break;
          }
      }
  });
} else {
  console.log('geolocation unavailable');
}

function darkMode(){

    let spanText = document.getElementById("darkmodesign").innerHTML;

    if(spanText == "Dark Mode"){
      document.getElementById('body').style.backgroundColor = '#303030';
      document.getElementById('body').style.color = 'white';
      document.getElementById('darkmodesign').innerHTML = 'Light Mode';
    } else if(spanText == "Light Mode"){
      document.getElementById('body').style.backgroundColor = 'white';
      document.getElementById('body').style.color = 'black';
      document.getElementById('darkmodesign').innerHTML = 'Dark Mode';
    }

}
