/**
 * Cloudinary Upload Utility
 * This handles uploading images to Cloudinary to avoid storing large Base64 strings in the database.
 */

// Your Cloudinary Cloud Name
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dru3l3gnu'; 

// IMPORTANT: Go to Cloudinary Settings -> Upload -> Add upload preset
// Set "Signing Mode" to "Unsigned" and give it this name:
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'guardian_pharma_uploads'; 

/**
 * Uploads a file to Cloudinary and returns the URL.
 * @param {File} file - The image file object from input.
 * @returns {Promise<string>} - The URL of the uploaded image.
 */
export const uploadToCloudinary = async (file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

        const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Cloudinary upload failed');
        }

        const data = await response.json();
        return data.secure_url;
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw error;
    }
};
