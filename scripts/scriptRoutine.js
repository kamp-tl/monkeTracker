let buttonPlus = document.getElementById("plus");
let hiddenTextarea = document.getElementById("hiddenTextarea")
let textArea = document.getElementById("textArea")
let textWallEl = document.getElementById("textWall")
let helpTextEl = document.getElementById("helpText")
let currentExerciseLine = null;
let pendingSets = null;

let lastEnterTime = 0;
let doubleEnterThres = 400;

let inputStage = "Group";

let activeGroup = null;
function clickPlus() {
    if (hiddenTextarea.style.display == ""){
        hiddenTextarea.style.display = "flex";
    }
    if (activeGroup==null){
       
        if(textArea.value.trim() != "") {
            startGroup()
            helpTextEl.textContent=("Add Exercise Movement");
        }
    }
    else {
        if (inputStage==="Group"){
            currentExerciseLine = addExercise();
            inputStage = "sets"
            helpTextEl.textContent=("How many sets?");
        }
        else if (inputStage==="sets"){
            addSets();
            inputStage = "reps"
            helpTextEl.textContent=("How many reps?");
        }
        else if (inputStage==="reps"){
            addReps();
            inputStage = "Group"
            helpTextEl.textContent=("Add Exercise Movement");
            currentExerciseLine = null;
        }
    }
    textArea.value = "";
    textArea.focus();
}

function startGroup() {
    //create a div to group the exercises 
    let newItem = textArea.value; 
    let newGroup = document.createElement("div")
    newGroup.classList.add("moveGroup");
    newGroup.textContent = newItem;
    textWallEl.appendChild(newGroup);
    textArea.value = "";
    activeGroup = newGroup;
}

function addExercise() {
    let exName = textArea.value;
    let line = document.createElement("div");
    line.classList.add("exerciseLine");
    line.textContent = exName;
    textArea.value="";
    activeGroup.appendChild(line);
    return line;
}


function addSets() {
    pendingSets = textArea.value.trim();
}

function addReps() {
    let reps = textArea.value.trim();  if (currentExerciseLine && pendingSets) {
        currentExerciseLine.textContent =
            `${pendingSets} x ${reps}  ` + currentExerciseLine.textContent;
    }

    pendingSets = null; // reset
}


document.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        const now = Date.now(); 
      
      
      if (now - lastEnterTime < doubleEnterThres){
        //double enter 
        activeGroup = null;
        inputStage = "Group"
        currentExerciseLine = null;
        helpTextEl.textContent = "Add Movement Group"
        textArea.value = "";
        lastEnterTime = now;
        return;
      }
      else {
        clickPlus()
      }
      lastEnterTime = now;
      textArea.focus();
      event.preventDefault();
    }
  });
