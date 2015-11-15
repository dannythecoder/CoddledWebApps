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

        // Car states
        carSpeed: 0.02, // Pixels per millisecond
        carDirection: 0, // Radiens
        carImage: carImage,
        carSize: 2.2,
        carX: 0,
        carY: 10,
        turnScale: 0.1, // Radiens per button press/touch/mousedown

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

    // Move the car
    appState.carX += (appState.carSpeed * item.carSize* deltaTime * Math.cos(item.carDirection));
    appState.carY += (appState.carSpeed * item.carSize * deltaTime * Math.sin(item.carDirection));

    // Wrap around the right and left side of the screen
    if (appState.carX > (appState.windowWidth + (appState.carSize))) {
        appState.carX = -1 * appState.carSize;
    }
    if (appState.carX < -1 * (appState.carSize)) {
        appState.carX = appState.carSize;
    }

    // Wrap around the top and bottom of the screen
    if (appState.carY > (appState.windowHeight + (appState.carSize))) {
        appState.carY = -1 * appState.carSize;
    }
    if (appState.carY < -1 * (appState.carSize)) {
        appState.carY = appState.carSize;
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
    appState.context.fillText("a - turn left", leftMargin, sectionStarts[0] + 28);
    appState.context.fillText("d - turn right", leftMargin, sectionStarts[0] + 42);
    appState.context.fillText("e - toggle sound", leftMargin, sectionStarts[0] + 56);

    appState.context.fillText("Touch/Mouse", leftMargin, sectionStarts[1]);
    appState.context.fillText("top left - help", leftMargin, sectionStarts[1] + 14);
    appState.context.fillText("touch left - turn left", leftMargin, sectionStarts[1] + 28);
    appState.context.fillText("touch right - turn right", leftMargin, sectionStarts[1] + 42);
    appState.context.fillText("touch top center - toggle sound", leftMargin, sectionStarts[1] + 56);
}

/**
 * Handle Key down events.
 * @param e The key event.
 */
function doKeyDown(e) {
    if(e.keyCode==37 || e.keyCode==40){
        // Left Arrow or 'a' - turn left
        appState.carDirection -= appState.turnScale;
    }
    else if(e.keyCode==39 || e.keyCode==43){
        // Right Arrow or 'd' - turn right
        appState.carDirection += appState.turnScale;
    }
    else if(e.keyCode==44){
        // 'e' - toggle sound
        appState.soundEnabled = !appState.soundEnabled;
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

    touchCount = e.targetTouches.length;
    for (var i = 0; i < touchCount; i++)
    {
        touchX = e.targetTouches[i].pageX;
        touchY = e.targetTouches[i].pageY;

        // is this touch in a special region?
        // top left - help
        if ((touchX < appState.windowWidth / 8) && (touchY < appState.windowHeight / 8)) {
            appState.helpDisplayed = !appState.helpDisplayed;
        } else if (touchX < appState.windowWidth / 3) {
            // Left Touch, turn left
            appState.carDirection -= appState.turnScale;
        } else if (touchX > appState.windowWidth * 2 / 3) {
            // Right Touch, turn right
            appState.carDirection += appState.turnScale;
        } else if ((touchX > appState.windowWidth / 3) &&
                   (touchX < appState.windowWidth * 2 / 3) &&
                   (touchY < appState.windowHeight / 2) ) {
            //Top Center touch, toggle sound
            appState.soundEnabled = !appState.soundEnabled;
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

    // is this mouse down in a special region?
    // top left - help
    if ((mouseX < appState.windowWidth / 8) && (mouseY < appState.windowHeight / 8)) {
        appState.helpDisplayed = !appState.helpDisplayed;
    } else if (mouseX < appState.windowWidth / 3) {
        // Left Touch, turn left
        appState.carDirection -= appState.turnScale;
    } else if (mouseX > appState.windowWidth * 2 / 3) {
        // Right Touch, turn right
        appState.carDirection += appState.turnScale;
    } else if ((mouseX > appState.windowWidth / 3) &&
               (mouseX < appState.windowWidth * 2 / 3) &&
               (mouseY < appState.windowHeight / 2) ) {
        //Top Center touch, toggle sound
        appState.soundEnabled = !appState.soundEnabled;
    }
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
    appState.context.fillRect(0, 0, window.innerWidth, window.innerHeight);

    // Draw the car
    appState.context.drawImage(
        appState.carImage,
        appState.carX,
        appState.carY,
        appState.carSize,
        appState.carSize);

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
    // Recalculate canvas size
    appState.canvas.width = window.innerWidth;
    appState.canvas.height = window.innerHeight;
    appState.windowHeight = window.innerHeight;
    appState.windowWidth = window.innerWidth;

    // Recalculate car size
    appState.carSize = Math.min(appState.windowHeight,
                                  appState.windowWidth) / 20.0;

    // Recalculate wall positions.
    generateWalls();

    // Redraw
    redraw();
}

} // end startShootingStars
