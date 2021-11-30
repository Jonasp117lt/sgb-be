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
exports.create = (req, res) => {
    const missingFields = []
    requiredFields.map(field => {
        if (!(req.body.person || {})[field.key]) {
            missingFields.push(field.name)
        }
    })

    if (missingFields.length) {
        res.status(400).send({
            message: `Faltan los siguientes campos: ${missingFields.join(', ')}`
        });
        return
    }

    //Registrar primero a la persona
    const { person = {} } = req.body
    Person.create({
        name: person.name,
        lastname: person.lastname,
        email: person.email,
        phone: person.phone,
        address: person.address,
    }).then(person => {
        //Si se crea la persona, crear ahora si el cliente
        const customer = {
            has_books: false,
            debt: 0,
            personId: person.id,
        }
        Customer.create(customer)
            .then(data => {
                res.send(data)
            })
            .catch(err => {
                Person.destroy({ where: { id: person.id } })
                res.status(500).send({
                    message:
                        err.message || "Ocurrió un error al intentar registrar el cliente"
                });
            })
    }).catch(err => {
        res.status(500).send({
            message:
                err.message || "Ocurrió un error al intentar registrar los datos personales"
        });
    })
};

// Trae todos los clientes de la base de datos
exports.findAll = (req, res) => {
    Customer.findAll()
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ocurrió un error al intentar ver los clientes"
            });
        })
};

//Encuentra un cliente usando su id como referencia
exports.findOne = (req, res) => {
    const id = req.params.id

    Customer.findByPk(id)
        .then(data => {
            if (data) res.send(data)
            else {
                res.status(404).send({
                    message: `No se encontró el cliente con id: ${id}`
                });
            }
        })
        .catch(err => {
            res.status(404).send({
                message: err.message || "Ocurrió un error al intentar ver el cliente"
            });
        })
};

//Actualizar el cliente usando su id como referencia
// exports.update = async (req, res) => {
//     const id = req.params.id

//     const currentBook = await Book.findByPk(id)

//     const body = req.body

//     if (currentBook) {
//         const currentInventoryTotal = currentBook.inventory_total
//         const newInventoryTotal = body.inventory_total || currentInventoryTotal
//         const diff = newInventoryTotal - currentInventoryTotal
//         body.inventory = currentBook.inventory + diff
//         if (body.inventory < 0) body.inventory = 0
//     }

//     Book.update(req.body, {
//         where: { id }
//     })
//         .then(num => {
//             if (num == 1) {
//                 res.send({ message: 'El libro se actualizó correctamente' })
//             } else {
//                 res.send({ message: `No se pudo actualizar el libro con id: ${id}` })
//             }
//         })
//         .catch(err => {
//             console.log(err.message)
//             res.status(500).send({
//                 message: `Ocurrió un error al intentar actualizar el libro con id: ${id}`
//             })
//         })

// };

// Elimina un cliente usando su id como referencia
exports.delete = (req, res) => {
    const id = req.params.id
    Customer.destroy({ where: { id } })
        .then(num => {
            if (num == 1) req.send({ message: 'El cliente fue eliminado correctamente' })
            else req.send({ message: `No se pudo eliminar el cliente con id: ${id}` })
        })
        .catch(err => req.send({ message: `Ocurrió un error al intentar eliminar el cliente con id: ${id}` }))
};