const Sequelize = require("sequelize");

module.exports = (sequelize_config) => {
    const Return = sequelize_config.define("return", {
        payment: {
            type: Sequelize.FLOAT
        },
        date: {
            type: Sequelize.DATE
        },
    });

    return Return;
};