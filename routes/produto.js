const express = require('express');
const router = express.Router();
const upload = require('../upload');
const { createProdutos, getAllProdutos, updateProdutos } = require('../controller/controllerProduto');

router.post('/', upload.single('imagem'), createProdutos);
router.get('/', getAllProdutos);
router.patch('/', upload.single('imagem'), updateProdutos);

module.exports = router;
