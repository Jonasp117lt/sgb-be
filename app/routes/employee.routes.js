module.exports = (app, protectedRoutes) => {
    const employees = require("../controllers/employee.controller.js")

    let router = require('express').Router();

    //Crear un nuevo usuario
    router.post("/", employees.create);

    //Obtener todos los usuarios
    // router.get("/", employees.findAll);

    //Obtener un solo usuario
    router.get("/:id", employees.findOne);

    // // Update a Book with id
    router.put("/:id", employees.update);

    //Eliminar un usuario
    router.delete("/:id", employees.delete);

    app.use('/api/employees', protectedRoutes, router);
}