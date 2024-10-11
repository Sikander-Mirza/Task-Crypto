import Stock from "../Controllers/stockController.mjs";
import {upload,parseCSVFile} from "../Middleware/csvUploader.mjs"
const Routes =async(app) => {
     
    app.post('/createstock', upload.single('file'),parseCSVFile,); 
    app.get("/getstock",Stock.Getstock)

};

export default Routes;  
