const fs = require("fs");
const http = require("http");
const url = require("url");

// // blocking synchronous way
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// // console.log(textIn);
// const textOut = `this is editng avocato: ${textIn} and created on ${Date.now()}`;
// fs.writeFileSync("./txt/output.txt", textOut);
// // console.log("file written", textOut);

// //non blocking asynchronous way uncomplete code
// fs.readFile("./txt/start.txt", "utf-8", (err, data) => {
//   console.log(data);
// });

// console.log("this code will be first");

/////////////
// server

// readfile will be executed once and will be distributed when its needed
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObject = JSON.parse(data);
console.log(dataObject);

const server = http.createServer((req, res) => {
  const pathName = req.url;

  if (pathName === "/" || pathName === "/overview") {
    res.end("this is the overview");
  } else if (pathName === "/product") {
    res.end("this is product page");
  } else if (pathName === "/api") {
    // it isn't preferred way because it will read file on every server creation call which is not a good practice
    // fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8", (err, data) => {
    //   const dataObject = JSON.parse(data);
    // });
    res.writeHead(200, { "Content-type": "application/json" });
    // sending JSON to  browser
    res.end(data);
  } else {
    // headers always need to send before sending response
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-header": "headerr",
    });
    res.end(" <h1> this is wrong route </h1>");
  }
});

server.listen(5000, () => {
  console.log("server listening to port 5000");
});
