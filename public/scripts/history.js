async function history() {
    document.getElementById('workoutHistory').innerHTML = ''
    try{
        let response = await fetch(`/api/workouts/`,{method:'GET'});
        let data = await response.json();

        const displayEL = document.getElementById('workoutHistory')
        if (data.length === 0){
            displayEL.innerHTML = "<p>No recent workouts</p>";
            return;
        }
        else {
            data.forEach(workout =>{
                const {id,exercises,difficulty} = workout
                const card = document.createElement('div');
                const cleanDate = new Date(id).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                card.classList.add('workout-card');
                // card.innerHTML = `<p>id: ${cleanDate} difficulty: ${difficulty} exercises:${exercises}`
                let exerciseHTML = "";
                for(let group in exercises){
                    exerciseHTML += `<p>${group}<ul>`;
                    for(let move in exercises[group]){
                        const stats = exercises[group][move];
                        exerciseHTML += `<li>${stats.sets} x ${stats.reps} ${move}</li>`
                    }
                    exerciseHTML += `</ul>`
                }
                card.innerHTML = `<div>
                <h2>Date: ${cleanDate} </h2>
                <button class="delete-btn" onclick="deleteWork(${id})">Delete</button>
                <button class="update-btn" onclick="updateDif(${id})">Update Difficulty</button>
                difficulty: ${difficulty}
                exercises: ${exerciseHTML}
                </div>`;
                displayEL.appendChild(card)
            })
        }
        //console.log(data);
    }
    catch(err){
        console.error(`error: ${err}`)
    }
}

async function deleteWork(id){
    if(!confirm("are you sure"))return;
    try {
        const response = await fetch(`/api/workouts/${id}`,{
            method:'DELETE'
        })
        if (response.ok){
            history()
        }
        else{
            alert('failed')
        }
    }
    catch(err){
        console.error(`${err}`)
    }
}
async function updateDif (id){
    const newDif = prompt("How hard was it *really?*");
    if (!newDif)return;

    try{
        const response = await fetch(`/api/workouts/${id}`,
        {method:'PATCH',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({difficulty:newDif})})
        if (response.ok){
            history();
        }
    }
    catch(err){
        console.error('fail')
    }
}

history()