

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
const SUN_OFFSET = 0.7;
const sun = {

}

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
var timeMultiplyer = 1;





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

    // sunrise and sunset
    let sunriseDegrees = timeToDegrees(sunrise);
    const sunriseRadians = (sunriseDegrees / 180) * Math.PI;

    let sunsetDegrees = timeToDegrees(sunset);
    const sunsetRadians = (sunsetDegrees / 180) * Math.PI;
    drawColorOnCanvas(sunsetRadians, sunriseRadians, '#7858A6')

    // civil twilight
    let civilTwilightBeginDegrees = timeToDegrees(civilTwilightBegin);
    const civilTwilightBeginRadians = (civilTwilightBeginDegrees / 180) * Math.PI;

    let civilTwilightEndDegrees = timeToDegrees(civilTwilightEnd);
    const civilTwilightEndRadians = (civilTwilightEndDegrees / 180) * Math.PI;
    console.log(civilTwilightBeginDegrees, civilTwilightEndDegrees);
    drawColorOnCanvas(civilTwilightEndRadians, civilTwilightBeginRadians, '#5B4B8A');

    // nautical twilight
    let nauticalTwilightBeginDegrees = timeToDegrees(nauticalTwilightBegin);
    const nauticalTwilightBeginRadians = (nauticalTwilightBeginDegrees / 180) * Math.PI;

    let nauticalTwilightEndDegrees = timeToDegrees(nauticalTwilightEnd);
    const nauticalTwilightEndRadians = (nauticalTwilightEndDegrees / 180) * Math.PI;
    drawColorOnCanvas(nauticalTwilightEndRadians, nauticalTwilightBeginRadians, '#4C3575');

    // astronomical twilight
    let astronomicalTwilightBeginDegrees = timeToDegrees(astronomicalTwilightBegin);
    const astronomicalTwilightBeginRadians = (astronomicalTwilightBeginDegrees / 180) * Math.PI;

    let astronomicalTwilightEndDegrees = timeToDegrees(astronomicalTwilightEnd);
    const astronomicalTwilightEndRadians = (astronomicalTwilightEndDegrees / 180) * Math.PI;
    drawColorOnCanvas(astronomicalTwilightEndRadians, astronomicalTwilightBeginRadians, '#371B58');
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
    ctx.arc(centerX, centerY, clockRadius * SUN_OFFSET, 0, 2 * Math.PI);
    const grd = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, clockRadius * SUN_OFFSET);
    const baseColor = hexToRgba('#F8FDCF', 0);
    grd.addColorStop(0.9, baseColor);
    const outterColor = hexToRgba('#F8FDCF',1 );
    grd.addColorStop(1, outterColor);
    ctx.fillStyle = grd;
    // ctx.fill();

    ctx.strokeStyle = "grey";
    ctx.lineWidth = 2;
    ctx.stroke();
}

