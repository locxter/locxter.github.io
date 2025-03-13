'use strict';

// DOM references
let maxPointsInput = document.getElementById('max-points');
let achievedPointsInput = document.getElementById('achieved-points');
let gradeInput = document.getElementById('grade');
let calculateButton = document.getElementById('calculate');
let directionInput = document.getElementById('direction');
let roundingStyleInput = document.getElementById('rounding-style');
let decimalPlacesInput = document.getElementById('decimal-places');

// Create some enums for selection parsing
const DIRECTION = Object.freeze({
    POINTS_TO_GRADE: 'points-to-grade',
    GRADE_TO_POINTS: 'grade-to-points',
});
const ROUNDING_STYLE = Object.freeze({
    CUT: 'cut',
    ROUND: 'round',
    CEIL: 'ceil',
});

// Some global variables
let direction = DIRECTION.POINTS_TO_GRADE;
let roundingStyle = ROUNDING_STYLE.CUT;
let decimalPlaces = 1;

// Helper function to format the results
function formatResult(result) {
    switch (roundingStyle) {
        case ROUNDING_STYLE.ROUND:
            return Math.round(result * Math.pow(10.0, decimalPlaces)) / Math.pow(10.0, decimalPlaces);
        case ROUNDING_STYLE.CEIL:
            return Math.ceil(result * Math.pow(10.0, decimalPlaces)) / Math.pow(10.0, decimalPlaces);
        default:
            return Math.floor(result * Math.pow(10.0, decimalPlaces)) / Math.pow(10.0, decimalPlaces);
    }
}

// Function to run the main calculation (100% => 1.0, 50% => 4.0, 33.33% => 5.0)
function calculate() {
    if (maxPointsInput.value && achievedPointsInput.value && gradeInput.value) {
        let maxPoints = parseInt(maxPointsInput.value);
        let percent, result;
        switch (direction) {
            case DIRECTION.POINTS_TO_GRADE:
                let achievedPoints = Math.min(parseInt(achievedPointsInput.value), maxPoints);
                percent = achievedPoints / maxPoints;
                if (percent <= 1.0 / 3.0) {
                    result = 5.0;
                } else {
                    result = -6.0 * percent + 7.0;
                }
                gradeInput.value = formatResult(result);
                break;
            default:
                let grade = Math.max(Math.min(parseFloat(gradeInput.value), 5.0), 1.0);
                percent = (-1.0 / 6.0) * grade + 7.0 / 6.0;
                result = maxPoints * percent;
                achievedPointsInput.value = formatResult(result);
                break;
        }
    } else {
        throw new Error('Enter all required data');
    }
}
// Handle initialization on load
window.addEventListener('load', () => {
    let event = new Event('change');
    directionInput.dispatchEvent(event);
    roundingStyleInput.dispatchEvent(event);
    decimalPlacesInput.dispatchEvent(event);
});
// Handle calculate button
calculateButton.addEventListener('click', () => {
    try {
        calculate();
    } catch (error) {
        alert(error);
        console.error(error);
    }
});
// Handle direction input
directionInput.addEventListener('change', (event) => {
    direction = event.target.value;
    switch (direction) {
        case DIRECTION.POINTS_TO_GRADE:
            achievedPointsInput.readOnly = false;
            gradeInput.readOnly = true;
            break;
        default:
            achievedPointsInput.readOnly = true;
            gradeInput.readOnly = false;
            break;
    }
    try {
        calculate();
    } catch (error) {
        alert(error);
        console.error(error);
    }
});
// Handle rounding style input
roundingStyleInput.addEventListener('change', (event) => {
    roundingStyle = event.target.value;
    try {
        calculate();
    } catch (error) {
        alert(error);
        console.error(error);
    }
});
// Handle decimal places input
decimalPlacesInput.addEventListener('change', (event) => {
    if (event.target.value) {
        decimalPlaces = parseInt(event.target.value);
        gradeInput.step = 1.0 / Math.pow(10.0, decimalPlaces);
    } else {
        event.target.value = decimalPlaces;
    }
    try {
        calculate();
    } catch (error) {
        alert(error);
        console.error(error);
    }
});
