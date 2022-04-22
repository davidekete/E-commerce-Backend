const express = require("express");
const Product = require("../models/productSchema");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();
const multer = require("multer");
const errorHandler = require("../../helper");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${new Date().toISOString()}${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  //reject a file
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage,

  limits: {
    fileSize: 1024 * 1024 * 5,
  },

  fileFilter,
});

router.get("/", (req, res, next) => {
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
      errorHandler(error, 404);
    });
});

// ,upload.single('productImage')

router.post("/", checkAuth, (req, res, next) => {
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
      errorHandler(error,500)
    });
});

router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id).then((result) => {
    res.send(result);
  });
});

router.patch("/:productId", (req, res, next) => {
  const id = req.params.productId;

  Product.updateOne({ _id: id }, { $set: req.body }).then((result) => {
    res.json(result);
  });

});

router.delete("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.findByIdAndDelete(id)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      errorHandler(err,500)
    });
});

module.exports = router;
