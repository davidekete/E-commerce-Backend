const express = require('express');
const morgan = require('morgan');
require('dotenv').config();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const productRoutes = require('./api/routes/productsRoute');
const orderRoutes = require('./api/routes/ordersRoute');
const userRoutes = require('./api/routes/userRoute');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// env variables
const dbUri = process.env.MONGO_URI;
const port = process.env.PORT;

// connectiong to db
mongoose
  .connect(dbUri)
  .then(() => {
    console.log('connected to db');
  })
  .catch((err) => {
    console.log(err);
  });

// handling CORS error
app.use(cors());

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res) => {
  res.status(error.status || 500).json({ error: error.message });
});

module.exports = app.listen(port, () => {
  console.log('port running');
});
