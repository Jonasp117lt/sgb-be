module.exports = (db) => {
    //Models that have a person
    db.persons.hasOne(db.employees)
    db.persons.hasOne(db.customers)
    db.employees.belongsTo(db.persons)
    db.customers.belongsTo(db.persons)

    //Models that have books
    db.books.belongsToMany(db.loans, { through: db.loanbooks })
    db.loans.belongsToMany(db.books, { through: db.loanbooks })

    //Models that have a customer
    db.customers.hasMany(db.loans)
    db.loans.belongsTo(db.customers)

    //Models that have a loan
    db.loans.hasMany(db.emails)
    db.emails.belongsTo(db.loans)

    db.loans.hasMany(db.returns)
    db.returns.belongsTo(db.loans)
};