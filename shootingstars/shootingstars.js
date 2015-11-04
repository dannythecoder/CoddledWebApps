/**
 * @fileoverview Coddled Software's Shooting Stars.
 * @author Danny F. Caudill (DannyTheCoder)
 *
 *           Copyright Danny Caudill 2015.
 * Distributed under the Boost Software License, Version 1.0.
 *    (See accompanying file LICENSE_1_0.txt or copy at
 *          http://www.boost.org/LICENSE_1_0.txt)
 */

/**
 * This function creates the namespace for all components of
 * Shooting Stars.
 */
function startShootingStars() {

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
 */
function createAppState() {
    var htmlCanvas = document.getElementById('c')

    // Load Images
    var starImages = []
    starImages[0] = new Image();
    starImages[0].src = 'Star1.png';
//    starImages[1] = new Image();
//    starImages[1].src = 'Star2.png';
//    starImages[1] = new Image();
//    starImages[1].src = 'ShootingStar1.png';

    // Specify the number of stars
    var starCount = 350;

    // Generate stars
    stars = generateInitialStars(starCount);

    // Create the appState structure
    var appState = {
        // Window states
        canvas: htmlCanvas,
        context: htmlCanvas.getContext('2d'),
        windowWidth: 100,
        windowHeight: 100,
        bg: '#000000',
        lastUpdateTime: Date.now(), // Used for deltaTime calculation

        // World state
        starSpeed: -0.002, // Pixels per millisecond

        // Star states
        starImages: starImages,
        stars: stars,
        starSize: 2.2,

    };

    return appState;
}

function generateInitialStars(starCount) {
    // Always produce at least 1 star
    if (starCount < 1) {
        starCount = 1;
    }

    // Generate the objects
    stars = []
    for (var i = 0; i < starCount; i++)
    {
        var star = {
            x: 1,
            y: 80,
            sizeScale: 1.0,
            puffs: 8,
            imageIndex: 0
        }
        stars.push(star);
    }

    return stars;
}

function generateRandomStar(star) {
    var starMinY = -1 * (appState.starSize*1.2);
    var starMaxY = appState.windowHeight + appState.starSize;
    var starMinX = -1 * (appState.starSize*1.2);
    var starMaxX = appState.windowWidth + (appState.starSize);
    var imageCount = appState.starImages.length;

    // Randomize location
    star.y = Math.random() * (starMaxY - starMinY) + starMinY;
    star.x = Math.random() * (starMaxX - starMinX) + starMinX;

    // Randomize the image
    star.imageIndex = Math.floor(Math.random() * imageCount);

    // Randomize the size modifiers that add variety
    star.sizeScale = Math.random() * (1.0 - 0.2) + 0.2;
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

    // Move the stars
    appState.stars.forEach(function (item, index, array) {
        item.x += (appState.starSpeed * deltaTime);
        if (item.x > (appState.windowWidth + (appState.starSize))) {
            generateRandomStar(item);
            item.x = -1 * (appState.starSize+1.2);
        }
        if (item.x < -1 * (appState.starSize*1.2)) {
            generateRandomStar(item);
            item.x = appState.windowWidth + (appState.starSize);
        }
    });
}

// Key Down handler
function doKeyDown(e) {
    if(e.keyCode==37){
        // Left Arrow
        // TODO Start a shooting star on the left.

    }
    else if(e.keyCode==39){
        // Right Arrow
        // TODO Start a shooting star on the right.
    }
    else if(e.keyCode==38 || e.keyCode==81){
        // Up Arrow or 'q'
        // More stars!
        var curLen = appState.stars.length;
        appState.stars = generateInitialStars(curLen + 50);
        resizeCanvas();
    }
    else if(e.keyCode==40 || e.keyCode==65){
        // Down Arrow or 'a'
        // Fewer stars!
        var curLen = appState.stars.length;
        appState.stars = generateInitialStars(curLen - 50);
        resizeCanvas();
    }
    else if(e.keyCode==66){
        // 'b'
        // TODO Start a random shooting star.
    }
}

// Touch handler
function doTouchStart(e) {
    e.preventDefault();

    touchCount = e.targetTouches.length;
    for (var i = 0; i < touchCount; i++)
    {
        touchX = e.targetTouches[i].pageX;
        touchY = e.targetTouches[i].pageY;

        // TODO Queue a shooting star, beginning at this location.
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

    // Draw the stars
    var starScale = (appState.windowHeight);
    var count = appState.stars.length;
    for (var i = 0; i < count; i++) {
        appState.context.drawImage(
            appState.starImages[appState.stars[i].imageIndex],
            appState.stars[i].x,
            appState.stars[i].y,
            appState.starSize * appState.stars[i].sizeScale,
            appState.starSize * appState.stars[i].sizeScale);
            //((1 - appState.stars[i].y / starScale) + 0.5) * appState.starSize);
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
    window.addEventListener('keydown', doKeyDown, false);

    // Register a touch listener
    document.getElementById('c').addEventListener('touchstart', doTouchStart, false);

    // Setup a 30fps timer to redraw
    // 33 = 30 fps
    // 66 = 15 fps
    timer = setInterval(redraw, 66);
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

    // Recalculate star size
    appState.starSize = Math.min(appState.windowHeight,
                                  appState.windowWidth) / 50.0;

    // Recalculate star positions.
    appState.stars.forEach(function (item, index, array) {
        generateRandomStar(item);
    });

    // Redraw
    redraw();
}

} // end startShootingStars
