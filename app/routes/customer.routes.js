module.exports = app => {
    const customers = require("../controllers/customer.controller.js")

    let router = require('express').Router();

    //Crear un nuevo cliente
    router.post("/", customers.create);

    //Obtener todos los clientes
    router.get("/", customers.findAll);

    //Obtener un solo cliente
    router.get("/:id", customers.findOne);

    // // Update a Book with id
    // router.put("/:id", books.update);

    //Eliminar un cliente
    router.delete("/:id", customers.delete);

    app.use('/api/customers', router);
}