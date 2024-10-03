import auth from "../Controllers/authController.mjs";  

const Routes =async(app) => {
    
    app.post("/login",auth.login);  
    app.post("/create", auth.create); 
};

export default Routes;  
