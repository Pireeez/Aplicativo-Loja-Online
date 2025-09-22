const express = require('express');
const router = express.Router();
const { createPedidos, getAllPedidos, detailsPedidos } = require('../controller/controllerPedido');

router.post('/', createPedidos);
router.get('/', getAllPedidos);
router.get('/:id', detailsPedidos);
// router.patch("/");

module.exports = router;
