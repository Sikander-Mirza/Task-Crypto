import AuthModel from '../Models/AuthModel.mjs';
import loginAdmin from '../Services/authService.mjs';

    const auth={
     login : async (req, res) => {
        try {
            const { userName, password } = req.body;
            const token = await loginAdmin({ userName, password });
  
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

            // Check if admin with the same username or email already exists
            const existingAdmin = await AuthModel.findOne({ $or: [{ userName: data.userName }, { email: data.email }] });
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
    }
}

export default auth;
