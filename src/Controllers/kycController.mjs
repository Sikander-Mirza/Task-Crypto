import User from '../Models/AuthModel.mjs';

export const submitKyc = async (req, res) => {
  try {
    const userId = req.userId;

    const { document_type, document_number } = req.body;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const documentUrls = files.map(file => file.path);

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.kyc = {
      status: 'pending',
      document_type,
      document_number,
      document_photo_url: documentUrls, // Save array of Cloudinary URLs
      verified_at: null
    };

    await user.save();

    res.json({ message: "KYC submitted", kyc: user.kyc });
  } catch (error) {
    console.error("KYC submission error:", error.message);
    res.status(500).json({ message: "KYC submission failed" });
  }
};
