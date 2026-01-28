monkeTracker 

SBA 318 

I connected my fitness tracker project from the previous SBAs to a server. 
You can create data on push.html  pull.html and legs.html. Once you complete the workout and give it a difficulty rating, 
it will be POSTed by /history. You can view them in the Past Workouts page.


Routes:

GET /api/workouts - gets all workouts 

POST /api/workouts - post a new workout

PATCH /api/workouts/:id - update workout difficulty

DELETE /api/workouts/:id - delete by id 

DELETE /api/workouts - delete all 

GET /api/users - get all users // POST not implemented yet

GET /api/goals - get all goals // POST not implemented yet

GET / - render index.html

GET /history - shows past workouts 
