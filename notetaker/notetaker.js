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
        content = localStorage.getItem("notes");
        if (content !== null) {
            document.getElementById("notes").value = content;
        } else {
            document.getElementById("notes").value = "";
        }

    } else {
        document.getElementById("notes").value = "This ancient browser does not support local storage...";
    }
}


/**
 * Save the notes to localStorage from the text field.
 */
function saveNotes() {

    if (typeof(Storage) !== "undefined") {
        content =  document.getElementById("notes").value;
        localStorage.setItem("notes", content);
    } else {
        document.getElementById("notes").value = "This browser does not support local storage...all is lost.";
    }
}
