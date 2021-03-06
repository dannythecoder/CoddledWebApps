/**
 * @fileoverview Coddled Software's Car Labyrinth.
 * @author Danny F. Caudill (DannyTheCoder)
 *
 *           Copyright Danny Caudill 2015.
 * Distributed under the Boost Software License, Version 1.0.
 *    (See accompanying file LICENSE_1_0.txt or copy at
 *          http://www.boost.org/LICENSE_1_0.txt)
 */

/**
 * Create the namespace for all components of Car Labyrinth.
 */
function startCarLabyrinth() {

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
    var carImage = new Image();
    carImage.src = 'Car1.png';
    var dustImage = new Image();
    dustImage.src = 'Dust1.png';

    // Generate walls
    walls = generateWalls();

    // Create the appState structure
    var appState = {
        // Window states
        canvas: htmlCanvas,
        context: htmlCanvas.getContext('2d'),
        windowWidth: 100,
        windowHeight: 100,
        bg: '#000033',
        lastUpdateTime: Date.now(), // Used for deltaTime calculation
        helpOverlayColor: '#CCEEFF',
        helpDisplayed: false,
        soundEnabled: false,
        bgEnabled: true,
        debugText: "",

        // Car states
        carSpeed: 0.001, // Pixels per millisecond
        carMaxSpeed: 0.003,
        carMinSpeed: 0.0001,
        carAcceleration: 0.000006,
        carDirection: 0, // Radians
        carImage: carImage,
        carSize: 2.2,
        carX: 0,
        carY: 10,

        // Control variables
        turnScale: 0.004, // Radians per millisecond
        turningRight: false,
        turningLeft: false,

        // Wall state
        walls: walls,
    };

    return appState;
}

/**
 * Create the initial walls for the world.
 */
function generateWalls() {

    var wallCount = 10;

    // Generate the objects
    var walls = []
    for (var i = 0; i < wallCount; i++)
    {
        var wall = {
            x: 1,
            y: 80,
            width: 10,
            height: 2,
            imageIndex: 0
        }
        walls.push(wall);
    }

    return walls;
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

    // Handle car rotation if turning (this handles the case where someone
    // is touching both sides, by canceling out the turns).
    // Turning also slows the car a bit.
    if (appState.turningLeft) {
        appState.carDirection -= (appState.turnScale * deltaTime);
        appState.carSpeed -= (appState.carAcceleration * 100);
    }
    if (appState.turningRight) {
        appState.carDirection += (appState.turnScale * deltaTime);
        appState.carSpeed -= (appState.carAcceleration * 100);
    }

    // Adjust car speed
    appState.carSpeed += (appState.carAcceleration * deltaTime);
    if (appState.carSpeed > appState.carMaxSpeed) {
        appState.carSpeed = appState.carMaxSpeed;
    }
    if (appState.carSpeed < appState.carMinSpeed) {
        appState.carSpeed = appState.carMinSpeed;
    }

    // Move the car
    appState.carX += (appState.carSpeed * appState.carSize * deltaTime * Math.cos(appState.carDirection));
    appState.carY += (appState.carSpeed * appState.carSize * deltaTime * Math.sin(appState.carDirection));

    // Wrap around the right and left side of the screen
    if (appState.carX > (appState.windowWidth + appState.carSize)) {
        appState.carX = -1 * appState.carSize * 0.5;
    }
    if (appState.carX < -1 * (appState.carSize)) {
        appState.carX = appState.windowWidth + appState.carSize * 0.5;
    }

    // Wrap around the top and bottom of the screen
    if (appState.carY > (appState.windowHeight + (appState.carSize))) {
        appState.carY = -1 * appState.carSize * 0.5;
    }
    if (appState.carY < -1 * (appState.carSize)) {
        appState.carY = appState.windowHeight;
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
                         topMargin + 104,
                         topMargin + 198];

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
    appState.context.fillText("a - turn left", leftMargin, sectionStarts[0] + 28);
    appState.context.fillText("d - turn right", leftMargin, sectionStarts[0] + 42);
    appState.context.fillText("e - toggle sound", leftMargin, sectionStarts[0] + 56);

    appState.context.fillText("Touch/Mouse", leftMargin, sectionStarts[1]);
    appState.context.fillText("top left - help", leftMargin, sectionStarts[1] + 14);
    appState.context.fillText("touch left - turn left", leftMargin, sectionStarts[1] + 28);
    appState.context.fillText("touch right - turn right", leftMargin, sectionStarts[1] + 42);
    appState.context.fillText("touch top center - toggle sound", leftMargin, sectionStarts[1] + 56);
    appState.context.fillText("touch bottom center - toggle background", leftMargin, sectionStarts[1] + 70);

    appState.context.fillText("Tips", leftMargin, sectionStarts[2]);
    appState.context.fillText("Turn both directions simultaneously to brake.", leftMargin, sectionStarts[2] + 14);
    appState.context.fillText("Debug: " + appState.debugText, leftMargin, sectionStarts[2] + 28)
}

