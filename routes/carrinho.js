const express = require('express');
const router = express.Router();
const { addCarrinho, exibeCarrinho, updateQuantidadeCarrinho } = require('../controller/controllerCarrinho');

router.post('/', addCarrinho);
router.get('/', exibeCarrinho);
router.patch('/', updateQuantidadeCarrinho);
// router.patch("/");

module.exports = router;
