// Get the canvas element and its context
const canvas = document.getElementById("clockCanvas");
const ctx = canvas.getContext("2d");
const popup = document.getElementById('popup');
// Array to store circle information
const circles = [];

// Define clock parameters
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const clockRadius = 300;
const sunOffset = 0.8;
const sun = {

}

const testDuskTime = new Date();
testDuskTime.setHours(20, 37, 0, 0);
const testDawnTime = new Date();
testDawnTime.setHours(6, 23, 0, 0);

let sunRadius = 25; // Initial sun radius
var sunrise;
var sunset;
var solarNoon;
var dayLength;
var civilTwilightBegin;
var civilTwilightEnd;
var nauticalTwilightBegin;
var nauticalTwilightEnd;
var astronomicalTwilightBegin;
var astronomicalTwilightEnd;






function degreesToTime(degrees) {
    // Calculate time values based on the degree angle
    let hours = Math.floor((degrees / 360) * 24);
    // offset hours by 12
    hours = (hours + 12) % 24;
    let minutes = Math.floor(((degrees % 30) / 30) * 60);
    let dateObj = new Date();
    dateObj.setHours(hours, minutes, 0, 0);
    // Convert degrees to radians
    const radians = (degrees / 180) * Math.PI;
  
    return dateObj;
}

// WORKING
function timeToDegrees(dateObj) {
    const date = new Date(dateObj);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const totalTimeInMinutes = (hours * 60) + minutes;
    const degrees = totalTimeInMinutes * 0.25;
    return degrees + 90;
}

function timeToRadians(date) {
    const degrees = timeToDegrees(date);
    return (degrees / 180) * Math.PI;
}

function radiansToDate(angleInRadians) {
    // Offset angle in radians (3π/2)
    const offsetRadians = 3 * Math.PI / 2;

    // Add the offset to the input angle
    const adjustedRadians = angleInRadians + offsetRadians;

    // Ensure the adjusted angle is within the range [0, 2π)
    if (adjustedRadians < 0) {
        adjustedRadians += 2 * Math.PI;
    } else if (adjustedRadians >= 2 * Math.PI) {
        // adjustedRadians -= 2 * Math.PI;
    }

    // Calculate the total hours (24 hours in 2π radians)
    const totalHours = (adjustedRadians / (2 * Math.PI)) * 24;

    // Extract hours and minutes
    const hours = Math.floor(totalHours);
    const minutes = Math.floor((totalHours - hours) * 60);

    // Create a new Date object for the current date with the calculated time
    const currentDate = new Date();
    currentDate.setHours(hours, minutes, 0, 0);

    return currentDate;
}

// Function to calculate the background color based on the current time
function fillNightBackGround(time) {

    let dawnAngle = timeToDegrees(sunrise);
    const dawnRadians = (dawnAngle / 180) * Math.PI;

    let duskAngle = timeToDegrees(sunset);
    const duskRadians = (duskAngle / 180) * Math.PI;
    drawColorOnCanvas(duskRadians, dawnRadians, '#5C469C')

    // offset testdawntime by 30 minutes
    let dawnOffset = new Date(sunrise.getTime() - 30 * 60000);
    let dawnOffsetAngle = timeToDegrees(dawnOffset);
    let dawnOffsetRadians = (dawnOffsetAngle / 180) * Math.PI;

    let duskOffset = new Date(sunset.getTime() + 30 * 60000);
    let duskOffsetAngle = timeToDegrees(duskOffset);
    let duskOffsetRadians = (duskOffsetAngle / 180) * Math.PI;
    drawColorOnCanvas(duskOffsetRadians, dawnOffsetRadians, '#1D267D');

     // offset testdawntime by 60 minutes
     dawnOffset = new Date(sunrise.getTime() - 60 * 60000);
     dawnOffsetAngle = timeToDegrees(dawnOffset);
     dawnOffsetRadians = (dawnOffsetAngle / 180) * Math.PI;

     duskOffset = new Date(sunset.getTime() + 60 * 60000);
    duskOffsetAngle = timeToDegrees(duskOffset);
    duskOffsetRadians = (duskOffsetAngle / 180) * Math.PI;
    drawColorOnCanvas(duskOffsetRadians, dawnOffsetRadians, '#0C134F');
}

