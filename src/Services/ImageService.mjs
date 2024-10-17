// ImageService.mjs
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary'; // Use named import for v2
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dwul2hfvj',
  api_key: '725959839144441',
  api_secret: 'dPV-3z6Iv4pvNbmWJsAq3xUPr2A',
});

// Configure Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads', // Cloudinary folder where images will be stored
    allowed_formats: ['jpg', 'png', 'gif'], // Use 'allowed_formats' (not 'allowedFormats')
    public_id: (req, file) => `${file.fieldname}_${Date.now()}`, // Unique public ID using field name + timestamp
  },
});

// Create Multer instance with Cloudinary storage
const upload = multer({ storage });

export { upload, cloudinary };
