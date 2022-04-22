const Product = require("../models/productSchema");
const errorHandler = require("../../helper");

exports.getAllProducts = (req, res, next) => {
  Product.find()
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        products: docs.map((doc) => {
          return {
            doc,
            reqest: {
              type: "GET",
              url: `http://localhost:${process.env.PORT}/products/${doc._id}`,
            },
          };
        }),
      };
      res.send(response);
    })
    .catch((error) => {
      errorHandler(res, error, 404);
    });
};

exports.createNewProduct = (req, res, next) => {
  const product = new Product(req.body);

  product
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Product Created successfully",
        createdProduct: result,
      });
    })
    .catch((error) => {
      errorHandler(res, error, 500);
    });
};

exports.getOneProduct = (req, res, next) => {
  const id = req.params.productId;

  Product.findById(id, (error, result) => {
    if (result) res.send(result);
    if (error) res.status(404).json({ message: `product not found` });
  });
};

exports.patchProduct = (req, res, next) => {
  const id = req.params.productId;

  Product.findByIdAndUpdate(id, req.body, (err, doc) => {
    if (doc) {
      res.json({
        message: `Product Updated Succesfully`,
        Details: doc,
      });
    }
    if (err)
      res.status(500).json({
        error: `product does not exist`,
      });
  });
};

exports.deleteProduct = (req, res, next) => {
  const id = req.params.productId;

  let product = Product.findById(id);
  if (!product) res.status(404).json({ message: `product not found` });

  Product.findByIdAndDelete(id, (error, result) => {
    if (result) {
      res.json({
        message: `Product ${id} deleted successfully`,
      });
      if (error) errorHandler(res, error, 404);
    }
  });
};
