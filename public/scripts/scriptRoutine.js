//elements from the document
const plusButton = document.getElementById("plus");
const hiddenText = document.querySelector("section");
const textArea = document.getElementById("textArea");
const textWallEl = document.getElementById("textWall");
const helpTextEl = document.getElementById("helpText");
const createTextEl = document.getElementById("helpCreateHeader");
const createPEl = document.getElementById("helpCreateP");
const checkButton = document.getElementById("check");
const favPulse = document.getElementById("favPulse") || document.getElementById("favPulseLegs") || document.getElementById("favPulsePull")
const actionForm = document.getElementById("actionForm");
const checkboxes = document.getElementsByName("y/n");

//global variables
let currentExerciseLine;
let currentExercise;
let currentGroupExercises = {};
let lastEnterTime = 0;
let doubleEnterThres = 400;
let inputStage = "Group";
let currentGroup;
let currentGroupName;
let sets;
let workoutData = {
  exercises:{}
};
//how am I going to add push/pull/legs to the workoutData 
//main function runs when the plus button is clicked or the Enter key is pressed
function clickPlus() {
  if (checkButton.style.display == "flex") {
    //if the checkButton is visible
    checkButton.textContent = "✓";
  }
  //hide the textArea helpTextEl and the checkButton until the function is called for the first time
  if (hiddenText.style.display == "") {
    hiddenText.style.display = "flex";
    hiddenText.lastChild.focus;
    checkButton.style.display = "flex";
    createPEl.style.display = "none";
  }
  
  if (
    currentGroup == null &&   //if not in an exercise group
    textArea.value.trim != "" && 
    validateText() == true 
  ) {
    if (textArea.value.trim() != "") {
      startGroup(); // <---------------------------------------------------------------startGroup()
      createTextEl.style.display = "none";
      createPEl.style.display = "none";
      helpTextEl.textContent = "Add Exercise Movement";
    }
  } else {
   
    if (
      inputStage === "Group" && // if inside an exercise group 
      textArea.value != "" &&
      validateText() == true
    ) {
      currentExerciseLine = addExercise(); //<-----------------------------------------addExercise()
      inputStage = "sets";
      helpTextEl.textContent = "How many sets?";
      createPEl.style.display = "none";
    }
    // after exercise 
    else if (
      inputStage === "sets" &&
      textArea.value != "" &&
      validateNum() == true
    ) {
      addSets(); //<------------------------------------------------------------------------addSets()
      inputStage = "reps";
      helpTextEl.textContent = "How many reps?";
      createPEl.style.display = "none";
    }
    //after sets and back to exercise inside the group
    else if (
      inputStage === "reps" &&
      textArea.value != "" &&
      validateNum() == true
    ) {
      addReps(); //<-----------------------------------------------------------------------addReps()
      inputStage = "Group";
      createPEl.style.display = "flex";
      createPEl.textContent = "Double click Enter to create a New Group";
      helpTextEl.textContent = "Add Exercise Movement";
      currentExerciseLine = null;
    }
  }
  //reset the textArea
  textArea.value = "";
  textArea.focus();
}
//hides the textarea or prompts difficulty when workout complete
async function clickCheck() { 
  try {
    if (hiddenText.style.display == "flex") {
    hiddenText.style.display = "";
    createPEl.style.display = "none";
    checkButton.textContent = "complete!";
    workoutData.exercises[currentGroupName] = currentGroupExercises;
    console.log(workoutData)
  } else if (hiddenText.style.display == "") {
    //workoutData.exercises[currentGroupName] = currentGroupExercises
    let difRate = prompt("How hard was your workout 1-10?");
    workoutData.difficulty = difRate;
    workoutData.id = Date.now();
    console.log('Workout Data: ',workoutData)
    const response = await fetch('/api/workouts',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:(JSON.stringify(workoutData))
    //window.location.reload(); //bom 1
    })
    const result = await response.json()
    console.log('server says: ', result.message)
  }
} catch(err){
  console.error('delivery failed')
}
}
//create a div to group the exercises
function startGroup() {
  let newGroup = document.createElement("div");
  newGroup.classList.add("moveGroup");
  let newName = document.createElement("p");
  newName.classList.add("groupName");
  newName.textContent = textArea.value;
  newGroup.append(newName);
  currentGroupName = textArea.value
  textWallEl.appendChild(newGroup);
  textArea.value = "";
  currentGroup = newGroup;
  actionForm.style.display = "none";
  favPulse.style.display = "none";
  currentGroupExercises = {};
}
//creates an exercise div that holds text
function addExercise() {
  let exName = textArea.value;
  currentExercise = textArea.value;
  let line = document.createElement("div");
  line.classList.add("exerciseLine");
  line.textContent = exName;
  textArea.value = "";
  currentGroup.appendChild(line);
  return line;
}
//extract sets from textarea
function addSets() {
  sets = textArea.value.trim();
}
//extract reps and display sets x reps
function addReps() {
  let reps = textArea.value.trim();
  if (currentExerciseLine && sets) {
    if (sets == 1) {
      currentExerciseLine.textContent =
        `${reps}  ` + currentExerciseLine.textContent;
    } else {
      currentExerciseLine.textContent =
        `${sets} x ${reps}  ` + currentExerciseLine.textContent;
    }
    let exercise = {
      sets:sets,
      reps:reps,
    }
      currentGroupExercises[currentExercise]=exercise;
      console.log(currentGroupExercises)
      sets = null; // reset
  }
}
//go back to ../index.html
function clickBack() { // <-------------------------------------------------------------- clickBack()
  // window.location.href = "../index.html"; 
  
  //rolls back first moveGroup 
  if (currentGroup && inputStage === 'Group'){
  currentGroup = null;
  textArea.value = textWallEl.lastChild.textContent
  textWallEl.removeChild(textWallEl.lastElementChild)
  textArea.focus()
  helpTextEl.textContent = 'Add Movement Group'
} else {
  window.location.href = "../../";
}

}
function validateText() {
  let value = textArea.value.trim();
  let pattern = /^[a-zA-Z0-9 ]+$/;
  return pattern.test(value);
}
 //display a help text to explain the validation 
function validateNum() {
  let value = textArea.value.trim();
  let pattern = /^[0-9]+[sm]?$/;
  return pattern.test(value);
}
checkboxes.forEach(function (currentBox) {
  currentBox.addEventListener("change", () => {
    checkboxes.forEach((check) => {
      if (check != currentBox) check.checked = false;
    });
  });
});
//hide form on submit
actionForm.addEventListener("submit", (e) => {
  actionForm.style.display = "none";
  favPulse.style.display = "none";
  e.preventDefault();
  createPEl.style.display = "flex";
});
//runs clickPlus and checks for double Enter
document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    const now = Date.now();
    //save the time anytime Enter is pressed
    //double enter
    if (now - lastEnterTime < doubleEnterThres && inputStage == "Group" && currentGroup.children.length != 1) {
      currentGroup = null;
      inputStage = "Group";
      currentExerciseLine = null;
      helpTextEl.textContent = "Add Movement Group";
      textArea.value = "";
      lastEnterTime = now;
      createPEl.style.display = "none";
      workoutData.exercises[currentGroupName] = currentGroupExercises;
      return;
    } else {
      clickPlus();
    }
    lastEnterTime = now;
    textArea.focus();
    event.preventDefault();
  }
});
