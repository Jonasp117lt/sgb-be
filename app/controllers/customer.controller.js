const db = require("../models");
const Customer = db.customers;
const Person = db.persons;

const requiredPersonFields = [
    { key: 'name', name: 'Nombre' },
    { key: 'lastname', name: 'Apellido' },
    { key: 'email', name: 'Correo Electrónico' },
    { key: 'phone', name: 'Teléfono' },
]

//Crear y guardar un nuevo cliente
exports.create = async (req, res, next) => {
    //Registrar primero a la persona
    try {
        const missingFields = []
        requiredPersonFields.map(field => {
            if (!(req.body.person || {})[field.key]) {
                missingFields.push(field.name)
            }
        })

        if (missingFields.length) {
            res.status(400).send({
                message: `Faltan los siguientes campos: ${missingFields.join(', ')}`, err
            });
            return
        }
        const { person = {} } = req.body
        const customer = {
            has_books: false,
            debt: 0,
            person: {
                name: person.name,
                lastname: person.lastname,
                email: person.email,
                phone: person.phone,
                address: person.address,
            },
        }
        const data = await Customer.create(customer, { include: Person })
        res.send({ customer: data, success: true })
    } catch (err) {
        res.status(500).send({
            message:
                err.message || "Ocurrió un error al intentar registrar el cliente"
        });
        next(err)
    }

    return
};

// Trae todos los clientes de la base de datos
exports.findAll = async (req, res, next) => {
    try {
        const data = await Customer.findAll({ include: Person })
        res.send({ customers: data, success: true })
    }
    catch (err) {
        res.status(500).send({
            message:
                err.message || "Ocurrió un error al intentar ver los clientes"
        });
        next(err)
    }
    return
};

//Encuentra un cliente usando su id como referencia
exports.findOne = async (req, res, next) => {
    try {
        const id = req.params.id
        const data = await Customer.findByPk(id, { include: Person })
        if (data) res.send({ customer: data, success: true })
        else {
            res.status(404).send({
                message: `No se encontró el cliente con id: ${id}`
            });
        }
    } catch (err) {
        res.status(404).send({
            message: err.message || "Ocurrió un error al intentar ver el cliente"
        });
        next(err)
    }
    return
};

//Actualizar el cliente usando su id como referencia
exports.update = async (req, res) => {
    const id = req.params.id
    try {
        const currentCustomer = await Customer.findByPk(id, { include: Person })
        await Person.update(req.body.person, { where: { id: currentCustomer.personId } })
        await currentCustomer.update(req.body, { where: { id } })
        res.send({ customer: currentCustomer, success: true })
    } catch (err) {
        res.status(500).send({
            message: `Ocurrió un error al intentar actualizar el libro con id: ${id}`, log: err.message
        })
    }
};

// Elimina un cliente usando su id como referencia
exports.delete = async (req, res, next) => {
    const id = req.params.id
    try {
        const num = await Customer.destroy({ where: { id } })
        if (num == 1) res.send({ message: 'El cliente fue eliminado correctamente', success: true })
        else res.send({ message: `No se pudo eliminar el cliente con id: ${id}` })
    } catch (err) {
        res.send({ message: `Ocurrió un error al intentar eliminar el cliente con id: ${id}` })
        next(err)
    }
    return
};