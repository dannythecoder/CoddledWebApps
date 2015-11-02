/**
 * @fileoverview Coddled Software's Cloudy Night 2.
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
function startCloudyNight2() {

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
 *
 * The moon occupies the top 1/4 of the screen.
 *
 * The view is meant to be looking straight up at the sky, so no horizon.
 *
 */
function createAppState() {
    var htmlCanvas = document.getElementById('c')

    // Load Images
    var moonImage = new Image();
    moonImage.src = 'Moon512x512.png';
    var cloudImages = []
    cloudImages[0] = new Image();
    cloudImages[0].src = 'CloudFaded.png';

    // Specify the number of clouds
    var cloudCount = 500;

    // Generate clouds
    clouds = generateInitialClouds(cloudCount);

    // Create the appState structure
    var appState = {
        // Window states
        canvas: htmlCanvas,
        context: htmlCanvas.getContext('2d'),
        windowWidth: 100,
        windowHeight: 100,
        bg: '#000009',
        lastUpdateTime: Date.now(), // Used for deltaTime calculation

        // World state
        windSpeed: -0.005,

        // Moon state
        moonLocation: [15, 20],
        moon: moonImage,
        moonSize: 100,
        moonSpeed: 0.0017, // Pixels per millisecond

        // Cloud states
        cloudImages: cloudImages,
        clouds: clouds,
        cloudSize: 80,

    };

    return appState;
}

function generateInitialClouds(cloudCount) {
    // Always produce at least 1 cloud
    if (cloudCount < 1) {
        cloudCount = 1;
    }

    // Generate the objects
    clouds = []
    for (var i = 0; i < cloudCount; i++)
    {
        var cloud = {
            x: 1,
            y: 80,
            speedScale: 0.8,
            sizeScale: 1.0,
            puffs: 8,
            imageIndex: 0
        }
        clouds.push(cloud);
    }

    return clouds;
}

function generateRandomCloud(cloud) {
    var cloudMinY = 10;
    var cloudMaxY = appState.windowHeight;
    var cloudMinX = -1 * (appState.cloudSize*1.2);
    var cloudMaxX = appState.windowWidth + (appState.cloudSize);
    var imageCount = appState.cloudImages.length;

    // Randomize location
    cloud.y = Math.random() * (cloudMaxY - cloudMinY) + cloudMinY;
    cloud.x = Math.random() * (cloudMaxX - cloudMinX) + cloudMinX;

    // Randomize the image
    cloud.imageIndex = Math.floor(Math.random() * imageCount);

    // Randomize the size/speed modifiers that add variety
    cloud.speedScale = Math.random() * (1.0 - 0.3) + 0.3;
    cloud.sizeScale = Math.random() * (1.0 - 0.6) + 0.6;
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
    if (deltaTime > 1000) {
        // Limit time jumps to 1-second
        deltaTime = 1000;
    }
    appState.lastUpdateTime = currTime;

    // Move the moon
    appState.moonLocation[0] += (appState.moonSpeed * deltaTime);
    if (appState.moonLocation[0] > appState.windowWidth) {
        appState.moonLocation[0] = -1*appState.moonSize;
    }

    // Move the clouds
    appState.clouds.forEach(function (item, index, array) {
        item.x += (item.speedScale * appState.windSpeed * deltaTime);
        if (item.x > (appState.windowWidth + (appState.cloudSize))) {
            generateRandomCloud(item);
            item.x = -1 * (appState.cloudSize+1.2);
        }
        if (item.x < -1 * (appState.cloudSize*1.2)) {
            generateRandomCloud(item);
            item.x = appState.windowWidth + (appState.cloudSize);
        }
    });
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
  else if(e.keyCode==38 || e.keyCode==81){
    // Up Arrow or 'q'
    // More clouds!
    var curLen = appState.clouds.length;
    appState.clouds = generateInitialClouds(curLen + 50);
    resizeCanvas();
  }
  else if(e.keyCode==40 || e.keyCode==65){
    // Down Arrow or 'a'
    // Fewer clouds!
    var curLen = appState.clouds.length;
    appState.clouds = generateInitialClouds(curLen - 50);
    resizeCanvas();
  }
  else if(e.keyCode==66){
    // 'b'
    appState.moonLocation[0] += 20;
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
                               appState.moonSize);

    // Draw the clouds
    var cloudScale = appState.windowHeight;
    var count = appState.clouds.length;
    for (var i = 0; i < count; i++) {
        appState.context.drawImage(
            appState.cloudImages[appState.clouds[i].imageIndex],
            appState.clouds[i].x,
            appState.clouds[i].y,
            appState.cloudSize,
            appState.cloudSize);

            //((1 - appState.clouds[i].y / cloudScale) + 0.5) * appState.cloudSize);
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

    // some platforms have initial scroll issues
    window.scrollTo(0,1);

    // Register resize listener
    window.addEventListener('resize', resizeCanvas, false);

    // Call the handler for the first time
    resizeCanvas();

    // Register a key listener
    window.addEventListener('keydown',doKeyDown,false);

    // Setup a 30fps timer to redraw
    // 33 = 30 fps
    // 66 = 15 fps
    timer = setInterval(redraw, 66);

    // Configure compositing
    //appState.context.globalCompositeOperation = 'saturation';
    appState.context.globalCompositeOperation = 'luminosity';
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

    // Recalculate moon Y coordinate
    appState.moonLocation[1] = (appState.windowHeight / 2.0) - (appState.moonSize / 2.0);

    // Recalculate cloud size
    appState.cloudSize = Math.min(appState.windowHeight,
                                  appState.windowWidth) / 10.0;

    // Recalculate cloud positions.
    appState.clouds.forEach(function (item, index, array) {
        generateRandomCloud(item);
    });

    // Redraw
    redraw();
}

} // end startCloudyNight
