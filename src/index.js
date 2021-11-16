const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];


function checksExistsUserAccount(request, response, next) {
  try {
    const {username} = request.headers

    const user = users.find((user) => user.username === username)

    if(!user) {
      return response.status(404).json({error: "Usuário não existe."})
    }

    request.user = user
    return next()
  } catch (err) {
    return response.status(500).json(err.message)
  }
}

app.post('/users', (request, response) => {
  try {
    const {name, username} = request.body
    // console.log(request.body)

    const id = uuidv4()

    const userExist = users.find((user) => user.username === username)

    if(userExist) {
      // console.log(response.body.error)
      return response.status(400).json({error: "Usuário já existe"})
    }
  
    const newUser = {
      id,
      name,
      username,
      todos: []
    }
  
    users.push(newUser)
    // console.log(response.body.id)
  
    return response.status(201).json(newUser)
  } catch (error) {
    return response.status(400).json(error.message)
  }
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  try {
    const {user} = request

  return response.status(200).json(user.todos)
  } catch (error) {
    return response.json(error.message)
  }
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  try {
    const {title, deadline} = request.body

    const id = uuidv4()
  
    const {user} = request
  
    const newTask = {
      id,
      title,
      done: false,
      deadline: new Date(deadline),
      created_at: Date.now()
    }
  
    user.todos.push(newTask)
  
    return response.status(201).json(newTask)
  } catch(err) {
    return response.json(err.message)
  }

});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  try {
    const {title, deadline} = request.body
    const {id} = request.params
    const {user} = request
  

    const task = user.todos.find((task) => task.id === id)

    if(!task) {
      return response.status(404).json({error: "Not found"})
    }

    task.title = title
    task.deadline = deadline
 
    return response.status(200).json(task)
  } catch(err) {
    return response.json(err.message)
  }
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  try {
    const {user} = request
    const {id} = request.params
  
    const task = user.todos.find((task) => task.id === id)

    if(!task) {
      return response.status(404).json({error: "Not found"})
    }

    task.done = true
    
    return response.status(200).json(task)
  } catch (err) {
    return response.json(err.message)
  }

});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  try {
    const {user} = request
    const {id} = request.params
    
    const task = user.todos.find((task) => task.id === id)

    if(!task) {
      return response.status(404).json({error: "Not found"})
    }
    
    const newTaskList = user.todos.filter((task) => task.id !== id)


    user.todos = newTaskList
  
    return response.status(204).json({"Tarefa deletada com sucesso!": user})
  } catch (err) {
    return response.json(err.message)
  }
  
});

module.exports = app;
