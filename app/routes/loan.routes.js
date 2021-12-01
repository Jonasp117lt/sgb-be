module.exports = (app, protectedRoutes,) => {
    const loans = require("../controllers/loan.controller.js")

    let router = require('express').Router();

    //Crear un nuevo préstamo
    router.post("/:customerId", loans.create);

    //Obtener todos los préstamos
    router.get("/", loans.findAll);

    // //Obtener un solo préstamo
    router.get("/:id", loans.findOne);

    app.use('/api/loans', protectedRoutes, router);
}