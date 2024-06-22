import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

export const uploader = async (file ) => {
    var result = await cloudinary.uploader.upload(file);
    console.log('image uploaded: ', result);
    return result;
}

export const videoUploader = async (file ) => {
    var result = await cloudinary.uploader.upload(file, { resource_type: 'video'});
    console.log('image uploaded: ', result);
    return result;
}