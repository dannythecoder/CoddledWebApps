// relaxinghues.js
// Written by Danny F. Caudill (DannyTheCoder)
//
// Oct 8, 2015
//

function createAppState() {
    var colorState = {
        curColor: [11.3, 12.7, 13.1],
        curDir: [1, 1, 1],
        maxVal: 0xFF,
        minVal: 0x10
    };

    return colorState;
}

function updateColorState() {

    var len = colorState.curColor.length;
    var COMP_SCALE = 0.3;

    for (var i = 0; i < len; i++) {
        // Calculate the new color
        colorState.curColor[i] += (((i + 1) * COMP_SCALE) * colorState.curDir[i])

        // Cap at max
        if (colorState.curColor[i] > colorState.maxVal) {
            colorState.curDir[i] = -1;
            colorState.curColor[i] = colorState.maxVal - ((i + 1) * COMP_SCALE);
        }

        // Cap at min
        if (colorState.curColor[i] < colorState.minVal) {
            colorState.curDir[i] = 1;
            colorState.curColor[i] = colorState.minVal + ((i + 1) * COMP_SCALE);
        }
    }
}

// Redraw method
function redraw() {
// Calculate the main color
var currentHue = "#" + ((Math.round(colorState.curColor[2]) & 0x0000FF) |
                        ((Math.round(colorState.curColor[1]) << 8) & 0x00FF00) |
                        ((Math.round(colorState.curColor[0]) << 16) &
                          0xFF0000)).toString(16)

// Draw next frame
context.strokeStyle = currentHue;
context.fillStyle = currentHue;
context.lineWidth = '10';
context.fillRect(0, 0, window.innerWidth, window.innerHeight);

// Update state
updateColorState();
}

// Key Down handler
function doKeyDown(e) {
  if(e.keyCode==37){
    // Left Arrow
    colorState.curRed = 0;
  }
  else if(e.keyCode==39){
    // Right Arrow
    colorState.curBlue = 0;
  }
}