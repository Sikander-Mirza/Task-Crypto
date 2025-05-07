import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../Utils/cloudinary.mjs';

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'kyc_documents',
    allowed_formats: ['jpg', 'png', 'jpeg', 'pdf']
  }
});

export const upload = multer({ storage });
