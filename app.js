const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const minElement = document.querySelector(".min-value p");
const maxElement = document.querySelector(".max-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");
const notificationElement = document.querySelector(".notification");
const titleElement = document.querySelector(".app-title")

document.querySelector(".search-button").addEventListener("click", function() {getWeatherCity()});

// App data
const weather = {};

weather.temperature = {
    unit : "celsius",
    minUnit: "celsius",
    maxUnit: "celsius"
}

const KELVIN = 273;
// API KEY
const key = "8f1bc485c345a398e343506e3c8fee10";

if('geolocation' in navigator){
    navigator.geolocation.getCurrentPosition(setPosition, showError);
}else{
    notificationElement.style.display = "block";
    notificationElement.innerHTML = "<p>Browser doesn't Support Geolocation</p>";
}

function setPosition(position){
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    
    getWeatherLatLong(latitude, longitude);
}

function showError(error){
    notificationElement.style.display = "block";
    let msg = error.message.split(" ");
    for (let i = 0; i < msg.length; ++i) {
        msg[i] = msg[i].charAt(0).toUpperCase() + msg[i].slice(1);
    }
    notificationElement.innerHTML = `<p> ${msg.join(' ')} </p>`;
}

function getWeatherLatLong(latitude, longitude){
    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
    
    fetch(api)
        .then(function(response){
            let data = response.json();
            return data;
        })
        .then(function(data){
            weather.temperature.value = Math.floor(data.main.temp - KELVIN);
            weather.temperature.max = Math.floor(data.main.temp_max - KELVIN);
            weather.temperature.min = Math.floor(data.main.temp_min - KELVIN);
            weather.description = data.weather[0].description;
            weather.iconId = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country;
        })
        .then(function(){
            displayWeather();
        });
}

function getWeatherCity() {
    let city = document.getElementById("search");
    let api = `http://api.openweathermap.org/data/2.5/weather?q=${city.value}&appid=${key}`
    fetch(api)
        .then(function(response) {
            let data = response.json()
            return data
        })
        .then(function(data){
            if (data.cod == "404") {
                showError(data);
            } else {
                notificationElement.style.display = "none";
                weather.temperature.value = Math.floor(data.main.temp - KELVIN);
                weather.temperature.min = Math.floor(data.main.temp_min - KELVIN);
                weather.temperature.max = Math.floor(data.main.temp_max - KELVIN);
                weather.description = data.weather[0].description;
                weather.iconId = data.weather[0].icon;
                weather.city = data.name;
                weather.country = data.sys.country;
            }
        })
        .then(function(){
            displayWeather();
        });
}

function displayWeather(){
    iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    maxElement.innerHTML = `High: ${weather.temperature.max}°<span>C</span>`;
    minElement.innerHTML = `Low: ${weather.temperature.min}°<span>C</span>`;
    var words = weather.description.split(" ")
    
    for (let i = 0; i < words.length; ++i) {
        words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
    }
    
    descElement.innerHTML = words.join(' ');
    locationElement.innerHTML = `${weather.city}, ${weather.country}`;
}

function celsiusToFahrenheit(temperature){
    return (temperature * 9/5) + 32;
}

tempElement.addEventListener("click", function(){
    if(weather.temperature.value === undefined) return;
    
    if(weather.temperature.unit == "celsius"){
        let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
        fahrenheit = Math.floor(fahrenheit);
        
        tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
        weather.temperature.unit = "fahrenheit";
    }else{
        tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
        weather.temperature.unit = "celsius"
    }
});

minElement.addEventListener("click", function(){
    if(weather.temperature.min === undefined) return;
    
    if(weather.temperature.minUnit == "celsius"){
        let fahrenheit = celsiusToFahrenheit(weather.temperature.min);
        fahrenheit = Math.floor(fahrenheit);
        
        minElement.innerHTML = `Low: ${fahrenheit}°<span>F</span>`;
        weather.temperature.minUnit = "fahrenheit";
    }else{
        minElement.innerHTML = `Low: ${weather.temperature.min}°<span>C</span>`;
        weather.temperature.minUnit = "celsius"
    }
});

maxElement.addEventListener("click", function(){
    if(weather.temperature.max === undefined) return;
    
    if(weather.temperature.maxUnit == "celsius"){
        let fahrenheit = celsiusToFahrenheit(weather.temperature.max);
        fahrenheit = Math.floor(fahrenheit);
        
        maxElement.innerHTML = `High: ${fahrenheit}°<span>F</span>`;
        weather.temperature.maxUnit = "fahrenheit";
    }else{
        maxElement.innerHTML = `High: ${weather.temperature.max}°<span>C</span>`;
        weather.temperature.maxUnit = "celsius"
    }
});
