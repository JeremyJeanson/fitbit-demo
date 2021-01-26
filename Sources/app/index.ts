import document from "document";
import clock from "clock";
import { me } from "appbit";
import { goals, today } from "user-activity";

// Clock
const _clockText = document.getElementById("clock") as TextElement;

// Steps
const _stepsContainer = document.getElementById("steps-container") as GraphicsElement;
const _stepsText = document.getElementById("steps-text") as TextElement;
const _stepsArc = document.getElementById("steps-arc") as ArcElement;
let _stepsLastValue: number | undefined = undefined;

// Clock tick granularity
clock.granularity = "seconds";

/**
 * Tick each seconds
 * @param e 
 */
clock.ontick = (e) => {
    _clockText.text = e.date.toTimeString().substr(0, 8);
    updateSteps();
};

/**
 * Update the steps counter and arc
 */
function updateSteps() {
    if (me.permissions.granted("access_activity")) {
        const actual = today.adjusted.steps || 0;
        // Test if the steps counter havn't changed
        if (_stepsLastValue === actual) {
            return;
        }
        // Save the value
        _stepsLastValue = actual;
        // Display the steps container
        _stepsContainer.style.display = "inline";
        // Update
        _stepsText.text = actual.toString();
        _stepsArc.sweepAngle = activityAs360Arc(actual, goals.steps);
        return;
    }
    _stepsContainer.style.display = "none";
}

/**
 * Return the activity progression as an arc
 * @param actual 
 * @param goal 
 */
function activityAs360Arc(actual: number | undefined, goal: number | undefined): number {
    // Check to avoid calcul
    if (actual === undefined
        || goal === undefined
        || actual <= 0 || goal <= 0) return 0;
    if (actual >= goal) return 360;
    // Calcul
    return actual * 360 / goal;
}