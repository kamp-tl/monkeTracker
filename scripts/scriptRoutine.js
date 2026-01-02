//elements from the document 
const buttonPlus = document.getElementById("plus"); // .getElementById()
const hiddenTextarea = document.querySelector('section') // .querySelector()
const textArea = document.getElementById("textArea");
const textWallEl = document.getElementById("textWall");
const helpTextEl = document.getElementById("helpText");
const createTextEl = document.getElementById('helpCreateHeader')
const createPEl = document.getElementById('helpCreateP')
const checkButton = document.getElementById('check')
//required global variables 
let currentExerciseLine;
let lastEnterTime = 0;
let doubleEnterThres = 400;
let inputStage = "Group";
let activeGroup;
let actionForm = document.getElementById('actionForm')


//this is the function called when the plus button is clicked or the Enter key is pressed
function clickPlus() {
  //this hides the textArea and the checkButton until the function is called for the first time
  if (hiddenTextarea.style.display == "") {
    hiddenTextarea.style.display = "flex";
    hiddenTextarea.lastChild.focus //parent-child element navigation 
    checkButton.style.display = 'flex'
    createPEl.style.display = 'none'
  }
  if (activeGroup == null && textArea.value.trim != ""&& validateText() == true) {
    //if we are not in an exercise group and there is a value of textArea, start a group
    if (textArea.value.trim() != "") {
      startGroup();
      createTextEl.style.display = 'none'
      createPEl.style.display = 'none'
      helpTextEl.textContent = "Add Exercise Movement";
    }
  } else {
    //if we are inside an exercise group
    if (inputStage === "Group" && textArea.value != ""&& validateText() == true) {
      //if we are in an exercise group, addExercise()
      currentExerciseLine = addExercise();
      inputStage = "sets"; // change the stage
      helpTextEl.textContent = "How many sets?";
    } else if (inputStage === "sets" && textArea.value != "" && validateNum() == true) {
      addSets(); //adds the text to a variable 'sets'
      inputStage = "reps"; // change the stage
      helpTextEl.textContent = "How many reps?";
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

function clickCheck() {
  if (hiddenTextarea.style.display == 'flex'){
    hiddenTextarea.style.display = ''
    createPEl.style.display = 'none'
    checkButton.textContent = 'complete!'
  }
  else if(hiddenTextarea.style.display == '') {
    let difRate = prompt('How hard was your workout 1-10?')
    window.location.reload() //bom
  }
}

function startGroup() {
  //create a div to group the exercises
  let newGroup = document.createElement("div"); 
  newGroup.classList.add("moveGroup");
  let newName = document.createElement('p')
  newName.classList.add('groupName')
  newName.textContent = textArea.value;
  newGroup.append(newName)
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

function backButton () {
window.location.href = '../index.html' //bom
}
// JS validation
function validateText(){ 
  let value = textArea.value.trim()
  let pattern = /^[a-zA-Z0-9 ]+$/
  return pattern.test(value)
}

function validateNum(){
  let value = textArea.value.trim()
  let pattern = /^[0-9]+$/
  return pattern.test(value)
}

let checkboxes = document.getElementsByName('y/n') //iteration
checkboxes.forEach(function(currentBox) {
  currentBox.addEventListener('change',
  () => {
    checkboxes.forEach((checked) =>
    {if(checked != currentBox )
    checked.checked = false})
  }
  )
})

actionForm.addEventListener('submit', (e) =>{actionForm.style.display = 'none'
e.preventDefault()} 
)

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
