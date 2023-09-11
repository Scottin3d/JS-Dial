function hexToRgba(hex, alpha) {
    // https://colorhunt.co/
    // Remove the hash character (#) if it exists
    hex = hex.replace(/^#/, '');

    // Parse the hex value into individual RGB components
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Ensure the alpha value is within the range [0, 1]
    alpha = Math.min(Math.max(0, alpha), 1);

    // Create the RGBA string
    const rgba = `rgba(${r}, ${g}, ${b}, ${alpha})`;

    return rgba;
}


function blendHexColors(color1, color2, weight) {
    // Convert HEX colors to RGB
    const hexToRgb = (hex) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return { r, g, b };
    };

    // Convert RGB to HEX
    const rgbToHex = (rgb) => {
        const toHex = (val) => {
            const hex = val.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
    };

    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);

    // Calculate the blended RGB color
    const blendedRgb = {
        r: Math.round((1 - weight) * rgb1.r + weight * rgb2.r),
        g: Math.round((1 - weight) * rgb1.g + weight * rgb2.g),
        b: Math.round((1 - weight) * rgb1.b + weight * rgb2.b),
    };

    // Convert the blended RGB back to HEX
    return rgbToHex(blendedRgb);
}

function calculateDistance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx ** 2 + dy ** 2);
}

// time 
function timeToDegrees(dateObj) {
    const date = new Date(dateObj);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const totalTimeInMinutes = (hours * 60) + minutes;
    const degrees = totalTimeInMinutes * 0.25;
    return (degrees + 90) % 360;
}

function timeToRadians(date) {
    const degrees = timeToDegrees(date);
    return (degrees / 180) * Math.PI;
}