const express = require("express");
const router = express.Router();
const upload = require("../upload");
const {
    createProdutos,
    getAllProdutos,
} = require("../controller/controllerProduto");

// Em vez de colocar a função de callback aqui, chamamos uma do controller
router.post("/", upload.single("imagem"), createProdutos);
router.get("/", getAllProdutos);
// router.patch("/");

module.exports = router;
