const express = require("express");
require("dotenv").config();
const app = express();

const route = require("./route/client/index.route");

app.set("views", "./views");
app.set("view engine", "ejs");

// route
route(app)

const port = process.env.PORT ;
console.log("Loaded env:", process.env.PORT);

app.listen(port, () => {
    console.log(`App listening on port: ${port}`);
})