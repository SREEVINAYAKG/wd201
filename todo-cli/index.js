const { connect } = require("./connectDB.js");
const Todo = require("./TodoModel.js");

const createTodo = async () => {
  try {
    await connect();
    const todo = await Todo.addTask({
      title: "Second item",
      dueDate: new Date(),
      completed: false,
    });
    console.log(`Created todo with id: ${todo.id}`);
  } catch (err) {
    console.log(err);
  }
};

const countItems = async () => {
  try {
    const totalCount = await Todo.count();
    console.log(`Found ${totalCount} items in the table!`);
  } catch (err) {
    console.log(err);
  }
};

const getAllTodos = async () => {
  try {
    const todos = await Todo.findAll();
    const todoList = todos.map((todo) => todo.displayableString()).join("\n");
    console.log(todoList);
  } catch (err) {
    connsole.log(err);
  }
};
const getSingleTodo = async () => {
  try {
    const todo = await Todo.findOne({
      where: {
        completed: false,
      },
      order: [["id", "DESC"]],
    });
    console.log(todo.displayableString());
  } catch (err) {
    connsole.log(err);
  }
};

const updateItem = async (id) => {
  try {
    await Todo.update(
      { completed: true },
      {
        where: {
          id: id,
        },
      },
    );
  } catch (err) {
    console.log(err);
  }
};

const deleteItem = async (id) => {
  try {
    const deletedRowCount = await Todo.destroy({
      where: {
        id: id,
      },
    });
    console.log(`Deleted ${deletedRowCount} items!`);
  } catch (err) {
    console.log(err);
  }
};

(async () => {
  // await createTodo();
  // await countItems();
  await getAllTodos();
  // await updateItem(2);
  await deleteItem(2);
  await getAllTodos();
})();
