module.exports = {
  HOST: "localhost",
  USER: "jon",
  PASSWORD: "jon",
  DB: "biblioteca",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};