const Sequelize = require("sequelize");

module.exports = (sequelize_config) => {
    const Employee = sequelize_config.define("employee", {
        username: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        },
    });
    return Employee;
};