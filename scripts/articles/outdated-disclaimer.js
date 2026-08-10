'use strict';

// DOM references
let dateHeading = document.querySelector('body > main:nth-child(2) > h3:nth-child(2)');
let outdatedDisclaimer = document.getElementById('outdated-disclaimer');

// Time constant
const TWO_YEARS_IN_MILLIS = 1000 * 60 * 60 * 24 * 365 * 2;

// Display or hide the disclaimer on load
window.addEventListener('load', () => {
    let twoYear;
    let postDate = Date.parse(dateHeading.textContent);
    let currentDate = Date.now();
    if (currentDate - postDate >= TWO_YEARS_IN_MILLIS) {
        outdatedDisclaimer.setAttribute('style', 'display: block');
    }
});
