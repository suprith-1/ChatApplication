import cloudinaryPkg from 'cloudinary';
const { v2: cloudinary } = cloudinaryPkg;
import {CloudinaryStorage} from 'multer-storage-cloudinary';
import multer from 'multer';
import user from '../model/user.js';
import {config} from 'dotenv';
config();

cloudinary.config({
    // cloud_name: 'dkbufevb1',
    cloud_name: process.env.cloud_name,
    // api_key: '999277226475751',
    api_key: process.env.api_key,
    // api_secret: 'HONTveemIl5PbDyyJhHe-KVbAVY',
    api_secret: process.env.api_secret,
})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'profiles',
        allowed_Formats: ['jpg', 'png', 'jpeg'],
        public_id: (req, file) => file.originalname.split('.')[0]+Date.now(),
    },
})

const upload = multer({storage});

export const uploadProfilePhoto = (req, res) => {
    console.log("uploading photo");
    upload.single('profile')(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error uploading file', error: err.message });
        }
        const userId = req.body._id;
        const profileUrl = req.file.path;

        try {
            const updatedUser = await user.findByIdAndUpdate(userId, { profile: profileUrl }, { new: true });
            if (!updatedUser) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }
            console.log("Profile photo updated successfully:", profileUrl);
            return res.status(200).json({ success: true, profile: profileUrl });
        } catch (error) {
            console.error("Error updating profile photo:", error);
            return res.status(500).json({ success: false, message: 'Error updating profile', error: error.message });
        }
    });
}
