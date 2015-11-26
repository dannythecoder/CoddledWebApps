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
 * Create the namespace for all components of Shooting Stars.
 */
function startShootingStars() {

// Create App State within this namespace
appState = createAppState();

// Configure listeners and start the world
initialize();


//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//
// Object Creation
//
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

/**
 * Create the application context that all other methods
 * will use.  The result should be stored in a global called 'appState'
 */
function createAppState() {
    var htmlCanvas = document.getElementById('c')

    // Load Images
    var starImages = []
    starImages[0] = new Image();
    starImages[0].src = 'Star1.png';

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
        helpOverlayColor: '#CCEEFF',
        helpDisplayed: false,

        // World state
        starSpeed: -0.002, // Pixels per millisecond

        // Star states
        starImages: starImages,
        stars: stars,
        starSize: 2.2,

        // Shooting star states
        shootingStars: [],
        shootingStarSpeed: 0.05 // Pixels per millisecond

    };

    return appState;
}

/**
 * Create the initial stars for the cosmos.
 * @param {number} starCount The number of stars to produce.
 */
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

/**
 * Populate a single star's data structure with random values.
 * @param star A star object to be randomized.
 */
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

/**
 * Add a shooting star to the list of shooting stars.
 * @param {number} startX The starting X coordinate (in canvas coordinates).
 * @param {number} startY The starting Y coordinate (in canvas coordinates).
 */
function addShootingStar(startX, startY) {

    // startX and startY are in screen pixels, not backing pixels
    startX = startX * 1.0 * appState.windowWidth / window.innerWidth;
    startY = startY * 1.0 * appState.windowHeight / window.innerHeight;

    // Generate the object
    var shootingStar = {
        x: startX,
        y: startY,
        sizeScale: Math.random() * (1.0 - 0.3) + 0.3,
        direction: Math.random() * 2 * Math.PI, // Radians
        imageIndex: 0,
        progress: 0 // Ranges from 0 to 100
    }

    appState.shootingStars.push(shootingStar);
}


//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//
// World Tracking
//
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

/**
 * Update the locations of all the world objects.
 * Note that the calculation is based on deltaTime, not frames, so even if
 * the frame rate is inconsistent, the overall motion will be corrected
 * based on the physics model.
 */
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
        // Move this star
        //item.x += (appState.starSpeed * deltaTime);
        item.x += (appState.starSpeed * item.sizeScale * deltaTime);

        // Wrap around
        if (item.x > (appState.windowWidth + (appState.starSize))) {
            generateRandomStar(item);
            item.x = -1 * (appState.starSize * 1.2);
        }
        if (item.x < -1 * (appState.starSize * 1.2)) {
            generateRandomStar(item);
            item.x = appState.windowWidth + (appState.starSize);
        }
    });

    // Move the shooting stars
    appState.shootingStars.forEach(function (item, index, array) {
        // Move this shooting star
        item.x += (appState.shootingStarSpeed * item.sizeScale * deltaTime * Math.cos(item.direction));
        item.y += (appState.shootingStarSpeed * item.sizeScale * deltaTime * Math.sin(item.direction));
        item.progress += 1

        // No Wrap around for shooting stars, just disappear when finished
        if (item.x > (appState.windowWidth + (appState.starSize))) {
            item.progress = 100;
        }
        if (item.x < -1 * (appState.starSize * 1.2)) {
            item.progress = 100;
        }
    });

    // Remove stars with progress >= 100
    for (var i = 0; i < appState.shootingStars.length; i++) {
        if (appState.shootingStars[i].progress >= 100) {
            appState.shootingStars.splice(i, 1);
        }
    }

}


//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//
// User Input
//
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

/**
 * Display the help/controls overlay.
 */
function displayHelp() {

    var leftMargin = 5;
    var topMargin = 28;
    var sectionStarts = [topMargin + 24,
                         topMargin + 90];

    // TODO calculate the optimal font size based on window dimensions

    // Configure the font
    appState.context.strokeStyle = appState.helpOverlayColor;
    appState.context.fillStyle = appState.helpOverlayColor;
    appState.context.lineWidth = '2';
    appState.context.font = "14px serif";

    // Draw the text
    appState.context.fillText("Controls", leftMargin, topMargin);

    appState.context.fillText("Keyboard", leftMargin, sectionStarts[0]);
    appState.context.fillText("h - help", leftMargin, sectionStarts[0] + 14);
    appState.context.fillText("b - random shooting star", leftMargin, sectionStarts[0] + 28);
    appState.context.fillText("q/a - more/fewer stars", leftMargin, sectionStarts[0] + 42);

    appState.context.fillText("Touch/Mouse", leftMargin, sectionStarts[1]);
    appState.context.fillText("top left - help", leftMargin, sectionStarts[1] + 14);
    appState.context.fillText("touch - new shooting star", leftMargin, sectionStarts[1] + 28);
}

