const express = require("express"); // import express
require("dotenv").config(); // import dotenv
const app = express(); // tạo server

const systemConfig = require("./config/system");

const route = require("./route/client/index.route"); // import route
const routeAdmin = require("./route/admin/index.route"); // import route


const database = require("./config/database"); //import database
database.connect(); //gọi tới hàm connect trong file database.js

//config views engine
app.set("views", "./views"); //đường dẫn tới thư mục views
app.set("view engine", "ejs"); //đặt engine views là ejs

// App local variable. Tạo biến local để sử dụng trong các file views
app.locals.prefixAdmin = systemConfig.prefixAdmin;

app.use(express.static("public")); //đường dẫn tới thư mục public

//config route
// route: đường dẫn tới file index.route.js
route(app); //gọi hàm route và truyền vào app
routeAdmin(app); //gọi hàm route và truyền vào app


//config port
const port = process.env.PORT || 3000;
console.log("Loaded env:", process.env.PORT); //giải thích: hiển thị port

//start server
app.listen(port, () => {
    console.log(`App listening on port: ${port}`); //giải thích: hiển thị port
});