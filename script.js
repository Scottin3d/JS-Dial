

// Get the canvas element and its context
const CANVAS = document.getElementById("clockCanvas");
const CTX = CANVAS.getContext("2d");
// Array to store circle information
const circles = [];

// Define clock parameters
const CENTER_X = CANVAS.width / 2;
const CENTER_Y = CANVAS.height / 2;
const CLOCK_RADIUS = 300;
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
var degrees = 0;




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
    
    const grd = CTX.createRadialGradient(CENTER_X, CENTER_Y, 20, CENTER_X, CENTER_Y, CLOCK_RADIUS);
    

    // 0.25 degrees per minute
    // sunrise #EFD595, #EFB495, sunrise +- 30 minutes 8 degrees
    // midday #99DBF5 after sunrise
    // noon #9AC5F4 sunrise + day length /2 +- 1 hour 16 degrees
    // evening #FFEEBB
    // sunset #EBEF95, #EF9595 sunset +- 30 minutes
    // night #4D3C77
    // midnight #3F1D38 midnight +- 1 hour

    // set color based on conditions
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
    CTX.beginPath();
    CTX.arc(CENTER_X, CENTER_Y, CLOCK_RADIUS, angleTo, angleFrom);
    CTX.lineTo(CENTER_X, CENTER_Y);
    CTX.fillStyle = color;
    CTX.fill();
}


function drawClockTickMarks(centerX, centerY, radius, labelRadius) {
    // draw a tick mark every 6 degrees
    for (let i = 0; i < 360; i += 3) {
        const angle = (i / 180) * Math.PI;
        const x1 = centerX + radius * Math.cos(angle);
        const y1 = centerY + radius * Math.sin(angle);
        const x2 = centerX + labelRadius * Math.cos(angle);
        const y2 = centerY + labelRadius * Math.sin(angle);

        CTX.beginPath();
        CTX.moveTo(x1, y1);
        CTX.lineTo(x2, y2);

        // ctx.strokeStyle = (i % 15 === 0) ?  'black':'gray'; 
        CTX.strokeStyle = '#B9B4C7';
        CTX.lineWidth = (i % 15 === 0) ? 3 : 1;
        CTX.stroke();

        const labelX2 = centerX + (labelRadius - 10) * Math.cos(angle);
        const labelY2 = centerY + (labelRadius - 10) * Math.sin(angle);

        if (!(i % 15)) {
            // Draw labels
            CTX.font = '16px Arial';
            CTX.fillStyle = 'white';
            CTX.textAlign = 'center';
            CTX.textBaseline = 'middle';
            CTX.fillText(`${ ((i / 15) + 18) % 24}`, labelX2, labelY2);
        }
    }
}

// Function to draw the clock
function drawClock() {

    // Draw the clock circle
    CTX.beginPath();
    CTX.arc(CENTER_X, CENTER_Y, CLOCK_RADIUS, 0, 2 * Math.PI);
    CTX.strokeStyle = "black";
    CTX.lineWidth = 2;
    CTX.stroke();
}

function drawSunCircle(){
    CTX.beginPath();
    CTX.arc(CENTER_X, CENTER_Y, CLOCK_RADIUS * SUN_OFFSET, 0, 2 * Math.PI);
    const grd = CTX.createRadialGradient(CENTER_X, CENTER_Y, 0, CENTER_X, CENTER_Y, CLOCK_RADIUS * SUN_OFFSET);
    const baseColor = hexToRgba('#F8FDCF', 0);
    grd.addColorStop(0.9, baseColor);
    const outterColor = hexToRgba('#F8FDCF',1 );
    grd.addColorStop(1, outterColor);
    CTX.fillStyle = grd;
    // ctx.fill();

    CTX.strokeStyle = "grey";
    CTX.lineWidth = 2;
    CTX.stroke();
}

