/**
 * @fileoverview Common methods for Coddled Software's web apps.
 * @author Danny F. Caudill (DannyTheCoder)
 *
 *           Copyright Danny Caudill 2015.
 * Distributed under the Boost Software License, Version 1.0.
 *    (See accompanying file LICENSE_1_0.txt or copy at
 *          http://www.boost.org/LICENSE_1_0.txt)
 */


/**
 * Call this method to setup all the standard things that a full-screen
 * web app would need.  Before calling this method, be sure that the following
 * functions are defined.
 *
 * redraw() - redraw the canvas content.
 * doKeyDown(e) - Handler for keydown events.
 *
 */
function startCanvas() {

// Get canvas and context
var htmlCanvas = document.getElementById('c'),
    context = htmlCanvas.getContext('2d');

// Configure listeners
initialize();

function initialize() {

    // some platforms have initial scroll issues
    window.scrollTo(0,1);

    // Register resize listener
    window.addEventListener('resize', resizeCanvas, false);

    // Call the handler for the first time
    resizeCanvas();

    // Register a key listener
    window.addEventListener("keydown",doKeyDown,false);

    // Setup a 30fps timer to redraw
    timer = setInterval(redraw, 33);
}

// Provide a default redraw() method that a caller-supplied redraw() could
// call.
function redrawDefault() {
    context.strokeStyle = 'blue';
    context.lineWidth = '5';
    context.strokeRect(0, 0, window.innerWidth, window.innerHeight);
}

// Handler for resize events
function resizeCanvas() {
    htmlCanvas.width = window.innerWidth;
    htmlCanvas.height = window.innerHeight;
    redraw();
}

} // end startCanvas



