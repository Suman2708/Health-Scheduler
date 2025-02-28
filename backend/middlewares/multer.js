// // const multer= require ('multer')

import multer from 'multer';



const storage= multer.diskStorage({
    filename:function(req,file,callback){
        callback(null,file.originalname)
    }
})
const upload = multer({storage:storage });

// console.log(upload)
// module.exports=upload
export default upload;



// import multer from 'multer';

// const storage = multer.memoryStorage(); // Store in memory, not disk
// const upload = multer({ storage });



// import multer from "multer";
// import path from "path";

// // Define storage engine
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "uploads/"); // Ensure this folder exists
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
//     },
// });

// // Upload middleware
// const upload = multer({ storage });

// export default upload;
