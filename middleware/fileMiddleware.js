import multer from "multer";
//create a storage
const fileStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        if(file.mimetype.startsWith('image/')){
            cb(null, '../public/images');
        }else if(file.mimetype.startsWith('video/') ){
            cb(null, '../public/videos');
        }else{
            cb({ message: 'this file is not supported'})
        }
        
    },
    filename: function(req, file, cb){
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    } 
})
const upload = multer({ storage: fileStorage });
 
export const multiUpload = upload.fields([ { name: 'image', maxCount: 4 }, { name: 'video', maxCount: 1 } ])

export default upload;