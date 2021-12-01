const db = require("../models");
const Loan = db.loans;
const Return = db.returns
const Book = db.books;
const Customer = db.customers;
const Person = db.persons;
const Op = db.Sequelize.Op;

const requiredFields = [
    { key: 'payment', name: 'Pago' },
    { key: 'date', name: 'Fecha' },
]

// Crear y guardar un préstamo
exports.create = async (req, res, next) => {
    const loanId = req.params.loanId
    try {
        const missingFields = []
        requiredFields.map(field => {
            if (req.body[field.key] === undefined || req.body[field.key] === null) {
                missingFields.push(field.name)
            }
        })
        if (missingFields.length) {
            res.status(400).send({
                message: `Faltan los siguientes campos: ${missingFields.join(', ')}`
            });
            return
        }
        const _return = await Return.create({
            payment: req.body.payment,
            date: req.body.date,
            loanId: loanId,
        })
        res.send({ _return, success: true })
    } catch (err) {
        res.status(500).send({
            message:
                err.message || "Ocurrió un error al intentar registrar la devolución"
        });
        next(err)
    }
    return
};

// Traer todas las devoluciones de un cliente
exports.findAllByCustomer = async (req, res, next) => {
    const customerId = req.params.customerId
    try {
        const data = await Return.findAll({ include: [{ model: Loan, include: [{ model: Book }, { model: Customer, include: [Person], where: { id: customerId } }] }] })
        res.send({ returns: data, success: true })
    } catch (err) {
        res.status(500).send({
            message:
                err.message || "Ocurrió un error al intentar ver las devoluciones"
        });
        next(err)
    }
    return
};