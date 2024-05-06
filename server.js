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
        filteredTasks = filteredTasks.filter(task => task.completed === isCompleted);
    } else {
        return res.status(404).json({ message: 'Invalid request!' });
    }

    //Filter by duedate / created date if specified.
    if (req.query.sort_by) {
        const sortBy = req.query.sort_by.slice(1); // Remove the + or -, leaving dueDate or createdDate
        const sortDirection = req.query.sort_by.charAt(0) === '-' ? -1 : 1 //Set the sorting direction based on + or -
        //Sort tasks by the correct date and in the correct direction
        filteredTasks.sort((a,b) => sortDirection * (new Date(a[sortBy]) - new Date(b[sortBy])));
    }

    //Return our resulting filtered tasks.
    res.json(filteredTasks);
});