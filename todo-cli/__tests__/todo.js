const todoList = require("../todo");

const {
  all,
  markAsComplete,
  add,
  overdue,
  dueToday,
  dueLater,
  toDisplayableList,
} = todoList();

describe("Todolist Test Suite", () => {
  beforeAll(() => {
    add({
      title: "Test todo",
      completed: false,
      dueDate: new Date().toISOString().slice(0, 10),
    });
  });

  test("Should add new todo", () => {
    const todoCount = all.length;
    add({
      title: "Test todo",
      completed: false,
      dueDate: new Date().toISOString().slice(0, 10),
    });
    expect(all.length).toBe(todoCount + 1);
  });
  test("Should mark a todo as complete", () => {
    expect(all[0].completed).toBe(false);
    markAsComplete(0);
    expect(all[0].completed).toBe(true);
  });
  test("retrieval of overdue items", () => {
    const overdueItems = overdue();
    expect(overdueItems.length).toBe(0);
  });
  test("retrieval of due today items", () => {
    const dueTodayItems = dueToday();
    expect(dueTodayItems.length).toBe(2);
  });
  test("retrieval of due later items", () => {
    const dueLaterItems = dueLater();
    expect(dueLaterItems.length).toBe(0);
  });
});
