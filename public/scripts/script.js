let button1 = document.getElementById("button1");
let button2 = document.getElementById("button2");
let button3 = document.getElementById("button3");
let buttonCase = document.getElementById("buttonCase");
let hiddenCase = document.getElementById("hiddenCase");

let fixDate = new Date('2025-12-01T16:51:19.000Z')
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


async function deleteItem(id) {
    if (confirm("Delete?")) {
        await fetch(`/api/workouts/${id}`, { method: 'DELETE' });
        location.reload();
    }
}

async function editItem(id) {
    let val = prompt("New Difficulty:");
    if (val) {
        await fetch(`/api/workouts/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ difficulty: val })
        });
        location.reload();
    }
}

