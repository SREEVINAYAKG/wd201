// __tests__/todo.js
/* eslint-disable no-undef */
const db = require("../models");

describe("Todolist Test Suite", () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
  });

  test("Should add new todo", async () => {
    const todoItemsCount = await db.Todo.count();
    await db.Todo.addTask({
      title: "Test todo",
      completed: false,
      dueDate: new Date(),
    });
    const newTodoItemsCount = await db.Todo.count();
    expect(newTodoItemsCount).toBe(todoItemsCount + 1);
  });
});

// const todoList = require("../todo");

// const {
//   all,
//   markAsComplete,
//   add,
//   overdue,
//   dueToday,
//   dueLater,
//   toDisplayableList,
// } = todoList();

// const formattedDate = (d) => {
//   return d.toISOString().split("T")[0];
// };

// var dateToday = new Date();
// const today = formattedDate(dateToday);
// const yesterday = formattedDate(
//   new Date(new Date().setDate(dateToday.getDate() - 1)),
// );
// const tomorrow = formattedDate(
//   new Date(new Date().setDate(dateToday.getDate() + 1)),
// );

// describe("Todolist Test Suite", () => {
//   beforeAll(() => {
//     add({
//       title: "Test todo",
//       completed: false,
//       dueDate: today,
//     });
//   });

//   test("Should add new todo", () => {
//     const todoCount = all.length;
//     add({
//       title: "Test todo",
//       completed: false,
//       dueDate: today,
//     });
//     add({
//       title: "Test todo",
//       completed: false,
//       dueDate: yesterday,
//     });
//     add({
//       title: "Test todo",
//       completed: false,
//       dueDate: tomorrow,
//     });

//     expect(all.length).toBe(todoCount + 3);
//   });
//   test("Should mark a todo as complete", () => {
//     expect(all[0].completed).toBe(false);
//     markAsComplete(0);
//     expect(all[0].completed).toBe(true);
//   });
//   test("retrieval of overdue items", () => {
//     const overdueItems = overdue();
//     expect(overdueItems.length).toBe(1);
//   });
//   test("retrieval of due today items", () => {
//     const dueTodayItems = dueToday();
//     expect(dueTodayItems.length).toBe(2);
//   });
//   test("retrieval of due later items", () => {
//     const dueLaterItems = dueLater();
//     expect(dueLaterItems.length).toBe(1);
//   });
// });
