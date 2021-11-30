const Sequelize = require("sequelize");

module.exports = (sequelize_config) => {
    const Loan = sequelize_config.define("loan", {
        book_num: {
            type: Sequelize.INTEGER
        },
        start_date: {
            type: Sequelize.DATE
        },
        end_date: {
            type: Sequelize.DATE
        },
        active: {
            type: Sequelize.BOOLEAN
        },
        debt: {
            type: Sequelize.FLOAT
        },
    });

    return Loan;
};