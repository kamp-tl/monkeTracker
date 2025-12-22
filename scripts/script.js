let button1 = document.getElementById("button1");
let button2 = document.getElementById("button2");
let button3 = document.getElementById("button3");
let buttonCase = document.getElementById("buttonCase");
let hiddenCase = document.getElementById("hiddenCase");

let fixDate = new Date('2025-12-20T20:16:22.000Z')
let today = Date.now()
let daysSince = getDaysSince(today)
let dayTrackEl = document.getElementById('dayTrack')

dayTrackEl.textContent = `Been training for ${daysSince} days`

function showRoutine() {

    buttonCase.style.display = "none";
    hiddenCase.style.display = "flex";
}

function flipback() {
    if (buttonCase.style.display == "none"
    && hiddenCase.style.display == "flex"){
    hiddenCase.style.display = "none";
    buttonCase.style.display = "flex"}
}

function getDaysSince (today){
   let todayMilli = new Date(today).getTime()
   let difMilli = todayMilli - fixDate.getTime()
   let difDays = (difMilli / 86400000).toFixed()
   return difDays
}

