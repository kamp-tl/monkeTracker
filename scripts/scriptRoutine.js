//elements from the document 
const plusButton = document.getElementById("plus"); // .getElementById() 5%
const hiddenTextarea = document.querySelector('section') // .querySelector() 5%
const textArea = document.getElementById("textArea");
const textWallEl = document.getElementById("textWall");
const helpTextEl = document.getElementById("helpText");
const createTextEl = document.getElementById('helpCreateHeader')
const createPEl = document.getElementById('helpCreateP')
const checkButton = document.getElementById('check')
const favPulse = document.getElementById('favPulse')
const actionForm = document.getElementById('actionForm')
//global variables 
let currentExerciseLine;
let lastEnterTime = 0;
let doubleEnterThres = 400;
let inputStage = "Group";
let activeGroup;


function clickPlus() { //when the plus button is clicked or the Enter key is pressed
  if (checkButton.style.display == 'flex'){ //if the checkButton is visible 
    checkButton.textContent = '✓' //modifying textContent 10%
  }
  //hide the textArea and the checkButton until the function is called for the first time
  if (hiddenTextarea.style.display == "") { //style property 5% interaction 3%
    hiddenTextarea.style.display = "flex";
    hiddenTextarea.lastChild.focus //parent-child element navigation 5%
    checkButton.style.display = 'flex'
    createPEl.style.display = 'none'
  }
  // not in an exercise group and there is a value of textArea, start a group
  if (activeGroup == null && textArea.value.trim != ""&& validateText() == true) {
    if (textArea.value.trim() != "") {
      startGroup();
      createTextEl.style.display = 'none'
      createPEl.style.display = 'none'
      helpTextEl.textContent = "Add Exercise Movement";
    }
  } else {// inside an exercise group
    if (inputStage === "Group" && textArea.value != ""&& validateText() == true) {
      // in an exercise group, addExercise()
      currentExerciseLine = addExercise();
      inputStage = "sets"; // change the stage
      helpTextEl.textContent = "How many sets?";
      createPEl.style.display = 'none'
    } else if (inputStage === "sets" && textArea.value != "" && validateNum() == true) {
      addSets(); //adds the text to a variable 'sets'
      inputStage = "reps"; // change the stage
      helpTextEl.textContent = "How many reps?";
      createPEl.style.display = 'none'
    } else if (inputStage === "reps" && textArea.value != ""&& validateNum() == true) {
      addReps(); //adds the text to a variable 'reps' and concatenates both to the exercise
      inputStage = "Group"; // back to adding an exercise inside the group
        createPEl.style.display = 'flex'
        createPEl.textContent = 'Double click Enter to create a New Group'
        createPEl.style.margin = 'auto'
      helpTextEl.textContent = "Add Exercise Movement";
      currentExerciseLine = null;
    }
  }
  textArea.value = ""; //reset the textArea when run
  textArea.focus();
}

function clickCheck() {  //hides the textarea or prompts difficulty
  if (hiddenTextarea.style.display == 'flex'){
    hiddenTextarea.style.display = ''
    createPEl.style.display = 'none'
    checkButton.textContent = 'complete!'
  }
  else if(hiddenTextarea.style.display == '') {
    let difRate = prompt('How hard was your workout 1-10?')
    window.location.reload() //bom 1
  }
}

function startGroup() {
  //create a div to group the exercises
  let newGroup = document.createElement("div"); // creating elements 5% 
  newGroup.classList.add("moveGroup");
  let newName = document.createElement('p')
  newName.classList.add('groupName')
  newName.textContent = textArea.value;
  newGroup.append(newName) //append thangs 5%
  textWallEl.appendChild(newGroup);
  textArea.value = "";
  activeGroup = newGroup;
  actionForm.style.display = 'none'
  favPulse.style.display = 'none'
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
    if(sets == 1){
      currentExerciseLine.textContent =
      `${reps}  ` + currentExerciseLine.textContent;
    }
    else {
    currentExerciseLine.textContent =
      `${sets} x ${reps}  ` + currentExerciseLine.textContent; 
    }
  }

  sets = null; // reset
}

function backButton () {
window.location.href = '../index.html' //bom 2 3%
}
// JS validation 5%
function validateText(){ 
  let value = textArea.value.trim()
  let pattern = /^[a-zA-Z0-9 ]+$/
  return pattern.test(value)
}

function validateNum(){
  let value = textArea.value.trim()
  let pattern = /^[0-9]+[sm]?$/
  return pattern.test(value)
}

let checkboxes = document.getElementsByName('y/n') //iteration 5%
checkboxes.forEach(function(currentBox) { //and it's html validation here 5%
  currentBox.addEventListener('change',
  () => {
    checkboxes.forEach((checked) =>
    {if(checked != currentBox )
    checked.checked = false})
  }
  )
})

actionForm.addEventListener('submit', (e) =>{actionForm.style.display = 'none'
favPulse.style.display = 'none'
e.preventDefault()
createPEl.style.display = 'flex'} 
)
//two event listeners ^v 10%
document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    const now = Date.now();
    //save the time anytime Enter is pressed

    if (now - lastEnterTime < doubleEnterThres && inputStage == 'Group') {
      //double enter
      activeGroup = null;
      inputStage = "Group";
      currentExerciseLine = null;
      helpTextEl.textContent = "Add Movement Group";
      textArea.value = "";
      lastEnterTime = now;
      createPEl.style.display = 'none'
      return;
    } else {
      clickPlus();
    }
    lastEnterTime = now;
    textArea.focus();
    event.preventDefault();
  }
});
//it runs 10% got commits 5% got a readme 2% effort–you tell me ?%

//I would use cloneNode() by creating a nonvisible <template> in html for each exercise line
  //addExercise() would clone the template, edit the clone, then append to the current moveGroup 
  //my way works but that's how I would snag that 2% ^