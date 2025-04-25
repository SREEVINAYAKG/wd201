const http = require("http");
const fs=require("fs");
const minimist = require("minimist");
const args = minimist(process.argv.slice(2));
const port = args.port;

let homeContent = "";
let projectContent = "";
let regContent=""

fs.readFile("home.html", (err, home) => {
  if (err) {
    throw err;
  }
  homeContent = home;
});

fs.readFile("project.html", (err, project) => {
  if (err) {
    throw err;
  }
  projectContent = project;
});
fs.readFile("registration.html",(err, registration)=>{
    if(err){
        throw err;
    }
    regContent=registration;
})

http
  .createServer((request, response) => {
    let url = request.url;
    response.writeHeader(200, { "Content-Type": "text/html" });
    switch (url) {
      case "/project":
        response.write(projectContent);
        response.end();
        break;
      case "/registration":
        response.write(regContent);
        response.end();
        break;
      default:
        response.write(homeContent);
        response.end();
        break;
    }
  })
  .listen(port);






// fs.readFile("home.html", (err, home) => {
//     if (err) {
//       throw err;
//     }
//     http
//       .createServer((request, response) => {
//         response.writeHeader(200, { "Content-Type": "text/html" });
//         response.write(home);
//         response.end();
//       })
//       .listen(3000);
//   });



// const server = http.createServer((req,res)=>{
//     const stream = fs.createReadStream("sample.txt");
//     stream.pipe(res);

//     // fs.readFile("sample.txt",(err,data)=>{
//     //     res.end(data);
//     // })
// });
// server.listen(3000);