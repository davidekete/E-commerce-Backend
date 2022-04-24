const mongoose = require('mongoose');

const { Schema } = mongoose;
const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
  },
  image: {
    type: String,
    required: true,
  },
  rating: [
    {
      rate: {
        type: Number,
      },
      count: {
        type: Number,
      },
    },
  ],
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
