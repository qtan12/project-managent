const express = require("express"); // import express
require("dotenv").config(); // import dotenv
const app = express(); // tạo server

const route = require("./route/client/index.route"); // import route

const database = require("./config/database"); //import database
database.connect(); //gọi tới hàm connect trong file database.js
//config views engine
app.set("views", "./views"); //đường dẫn tới thư mục views
app.set("view engine", "ejs"); //đặt engine views là ejs

app.use(express.static("public")); //đường dẫn tới thư mục public
//config route
// route: đường dẫn tới file index.route.js
route(app); //gọi hàm route và truyền vào app

//config port
const port = process.env.PORT ;
console.log("Loaded env:", process.env.PORT); //giải thích: hiển thị port

//start server
app.listen(port, () => {
    console.log(`App listening on port: ${port}`); //giải thích: hiển thị port
});