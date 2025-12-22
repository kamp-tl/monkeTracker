let buttonPlus = document.getElementById("plus");
let hiddenTextarea = document.getElementById("hiddenTextarea");
let textArea = document.getElementById("textArea");
let textWallEl = document.getElementById("textWall");
let helpTextEl = document.getElementById("helpText");
let currentExerciseLine = null;
let sets = null;
let lastEnterTime = 0;
let doubleEnterThres = 400;
let inputStage = "Group";
let activeGroup = null;

// let exampleWorkoutObject = {time:'12/12/2025', groups:groups[exercises[]],difficulty:'1'}
// Same Function but with rest parameters.
// function getDevObject(name, age, ...skills) {
//     let dev = {
//       name: name,
//       age: age,
//       skills: skills,
//     };

//     return dev;
//   }

// function getWorkObject(time, difficulty,...groups)

//this is the function called when the plus button is clicked or the Enter key is pressed
function clickPlus() {
  //this hides the testArea until the function is called for the first time
  if (hiddenTextarea.style.display == "") {
    hiddenTextarea.style.display = "flex";
  }
  if (activeGroup == null) {
    //if we are not in an exercise group, startGroup()
    if (textArea.value.trim() != "") {
      startGroup();
      helpTextEl.textContent = "Add Exercise Movement";
    }
  } else {
    //if we are inside an exercise group
    if (inputStage === "Group") {
      //if we are in an exercise group, addExercise()
      currentExerciseLine = addExercise();
      inputStage = "sets"; // change the stage
      helpTextEl.textContent = "How many sets?";
    } else if (inputStage === "sets") {
      addSets(); //adds the text to a variable 'sets'
      inputStage = "reps"; // change the stage
      helpTextEl.textContent = "How many reps?";
    } else if (inputStage === "reps") {
      addReps(); //adds the text to a variable 'reps' and concatenates both to the exercise
      inputStage = "Group"; // back to adding an exercise inside the group
      helpTextEl.textContent = "Add Exercise Movement";
      currentExerciseLine = null;
    }
  }
  textArea.value = ""; //reset the textArea when run
  textArea.focus();
}

function startGroup() {
  //create a div to group the exercises
  //let newItem = textArea.value;
  let newGroup = document.createElement("div");
  newGroup.classList.add("moveGroup");
  newGroup.textContent = textArea.value;
  textWallEl.appendChild(newGroup);
  textArea.value = "";
  activeGroup = newGroup;
  //create a tracking variable and a div to hold it, then append the div inside the group
  //if there is time under tension then create a second variable
  //that adds up the total reps and the time under tension in each group
}

function addExercise() {
  let exName = textArea.value;
  let line = document.createElement("div");
  line.classList.add("exerciseLine");
  line.textContent = exName;
  textArea.value = "";
  activeGroup.appendChild(line);
  return line;
}

function addSets() {
  sets = textArea.value.trim();
}

function addReps() {
  let reps = textArea.value.trim();
  if (currentExerciseLine && sets) {
    currentExerciseLine.textContent =
      `${sets} x ${reps}  ` + currentExerciseLine.textContent;
  }

  sets = null; // reset
}

document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    const now = Date.now();
    //save the time anytime Enter is pressed

    if (now - lastEnterTime < doubleEnterThres) {
      //double enter
      activeGroup = null;
      inputStage = "Group";
      currentExerciseLine = null;
      helpTextEl.textContent = "Add Movement Group";
      textArea.value = "";
      lastEnterTime = now;
      return;
    } else {
      clickPlus();
    }
    lastEnterTime = now;
    textArea.focus();
    event.preventDefault();
  }
});
