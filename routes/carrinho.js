const express = require('express');
const router = express.Router();
const {
    addCarrinho,
    exibeCarrinho,
    updateQuantidadeCarrinho,
    deleteProdutoCarrinho,
} = require('../controller/controllerCarrinho');

router.post('/', addCarrinho);
router.get('/', exibeCarrinho);
router.patch('/', updateQuantidadeCarrinho);
router.delete('/:id', deleteProdutoCarrinho);
// router.patch("/");

module.exports = router;
