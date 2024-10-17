import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  product: {
    type: String,
    required: true,
  },
  pricerub: {
    type: String,
    required: true,
  },
  priceusd: {
    type: String,
    required: true,
  },
  status:{
    type:Boolean
  },
  imageurl:{
    type:String
  },
  description:{
    type:String
  }
});

// Creating the Product model from the schema
const ProductModel = mongoose.model("Product", productSchema);

export default ProductModel;
