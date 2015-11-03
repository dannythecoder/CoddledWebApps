/**
 * @fileoverview Coddled Software's Note Taker.
 * @author Danny F. Caudill (DannyTheCoder)
 *
 *           Copyright Danny Caudill 2015.
 * Distributed under the Boost Software License, Version 1.0.
 *    (See accompanying file LICENSE_1_0.txt or copy at
 *          http://www.boost.org/LICENSE_1_0.txt)
 */

/**
 * Load the notes from localStorage into the text field.
 */
function startNoteTaker() {
    if (typeof(Storage) !== "undefined") {

        // Retrieve Content, if available
        content = localStorage.getItem("notes");
        if (content !== null) {
            document.getElementById("notes").value = content;
        } else {
            document.getElementById("notes").value = "";
        }

        // Retrieve last save time, if available.
        saveText = localStorage.getItem("saveTime");
        if (content !== null) {
            document.getElementById("save").value = saveText;
        } else {
            document.getElementById("save").value = "Save";
        }

    } else {
        document.getElementById("notes").value = "This ancient browser does not support local storage...";
    }

    // Register resize listener
    window.addEventListener('resize', resizeTextArea, false);

    // Call resize for the first time.
    resizeTextArea();
}


/**
 * Save the notes to localStorage from the text field.
 */
function saveNotes() {

    if (typeof(Storage) !== "undefined") {
        // Update the saved notes.
        content = document.getElementById("notes").value;
        localStorage.setItem("notes", content);

        // Update the save time.
        var currTime = new Date()
        var saveText = ("Save (last: " +
                        currTime.getFullYear() + "/" +
                        pad(currTime.getMonth(), 2) + "/" +
                        pad(currTime.getDay(), 2) + " " +
                        pad(currTime.getHours(), 2) + ":" +
                        pad(currTime.getMinutes(), 2) + ":" +
                        pad(currTime.getSeconds(), 2) + ")");
        document.getElementById("save").value = saveText;
        localStorage.setItem("saveTime", saveText);
    } else {
        document.getElementById("notes").value = "This browser does not support local storage...all is lost.";
    }
}

/**
 * Provide zero-padding for a number.
 */
function pad(num, size) {
    var s = "000000000" + num;
    return s.substr(s.length-size);
}

/**
 * Resize the text area to match the full height of the window.
 */
function resizeTextArea() {
    var textarea = document.getElementById("notes");
    textarea.style.height = "" + Math.floor(window.innerHeight * 0.92) + "px";
}