/**
 * Handle Key down events.
 * @param e The key event.
 */
function doKeyDown(e) {
    if(e.keyCode==37 || e.keyCode==65){
        // Left Arrow or 'a' - turn left
        processTouch(appState.windowWidth / 6, appState.windowHeight / 2);
    }
    else if(e.keyCode==39 || e.keyCode==68){
        // Right Arrow or 'd' - turn right
        processTouch(appState.windowWidth * 5 / 6, appState.windowHeight / 2);
    }
    else if(e.keyCode==69){
        // 'e' - toggle sound
        appState.soundEnabled = !appState.soundEnabled;
    }
    else if(e.keyCode==72){
        // 'h' - help
        appState.helpDisplayed = !appState.helpDisplayed;
    }
}

/**
 * Handle Key up events.
 * @param e The key event.
 */
function doKeyUp(e) {
    // Note: e.keyCode is not populated for keyup in Safari.
    clearAllTouches();
}

/**
 * Process a single touch/mouse event.
 */
function processTouch(touchX, touchY) {
    // is this touch in a special region?

    // touches use the window pixels, not scaled for hi DPI displays
    var width = window.innerWidth;
    var height = window.innerHeight;

    // top left - help
    if ((touchX < width / 8) && (touchY < height / 8)) {
        appState.helpDisplayed = !appState.helpDisplayed;
    } else if (touchX < width / 3) {
        // Left Touch, turn left
        appState.turningLeft = true;
    } else if (touchX > width * 2 / 3) {
        // Right Touch, turn right
        appState.turningRight = true;
    } else if ((touchX > width / 3) &&
               (touchX < width * 2 / 3) &&
               (touchY < height / 2) ) {
        //Top Center touch, toggle sound
        appState.soundEnabled = !appState.soundEnabled;
    } else if ((touchX > width / 3) &&
               (touchX < width * 2 / 3) &&
               (touchY > height / 2) ) {
        //Bottom Center touch, toggle background
        appState.bgEnabled = !appState.bgEnabled;
    }
}

/**
 * Clear all touch events, in preparation for processing more.
 * This mostly just clears the state to reflect a condition where there are no active touches.
 */
function clearAllTouches() {
    appState.turningLeft = false;
    appState.turningRight = false;
}

/**
 * Handle Touch Start/End/Cancel/Move events.
 * @param e The touch event.
 */
function doTouchStart(e) {
    e.preventDefault();

    clearAllTouches();

    touchCount = e.targetTouches.length;
    for (var i = 0; i < touchCount; i++)
    {
        touchX = e.targetTouches[i].pageX;
        touchY = e.targetTouches[i].pageY;

        processTouch(touchX, touchY);
    }
}

/**
 * Handle Mouse Down events.
 * @param e The mouse event.
 */
function doMouseDown(e) {
    clearAllTouches();

    mouseX = e.clientX;
    mouseY = e.clientY;

    processTouch(mouseX, mouseY);
}

/**
 * Handle Mouse Up events.
 * @param e The mouse event.
 */
function doMouseUp(e) {
    clearAllTouches();
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
    if (appState.bgEnabled) {
        appState.context.strokeStyle = appState.bg;
        appState.context.fillStyle = appState.bg;
        appState.context.lineWidth = '10';
        appState.context.fillRect(0, 0, appState.windowWidth, appState.windowHeight);
    }

    // Rotate for the car
    // Translate for the car display
    appState.context.translate(appState.carX, appState.carY);
    appState.context.rotate(appState.carDirection + 1.5708);
    // Draw the car
    appState.context.drawImage(
        appState.carImage,
        -1 * appState.carSize / 2,
        -1 * appState.carSize / 2,
        appState.carSize,
        appState.carSize);
    // Reset rotation
    appState.context.setTransform(1, 0, 0, 1, 0, 0);

    /*
    // Draw the walls
    var count = appState.walls.length;
    for (var i = 0; i < count; i++) {
        appState.context.drawRect(
            appState.walls[i].x,
            appState.walls[i].y,
            appState.walls[i].width,
            appState.walls[i].height);
    }
    */

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
    window.addEventListener('keyup', doKeyUp, false);

    // Register a touch listener
    document.getElementById('c').addEventListener('touchstart', doTouchStart, false);
    document.getElementById('c').addEventListener('touchend', doTouchStart, false);
    document.getElementById('c').addEventListener('touchcancel', doTouchStart, false);
    document.getElementById('c').addEventListener('touchmove', doTouchStart, false);

    // Register a mouse listener
    document.getElementById('c').addEventListener('mousedown', doMouseDown, false);
    document.getElementById('c').addEventListener('mouseup', doMouseUp, false);

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

    // Recalculate car size
    appState.carSize = Math.min(appState.windowHeight,
                                  appState.windowWidth) / 15.0;

    // Recalculate wall positions.
    generateWalls();

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
