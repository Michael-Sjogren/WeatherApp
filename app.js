
const FAHRENHEIT = 'F';
const CELSIUS = 'C';

const proxy = 'https://cors-anywhere.herokuapp.com/';
const apiKey = '3cf182a5cdefc67500bcb96a8beedb87';

const tempSection = document.querySelector('#degree-section');
const tempSymbol = document.querySelector('#degree-symbol');


var currentTemp = 0;
var icon = '';
var summary = '';
var precipType = '';
var timezone = '';
var units = 'us';

var long = 0;
var lat = 0;

function setIcon(icon , iconID){
    // update icon
    var skycons = new Skycons({'color': 'white'});
    const currentIcon = icon.replace(/-/g, '_').toUpperCase();
    skycons.play();
    skycons.set(iconID , Skycons[currentIcon]);
}


function updateApp () {
    // update timezone
    document.querySelector('#location-timezone').textContent = timezone;
    // update temp
    document.querySelector('#temprature-degree').textContent = currentTemp;
    // update summary
    document.querySelector('#temprature-description').textContent = summary;
    setIcon(icon , document.querySelector('#precipType-icon'));
}

function updateTemprature(){
    document.querySelector('#temprature-degree').textContent = currentTemp;
}
function toggleDegreeUnits(){
    
    if(tempSymbol.textContent == FAHRENHEIT) {
        tempSymbol.textContent = CELSIUS;
        // (32°F − 32) × 5/9 = 0°C
        currentTemp = +((currentTemp - 32) * 5/9).toFixed(2);
    }else {
        tempSymbol.textContent = FAHRENHEIT;
        // (32°C × 9/5) + 32 = 89,6°F
        currentTemp = +((currentTemp * 9/5) + 32).toFixed(2);
    }
    updateTemprature();
}
window.addEventListener('load', () => {
    
    tempSection.addEventListener('click' , () => {
        toggleDegreeUnits();
    });

    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition( pos => {

            long = pos.coords.longitude;
            lat = pos.coords.latitude;

            const api = `${proxy}https://api.darksky.net/forecast/${apiKey}/${lat},${long}`;

            fetch(api )
            .then( response => {
                return response.json();
            })
            .then( data => {
                const { temperature , icon  , precipType , summary } = data.currently;
                const { units }  = data.flags;
                const { timezone }  = data;

                this.currentTemp = temperature;
                this.icon = icon;
                this.precipType = precipType;
                this.summary = summary;
                this.timezone = timezone;
                this.units = units;
                updateApp();
            });
        });
        
    }
    else {
        console.log('User declined geolocation or does not have it.');
    } 
});



