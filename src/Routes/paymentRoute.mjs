import { createPayment } from "../Controllers/paymentController.mjs";  

const Routes =async(app) => {
    
app.post("/create-payment",createPayment)

};

export default Routes;  
