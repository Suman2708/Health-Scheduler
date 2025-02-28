import axios from "axios";
import FormData from "form-data";
import 'dotenv/config';
import fs from "fs";

const API_KEY = process.env.BB_KEY;

// const uploadToImgBB = async (fileBuffer) => {
//     try {
//         const formData = new FormData();
//         formData.append("image", fileBuffer.toString("base64"));
//         formData.append("key", IMGBB_API_KEY);

//         const response = await axios.post("https://api.imgbb.com/1/upload", formData, {
//             headers: formData.getHeaders(),
//         });

//         return response.data.data.url;
//     } catch (error) {
//         console.error("ImgBB Upload Error:", error.response?.data || error.message);
//         throw new Error("Failed to upload to ImgBB");
//     }
// };

// export default uploadToImgBB;



const uploadToImgBB = async (imagePath) => {

    // Read file and append to form data
    const formData = new FormData();
    formData.append("image", fs.createReadStream(imagePath));  // Ensure correct file path

    try {
        const response = await axios.post(
            `https://api.imgbb.com/1/upload?key=${API_KEY}`,
            formData,
            { 
                headers: { ...formData.getHeaders() },
                timeout: 120000  // Set to 2 minutes
            } // Important for multipart upload
        );
        return response.data;
    } catch (error) {
        console.error("ImgBB Upload Error:", error.response?.data || error.message);
        throw error;
    }
};


export default uploadToImgBB;