function drawSun(angleDegrees){
    const angleRadians = ((angleDegrees - 90) * Math.PI) / 180; // Rotate -90 degrees
    const sunX = CENTER_X + (CLOCK_RADIUS * SUN_OFFSET) * Math.cos(angleRadians);
    const sunY = CENTER_Y + (CLOCK_RADIUS * SUN_OFFSET) * Math.sin(angleRadians);

    drawLineToTime(angleRadians, CENTER_X, CENTER_Y, CLOCK_RADIUS, 'white');

    CTX.shadowBlur = 10;
    CTX.shadowColor = 'white';

    CTX.beginPath();
    CTX.arc(sunX, sunY, sunRadius, 0, 2 * Math.PI);
    CTX.fillStyle = "#F8FDCF";

    const sunrise_begin = ((timeToDegrees(sunrise)+90) + 360) % 360;
    const sunset_end = ((timeToDegrees(sunset)+90) + 360)% 360;
    console.log('d',angleDegrees);
    console.log('s',sunrise_begin, sunset_end);
    if(angleDegrees < sunrise_begin && angleDegrees < sunset_end){
        CTX.fill();
    }
    CTX.strokeStyle = "#E2F6CA";
    CTX.lineWidth = 2;
    CTX.stroke();

    CTX.shadowBlur = 0;
    CTX.shadowColor = 'transparent';

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
    
        CTX.beginPath();
        CTX.strokeStyle = color;
        CTX.lineWidth = 3;
        CTX.moveTo(x1, y1);
    
        // Length of the tick mark
        const tickLength = isSecondPassed ? 10 : 15;
    
        const x2 = X + (r - tickLength) * Math.cos(angle);
        const y2 = Y + (r - tickLength) * Math.sin(angle);
    
        CTX.lineTo(x2, y2);
        CTX.stroke();
      }
}

function drawClockFace(angleRadians){
    const clockX = CENTER_X + (CLOCK_RADIUS * 0.5) * Math.cos(angleRadians + Math.PI);
    const clockY = CENTER_Y + (CLOCK_RADIUS * 0.5) * Math.sin(angleRadians + Math.PI);

    const HEX_LIGHT_BLUE = '#8db4ff';
    const HEX_DARK_BLUE = '#35468e';
    const grd = CTX.createLinearGradient(CENTER_X, CENTER_Y, clockX, clockY);

    drawLineToTime(angleRadians, CENTER_X, CENTER_Y, CLOCK_RADIUS * .5, 'white');

    grd.addColorStop(0, HEX_LIGHT_BLUE);
    grd.addColorStop(1, HEX_DARK_BLUE);
    CTX.beginPath();
    CTX.arc(clockX, clockY, 100, 0, 2 * Math.PI);
    CTX.fillStyle = grd;
    CTX.fill();

    const currentSecond = new Date().getSeconds(); 
    drawClockFaceSecondTickMarks(clockX, clockY, CLOCK_RADIUS * 0.3, currentSecond);

    const labelX = clockX;
    const labelY = clockY;

    // draw time label
    CTX.font = '36px Arial';
    CTX.fillStyle = 'white';
    CTX.textAlign = 'center';
    CTX.textBaseline = 'middle';

    const hours = radiansToDate(angleRadians).getHours().toString().padStart(2, '0');
    const minutes = radiansToDate(angleRadians).getMinutes().toString().padStart(2, '0');
    CTX.fillText(`${hours}:${minutes}`, labelX, labelY);

}

function drawMoon(angleRadians){
    const sunX = CENTER_X + (CLOCK_RADIUS * SUN_OFFSET) * Math.cos(angleRadians);
    const sunY = CENTER_Y + (CLOCK_RADIUS * SUN_OFFSET) * Math.sin(angleRadians);

    CTX.shadowBlur = 20;
    CTX.shadowColor = 'white';

    CTX.beginPath();
    CTX.arc(sunX, sunY, sunRadius, 0, 2 * Math.PI);
    CTX.fillStyle = "#EFE1D1";
    CTX.fill();
    CTX.strokeStyle = "#A78295";
    CTX.lineWidth = 1;
    CTX.stroke();

    CTX.shadowBlur = 0;
    CTX.shadowColor = 'transparent';
}

