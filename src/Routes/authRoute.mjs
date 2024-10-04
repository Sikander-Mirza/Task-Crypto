import auth from "../Controllers/authController.mjs";  

const Routes =async(app) => {
    
    app.post("/login",auth.login);  
    app.post("/create", auth.create); 
    app.post("/check-role",auth.verify)
    app.get("/getusers",auth.GetUsers)
    app.delete("/deleteusers/:id",auth.deleteuser)
};

export default Routes;  
