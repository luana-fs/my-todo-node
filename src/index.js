const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];
console.log(users)
function checksExistsUserAccount(request, response, next) {
  const {username} = request.headers

  const user = users.find((user) => user.username === username)

  if(!user) {
    response.status(404).send({message: "Usuário não existe."})
  }

  request.user = user
  next()
}

app.post('/users', (request, response) => {
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
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
const {user} = request

response.status(200).send({tarefas: user.todos})
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
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

});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
   const {title, deadline} = request.body
   const {id} = request.params
   const {user} = request

   const task = user.todos.find((task) => task.id === id)
   task.title = title
   task.deadline = deadline
   console.log(task)

   response.status(200).send({user})
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;

// app.listen(3333, () => console.log("Deu certo"))