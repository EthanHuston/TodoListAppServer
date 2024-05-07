const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// This will hold the tasks in the api
let tasks = [
    {
        id: uuidv4(),
        taskDescription: "Sample Task 1",
        createdDate: new Date().toString(),
        dueDate: new Date(Date.now() + 86400000).toString(), // Tomorrow
        completed: false
    },
    {
        id: uuidv4(),
        taskDescription: "Sample Task 2",
        createdDate: new Date().toString(),
        dueDate: new Date(Date.now() + 2 * 86400000).toString(), // Day after tomorrow
        completed: true
    },
    {
        id: uuidv4(),
        taskDescription: "Sample Task 3",
        createdDate: new Date().toString(),
        dueDate: new Date(Date.now() + 3 * 86400000).toString(), // Day after the day after tomorrow
        completed: false
    }
];

app.use(bodyParser.json());

// Fetch all tasks endpoint
app.get('/tasks', (req, res) => {
    let filteredTasks = tasks;

    //Start by checking for optional filter by completed
    if (req.query.completed !== undefined) {
        const isCompleted = req.query.completed === true;
        filteredTasks = filteredTasks.filter(task => task.completed === isCompleted);
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

//Fetch specific task endpoint
app.get('/tasks/:id', (req, res) => {
    //Check for task, return error if not found, otherwise return task.
    const taskToGet = tasks.find(task => task.id === req.params.id);
    if(!taskToGet) {
        return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
});

//Create a task endpoint
app.post('/tasks', (req, res) => {
    //Extract the posted task, creating server-side information
    const {taskDescription, dueDate, completed} = req.body;
    const newTask = {
        id: uuidv4(),
        taskDescription,
        createdDate: new Date().toString(),
        dueDate,
        completed
    };

    //Add task to "database" and send correct code.
    tasks.push(newTask);
    res.status(201).json(newTask);
});

//Update a task endpoint
app.put('/tasks/:id', (req, res) => {
    //Look for task, return error if not found
    const taskIndex = tasks.findIndex(task => task.id === req.params.id);
    if(taskIndex === -1) {
        return res.status(404).json({message: "Task not found!"});
    }

    //Extract new task data and replace, throw error if changing immutable member
    const { id, createdDate, taskDescription, dueDate, completed} = req.body;
    if ( id !== tasks[taskIndex].id || createdDate !== tasks[taskIndex].createdDate) {
        return res.status(404).json({message: "Attempted to change immutable value!"});
    }
    tasks[taskIndex] = {id, createdDate, taskDescription, dueDate, completed};

    //Return result
    res.json(tasks[taskIndex]);
});


//Delete task endpoint
app.delete('/tasks/:id', (req, res) => {
    //Check that task exists, return error if not found
    const taskIndex = tasks.findIndex(task => task.id === req.params.id);
    if(taskIndex === -1) {
        return res.status(404).json({message: "Task not found!"});
    }

    tasks.splice(taskIndex, 1);
    res.json({message: ""});
});

app.listen(PORT, () => {
    console.log("Server running on port ${PORT}");
});