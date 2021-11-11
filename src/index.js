const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const res = require('express/lib/response');

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

  // res.status(201).send(newUser)
  response.status(201).send({newUser})
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
// const {username} = request.headers
const {user} = request
// const result = users.find((user) => user.username === username)

response.status(200).send({tarefas: user.todos})
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;

// app.listen(3333, () => console.log("Deu certo"))