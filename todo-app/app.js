const express = require("express");
var csrf = require("tiny-csrf");

const app = express();
const { Todo,User } = require("./models");
const bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
const path = require("path");

const passport = require("passport");
const connectEnsureLogin = require("connect-ensure-login");
const session = require("express-session");
const flash = require("connect-flash");
const localStrategy = require("passport-local");

const bcrypt = require('bcrypt');
const saltRounds = 10;

app.use(bodyParser.json());
app.use(express.urlencoded({extended:false}))
app.use(express.json());
app.use(cookieParser('shh! some secret thing'))
app.use(csrf("this_should_be_32_character_long", ["POST", "PUT", "DELETE"]));

app.use(express.static(path.join(__dirname,"public")));
app.set("view engine","ejs");
app.set("views", path.join(__dirname, "views"));

passport.serializeUser((user,done)=>{
  console.log("Serializing user in session",user.id);
  done(null,user.id)
})

passport.deserializeUser((id,done)=>{
  User.findByPk(id)
  .then(user=>{
    done(null,user)
  }).catch(error=>{
    done(error,null)
  })

})

app.use(session({
  secret:"my-super-secret-key-21728176152478952",
  cookie:{
    maxAge:24*60*60*1000
  }
}))



app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(function(request, response, next) {
    response.locals.messages = request.flash();
    next();
});


passport.use(new localStrategy({
  usernameField:"email",
  passwordField:"password",
},(username,password,done)=>{
  // User.findOne({where:{email:username}})
  // .then(async(user)=>{
  //   const result = await bcrypt.compare(password,user.password);
  //   if (result){
  //     return done(null,user);
  //   }else{
  //     return done("invalid password");
  //   }
  // }).catch((error)=>{
  //   return (error)
  // })
  User.findOne({ where: { email: username } })
  .then(async function (user) {
    const result = await bcrypt.compare(password, user.password);
    if (result) {
      return done(null, user);
    } else {
      return done(null, false, { message: "Invalid password" });
    }
  })
  .catch((error) => {
    return done(error);
  });
}))


app.get("/", async function (request, response) {
  // response.send("Hello World");
    response.render('index',{
      title:"Todo application",
      csrfToken:request.csrfToken(),
    })
  }
);

app.get("/todos", connectEnsureLogin.ensureLoggedIn(), async function (request, response) {
  // response.send("Hello World");
  const loggedInUser = request.user.id;
  const allTodos = await Todo.getTodos(loggedInUser);
  if (request.accepts('html')){
    response.render('todos',{
      allTodos,
      csrfToken:request.csrfToken(),
      loggedInUser
      
    })
  }else{
    response.json({
      allTodos
    })
  }

})



app.get("/todos", async function (request, response) {
  console.log("Processing list of all Todos ...");
    const loggedInUser = request.user.id;
  // FILL IN YOUR CODE HERE
  try{
    const allTodos = await Todo.findAll({where:{userId:loggedInUser}});
    return response.json(allTodos);
  }catch(error){
    console.log(error);
    return response.status(422).json(error);
  }

});


app.get("/signup",(request,response)=>{
  response.render("signup",{title:"Sign Up",csrfToken:request.csrfToken()})
});

app.post("/users",async(request,response)=>{
    // console.log("firstName",request.body.firstName);
    if(request.body.firstName.length === 0){
      request.flash("error","Please enter a first name");
      return response.redirect("/signup");
    }
    if(request.body.email.length === 0){
      request.flash("error","Please enter a email");
      return response.redirect("/signup");
    }
    const hashedPwd = await bcrypt.hash(request.body.password,saltRounds);
    console.log(hashedPwd);
  try{
    const user=await User.create({
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      email: request.body.email,
      password: hashedPwd,
    });
    request.login(user,(err)=>{
      if(err){
        console.log(err);
      }else{
      console.log('successfully logged in');
      response.redirect("/todos");
      }
    })
  }catch(error){
    console.log(error);
  }

})

app.get("/login",(request,response)=>{
  response.render("login",{title:"Login",csrfToken:request.csrfToken()});
})

// app.post("/session",passport.authenticate('local',{failureRedirect:"/login"}),(request,response)=>{
//   console.log(request.user);
//   response.redirect("/todos");
// })
app.post(
  "/session",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  function (request, response) {
    console.log(request.user);
    response.redirect("/todos");
  }
);

app.get("/signout",(request,response,next)=>{
    request.logout((err)=>{
      if(err){return next(err)}
      response.redirect("/");
    })
})

app.post("/todos",  connectEnsureLogin.ensureLoggedIn(),async function (request, response) {
  if(request.body.title.length === 0){
    request.flash("error","Please enter a title");
    return response.redirect("/todos");
  }
  if(request.body.dueDate.length === 0){
    request.flash("error","Please enter a due date");
    return response.redirect("/todos");
  }
  try {
      const todo = await Todo.addTodo({
      title: request.body.title,
      dueDate: request.body.dueDate,
      userId: request.user.id,
    });
    // return response.redirect("/");
    if (request.accepts("html")) {
      return response.redirect("/todos");
    } else {
      return response.status(302).json(todo);
    }
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.put("/todos/:id", connectEnsureLogin.ensureLoggedIn(), async function (request, response) {
  console.log("We have to update a Todo with ID: ", request.params.id);
  const todo = await Todo.findByPk(request.params.id);
  if (!todo) {
    return response.status(404).json({ error: "Todo not found" });
  }
  try {
    const updatedTodo = await todo.setCompletionStatus(request.body.completed);
  if (request.accepts("html")) {
    return response.json(updatedTodo);
  }else{
    return response.status(302).json(updatedTodo);
  }
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});


app.delete("/todos/:id",  connectEnsureLogin.ensureLoggedIn(),async function (request, response) {
  console.log("We have to delete a Todo with ID: ", request.params.id);
  // FILL IN YOUR CODE HERE
    try{
        await Todo.remove(request.params.id,request.user.id);

        return response.json(true);
    }catch(error){
        // console.log(error);
        return response.status(402).json(error);  
    }

});

module.exports = app;




