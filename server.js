const http = require("http");
var fs = require("fs");
const hostname = "127.0.0.1";
const port = 3000;

fs.readFile("./site.html", function (error, html) {
  server = http
    .createServer((req, res) => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html");
      res.write(html);
      res.end();
    })
    .listen(port, hostname, () => {
      console.log(`Server running at http://${hostname}:${port}/`);
    });
});
