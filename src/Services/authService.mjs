import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import authrepo from '../Repository/authRepo.mjs';
const secretKey = 'yourSecretKey';  // Set your secret key here

const authservice={

     loginAdmin : async ({ username, password }) => {
      try {

        const admin = await authrepo.findByUserName(username);

        if (admin) {
         
            const token = jwt.sign({ username: admin.username, role: admin.role }, secretKey, { expiresIn: '10h' });
            admin.verifyToken = token;
            const data= await authrepo.save(admin); 
            console.log('Admin login success',data);
            return admin;
          
        }

        
      } catch (error) {
        console.error('Error during admin login', error);
        throw error;
      }
    },
    checktoken: async (token) => {  // Pass token as a string, not destructured
      try {
          console.log('Token in checktoken:', token);  // Log token for debugging
  
          // Verify the token using jwt
          const decoded = jwt.verify(token, secretKey);
          const admin = await authrepo.findByUserName(decoded.username);  // Find the user by username
          
          return admin;  // Return the admin data if found
      } catch (error) {
          console.error('Error during token verification:', error);
          return null;  // Return null if verification fails
      }
  }

}
  export default authservice;
