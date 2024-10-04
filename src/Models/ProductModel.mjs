import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  product: {
    type: String,
    required: true,
  },
  priceRub: {
    type: Number,
    required: true,
  },
  priceUsd: {
    type: Number,
    required: true,
  },
});

// Creating the Product model from the schema
const ProductModel = mongoose.model("Product", productSchema);

export default ProductModel;