/**
 * Handle Key down events.
 * @param e The key event.
 */
function doKeyDown(e) {
    if(e.keyCode==37){
        // Left Arrow - shooting star from the left
        addShootingStar(appState.windowWidth/4, appState.windowHeight/2);
    }
    else if(e.keyCode==39){
        // Right Arrow - shooting star from the right
        addShootingStar(appState.windowWidth * 3/4, appState.windowHeight/2);
    }
    else if(e.keyCode==38 || e.keyCode==81){
        // Up Arrow or 'q' - more stars
        var curLen = appState.stars.length;
        appState.stars = generateInitialStars(curLen + 50);
        resizeCanvas();
    }
    else if(e.keyCode==40 || e.keyCode==65){
        // Down Arrow or 'a' - fewer stars
        var curLen = appState.stars.length;
        appState.stars = generateInitialStars(curLen - 50);
        resizeCanvas();
    }
    else if(e.keyCode==66){
        // 'b' - random shooting star
        startY = Math.random() * appState.windowHeight;
        startX = Math.random() * appState.windowWidth;
        addShootingStar(startX, startY);
    }
    else if(e.keyCode==72){
        // 'h' - help
        appState.helpDisplayed = !appState.helpDisplayed;
    }
}

/**
 * Handle Touch Start events.
 * @param e The touch event.
 */
function doTouchStart(e) {
    e.preventDefault();

    var width = window.innerWidth;
    var height = window.innerHeight;

    touchCount = e.targetTouches.length;
    for (var i = 0; i < touchCount; i++)
    {
        touchX = e.targetTouches[i].pageX;
        touchY = e.targetTouches[i].pageY;

        // is this touch in a special region?
        // top left - help
        if ((touchX < width / 8) && (touchY < height / 8)) {
            appState.helpDisplayed = !appState.helpDisplayed;
        } else {
            // Queue a shooting star, beginning at this location.
            addShootingStar(touchX, touchY);
        }
    }
}

/**
 * Handle Mouse Down events.
 * @param e The mouse event.
 */
function doMouseDown(e) {

    mouseX = e.clientX;
    mouseY = e.clientY;

    // Queue a shooting star, beginning at this location.
    addShootingStar(mouseX, mouseY);
}

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//
// Display
//
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

/**
 * Redraw the scene.
 */
function redraw() {

    // Draw next frame

    // Fill in background
    appState.context.strokeStyle = appState.bg;
    appState.context.fillStyle = appState.bg;
    appState.context.lineWidth = '10';
    appState.context.fillRect(0, 0, appState.windowWidth, appState.windowHeight);

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
    }

    // Draw the shooting stars
    var count = appState.shootingStars.length;
    for (var i = 0; i < count; i++) {
        appState.context.drawImage(
            appState.starImages[appState.shootingStars[i].imageIndex],
            appState.shootingStars[i].x,
            appState.shootingStars[i].y,
            appState.starSize * appState.shootingStars[i].sizeScale,
            appState.starSize * appState.shootingStars[i].sizeScale);
    }

    // Draw the help overlay
    if (appState.helpDisplayed) {
        displayHelp();
    }

    // Update state
    updateLocations();
}

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//
// Setup/Teardown
//
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

/**
 * Perform the initial setup of the world and register handlers.
 */
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

    // Register a mouse listener
    document.getElementById('c').addEventListener('mousedown', doMouseDown, false);

    // Setup a 30fps timer to redraw
    // 33 = 30 fps
    // 66 = 15 fps
    timer = setInterval(redraw, 66);
}

/**
 * Handle resize events to adjust the canvas dimensions.
 */
function resizeCanvas() {

    // Determine if the dimensions are a lie
    var backScale = backingScale(appState.context);

    // Recalculate canvas size
    appState.windowHeight = window.innerHeight * backScale;
    appState.windowWidth = window.innerWidth * backScale;

    appState.canvas.width = appState.windowWidth;
    appState.canvas.height = appState.windowHeight;

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

function backingScale(context) {
    if ('devicePixelRatio' in window) {
        if (window.devicePixelRatio > 1) {
            return window.devicePixelRatio;
        }
    }
    return 1;
}

} // end startShootingStars
