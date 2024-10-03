import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import authrepo from '../Repository/authRepo.mjs';
const secretKey = 'yourSecretKey';  // Set your secret key here


    const loginAdmin= async ({ userName, password }) => {
      try {
        const admin = await authrepo.findByUserName(userName);
  
        if (admin) {
         
            const token = jwt.sign({ userName: admin.userName, role: admin.role }, secretKey, { expiresIn: '10h' });
            admin.verifyToken = token;
            await authrepo.save(admin); 
            console.log('Admin login success');
            return admin;
          
        }

        
      } catch (error) {
        console.error('Error during admin login', error);
        throw error;
      }
    }

  
  export default loginAdmin;
