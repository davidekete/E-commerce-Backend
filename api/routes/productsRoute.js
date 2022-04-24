const express = require('express');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', productController.getAllProducts);

router.post('/', checkAuth, productController.createNewProduct);

router.get('/:productId', productController.getOneProduct);

router.patch('/:productId', checkAuth, productController.patchProduct);

router.delete('/:productId', checkAuth, productController.deleteProduct);

module.exports = router;