function drawSun(angleRadians){
    const sunX = centerX + (clockRadius * SUN_OFFSET) * Math.cos(angleRadians);
    const sunY = centerY + (clockRadius * SUN_OFFSET) * Math.sin(angleRadians);

    drawLineToTime(angleRadians, centerX, centerY, clockRadius, 'white');

    ctx.shadowBlur = 10;
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

function drawClockFaceSecondTickMarks(X, Y, r, totalSeconds){
    const totalTicks = 60; // 60 seconds in a minute
    for (let i = 0; i < totalTicks; i++) {
        const angle = (i / totalTicks) * (2 * Math.PI); // Calculate the angle for each tick
        const x1 = X + r * Math.cos(angle);
        const y1 = Y + r * Math.sin(angle);
    
        // Determine the color based on whether the second has passed or not
        const isSecondPassed = i < totalSeconds;
        const color = isSecondPassed ? 'white' : 'darkblue';
    
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.moveTo(x1, y1);
    
        // Length of the tick mark
        const tickLength = isSecondPassed ? 10 : 15;
    
        const x2 = X + (r - tickLength) * Math.cos(angle);
        const y2 = Y + (r - tickLength) * Math.sin(angle);
    
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
}

function drawClockFace(angleRadians){
    const clockX = centerX + (clockRadius * 0.5) * Math.cos(angleRadians);
    const clockY = centerY + (clockRadius * 0.5) * Math.sin(angleRadians);

    const HEX_LIGHT_BLUE = '#8db4ff';
    const HEX_DARK_BLUE = '#35468e';
    const grd = ctx.createLinearGradient(centerX, centerY, clockX, clockY);

    drawLineToTime(angleRadians, centerX, centerY, clockRadius * .5, 'white');

    grd.addColorStop(0, HEX_LIGHT_BLUE);
    grd.addColorStop(1, HEX_DARK_BLUE);
    ctx.beginPath();
    ctx.arc(clockX, clockY, 100, 0, 2 * Math.PI);
    ctx.fillStyle = grd;
    ctx.fill();

    const currentSecond = new Date().getSeconds(); 
    drawClockFaceSecondTickMarks(clockX, clockY, clockRadius * 0.3, currentSecond);

    const labelX = clockX;
    const labelY = clockY;

    // draw time label
    ctx.font = '36px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const hours = radiansToDate(angleRadians).getHours().toString().padStart(2, '0');
    const minutes = radiansToDate(angleRadians).getMinutes().toString().padStart(2, '0');
    ctx.fillText(`${hours}:${minutes}`, labelX, labelY);

}

function drawMoon(angleRadians){
    const sunX = centerX + (clockRadius * SUN_OFFSET) * Math.cos(angleRadians);
    const sunY = centerY + (clockRadius * SUN_OFFSET) * Math.sin(angleRadians);

    ctx.shadowBlur = 20;
    ctx.shadowColor = 'white';

    ctx.beginPath();
    ctx.arc(sunX, sunY, sunRadius, 0, 2 * Math.PI);
    ctx.fillStyle = "#EFE1D1";
    ctx.fill();
    ctx.strokeStyle = "#A78295";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';
}

function drawLineToTime(angleInRadians, centerX, centerY, radius, color = 'blue') {
    // Calculate the angle in radians
    // Calculate the endpoint of the line
    const endX = centerX + Math.cos(angleInRadians) * radius ;
    const endY = centerY + Math.sin(angleInRadians) * radius;
    // Draw the line from the center to the endpoint
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = color; // Set the line color
    ctx.lineWidth = 2; // Set the line width
    ctx.stroke();
}

function drawTimeObject(date, centerX, centerY, radius, color = 'grey') {
    // Calculate the angle in radians
    const angleInRadians = timeToRadians(date);
    const intersectX = centerX + Math.cos(angleInRadians) * radius * SUN_OFFSET;
    const intersectY = centerY + Math.sin(angleInRadians) * radius * SUN_OFFSET;

    // draw object at intersection
    const r = 5;
    ctx.beginPath();
    ctx.arc(intersectX, intersectY, r, 0, 2 * Math.PI);
    ctx.fillStyle = '#f1f1f1';
    ctx.fill();

    circles.push({ intersectX, intersectY, r });
}

function testGradientOT(angleDegrees){
    const COLORS = ['#EFB495', '#EBEF95', '#8db4ff', '#EBEF95', '#EFB495'];
    const numStops = COLORS.length - 1;
    const stopWidth = 360 / numStops;
    const currentStop = Math.floor(angleDegrees / stopWidth);
    const remainder = angleDegrees % stopWidth;
    // Extract the two colors to blend
    const color1 = COLORS[currentStop];
    const color2 = COLORS[currentStop + 1];

    const HEX_LIGHT_BLUE = '#8db4ff';
    const HEX_DARK_BLUE = '#35468e';

    // const RGBA_COLOR_BLEND = blendColors(RGBA_LIGHT_BLUE, RGBA_DARK_BLUE, angleDegrees / 360);
    const HEX_COLOR_BLEND = blendHexColors(color1, color2, angleDegrees / 360);
    ctx.beginPath();
    ctx.arc(centerX, centerY, clockRadius, 0, 2 * Math.PI);
    const grd = ctx.createRadialGradient(centerX, centerY, 100, centerX, centerY, clockRadius);
    grd.addColorStop(0, HEX_COLOR_BLEND);
    grd.addColorStop(1, HEX_DARK_BLUE);
    ctx.fillStyle = grd;
    ctx.fill();

    // orange, yellow, light blue, yellow, orange
}

// Function to draw the sun at a specific angle
function updateSun(angleDegrees) {
    // Clear the canvas and redraw the clock
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const angleRadians = ((angleDegrees - 90) * Math.PI) / 180; // Rotate -90 degrees
    
    testGradientOT(angleDegrees);
    // fillDayBackGround(time);
    fillNightBackGround(angleDegrees);
    // drawMoon(angleRadians); // only at night TODO fade
    drawTimeObject(radiansToDate(angleRadians), centerX, centerY, clockRadius, 'grey');
    drawClock();
    drawSunCircle();
    drawSun(angleRadians);
    drawClockFace(angleRadians + Math.PI)
    drawClockTickMarks(centerX, centerY, clockRadius, clockRadius * .9);
    drawTimeObject(sunrise, centerX, centerY, clockRadius);
    drawTimeObject(sunset, centerX, centerY, clockRadius);
    drawTimeObject(solarNoon, centerX, centerY, clockRadius);
    drawTimeObject(civilTwilightBegin, centerX, centerY, clockRadius);
    drawTimeObject(civilTwilightEnd, centerX, centerY, clockRadius);
    drawTimeObject(nauticalTwilightBegin, centerX, centerY, clockRadius);
    drawTimeObject(nauticalTwilightEnd, centerX, centerY, clockRadius);
    drawTimeObject(astronomicalTwilightBegin, centerX, centerY, clockRadius);
    drawTimeObject(astronomicalTwilightEnd, centerX, centerY, clockRadius);
}





// Get the slider element
const slider = document.getElementById("slider");

// Add an event listener to the slider input
slider.addEventListener("input", () => {
    timeMultiplyer = parseInt(slider.value);
});





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

getSunriseSunsetData(51.5074, 0.1278);
// updateSun(0);

const interval = setInterval(()=>{
// getSunriseSunsetData(51.5074, 0.1278);
const time = new Date();
time.setMinutes(time.getMinutes() + time.getTimezoneOffset());
const degrees = timeToDegrees(time);
updateSun((degrees * timeMultiplyer) % 360);
}, 1000)
