const express = require('express');

const router = express.Router();
const orderController = require('../controllers/orderController');

router.get('/', orderController.getAllOrders);

router.post('/:productId', orderController.addNewOrder);

router.get('/:orderId', orderController.getSingleOrder);

router.delete('/:orderId', orderController.deleteOrder);

module.exports = router;
