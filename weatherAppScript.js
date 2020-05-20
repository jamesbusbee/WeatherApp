function getWeather(){
    const summary = document.getElementById("summary");
    const dsKey = DARK_SKY_KEY;       // api key for DarkSky API
    const dsUrl = "https://api.darksky.net/forecast/";      // api URL
    const degree = "&deg;"                                  // degree symbol
    
    navigator.geolocation.getCurrentPosition(success, error);   // use navigator to retrieve position
                                                                // pass success and error parameters 
    const f = document.getElementById("fahrenheit");
    const c = document.getElementById("celsius");
    const k = document.getElementById("kelvin");
    
    function success(pos){
        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
        console.log(lat);
        console.log(lng);
        
        // retrieve current location address
        $.ajax({
            url: 'https://reverse.geocoder.ls.hereapi.com/6.2/reversegeocode.json',
            type: 'GET',
            dataType: 'jsonp',
            jsonp: 'jsoncallback',
            data: {
                prox: lat + ',' + lng,
                mode: 'retrieveAddresses',
                maxresults: '1',
                gen: '9',
                apiKey: HERE_KEY
            }, 
            success: function (data) {
                console.log(data);
                $("#day").html(data.Response.View[0].Result[0].Location.Address.Label);
            }
        });
        
        // retrieve current weather, summary, high/low, skycon 
        $.getJSON(
            dsUrl + dsKey + "/" + lat + "," + lng + "?callback=?",
            function(data){
                
                // return current day summary
                $("#summary").html(data.currently.summary);
                
                // returns temperature in requested format
                if (f.checked){
                    $("#temp").html(data.currently.temperature.toFixed(0) + degree + " F");
                    $("#currentHigh").html(data.daily.data[0].apparentTemperatureHigh.toFixed(0) + degree +" F");
                    $("#currentLow").html(data.daily.data[0].apparentTemperatureLow.toFixed(0) + degree +" F");
                }
                else if (c.checked){
                    $("#temp").html(((data.currently.temperature-32)*5/9).toFixed(0) + degree + " C");
                    $("#currentHigh").html(((data.daily.data[0].apparentTemperatureHigh-32)*5/9).toFixed(0) + degree +" C");
                    $("#currentLow").html(((data.daily.data[0].apparentTemperatureLow-32)*5/9).toFixed(0) + degree +" C");
                }
                else if (k.checked){
                    $("#temp").html((((data.currently.temperature-32)*5/9)+273).toFixed(0) + degree + " K");
                    $("#currentHigh").html((((data.daily.data[0].apparentTemperatureHigh-32)*5/9)+273).toFixed(0) + degree +" K");
                    $("#currentLow").html((((data.daily.data[0].apparentTemperatureLow-32)*5/9)+273).toFixed(0) + degree +" K");
                }
                else{
                    alert("whoops");
                }
                
                // return weekly forecast
                $("#weeklyForecast").html(data.daily.summary);
                // JSON object for reference
                console.log(data);
                
                const icon = data.currently.icon;
                const skycon = new Skycons({"color":"orange"});
                // handles current day skycon selection 
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
            }
        );
        
        // retrieve forecast summary, day names, summaries, high/low, skycons
        $.getJSON(
            dsUrl + dsKey + "/" + lat + "," + lng + "?callback=?",
            function(data){
                for (i = 1; i < 9; i++){
                    $("#forecast").html(data.summary);
                    let iconi = data.daily.data[i].icon;
                    let fcSummary = data.daily.data[i].summary;
                    let high = data.daily.data[i].apparentTemperatureHigh;
                    let low = data.daily.data[i].apparentTemperatureLow;
                    let fcTime = data.daily.data[i].time;
                    
                // assign name of day to forecasts
                    let date = new Date(fcTime * 1000);
                    let dateStr = date.toDateString();
                    $("#dayName"+i).html(dateStr);
                    
                // returns temperature in requested format
                    if (f.checked){
                    $("#fcHigh"+i).html(high.toFixed(0)+degree+" F");
                    $("#fcLow"+i).html(low.toFixed(0)+degree+" F");
                }
                    else if (c.checked){
                    $("#fcHigh"+i).html(((high-32)*5/9).toFixed(0)+degree+" C");
                    $("#fcLow"+i).html(((low-32)*5/9).toFixed(0)+degree+" C");
                }
                    else if (k.checked){
                    $("#fcHigh"+i).html((((high-32)*5/9)+273).toFixed(0)+degree+" F");
                    $("#fcLow"+i).html((((low-32)*5/9)+273).toFixed(0)+degree+" F");
                }
                    else{
                    alert("whoops");
                }
                // list forecasted daily summaries
                    $("#fcSpan"+i).html(fcSummary);
                
                // handles assigning skycon 
                    let skyconi = new Skycons({"color":"orange"});
                    switch(iconi){                                  // switch statement to handle skycon selection 
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
            }
        );
    }
    
    function error(){                 // throw error message 
        summary.innerHTML = "Error retrieving weather forecast.";
    }
}

// function to display current day and date 
function displayTimeAndDay(){
    
    let today = new Date();
    $("#day").html(today.toDateString());
    
}

// dark mode 
function darkMode(){
    
    let spanText = document.getElementById("darkmodesign").innerHTML;
    
    if(spanText == "Dark Mode"){
        $("#container1").css("background-color", "#303030");
        $("#body").css("background-color", "#303030");
        $("#container1").css("color", "white");
        $("#body").css("color", "white");
        $("#darkMode").text("Light Mode");
        $("span.darkmodesign").text("Light Mode")
    } else if(spanText == "Light Mode"){
        $("#container1").css("background-color", "#FAFAFA")
        $("#body").css("background-color", "white");
        $("#container1").css("color", "black");
        $("#body").css("color", "black");
        $("#darkMode").text("Dark Mode");
        $("span.darkmodesign").text("Dark Mode")
    }

}

//displayTimeAndDay();
getWeather();