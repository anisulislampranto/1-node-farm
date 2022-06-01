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

const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product?.productName);
  output = output.replace(/{%IMAGE%}/g, product?.image);
  output = output.replace(/{%COUNTRY%}/g, product?.country);
  output = output.replace(/{%PRICE%}/g, product?.price);
  output = output.replace(/{%ID%}/g, product?.id);

  if (!product.organic) {
    return (output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic"));
  }

  return output;
};

// readfile will be executed once because the file is alwasy same and will be distributed when its needed
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObject = JSON.parse(data);

/////////////
// server

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // overview page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });

    const cardsHtml = dataObject
      .map((product) => replaceTemplate(tempCard, product))
      .join("");
    const output = tempOverview.replace(/{%PRODUCT_CARD%}/g, cardsHtml);
    // console.log(cardsHtml);

    res.end(output);
  }

  // product page
  else if (pathname === "/product") {
    res.writeHead(200, { "Content-type": "text/html" });
    const product = dataObject[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
  }

  //API
  else if (pathname === "/api") {
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
