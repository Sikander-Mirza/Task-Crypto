import Stock from "../Controllers/stockController.mjs";
import upload from '../Middleware/csvUploader.mjs'; // Adjust the import path as needed

const Routes =async(app) => {
     
    app.post('/createstock', upload.single('file'), Stock.createstock); // Ensure you specify the key used in the form-data
    app.get("/getstock",Stock.Getstock)

};

export default Routes;  
