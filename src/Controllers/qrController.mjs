import QRCode from 'qrcode';
import cloudinary from '../Utils/cloudinary.mjs'; // or wherever your cloudinary config is
import User from '../Models/AuthModel.mjs';

export const generateUserQRCode = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const account_number = user.linked_bank_accounts[0]?.account_number;
    if (!account_number) return res.status(400).json({ message: 'No linked bank account' });

    const qrPayload = JSON.stringify({
      account_number,
      name: user.name
    });

    const base64Image = await QRCode.toDataURL(qrPayload);

    // Upload base64 to Cloudinary
    const uploadRes = await cloudinary.uploader.upload(base64Image, {
      folder: 'zenpay_qrcodes',
      public_id: `qr_${user._id}`,
      overwrite: true
    });

    user.qr_code_url = uploadRes.secure_url;
    await user.save();

    res.json({
      message: 'QR Code generated and uploaded',
      qr_code_url: uploadRes.secure_url
    });

  } catch (err) {
    console.error('QR Upload Error:', err.message);
    res.status(500).json({ message: 'QR Code generation failed' });
  }
};
