const express = require("express");
const morgan = require("morgan");
require("dotenv").config();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const productRoutes = require("./api/routes/productsRoute");
const orderRoutes = require("./api/routes/ordersRoute");
const userRoutes = require("./api/routes/userRoute");

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//env variables
const dbUri = process.env.MONGO_URI;

//connectiong to db
mongoose
  .connect(dbUri)
  .then(() => {
    console.log(`connected to db`);
  })
  .catch((err) => {
    console.log(err);
  });


//handling CORS error
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT,POST,PATCH,DELETE,GET");
    return res.status(200).json({});
  }
  next();
});

app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/user", userRoutes);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500).json({ error: error.message });
});

module.exports = app;
