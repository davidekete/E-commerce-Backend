const express = require("express");
const res = require("express/lib/response");

const router = express.Router();
const mongoose = require("mongoose");
const Order = require("../models/orderSchema");
const Product = require("../models/productSchema");


const errorHandler=require('../../helper')


router.get("/", (req, res, next) => {
  Order.find().exec().then(result=>{
    res.send(result)
  }).catch(error=>{
    errorHandler(error,404)
  })
});

router.post("/:productId", (req, res, next) => {
  const id = req.params.productId;
  const product=Product.findById(id)

  if(!product) return new Error(`product not found`)
  const order=new Order({

  })

  order.save().then((result) => {
    console.log(result);
    res.status(201).json({
      message: "Product Created successfully",
      createdProduct: result,
    });
  })
  .catch((error) => {
    errorHandler(error,500)
  });
});

router.get("/:orderId", (req, res, next) => {
  const id = req.params.orderId;
  res.json({ message: `orders found id=${id}` });
});

router.delete("/:orderId", (req, res, next) => {
  const id = req.params.orderId;
  res.json({ message: `order deleted id=${id}` });
});

module.exports = router;
