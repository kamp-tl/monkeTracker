import express from 'express';
import { logReq, globalErr, checkJson } from "./public/scripts/middlewares.js";
import ejs from 'ejs'

const app = express()
const PORT = 3000;
let workouts = [];
let users = [];
let goals = [];

app.set('view engine', 'ejs')

app.use(express.static('public'));
app.use(express.json());
app.use(logReq);
app.use(checkJson);

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/api/workouts', (req,res)=>{
    const { difficulty } = req.query;
    if (difficulty) {
        const filtered = workouts.filter(w => w.difficulty == difficulty);
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
app.post('/api/workouts', (req,res)=>{
    const workoutData = req.body;
    if(!workoutData.exercises || !workoutData.difficulty){
        return res.status(400).json({error:'data is missing'});
    }
    workouts.push(workoutData)
    console.log(`Database: ${workouts}`)
    res.status(201).json({message:`workout recorded`, data: workoutData})
});
app.delete('/api/workouts/:id', (req,res)=>{
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
app.use(globalErr)

app.listen(PORT, ()=>{
    console.log(`Server is running on port: ${PORT}`)
})