const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// This will hold the tasks in the api
let tasks = [];

app.use(bodyParser.json());

// Fetch all tasks endpoint
app.get('/tasks', (req, res) => {
    let filteredTasks = tasks;

    //Start by checking for optional filter by completed
    if (req.query.completed !== undefined) {
        const isCompleted = req.query.completed === true;
        filteredTasks = filteredTasks.filter(task => task.completed === isCompleted)
    }
});