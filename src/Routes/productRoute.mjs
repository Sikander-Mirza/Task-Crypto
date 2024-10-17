import Product from '../Controllers/productController.mjs'; // Adjust the path as necessary
import multer from "multer";
import { v2 as cloudinary } from 'cloudinary'; // Use named import for v2
import { CloudinaryStorage } from 'multer-storage-cloudinary';
    // Cloudinary configuration
    cloudinary.config({
        cloud_name: "dwul2hfvj",
        api_key: '725959839144441',
        api_secret: 'dPV-3z6Iv4pvNbmWJsAq3xUPr2A',
    });

    // Set up Cloudinary storage
    const storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
            folder: 'uploads', // Folder in Cloudinary where the image will be stored
            allowed_formats: ['jpg', 'png'],
        },
    });

    // Multer middleware
    const upload = multer({
        storage: storage,
        limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
        fileFilter: (req, file, cb) => {
            if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
                cb(null, true);
            } else {
                cb(new Error('Invalid file format. Only JPEG and PNG are allowed.'), false);
            }
        }
    });
const Routes = async (app) => {
    app.post('/create-product', upload.single('image'), Product.createproduct);
    app.get("/getproducts", Product.GetProducts);
    app.get("/getsingle/:id", Product.getsingle);
    app.delete("/deleteproducts/:id", Product.deleteProduct);
    app.put("/updateproduct/:id", Product.updateProduct);



    // Route to upload image
    // app.post('/upload', upload.single('image'), (req, res) => {
    //     console.log("API Hit - File Upload");

    //     if (!req.file) {
    //         return res.status(400).json({
    //             success: false,
    //             message: 'Image is required',
    //         });
    //     }

    //     // Check Cloudinary response
    //     console.log("Uploaded File Info:", req.file);

    //     res.json({
    //         success: true,
    //         message: 'Image uploaded successfully',
    //         imageUrl: req.file.path, // Cloudinary URL path
    //     });
    // });

    // // Error handling for multer file upload
    // app.use((err, req, res, next) => {
    //     if (err instanceof multer.MulterError) {
    //         return res.status(400).json({
    //             success: false,
    //             message: `Multer error: ${err.message}`,
    //         });
    //     } else if (err) {
    //         return res.status(400).json({
    //             success: false,
    //             message: `Error: ${err.message}`,
    //         });
    //     }
    //     next();
    // });
};

export default Routes;