function drawLineToTime(angleInRadians, centerX, centerY, radius, color = 'blue') {
    // Calculate the angle in radians
    // Calculate the endpoint of the line
    const endX = centerX + Math.cos(angleInRadians) * radius ;
    const endY = centerY + Math.sin(angleInRadians) * radius;
    // Draw the line from the center to the endpoint
    CTX.beginPath();
    CTX.moveTo(centerX, centerY);
    CTX.lineTo(endX, endY);
    CTX.strokeStyle = color; // Set the line color
    CTX.lineWidth = 2; // Set the line width
    CTX.stroke();
}

function drawTimeObject(date, centerX, centerY, radius, color = 'grey') {
    // Calculate the angle in radians
    const angleInRadians = timeToRadians(date);
    const intersectX = centerX + Math.cos(angleInRadians) * radius * SUN_OFFSET;
    const intersectY = centerY + Math.sin(angleInRadians) * radius * SUN_OFFSET;

    // draw object at intersection
    const r = 5;
    CTX.beginPath();
    CTX.arc(intersectX, intersectY, r, 0, 2 * Math.PI);
    CTX.fillStyle = '#f1f1f1';
    CTX.fill();

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
    CTX.beginPath();
    CTX.arc(CENTER_X, CENTER_Y, CLOCK_RADIUS, 0, 2 * Math.PI);
    const grd = CTX.createRadialGradient(CENTER_X, CENTER_Y, 100, CENTER_X, CENTER_Y, CLOCK_RADIUS);
    grd.addColorStop(0, HEX_COLOR_BLEND);
    grd.addColorStop(1, HEX_DARK_BLUE);
    CTX.fillStyle = grd;
    CTX.fill();

    // orange, yellow, light blue, yellow, orange
}

// Function to draw the sun at a specific angle
function updateSun(angleDegrees) {
    // Clear the canvas and redraw the clock
    CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);
    CTX.fillStyle = 'black';
    CTX.fillRect(0, 0, CANVAS.width, CANVAS.height);
    const angleRadians = ((angleDegrees - 90) * Math.PI) / 180; // Rotate -90 degrees
    
    testGradientOT(angleDegrees);
    // fillDayBackGround(time);
    fillNightBackGround(angleDegrees);
    // drawMoon(angleRadians); // only at night TODO fade
    drawTimeObject(radiansToDate(angleRadians), CENTER_X, CENTER_Y, CLOCK_RADIUS, 'grey');
    drawClock();
    drawSunCircle();

    drawSun(angleDegrees);
    drawTimeObject(sunrise, CENTER_X, CENTER_Y, CLOCK_RADIUS);
    drawTimeObject(sunset, CENTER_X, CENTER_Y, CLOCK_RADIUS);
    drawTimeObject(solarNoon, CENTER_X, CENTER_Y, CLOCK_RADIUS);
    drawTimeObject(civilTwilightBegin, CENTER_X, CENTER_Y, CLOCK_RADIUS);
    drawTimeObject(civilTwilightEnd, CENTER_X, CENTER_Y, CLOCK_RADIUS);
    drawTimeObject(nauticalTwilightBegin, CENTER_X, CENTER_Y, CLOCK_RADIUS);
    drawTimeObject(nauticalTwilightEnd, CENTER_X, CENTER_Y, CLOCK_RADIUS);
    drawTimeObject(astronomicalTwilightBegin, CENTER_X, CENTER_Y, CLOCK_RADIUS);
    drawTimeObject(astronomicalTwilightEnd, CENTER_X, CENTER_Y, CLOCK_RADIUS);
    drawClockFace(angleRadians)
    drawClockTickMarks(CENTER_X, CENTER_Y, CLOCK_RADIUS, CLOCK_RADIUS * .9);
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


getSunriseSunsetData(51.5074, 0.1278);
// updateSun(0);

const interval = setInterval(()=>{
    // const time = new Date();
    // time.setMinutes(time.getMinutes() + time.getTimezoneOffset());
    // const degrees = timeToDegrees(time);
    degrees = (degrees + 0.25) % 360;
    console.log(degrees);
    updateSun(degrees);
}, 1000 / 20)
