const db = require("../models");
const Loan = db.loans;
const Book = db.books;
const Person = db.persons;
const Customer = db.customers;
const Op = db.Sequelize.Op;

const requiredFields = [
    { key: 'start_date', name: 'Fecha' },
    { key: 'book_num', name: 'No. de libros' },
]

// Crear y guardar un préstamo
exports.create = async (req, res, next) => {
    const customerId = req.params.customerId
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
        const bookIds = req.body.books.map(({ id }) => id)
        const books = await Book.findAll({ where: { id: { [Op.or]: bookIds } } })
        const start_date = new Date(req.body.start_date)
        const end_date = new Date()
        end_date.setDate(start_date.getDate() + 7)
        const loan = await Loan.create({
            book_num: req.body.book_num,
            start_date: start_date.toISOString(),
            end_date: end_date.toISOString(),
            active: true,
            debt: 0,
            customerId: customerId,
        })
        await loan.addBooks(books)
        res.send({ loan, success: true })
    } catch (err) {
        res.status(500).send({
            message:
                err.message || "Ocurrió un error al intentar guardar el libro"
        });
        next(err)
    }
    return
};

// Traer todos los préstamos
exports.findAll = async (req, res, next) => {
    const customerId = req.query.customerId
    let condition = customerId ? { customerId: { [Op.like]: `%${customerId}%` } } : null;
    try {
        const data = await Loan.findAll({
            include: [{ model: Book }, { model: Customer, include: [Person] }], where: condition
        })
        res.send({ loans: data, success: true })
    } catch (err) {
        res.status(500).send({
            message:
                err.message || "Ocurrió un error al intentar ver los préstamos"
        });
        next(err)
    }
    return
};

// Encontrar un préstamo con su id
exports.findOne = async (req, res, next) => {
    const id = req.params.id
    try {
        const data = await Loan.findByPk(id, { include: [{ model: Book }, { model: Customer, include: [Person] }] })
        if (data) res.send({ loan: data, success: true })
        else {
            res.status(404).send({
                message: `No se encontró el préstamo con id: ${id}`
            });
        }
    } catch (err) {
        res.status(500).send({
            message: err.message || "Ocurrió un error al intentar ver el préstamo", err
        });
        next(err)
    }
    return
};