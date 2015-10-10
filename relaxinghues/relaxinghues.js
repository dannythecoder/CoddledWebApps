// relaxinghues.js
// Written by Danny F. Caudill (DannyTheCoder)
//
// Oct 8, 2015
//

function createAppState() {
    var colorState = {
        curRed: 0x00,
        curBlue: 0x33,
        curGreen: 0x11,
        dirRed: 1,
        dirBlue: 1,
        dirGreen: 1,
        maxVal: 0xFF,
    };

    return colorState;
}

function updateColorState() {

colorState.curRed += (1 * colorState.dirRed);
colorState.curBlue += (2 * colorState.dirBlue);
colorState.curGreen += (3 * colorState.dirGreen);

if (colorState.curRed > colorState.maxVal) {
    colorState.dirRed = -1;
    colorState.curRed = colorState.maxVal;
}
if (colorState.curBlue > colorState.maxVal) {
    colorState.dirBlue = -1;
    colorState.curBlue = colorState.maxVal;
}
if (colorState.curGreen > colorState.maxVal) {
    colorState.dirGreen = -1;
    colorState.curGreen = colorState.maxVal;
}

if (colorState.curRed < 0) {
    colorState.dirRed = 1;
    colorState.curRed = 0;
}
if (colorState.curBlue < 0) {
    colorState.dirBlue = 1;
    colorState.curBlue = 0;
}
if (colorState.curGreen < 0) {
    colorState.dirGreen = 1;
    colorState.curGreen = 0;
}
}

// Redraw method
function redraw() {
// Calculate the main color
var currentHue = "#" + ((colorState.curBlue & 0x0000FF) |
                        ((colorState.curGreen << 8) & 0x00FF00) |
                        ((colorState.curRed << 16) & 0xFF0000)).toString(16)

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