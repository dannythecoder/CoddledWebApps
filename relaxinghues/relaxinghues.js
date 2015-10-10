// relaxinghues.js
// Written by Danny F. Caudill (DannyTheCoder)
//
// Oct 8, 2015
//

function createAppState() {
    var colorState = {
        curColor: [0x00, 0x33, 0x11],
        curDir: [1, 1, 1],
        maxVal: 0xFF
    };

    return colorState;
}

function updateColorState() {

    var len = colorState.curColor.length;

    for (var i = 0; i < len; i++) {
        // Calculate the new color
        colorState.curColor[i] += ((i + 1) * colorState.curDir[i])

        // Cap at max
        if (colorState.curColor[i] > colorState.maxVal) {
            colorState.curDir[i] = -1;
            colorState.curColor[i] = colorState.maxVal - (i + 1);
        }

        // Cap at min
        if (colorState.curColor[i] < 0) {
            colorState.curDir[i] = 1;
            colorState.curColor[i] = (i + 1);
        }
    }
}

// Redraw method
function redraw() {
// Calculate the main color
var currentHue = "#" + ((colorState.curColor[2] & 0x0000FF) |
                        ((colorState.curColor[1] << 8) & 0x00FF00) |
                        ((colorState.curColor[0] << 16) & 0xFF0000)).toString(16)

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