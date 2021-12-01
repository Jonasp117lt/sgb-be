module.exports = (app, protectedRoutes,) => {
    const returns = require("../controllers/return.controller.js")

    let router = require('express').Router();

    //Crear una nueva devolución
    router.post("/:loanId", returns.create);

    //Obtener todas las devoluciones de un cliente
    router.get("/:customerId", returns.findAllByCustomer);

    app.use('/api/returns', protectedRoutes, router);
}