const Sequelize = require("sequelize");

module.exports = (sequelize_config) => {
    const Return = sequelize_config.define("return", {
        book_num: {
            type: Sequelize.INTEGER
        },
        payment: {
            type: Sequelize.FLOAT
        },
        date: {
            type: Sequelize.DATE
        },
    });

    return Return;
};