function fillDayBackGround(angleDegrees) {
    // fill sky
    // offset angle by 270 % 360
    angleDegrees = (angleDegrees + 270) % 360;
    
    let dawnAngle = timeToDegrees(sunrise);
    const dawnRadians = (dawnAngle / 180) * Math.PI;
    
    let duskAngle = timeToDegrees(sunset);
    const duskRadians = (duskAngle / 180) * Math.PI;
    
    const grd = ctx.createRadialGradient(centerX, centerY, 20, centerX, centerY, clockRadius);
    

    // 0.25 degrees per minute
    // sunrise #EFD595, #EFB495, sunrise +- 30 minutes 8 degrees
    // midday #99DBF5 after sunrise
    // noon #9AC5F4 sunrise + day length /2 +- 1 hour 16 degrees
    // evening #FFEEBB
    // sunset #EBEF95, #EF9595 sunset +- 30 minutes
    // night #4D3C77
    // midnight #3F1D38 midnight +- 1 hour

    // set color based on conditions
    console.log(angleDegrees, dawnAngle, duskAngle);
    let baseColor = '#99DBF5'; // midday
    let outterColor = '#9AC5F4'; // midnight

    const noonAngle = timeToDegrees(solarNoon);
    // sunrise
    if (angleDegrees > dawnAngle - 16 && angleDegrees < dawnAngle + 16) {
        baseColor = '#EFD595';
    // noon
    }else if(angleDegrees > noonAngle - 16 && angleDegrees < noonAngle + 16){
        baseColor = '#9AC5F4';
    // sunset
    }else if(angleDegrees > duskAngle - 16 && angleDegrees < duskAngle + 16){
        baseColor = '#EBEF95';
        outterColor = '#EF9595';
    // evening
    }else if(angleDegrees > duskAngle + 16 && angleDegrees < 90 - 8){
        baseColor = '#4D3C77';
    }
    // midnight
    else if(angleDegrees > 90 -8 && angleDegrees < 90 + 8){
        baseColor = '#3F1D38';
        outterColor = '#4D3C77';
    }

    grd.addColorStop(0, baseColor);

    grd.addColorStop(1, outterColor);
    drawColorOnCanvas(dawnRadians, duskRadians, grd)

}

// WORKING
function drawColorOnCanvas(angleTo, angleFrom, color) {
    ctx.beginPath();
    ctx.arc(centerX, centerY, clockRadius, angleTo, angleFrom);
    ctx.lineTo(centerX, centerY);
    ctx.fillStyle = color;
    ctx.fill();
}


// Function to show the popup
function showPopup(x, y, message) {
    popup.style.display = 'block';
    popup.style.left = x + 'px';
    popup.style.top = y + 'px';
    popup.textContent = message;
}

// Function to hide the popup
function hidePopup() {
    popup.style.display = 'none';
}

