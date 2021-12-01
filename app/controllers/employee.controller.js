const db = require("../models");
const Employee = db.employees;
const Person = db.persons;

const requiredPersonFields = [
    { key: 'name', name: 'Nombre' },
    { key: 'lastname', name: 'Apellido' },
    { key: 'email', name: 'Correo Electrónico' },
    { key: 'phone', name: 'Teléfono' },
]

const requiredFields = [
    { key: 'username', name: 'Nombre de usuario' },
    { key: 'password', name: 'Contraseña' },
    { key: 'confirm_password', name: 'Contraseña repetida' },

]

//Crear y guardar un nuevo cliente
exports.create = async (req, res, next) => {
    //Registrar primero a la persona
    try {
        const missingFields = []
        requiredPersonFields.forEach(field => {
            if (!(req.body.person || {})[field.key]) {
                missingFields.push(field.name)
            }
        })
        requiredFields.forEach(field => {
            if (!(req.person || {})[field.key]) {
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
        const employee = {
            username: req.body.username,
            password: req.body.password,
            person: {
                name: person.name,
                lastname: person.lastname,
                email: person.email,
                phone: person.phone,
                address: person.address,
            },
        }
        const data = await Employee.create(employee, { include: Person })
        res.send({ employee: data, success: true })
    } catch (err) {
        res.status(500).send({
            message:
                err.message || "Ocurrió un error al intentar registrar el usuario"
        });
        next(err)
    }

    return
};


//Encuentra un usuario usando su id como referencia
exports.findOne = async (req, res, next) => {
    try {
        const id = req.params.id
        const data = await Employee.findByPk(id, { include: Person })
        if (data) res.send({ employee: data, success: true })
        else {
            res.status(404).send({
                message: `No se encontró el usuario con id: ${id}`
            });
        }
    } catch (err) {
        res.status(404).send({
            message: err.message || "Ocurrió un error al intentar ver el usuario"
        });
        next(err)
    }
    return
};

//Actualizar el usuario usando su id como referencia
exports.update = async (req, res) => {
    const id = req.params.id
    try {
        const currentEmployee = await Employee.findByPk(id, { include: Person })
        await Person.update(req.body.person, { where: { id: currentEmployee.personId } })
        await currentEmployee.update(req.body, { where: { id } })
        res.send(currentEmployee)
    } catch (err) {
        res.status(500).send({
            message: `Ocurrió un error al intentar actualizar el usuario con id: ${id}`, log: err.message
        })
    }
};

// Elimina un cliente usando su id como referencia
exports.delete = async (req, res, next) => {
    const id = req.params.id
    try {
        const num = await Customer.destroy({ where: { id } })
        if (num == 1) res.send({ message: 'El cliente fue eliminado correctamente' })
        else res.send({ message: `No se pudo eliminar el cliente con id: ${id}` })
    } catch (err) {
        res.send({ message: `Ocurrió un error al intentar eliminar el cliente con id: ${id}` })
        next(err)
    }
    return
};