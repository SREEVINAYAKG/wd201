const express = require("express");
const app = express();
const { Todo } = require("./models");
const bodyParser = require("body-parser");
const path = require("path")
app.use(bodyParser.json());
app.use(express.urlencoded({extended:false}))

app.set("view engine","ejs");

app.get("/", async function (request, response) {
  // response.send("Hello World");
  const allTodos = await Todo.getTodos();
  if (request.accepts('html')){
    response.render('index',{
      allTodos
    })
  }else{
    response.json({
      allTodos
    })
  }

});

app.use(express.static(path.join(__dirname,"public")));

app.get("/todos", async function (request, response) {
  console.log("Processing list of all Todos ...");
  // FILL IN YOUR CODE HERE
  try{
    const allTodos = await Todo.findAll();
    return response.json(allTodos);
  }catch(error){
    console.log(error);
    return response.status(422).json(error);
  }
  // First, we have to query our PostgerSQL database using Sequelize to get list of all Todos.
  // Then, we have to respond with all Todos, like:
  // response.send(todos)
});

app.get("/todos/:id", async function (request, response) {
  try {
    const todo = await Todo.findByPk(request.params.id);
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.post("/todos", async function (request, response) {
  try {
    const todo = await Todo.addTodo({
      title: request.body.title,
      dueDate: request.body.dueDate,
    });
    return response.redirect("/");
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.put("/todos/:id/markAsCompleted", async function (request, response) {
  const todo = await Todo.findByPk(request.params.id);
  try {
    const updatedTodo = await todo.markAsCompleted();
    return response.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.delete("/todos/:id", async function (request, response) {
  console.log("We have to delete a Todo with ID: ", request.params.id);
  // FILL IN YOUR CODE HERE
    try{
        const deletedCount = await Todo.destroy({
            where:{
                id: request.params.id,
            },
        })
        return response.json(deletedCount > 0);
    }catch(error){
        // console.log(error);
        return response.json(false);  
    }
  // First, we have to query our database to delete a Todo by ID.
  // Then, we have to respond back with true/false based on whether the Todo was deleted or not.
  // response.send(true)
});

module.exports = app;






// // const {request,response} = require('express')
// const express = require("express");
// const app = express();
// const bodyParser = require("body-parser");
// app.use(bodyParser.json());

// const { Todo } = require("./models");

// // eslint-disable-next-line no-unused-vars
// app.get("/todos", (request, response) => {
//   // response.send("hello world");
//   console.log("Todo list");
// });

// app.post("/todos", async (request, response) => {
//   console.log("Creating a todo", request.body);
//   try {
//     const todo = await Todo.addTodo({
//       title: request.body.title,
//       dueDate: request.body.dueDate,
//       completed: false,
//     });
//     return response.json(todo);
//   } catch (error) {
//     console.log(error);
//     response.status(422).json(error);
//   }
// });

// app.put("/todos/:id/markAsCompleted", async (request, response) => {
//   console.log("We have to update a todo with ID:", request.params.id);
//   const todo = await Todo.findByPk(request.params.id);
//   try {
//     const updatedTodo = await todo.markAsCompleted();
//     return response.json(updatedTodo);
//   } catch (error) {
//     console.log(error);
//     response.status(422).json(error);
//   }
// });

// // eslint-disable-next-line no-unused-vars
// app.delete("/todos/:id", (request, response) => {
//   console.log("Delete a todo by ID: ", request.params.id);
// });

// module.exports = app;
