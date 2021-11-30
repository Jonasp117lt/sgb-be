const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const associations = require("./associations");

const sequelize_config = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: 0,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize_config;

db.books = require("./book.model.js")(sequelize_config);
db.persons = require("./person.model.js")(sequelize_config);
db.customers = require("./customer.model.js")(sequelize_config);
db.employees = require("./employee.model.js")(sequelize_config);
db.loans = require("./loan.model.js")(sequelize_config);
db.emails = require("./email.model.js")(sequelize_config);
db.returns = require("./return.model.js")(sequelize_config);
db.loanbooks = require("./loanbook.model.js")(sequelize_config);
associations(db)


module.exports = db;