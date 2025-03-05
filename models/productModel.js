const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  discount: { type: String, required: true },
  price: { type: String, required: true },
  bgcolor: { type: String, required: true },
  panelColor: { type: String, required: true },
  textColor: { type: String, required: true }
});

const Products = mongoose.model("Products", productSchema);

module.exports = Products;