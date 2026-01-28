import express from 'express';
import { logReq, globalErr, checkJson } from "./public/scripts/middlewares.js"; 
// custom middleware 5% ✓ and error-handling 5% ✓


const app = express()
const PORT = 3000;
let workouts = [];
let users = [];
let goals = []; 
//3 categories, users and goals can GET not POST yet 5% ✓

app.set('view engine', 'ejs') //template engine 8% ✓

app.use(express.static('public')); //CSS 2% ✓
app.use(express.json());
app.use(logReq); 
app.use('/api',checkJson);

//GET routes 5% ✓
app.get('/api/workouts', (req,res)=>{
    const { difficulty } = req.query;
    if (difficulty) {
        const filtered = workouts.filter(w => w.difficulty == difficulty);
        //query parameter to filter by difficulty 5% ✓
        return res.json(filtered);
    }
    res.json(workouts)
})
app.get('/api/users', (req,res)=>{
    res.json(users);
})
app.get('/api/goals',(req,res)=>{
    res.json(goals);
})
app.get('/', (req, res) => {
    res.sendFile('index.html', { workoutCount: workouts.length });
});
app.get('/history', (req, res) => {
    res.render('history', { workouts: workouts }); //using engine
});
//POST workoutData 5% ✓
app.post('/api/workouts', (req,res)=>{
    const workoutData = req.body;
    if(!workoutData.exercises || !workoutData.difficulty){
        return res.status(400).json({error:'data is missing'});
    }
    workoutData.id = Date.now()
    workouts.push(workoutData)
    console.log('Database: ',workouts)
    res.status(201).json({message:`workout recorded`, data: workoutData})
});
//DELETE post 5% ✓
app.delete('/api/workouts',(req,res)=>{
    workouts = [];
    res.json({message:'deleted all workouts', data:workouts})
})

app.delete('/api/workouts/:id', (req,res)=> { //route parameters 5% ✓
    const targetID = Number(req.params.id);
    const initialLength = workouts.length;
    workouts = workouts.filter(workout => workout.id !== targetID);

    if (workouts.length < initialLength) {
        res.json({ message: "Workout deleted successfully" });
    } else {
        res.status(404).json({ message: "Workout not found" });
    }
});
app.get('/api/test-error', (req, res, next) => {
    const error = new Error("Middleware Test: Success!");
    error.status = 500;
    next(error); 
});
//PATCH Difficulty 5% ✓
app.patch('/api/workouts/:id', (req,res)=>{
    const target = Number(req.params.id);
    const updates = req.body;
    
    const workout = workouts.find(w => w.id === target);

    if (workout) {
        // Merge updates into the existing workout object
        Object.assign(workout, updates);
        res.json({ message: "Workout updated", data: workout });
    } else {
        res.status(404).json({ error: "Workout not found" });
    }

})
//globalErr
app.use(globalErr)

app.listen(PORT, ()=>{
    console.log(`Server is running on port: ${PORT}`)
})

//reasonable data structuring 5% ?
//principles of REST 10% ?
//form within rendered view 3% X 
//reasonable organization 5% ? 
//works 10% ✓
//commits 5% ✓
//README 2% ✓
//effort 5% ?
