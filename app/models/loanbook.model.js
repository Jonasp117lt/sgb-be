const Sequelize = require("sequelize");

module.exports = (sequelize_config) => {
    const LoanBook = sequelize_config.define("loanbook", {});
    return LoanBook;
};