function drawClockTickMarks(centerX, centerY, radius, labelRadius) {
    // draw a tick mark every 6 degrees
    for (let i = 0; i < 360; i += 3) {
        const angle = (i / 180) * Math.PI;
        const x1 = centerX + radius * Math.cos(angle);
        const y1 = centerY + radius * Math.sin(angle);
        const x2 = centerX + labelRadius * Math.cos(angle);
        const y2 = centerY + labelRadius * Math.sin(angle);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);

        // ctx.strokeStyle = (i % 15 === 0) ?  'black':'gray'; 
        ctx.strokeStyle = '#B9B4C7';
        ctx.lineWidth = (i % 15 === 0) ? 3 : 1;
        ctx.stroke();

        const labelX2 = centerX + (labelRadius - 10) * Math.cos(angle);
        const labelY2 = centerY + (labelRadius - 10) * Math.sin(angle);

        if (!(i % 15)) {
            // Draw labels
            ctx.font = '16px Arial';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${ ((i / 15) + 18) % 24}`, labelX2, labelY2);
        }
    }
}

// Function to draw the clock
function drawClock() {

    // Draw the clock circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, clockRadius, 0, 2 * Math.PI);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.stroke();
}

function drawSunCircle(){
    ctx.beginPath();
    ctx.arc(centerX, centerY, clockRadius * sunOffset, 0, 2 * Math.PI);
    ctx.strokeStyle = "grey";
    ctx.lineWidth = 2;
    ctx.stroke();
}

function drawLineToTime(date, centerX, centerY, radius, color = 'blue') {
    // Calculate the angle in radians
    const angleInRadians = timeToRadians(date);
    // Calculate the endpoint of the line
    const lineLength = Math.min(centerX, centerY) * 0.8; // Adjust the length as needed
    const endX = centerX + Math.cos(angleInRadians) * radius ;
    const endY = centerY + Math.sin(angleInRadians) * radius;
    const intersectX = centerX + Math.cos(angleInRadians) * radius * sunOffset;
    const intersectY = centerY + Math.sin(angleInRadians) * radius * sunOffset;



    // Draw the line from the center to the endpoint
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = color; // Set the line color
    ctx.lineWidth = 2; // Set the line width
    ctx.stroke();

    // draw object at intersection
    const r = 5;
    ctx.beginPath();
    ctx.arc(intersectX, intersectY, r, 0, 2 * Math.PI);
    ctx.fillStyle = '#f1f1f1';
    ctx.fill();

    circles.push({ intersectX, intersectY, r });
}

// Function to draw the sun at a specific angle
function updateSun(angleDegrees) {
    // Clear the canvas and redraw the clock
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const angleRadians = ((angleDegrees - 90) * Math.PI) / 180; // Rotate -90 degrees

    // Calculate the sun's position
    const sunX = centerX + (clockRadius * sunOffset) * Math.cos(angleRadians);
    const sunY = centerY + (clockRadius * sunOffset) * Math.sin(angleRadians);

    const time = angleDegrees;
    fillDayBackGround(time);
    fillNightBackGround(angleDegrees);
    drawLineToTime(radiansToDate(angleRadians), centerX, centerY, clockRadius, 'grey');
    drawClock();
    drawSunCircle();
    drawClockTickMarks(centerX, centerY, clockRadius, clockRadius * .9);
    drawLineToTime(sunrise, centerX, centerY, clockRadius);
    drawLineToTime(sunset, centerX, centerY, clockRadius);
    drawLineToTime(solarNoon, centerX, centerY, clockRadius);
    drawLineToTime(civilTwilightBegin, centerX, centerY, clockRadius);
    drawLineToTime(civilTwilightEnd, centerX, centerY, clockRadius);
    drawLineToTime(nauticalTwilightBegin, centerX, centerY, clockRadius);
    drawLineToTime(nauticalTwilightEnd, centerX, centerY, clockRadius);
    drawLineToTime(astronomicalTwilightBegin, centerX, centerY, clockRadius);
    drawLineToTime(astronomicalTwilightEnd, centerX, centerY, clockRadius);
    


    // // offset angle by -90 degrees
    // angleDegrees -= 90;
    // // convert degree to radian
    // const angleInRadians = (angleDegrees / 180) * Math.PI;
    // // offset angle 

    // ctx.beginPath();
    // ctx.arc(centerX, centerY, clockRadius * .5, angleInRadians, 3 * Math.PI /2);
    // ctx.lineTo(centerX, centerY);
    // ctx.fillStyle = "blue";
    // ctx.fill();

    ctx.shadowBlur = 20;
    ctx.shadowColor = 'white';

    ctx.beginPath();
    ctx.arc(sunX, sunY, sunRadius, 0, 2 * Math.PI);
    ctx.fillStyle = "#F8FDCF";
    ctx.fill();
    ctx.strokeStyle = "#E2F6CA";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';


}





// Get the slider element
const slider = document.getElementById("slider");

// Add an event listener to the slider input
slider.addEventListener("input", () => {
    const angleDegrees = parseInt(slider.value);
    updateSun(angleDegrees);
});

function calculateDistance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx ** 2 + dy ** 2);
  }


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
// Function to handle button click
function handleButtonClick() {
    // Get user input for latitude and longitude
    const latitude = document.getElementById('latitudeInput').value;
    const longitude = document.getElementById('longitudeInput').value;

    // Call the API with the provided coordinates
    getSunriseSunsetData(latitude, longitude);
}

// Add a click event listener to the button
document.getElementById('getSunriseSunsetBtn').addEventListener('click', handleButtonClick);

// Event listener for mousemove
canvas.addEventListener('mousemove', (event) => {
    const mouseX = event.clientX - canvas.getBoundingClientRect().left;
    const mouseY = event.clientY - canvas.getBoundingClientRect().top;
    
    // Check if the mouse is inside any of the circles
    for (const circle of circles) {
      const distance = calculateDistance(mouseX, mouseY, circle.intersectX, circle.intersectY);
      // log ditance and radius

      if (distance <= circle.radius) {
        showPopup(event.pageX, event.pageY, 'Circle Hovered');
        return; // Stop checking other circles
      }
    }
  
    hidePopup(); // Hide the popup if the mouse is not over any circle
  });

// Initialize the canvas by drawing random circles
// for (let i = 0; i < 5; i++) {
//     drawRandomCircle();
// }

// Update background color every second
// setInterval(calculateBackgroundColor, 1000);

// Initial clock drawing
drawClock();
fillNightBackGround();

