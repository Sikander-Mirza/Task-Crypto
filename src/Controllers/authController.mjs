import AuthModel from '../Models/AuthModel.mjs';
import authservice from '../Services/authService.mjs';
import authrepo from '../Repository/authRepo.mjs';

    const auth={
     login : async (req, res) => {
        try {
           
            const { username, password } = req.body;
            const token = await authservice.loginAdmin({ username, password });
  
            if (token) {
                return res.status(200).json({ token });
            } else {
                return res.status(404).json({ message: "Invalid username or password" });
            }
        } catch (error) {
            console.error('Error during admin login:', error);
            return res.status(500).json({ message: "Server error" });
        }
    },

    // Admin creation function
    create: async (req, res) => {
        try {
            const data = req.body;
console.log(data)
            // Check if admin with the same username or email already exists
            const existingAdmin = await AuthModel.findOne({ $or: [{ username: data.username }, { email: data.email }] });
            console.log('existingAdmin:', existingAdmin);
            if (existingAdmin) {
                return res.status(400).json({ message: 'Username or email already exists' });
            }

            // Create the new admin user
            const admin = new AuthModel(data);
            await admin.save();

            return res.status(201).json(admin);  // Return the created admin with a 201 status
        } catch (error) {
            console.error('Error during admin creation:', error);
            return res.status(500).json({ message: "Server error" });
        }
    },
    verify: async (req, res) => {
        try {
            // Get the token from the Authorization header
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1]; // Get the token after 'Bearer'
            
            console.log('Extracted Token:', token);  // Log the token for debugging
    
            if (!token) {
                return res.status(403).json({ message: 'Token is required' });
            }
    
            // Verify the token using authservice
            const valid = await authservice.checktoken(token);  // Pass token as a string
    
            if (valid) {
                return res.status(200).json({ valid });
            } else {
                return res.status(401).json({ message: 'Token is invalid or expired' });
            }
        } catch (error) {
            console.error('Error during token verification:', error);
            return res.status(500).json({ message: "Server error" });
        }
    },
    GetUsers: async(req,res)=>{

        try{

            const users = await authrepo.show()
            if(!users){

                return res.status(404).json({message:"No users found"})
            }
            return res.status(200).json(users)

        }catch(error){

            console.log(error)

        }
    },
    deleteuser:async(req,res)=>{
try{
        const {id}=req.params

        const user=await authrepo.delete(id)

        if(!user){

            return res.status(404).json({message:"User not found"})

        }

        return res.status(200).json({message:"User deleted successfully"})
}
catch(error){

    console.log(error)
    return res.status(500).json({message:"internal server error"})


}    

    }

    
    
}

export default auth;
