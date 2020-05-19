import Darksky from 'darkskyjs';

function getWeather(){
    let summary = document.getElementById("summary");
    let dsKey = "b18bbf608384819c30b48f368cb73167";       // api key for DarkSky API
    let dsUrl = "https://api.darksky.net/forecast/";      // api URL
    let degree = "&deg;"                                  // degree symbol
    
    navigator.geolocation.getCurrentPosition(success, error);   // use navigator to retrieve position
                                                                // pass success and error parameters 
    function success(pos){
        lat = pos.coords.latitude.toFixed(4);
        lng = pos.coords.longitude.toFixed(4);
        
        $.getJSON(                                              // get the returned JSON and output it to HTML 
            dsUrl + dsKey + "/" + lat + "," + lng + "?callback=?",
            function(data){
                let f = document.getElementById("fahrenheit");
                let c = document.getElementById("celsius");
                let k = document.getElementById("kelvin");
                
                if (f.checked){
                    $("#temp").html(data.currently.temperature.toFixed(0) + degree + " F");
                }
                else if (c.checked){
                    $("#temp").html(((data.currently.temperature-32)*5/9).toFixed(0) + degree + " C");
                }
                else if (k.checked){
                    $("#temp").html((((data.currently.temperature-32)*5/9)+273).toFixed(0) + degree + " K");
                }
                else{
                    alert("whoops");
                }
                $("#summary").html(data.daily.summary);
                $("#weeklyForecast").html(data.hourly.summary);
                console.log(data.hourly.summary);
                let icon = data.currently.icon;
                           
                let icon3 = data.daily.icon;
                
                let skycon = new Skycons({"color":"orange"});
                switch(icon){                                  // switch statement to handle skycon selection 
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
        
        // API call for very next day forecast
        // will need a variable to handle days as UNIX Time stamps
        $.getJSON(
            dsUrl + dsKey + "/" + lat + "," + lng + 1585785600 + "?callback=?",
            function(data){
                for (i = 1; i < 9; i++){
                    $("#forecast").html(data.summary);
                    let iconi = data.daily.icon;
                
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
    summary.innerHTML = "Weather Loading...";  // place holder
}

// function to display current day and date 
function displayTimeAndDay(){
    
    let today = new Date();
    let month = today.getMonth() + 1;   // getMonth returns last month incriment by 1
    let dow = today.getDay();           // current day
    
    $("#date").html(today.getDate()+'/'+month+'/'+today.getFullYear());
    
    switch(dow){                        // day of the week switch 
        case 0:
            $("#day").html("Sunday");
            break;
        case 1:
            $("#day").html("Monday");
            break;
        case 2:
            $("#day").html("Tuesday");
            break;
        case 3:
            $("#day").html("Wednesday");
            break;
        case 4:
            $("#day").html("Thursday");
            break;
        case 5:
            $("#day").html("Friday");
            break;
        case 6:
            $("#day").html("Saturday");
            break;
    }

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

displayTimeAndDay();
getWeather();