var count = 31.00; // default of 30 seconds
var NRPDepth = 0; // counter to orient the program as to how far along we are
var counter = setInterval(timer, 1000); //1000 will run it every 1 second
var paused = 0; // variable to keep track of whether the program is paused or not
var buttonState = false;

// main timer function
function timer() {
    count = count - 1;          // decrease timer counter by 1 every second
    if (count <= 0) {           // until timer reaches 0
        clearInterval(counter); // stop the timer
    //              document.getElementsByTagName("p")[0].innerHTML = "Too much time has passed. Seek medical attention!";
        alert("Too much time has passed. Seek medical attention!"); // send alert
      // TODO: add restart button at this point.
        return; // finish
    }
    document.getElementById("timer").innerHTML = count + "s"; // display the timer's number of seconds remaining
}

function updateInstruction(newInstruction) {
    document.getElementsByTagName("p")[1].innerHTML = newInstruction;
}

function updatePrompt(newPrompt) {
    document.getElementsByTagName("p")[0].innerHTML = newPrompt;
}

function updateTitle(newTitle) {
    document.getElementsByTagName("h1")[0].innerHTML = newTitle;
}

// resets the timer
function resetTimer() {
    clearInterval(counter);
    count = 31.00;
    counter = setInterval(timer, 1000);
    timer();
}

function resetTimerToOneMinute() {
    clearInterval(counter);
    count = 61.00;
    counter = setInterval(timer, 1000);
    timer();
}

// swaps the buttons so green-check is always a positive response (positive as in positive health outcome, and 
// red-x is always a negative response (negative as in a non-optimal health outcome),
// regardless of 'yes' or 'no' text
function swapButtons() {
    if (buttonState) {
        document.getElementsByTagName("td")[1].innerHTML = "<a href='#' class='btn btn-success btn-lg' role='button' onclick='yes()'><i class='fa fa-check-circle'></i> Yes</a>";
        document.getElementsByTagName("td")[2].innerHTML = "<a href='#' class='btn btn-danger btn-lg' role='button' onclick='no()'><i class='fa fa-times-circle'></i> No</a>";
        buttonState = !buttonState;
    } else if (!buttonState) {
        document.getElementsByTagName("td")[1].innerHTML = "<a href='#' class='btn btn-success btn-lg' role='button' onclick='no()'><i class='fa fa-check-circle'></i> No</a>";
        document.getElementsByTagName("td")[2].innerHTML = "<a href='#' class='btn btn-danger btn-lg' role='button' onclick='yes()'><i class='fa fa-times-circle'></i> Yes</a>";
        buttonState = !buttonState;
    }
}

function removeButtons() {
    document.getElementsByTagName("td")[0].innerHTML = "<a href='#' class='btn btn-primary btn-lg' role='button' onclick='restartAll()'><i class='fa fa-repeat'></i> Restart</a>";
    document.getElementsByTagName("td")[1].innerHTML = "";
    document.getElementsByTagName("td")[2].innerHTML = "";
}

function plusOne() {
    NRPDepth = NRPDepth + 1;
}

function plusTwo() {
    NRPDepth = NRPDepth + 2;
}

function minusOne() {
    NRPDepth = NRPDepth - 1;
}

function minusTwo() {
    NRPDepth = NRPDepth - 2;
}

// called when the user has completed the NRP - timer stops at this time.
function finish() {
    clearInterval(counter);
    document.getElementsByTagName("p")[0].innerHTML = "";
    document.getElementsByTagName("p")[1].innerHTML = "Okay, looks good - continue monitoring.";
    removeButtons();
}

// resumes the program wherever the user left off
function playTimer() {
    counter = setInterval(timer, 1000);
    timer();
}

// pauses the program
function pauseTimer() {
    if (paused === 0) {
        clearInterval(counter);
        paused = 1;
    } else if (paused === 1) {
        playTimer();
        paused = 0;
    }
}

function goodFinish() {
    clearInterval(counter);
    updateTitle("Okay, Good!");
    updatePrompt("");
    updateInstruction("Routine care; provide warmth; clear airway if necessary; dry; ongoing evaluation");
    removeButtons();
}

