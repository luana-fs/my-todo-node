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
      response.status(400).send({message: "Usuário não existe."})
    }

    request.user = user
    return next()
  } catch (err) {
    response.status(500).send(err.message)
  }
}

app.post('/users', (request, response) => {
  try {
    const {name, username} = request.body

    const id = uuidv4()
  
    const newUser = {
      id,
      name,
      username,
      todos: []
    }
  
    users.push(newUser)
  
    response.status(201).send({newUser})
    console.log(response.body)
  } catch (err) {
    response.json(err.message)
  }
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  try {
    const {user} = request

  response.status(200).send({tarefas: user.todos})
  } catch (err) {
    response.json(err.message)
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
  
    response.status(201).send({user})
  } catch(err) {
    response.json(err.message)
  }

});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  try {
    const {title, deadline} = request.body
    const {id} = request.params
    const {user} = request
 
    const task = user.todos.find((task) => task.id === id)
    task.title = title
    task.deadline = deadline
 
    response.status(200).send({user})
  } catch(err) {
    response.json(err.message)
  }
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  try {
    const {user} = request
    const {id} = request.params
  
    const task = user.todos.find((task) => task.id === id)
    task.done = true
    
    response.status(200).send({"Tarefa alterada com sucesso!": task})
  } catch (err) {
    response.json(err.message)
  }

});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  try {
    const {user} = request
    const {id} = request.params
    
    const newTaskList = user.todos.filter((task) => task.id !== id)
    user.todos = newTaskList
  
    response.status(200).send({"Tarefa deletada com sucesso!": user})
  } catch (err) {
    response.json(err.message)
  }
  
});

module.exports = app;
