const Sequelize = require("sequelize");

module.exports = (sequelize_config) => {
    const Book = sequelize_config.define("book", {
      name: {
        type: Sequelize.STRING
      },
      author: {
        type: Sequelize.STRING
      },
      edition: {
        type: Sequelize.STRING
      },
      editorial: {
        type: Sequelize.STRING
      },
      inventory: {
        type: Sequelize.INTEGER
      },
      inventory_total: {
        type: Sequelize.INTEGER
      },
    });
  
    return Book;
  };