import Stock from "../Controllers/stockController.mjs";

const Routes =async(app) => {
     
    app.post('/createstock', upload.single('file'), Stock.createstock); 
    app.get("/getstock",Stock.Getstock)

};

export default Routes;  
