const Sequelize = require("sequelize");

module.exports = (sequelize_config) => {
    const Person = sequelize_config.define("person", {
        name: {
            type: Sequelize.STRING
        },
        lastname: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        phone: {
            type: Sequelize.STRING
        },
        address: {
            type: Sequelize.STRING
        },
    });

    return Person;
};