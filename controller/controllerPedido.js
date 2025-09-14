//const { runQuery, getQuery, allQuery } = require("../database/database-helper");

const createPedidos = (req, res, next) => {
    try {
        const body = req.body;
    } catch (error) {
        res.status(500).json({
            message: "Aconteceu um probleminha no nosso servidor!  =(",
        });
    }
};

const getAllPedidos = () => {};

const updatePedidos = () => {};

const deletePedidos = () => {};
