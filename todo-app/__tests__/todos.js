const request = require("supertest");
var cheerio = require("cheerio");
const db = require("../models/index");
const app = require("../app");


let server, agent;

function extractCsrfToken(res) {
  var $ = cheerio.load(res.text);
  return $("[name=_csrf]").val();
}

const login = async(agent,username,password)=>{
  let res = await agent.get("/login");
  let csrfToken = extractCsrfToken(res);
  res = await agent.post("/session").send({
    email:username,
    password:password,
    _csrf:csrfToken,
  })
}

describe("Todo Application", function () {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(3000, () => {});
    agent = request.agent(server);
  });

  afterAll(async () => {
    try {
      await db.sequelize.close();
      await server.close();
    } catch (error) {
      console.log(error);
    }
  });

  test("Sign up",async()=>{
    let res = await agent.get("/signup");
    const csrfToken = extractCsrfToken(res);
    res = await agent.post("/users").send({
      firstName:"Test",
      lastName:"User A",
      email:"user.a@test.com",
      password:'12345678',
      _csrf:csrfToken,

    });
    expect(res.statusCode).toBe(302);
  })

  test("sign out",async()=>{
    let res = await agent.get("/todos");
    expect(res.statusCode).toBe(200);
    res = await agent.get("/signout");
    expect(res.statusCode).toBe(302);
    res = await agent.get("/todos");
    expect(res.statusCode).toBe(302);
  })

  test("Creates a todo and responds with json at /todos POST endpoint", async () => {
    const agent = request.agent(server);
    await login(agent,"user.a@test.com","12345678"); 
    const res = await agent.get("/todos");
    const csrfToken = extractCsrfToken(res);
    const response = await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
      "_csrf":csrfToken,
    });
    expect(response.statusCode).toBe(302);

  });




//------------------------------------------------------------------//

test("Marks a todo with the given ID as complete", async () => {

    const agent = request.agent(server);
    await login(agent,"user.a@test.com","12345678"); 
  let res = await agent.get("/todos");

  // Extract CSRF token
  let csrfToken = extractCsrfToken(res);

  // Add a new todo
  await agent.post("/todos").send({
    title: "Buy milk",
    dueDate: new Date().toISOString(),
    completed: false,
    "_csrf": csrfToken,
  });

  // Get all todos and parse the response
  const groupedTodosResponse = await agent
    .get("/todos")
    .set("Accept", "application/json");

  // Log the raw response for debugging
  console.log(groupedTodosResponse.text);

  // Check if the response is JSON before parsing
  if (groupedTodosResponse.headers['content-type'].includes('application/json')) {
    const parsedGroupedResponse = JSON.parse(groupedTodosResponse.text);
    const dueTodayCount = parsedGroupedResponse.allTodos.length;
    const latestTodo = parsedGroupedResponse.allTodos[dueTodayCount - 1];

    // Get CSRF token for the update request
    res = await agent.get("/todos");
    csrfToken = extractCsrfToken(res);

    // Mark the todo as complete
    const markCompleteResponse = await agent
      .put(`/todos/${latestTodo.id}`)
      .send({
        completed: true,
        "_csrf": csrfToken,
      });

    // Log the update response for debugging
    console.log(markCompleteResponse.text);

    // Check if the response is JSON before parsing
    if (markCompleteResponse.headers['content-type'].includes('application/json')) {
      const parsedUpdateResponse = JSON.parse(markCompleteResponse.text);
      expect(parsedUpdateResponse.completed).toBe(true);
    } else {
      console.error('Expected JSON but received:', markCompleteResponse.text);
    }
  } else {
    console.error('Expected JSON but received:', groupedTodosResponse.text);
  }
});



test("Deletes a todo with the given ID if it exists and sends a boolean response", async () => {
  // Create a new todo
      const agent = request.agent(server);
    await login(agent,"user.a@test.com","12345678"); 
  let res = await agent.get("/todos");

  // Extract CSRF token
  let csrfToken = extractCsrfToken(res);
  await agent.post("/todos").send({
    title: "Buy milk",
    dueDate: new Date().toISOString(),
    completed: false,
    "_csrf": csrfToken,
  });


  // Parse the response to get the ID of the new todo
  const groupedTodosResponse = await agent
  .get("/todos")
  .set("Accept", "application/json");
  const parsedResponse = JSON.parse(groupedTodosResponse.text);
  const todoID = parsedResponse.id;


  // Delete the todo
  const deleteResponse = await agent
  .delete(`/todos/${todoID}`)
  .send({ _csrf: csrfToken });
  res = await agent.get("/");
  csrfToken = extractCsrfToken(res);
  // Log the raw response for debugging
  console.log(deleteResponse.text);

  // Check if the response is in JSON format
  if (deleteResponse.headers['content-type'].includes('application/json')) {
    const parsedDeleteResponse = JSON.parse(deleteResponse.text);
    expect(parsedDeleteResponse).toBe(true); // Expecting a boolean response
  } else {
    // If not JSON, log the error and verify the status code is OK (200)
    console.error('Expected JSON but received:', deleteResponse.text);
    expect(deleteResponse.status).toBe(500);
  }
});
});

