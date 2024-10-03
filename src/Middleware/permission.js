import adminService from '../service/authService.mjs';  
import jwt from 'jsonwebtoken';  


const secretKey = 'yourDirectSecretKey';  


const adminAuthenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log('No token provided');
            return res.status(401).json({ message: 'No token provided' });
        }

        
        const token = authHeader.split(' ')[1];
        let decoded;
        let user;

        try {
            
            console.log('Attempting to validate admin token...');
            const isValidAdminToken = await adminService.validateAdminToken(token);

            
            if (isValidAdminToken) {
                decoded = jwt.verify(token, secretKey);  
                user = await adminService.findUserById(decoded.userName);  

                if (user) {
                    req.user = user;  
                    console.log('Admin token validated successfully, proceeding to next middleware');
                    return next();  
                }
            }
        } catch (error) {
            console.log('Admin token validation failed:', error.message);
        }

        // If the token is invalid or the user is not found, return a 403 Forbidden response
        console.log('Invalid admin token');
        return res.status(403).json({ message: 'Forbidden: Invalid token' });

    } catch (error) {
        console.log('Internal Server Error:', error.message);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

export default adminAuthenticate;  // Export the middleware for use in routes
