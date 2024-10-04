import Product from "../Controllers/productController.mjs";

const Routes =async(app) => {
     
    app.post("/createproducts", Product.createproduct); 
    app.get("/getproducts",Product.GetProducts)
    app.delete("/deleteproducts/:id",Product.deleteProduct)
    app.put("/updateproduct:/id",Product.updateProduct)
};

export default Routes;  
