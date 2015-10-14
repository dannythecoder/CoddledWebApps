/**
 * @fileoverview Coddled Software's Cloudy Night.
 * @author Danny F. Caudill (DannyTheCoder)
 *
 *           Copyright Danny Caudill 2015.
 * Distributed under the Boost Software License, Version 1.0.
 *    (See accompanying file LICENSE_1_0.txt or copy at
 *          http://www.boost.org/LICENSE_1_0.txt)
 */

/**
 * This method creates the application context that all other methods
 * will use.  The result should be stored in a global called 'appState'
 */
function createAppState() {
    var htmlCanvas = document.getElementById('c')
    var moonImage = new Image();
    moonImage.src = 'Moon512x512.png';

    var appState = {
        moonLocation: [15, 20],
        cloudLocations: [1, 4, 8],
        canvas: htmlCanvas,
        context: htmlCanvas.getContext('2d'),
        windowWidth: 100,
        windowHeight: 100,
        bg: '#001122',
        moon: moonImage,
        moonSize: 100,
        moonSpeed: 0.05
    };

    return appState;
}

function updateLocations() {
    // Move the moon
    appState.moonLocation[0] += appState.moonSpeed;
    if (appState.moonLocation[0] > appState.windowWidth) {
        appState.moonLocation[0] = -1*appState.moonSize;
    }

}

// Redraw method
function redraw() {

    // Draw next frame

    // Fill in background
    appState.context.strokeStyle = appState.bg;
    appState.context.fillStyle = appState.bg;
    appState.context.lineWidth = '10';
    appState.context.fillRect(0, 0, window.innerWidth, window.innerHeight);

    // Draw the moon
    appState.context.drawImage(appState.moon,
                               appState.moonLocation[0],
                               appState.moonLocation[1],
                               appState.moonSize,
                               appState.moonSize)

    // Update state
    updateLocations();
}

// Key Down handler
function doKeyDown(e) {
  if(e.keyCode==37){
    // Left Arrow
    appState.moonLocation[0] -= 0.1;
  }
  else if(e.keyCode==39){
    // Right Arrow
    appState.moonLocation[0] += 0.1;
  }
}

/**
 * Configure all the necessary handlers, setup initial state, etc.
 * Before calling this method, be sure that the following
 * functions are defined.
 *
 * redraw() - redraw the canvas content.
 * doKeyDown(e) - Handler for keydown events.
 *
 */
function startCanvas() {

// Configure listeners
initialize();

function initialize() {
    // Register resize listener
    window.addEventListener('resize', resizeCanvas, false);

    // Call the handler for the first time
    resizeCanvas();

    // Register a key listener
    window.addEventListener('keydown',doKeyDown,false);

    // Setup a 30fps timer to redraw
    timer = setInterval(redraw, 33);
}

// Provide a default redraw() method that a caller-supplied redraw() could
// call.
function redrawDefault() {
    appState.context.strokeStyle = 'blue';
    appState.context.lineWidth = '5';
    appState.context.strokeRect(0, 0, window.innerWidth, window.innerHeight);
}

// Handler for resize events
function resizeCanvas() {
    // Recalculate canvas size
    appState.canvas.width = window.innerWidth;
    appState.canvas.height = window.innerHeight;
    appState.windowHeight = window.innerHeight;
    appState.windowWidth = window.innerWidth;

    // Recalculate moon size
    appState.moonSize = Math.min(appState.windowHeight,
                                 appState.windowWidth) / 3.0;

    // Redraw
    redraw();
}

} // end startCanvas