const express = require("express");
const cors = require("cors");
const config = require("./app/config/config")
const jwt = require("jsonwebtoken")
const auth = require("./app/middleware/auth")

const app = express();
app.set('key', config.key)

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to sgb application." });
});

const db = require("./app/models");
db.sequelize.sync();

const protectedRoutes = auth(app)

require("./app/routes/book.routes")(app, protectedRoutes);
require("./app/routes/customer.routes")(app, protectedRoutes);
require("./app/routes/loan.routes")(app, protectedRoutes);
require("./app/routes/return.routes")(app, protectedRoutes);
require("./app/routes/employee.routes")(app, protectedRoutes);


// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});