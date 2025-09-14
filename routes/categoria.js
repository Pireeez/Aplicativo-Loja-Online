const express = require("express");
const router = express.Router();
const {
    getAllCategoria,
    createCategoria,
    updateCategoria,
} = require("../controller/controllerCategoria");

// Em vez de colocar a função de callback aqui, chamamos uma do controller
router.post("/", createCategoria);
router.get("/", getAllCategoria);
router.patch("/", updateCategoria);

module.exports = router;
