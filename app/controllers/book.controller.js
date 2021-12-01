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
exports.create = async (req, res, next) => {
    try {
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
        const data = await Book.create(book)
        res.send({ book: data, success: true })
    } catch (err) {
        res.status(500).send({
            message:
                err.message || "Ocurrió un error al intentar guardar el libro"
        });
        next(err)
    }
    return
};

// Retrieve all Books from the database.
exports.findAll = async (req, res, next) => {
    try {
        const data = await Book.findAll()
        res.send({ books: data, success: true })
    } catch (err) {
        res.status(500).send({
            message:
                err.message || "Ocurrió un error al intentar ver los libros"
        });
        next(err)
    }
    return
};

// Find a single Book with an id
exports.findOne = async (req, res, next) => {
    try {
        const id = req.params.id
        const data = await Book.findByPk(id)
        if (data) res.send({ book: data, success: true })
        else {
            res.status(404).send({
                message: `No se encontró el libro con id: ${id}`
            });
        }
    } catch (err) {
        res.status(404).send({
            message: err.message || "Ocurrió un error al intentar ver el libro", err
        });
        next(err)
    }
    return
};

// Update a Book by the id in the request
exports.update = async (req, res, next) => {
    try {
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
        const num = await Book.update(body, { where: { id } })
        if (num == 1) {
            res.send({ message: 'El libro se actualizó correctamente' })
        } else {
            res.send({ message: `No se pudo actualizar el libro con id: ${id}` })
        }
    } catch (err) {
        res.status(500).send({
            message: `Ocurrió un error al intentar actualizar el libro con id: ${id}`.err
        })
        next(err)
    }

    return

};

// Delete a Book with the specified id in the request
exports.delete = async (req, res, next) => {
    try {
        const id = req.params.id
        const num = await Book.destroy({ where: { id } })
        if (num == 1) res.send({ message: 'El libro fue eliminado correctamente' })
        else res.send({ message: `No se pudo eliminar el libro con id: ${id}` })
    } catch (err) {
        res.send({ message: `Ocurrió un error al intentar eliminar el libro con id: ${id}`, err })
        next(err)
    }
    return
};