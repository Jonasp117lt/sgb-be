const Sequelize = require("sequelize");

module.exports = (sequelize_config) => {
    const Email = sequelize_config.define("email", {
        send_date: {
            type: Sequelize.DATE
        },
    });
    return Email;
};