function warningFinish() {
    updateTitle("Requires specialised care.");
    updatePrompt("Please consult a specialist.");
    pauseTimer();
    removeButtons();
}

function alternateFinish() {
    updateTitle("Clear Airway; SPO<sub>2</sub> monitoring; consider CPAP.");
    updateInstruction("Gradually decrease PPV, move baby to for post-recucitation care.");
    updatePrompt("");
    pauseTimer();
    removeButtons();
}

// reloads the page, effectively restarting the program.
function restartAll() {
    window.location.reload(true);
}

// YES
// if user clicks 'yes', change the current view according to previous state.
function yes() {

    if (NRPDepth === 0) {
        goodFinish();
    } else if (NRPDepth === 1) {
        warningFinish();
    } else if (NRPDepth === 3) {
        alternateFinish();
    } else if (NRPDepth === 2) {
        plusTwo();
        updateTitle("PPV, SPO<sub>2</sub> monitoring");
        updateInstruction("");
        updatePrompt("HR Below 100bpm?");
        resetTimer();
    } else if (NRPDepth === 4) {
        plusOne();
        updateTitle("Take ventilation corrective steps.");
        updateInstruction("");
        updatePrompt("HR Below 60bpm?");
        resetTimer();
    } else if (NRPDepth === 5) {
        plusTwo();
        resetTimerToOneMinute();
        updateTitle("Consider intubation; Chest Compressions.");
        updateInstruction("Coordinate with PPV (40-60bpm). (1 minute = 90 compressions + 30 breaths) 'One-and-Two-and-Three-and-Breath-and'");
        updatePrompt("HR below 60bpm?");
    } else if (NRPDepth === 6) {
        minusOne();
        updateTitle("Take ventilation corrective steps.");
        updateInstruction("");
        updatePrompt("HR Below 60bpm?");
        resetTimer();
    } else if (NRPDepth === 7) {
        plusOne();
        resetTimerToOneMinute();
        updateTitle("Initiate umbilical IV access");
        updateInstruction("IV Epinephrine (1:10,000) continue PPV (O<sub>2</sub> @ 100%) + chest compressions");
        updatePrompt("HR still below 60bpm?");
    } else if (NRPDepth === 8) {
        plusOne();
        resetTimer();
        updateTitle("Repeat dose every 3-5 minutes");
        updateInstruction("Continue PPV, (0<sub>2</sub> @100% + Chest compressions");
        updatePrompt("HR still below 60bpm again?");
        resetTimer();
    } else if (NRPDepth === 9) {
        plusOne();
        resetTimer();
        updateTitle("Consider hypovolemia or pneumothorax");
        updateInstruction("Oxymeter; Stop chest compressions when HR >60");
        updatePrompt("HR still below 60bpm again?");
    } else if (NRPDepth === 10) {
        warningFinish();
    }
}

// NO
// if user clicks 'no', change the current view according to previous state.
function no() {

    if (NRPDepth === 0) {
        plusOne();
        swapButtons();
        updateTitle("Is meconium present?");
        updatePrompt("");
        resetTimer();
    } else if (NRPDepth === 1) {
        plusOne();
        updateTitle("Warm; dry; stimulate.");
        updateInstruction("Clear airway if necessary.");
        updatePrompt("HR below 100bpm, gasping, or apnea?");
        resetTimer();
    } else if (NRPDepth === 2) {
        plusOne();
        updateInstruction("");
        updatePrompt("");
        updateTitle("Laboured breathing, or persistent cyanosis?");
        resetTimer();
    } else if (NRPDepth === 3) {
        goodFinish();
    } else if (NRPDepth === 4) {
        alternateFinish();
    } else if (NRPDepth === 5) {
        plusOne();
        updateTitle("HR below 100bpm?");
        updateInstruction("");
        updatePrompt("");
        resetTimer();
    } else if (NRPDepth === 6) {
        alternateFinish();
    } else if (NRPDepth === 7) {
        minusOne();
        updateTitle("HR below 100bpm?");
        updateInstruction("");
        updatePrompt("");
        resetTimer();
    } else if (NRPDepth === 8) {
        alternateFinish();
    } else if (NRPDepth === 9) {
        alternateFinish();
    }
}