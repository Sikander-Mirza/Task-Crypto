import express from "express";   
import cors from "cors";         
import ConnectDB from "./Infractructure/db.mjs";   
import authRoutes from "./Routes/authRoute.mjs";   
import productRoutes from "./Routes/productRoute.mjs"
import stockRoutes from "./Routes/stockRoute.mjs"
import paymentRoutes from "./Routes/paymentRoute.mjs"
const app = express();


app.use(cors({ origin: "https://frontend-iota-dun-57.vercel.app" }));  
app.use(express.json());        
app.use(express.urlencoded({ extended: true }));  

productRoutes(app);
authRoutes(app);
stockRoutes(app);
paymentRoutes(app)


app.get("/", (req, res) => {
  res.send("Hello, world!"); 
});


const start = () => {
  ConnectDB()  
    .then(() => {
      
      app.listen(9000, '0.0.0.0', () => {
        console.log("Server is running on port 9000");  
      });
      console.log("DB connected successfully");  
    })
    .catch((err) => {
      console.error("Error connecting to DB:", err);  
    });
};

export default start;  
