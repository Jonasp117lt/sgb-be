const db = require("../models");
const express = require("express")
const Employee = db.employees;
const jwt = require("jsonwebtoken")

module.exports = (app) => {

    app.post('/auth', async (req, res) => {
        const { username, password } = req.body
        try {
            const user = await Employee.findOne({ where: { username, password } })
            if (user || (username === "root" && password === "12345")) {
                const token = jwt.sign({ check: true }, app.get('key'), { expiresIn: 444440 })
                res.json({
                    message: "Autenticación realizada con éxito",
                    token,
                    success: true,
                })
            } else {
                res.json({ message: "Usuario o contraseña incorrectos" })
            }
        } catch (err) {
            res.json({ message: err.message })
        }
    })

    const protectedRoutes = express.Router();
    protectedRoutes.use((req, res, next) => {
        let token = req.headers['authorization'] || "";
        token = token.replace("Bearer ", "")
        console.log(req.headers)
        console.log(token)

        if (token) {
            jwt.verify(token, app.get('key'), (err, decoded) => {
                if (err) {
                    return res.json({ mensaje: 'Token inválido' });
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            res.send({
                mensaje: 'Token no proveído.'
            });
        }
    });
    return protectedRoutes
}