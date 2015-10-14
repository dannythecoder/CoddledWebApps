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
 * This function creates the namespace for all components of
 * cloudy night.
 */
function startCloudyNight() {

// Create App State
appState = createAppState();

// Configure listeners
initialize();



///////////////////////////////////////////////
//
// State-control methods
//
///////////////////////////////////////////////

/**
 * Create the application context that all other methods
 * will use.  The result should be stored in a global called 'appState'
 */
function createAppState() {
    var htmlCanvas = document.getElementById('c')
    var moonImage = new Image();
    moonImage.src = 'Moon512x512.png';
    var cloudImage = new Image();
    cloudImage.src = 'Cloud128x128.png';

    var appState = {
        // Window states
        canvas: htmlCanvas,
        context: htmlCanvas.getContext('2d'),
        windowWidth: 100,
        windowHeight: 100,
        bg: '#001122',
        lastUpdateTime: Date.now(), // Used for deltaTime calculation

        // Moon state
        moonLocation: [15, 20],
        moon: moonImage,
        moonSize: 100,
        moonSpeed: 0.0017, // Pixels per millisecond

        // Cloud states
        cloudImage: cloudImage,
        cloudLocations: [1, 50, 120]
    };

    return appState;
}


///////////////////////////////////////////////
//
// State-control methods
//
///////////////////////////////////////////////

function updateLocations() {
    // Calculate deltaTime
    currTime = Date.now();
    deltaTime = currTime - appState.lastUpdateTime;
    appState.lastUpdateTime = currTime;

    // Move the moon
    appState.moonLocation[0] += (appState.moonSpeed * deltaTime);
    if (appState.moonLocation[0] > appState.windowWidth) {
        appState.moonLocation[0] = -1*appState.moonSize;
    }

    // Move the clouds

}

// Key Down handler
function doKeyDown(e) {
  if(e.keyCode==37){
    // Left Arrow
    appState.moonLocation[0] -= 5;
  }
  else if(e.keyCode==39){
    // Right Arrow
    appState.moonLocation[0] += 5;
  }
}

///////////////////////////////////////////////
//
// Display methods
//
///////////////////////////////////////////////


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

    // Draw the clouds
    count = appState.cloudLocations.length;
    for (var i = 0; i < count; i++) {
        appState.context.drawImage(appState.cloudImage,
                                   appState.cloudLocations[i],
                                   60,
                                   appState.moonSize/3,
                                   appState.moonSize/3)
    }

    // Update state
    updateLocations();
}

///////////////////////////////////////////////
//
// Setup/Teardown methods
//
///////////////////////////////////////////////

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

} // end startCloudyNight