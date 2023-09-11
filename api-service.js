//-4.4203400, 15.4046700
//https://sunrise-sunset.org/api
// Function to call the API
function getSunriseSunsetData(lat, lng) {
    const apiUrl = `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&formatted=0`;
    
    fetch(apiUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            // Display the API response
            console.log('Success:', data);
            sunrise = new Date(data.results.sunrise);
            sunrise.setMinutes(sunrise.getMinutes() + sunrise.getTimezoneOffset());
            sunset = new Date(data.results.sunset);
            sunset.setMinutes(sunset.getMinutes() + sunset.getTimezoneOffset());
            solarNoon = new Date(data.results.solar_noon);
            solarNoon.setMinutes(solarNoon.getMinutes() + solarNoon.getTimezoneOffset());
            dayLength = data.results.day_length / 60; // minutes 
            civilTwilightBegin = new Date(data.results.civil_twilight_begin);
            civilTwilightBegin.setMinutes(civilTwilightBegin.getMinutes() + civilTwilightBegin.getTimezoneOffset());
            civilTwilightEnd = new Date(data.results.civil_twilight_end);
            civilTwilightEnd.setMinutes(civilTwilightEnd.getMinutes() + civilTwilightEnd.getTimezoneOffset());
            nauticalTwilightBegin = new Date(data.results.nautical_twilight_begin);
            nauticalTwilightBegin.setMinutes(nauticalTwilightBegin.getMinutes() + nauticalTwilightBegin.getTimezoneOffset());
            nauticalTwilightEnd = new Date(data.results.nautical_twilight_end);
            nauticalTwilightEnd.setMinutes(nauticalTwilightEnd.getMinutes() + nauticalTwilightEnd.getTimezoneOffset());
            astronomicalTwilightBegin = new Date(data.results.astronomical_twilight_begin);
            astronomicalTwilightBegin.setMinutes(astronomicalTwilightBegin.getMinutes() + astronomicalTwilightBegin.getTimezoneOffset());
            astronomicalTwilightEnd = new Date(data.results.astronomical_twilight_end);
            astronomicalTwilightEnd.setMinutes(astronomicalTwilightEnd.getMinutes() + astronomicalTwilightEnd.getTimezoneOffset());
            
            updateSun(0);
            document.getElementById('apiResponse').textContent = JSON.stringify(data, null, 2);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}