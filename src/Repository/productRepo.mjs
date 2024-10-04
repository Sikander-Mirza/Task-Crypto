import ProductModel from "../Models/ProductModel.mjs";

const productrepo={

    save :async (data) => {
      return await ProductModel.create(data);  // Save the document in MongoDB (this updates verifyToken)
    },
    show: async()=>{
      return await ProductModel.find()
    },
    delete: async(id)=>{
      return await ProductModel.findByIdAndDelete(id)
    },
    update: async(id,data)=>{
      return await ProductModel.findByIdAndUpdate(id,data)
    },
    single: async(id)=>{
      return await ProductModel.findById(id)
    }
  
}
  export default productrepo;
