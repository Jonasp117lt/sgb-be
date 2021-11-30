const db = require("../models");
const bookRoutes = require("../routes/book.routes");
const Book = db.books;
const Op = db.Sequelize.Op;

const requiredFields = [
    { key: 'name', name: 'Nombre' },
    { key: 'author', name: 'Autor' },
    { key: 'edition', name: 'Edición' },
    { key: 'editorial', name: 'Editorial' },
]


// Create and Save a new Book
exports.create = (req, res) => {
    const missingFields = []
    requiredFields.map(field => {
        if (!req.body[field.key]) {
            missingFields.push(field.name)
        }
    })
    if (missingFields.length) {
        res.status(400).send({
            message: `Faltan los siguientes campos: ${missingFields.join(', ')}`
        });
        return
    }

    const book = {
        name: req.body.name,
        author: req.body.author,
        edition: req.body.edition,
        editorial: req.body.editorial,
        inventory_total: req.body.inventory_total,
        inventory: req.body.inventory_total,
    }

    Book.create(book)
        .then(data => {
            res.send(data)
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ocurrió un error al intentar guardar el libro"
            });
        })
};

// Retrieve all Books from the database.
exports.findAll = (req, res) => {
    Book.findAll()
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ocurrió un error al intentar ver los libros"
            });
        })
};

// Find a single Book with an id
exports.findOne = (req, res) => {
    const id = req.params.id

    Book.findByPk(id)
        .then(data => {
            if (data) res.send(data)
            else {
                res.status(404).send({
                    message: `No se encontró el libro con id: ${id}`
                });
            }
        })
        .catch(err => {
            res.status(404).send({
                message: err.message || "Ocurrió un error al intentar ver el libro"
            });
        })
};

// Update a Book by the id in the request
exports.update = async (req, res) => {
    const id = req.params.id

    const currentBook = await Book.findByPk(id)

    const body = req.body

    if (currentBook) {
        const currentInventoryTotal = currentBook.inventory_total
        const newInventoryTotal = body.inventory_total || currentInventoryTotal
        const diff = newInventoryTotal - currentInventoryTotal
        body.inventory = currentBook.inventory + diff
        if (body.inventory < 0) body.inventory = 0
    }

    Book.update(req.body, {
        where: { id }
    })
        .then(num => {
            if (num == 1) {
                res.send({ message: 'El libro se actualizó correctamente' })
            } else {
                res.send({ message: `No se pudo actualizar el libro con id: ${id}` })
            }
        })
        .catch(err => {
            console.log(err.message)
            res.status(500).send({
                message: `Ocurrió un error al intentar actualizar el libro con id: ${id}`
            })
        })

};

// Delete a Book with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id

    Book.destroy({ where: { id } })
        .then(num => {
            if (num == 1) req.send({ message: 'El libro fue eliminado correctamente' })
            else req.send({ message: `No se pudo eliminar el libro con id: ${id}` })
        })
        .catch(err => req.send({ message: `Ocurrió un error al intentar eliminar el libro con id: ${id}` }))
};