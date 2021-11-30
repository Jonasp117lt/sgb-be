const Sequelize = require("sequelize");

module.exports = (sequelize_config) => {
    const Customer = sequelize_config.define("customer", {
        has_books: {
            type: Sequelize.BOOLEAN
        },
        debt: {
            type: Sequelize.FLOAT
        },
    });
    return Customer;
};