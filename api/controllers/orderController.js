/* eslint-disable no-underscore-dangle */
/* eslint-disable no-shadow */
const Order = require('../models/orderSchema');
const Product = require('../models/productSchema');

const errorHandler = require('../../helper');

exports.getAllOrders = (req, res) => {
  Order.find()
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        products: docs.map((doc) => ({
          doc,
          reqest: {
            type: 'GET',
            url: `http://localhost:${process.env.PORT}/orders/${doc._id}`,
          },
        })),
      };
      res.send(response);
    })
    .catch((error) => {
      errorHandler(res, error, 404);
    });
};

exports.addNewOrder = (req, res) => {
  const id = req.body.productId;
  Product.findById(id, (error, result) => {
    if (error) res.status(404).json({ message: 'Product not found' });
    if (result) {
      const order = new Order({
        product: result._id,
        quantity: req.body.quantity,
        unitPrice: result.price,
        description: result.description,
        totalPrice: +(req.body.quantity * result.price),
      });

      order
        .save()
        .then((result) => {
          console.log(result);
          res.status(201).json({
            message: 'Order Created successfully',
            createdProduct: result,
          });
        })
        .catch((error) => {
          errorHandler(res, error, 500);
        });
    }
  });
};

exports.getSingleOrder = (req, res) => {
  const id = req.params.orderId;

  Order.findById(id, (error, result) => {
    if (error) {
      errorHandler(res, error, 404);
    }
    if (result) {
      res.send(result);
    }
  });
};

exports.deleteOrder = (req, res) => {
  const id = req.params.orderId;

  Order.findByIdAndDelete(id, (error, result) => {
    if (error) {
      errorHandler(res, error, 404);
    }
    if (result) {
      res.json({
        message: ' Order deleted Successfully',
        details: result,
      });
    }
    res.status(500).json({ message: 'could not process request' });
  });
};
