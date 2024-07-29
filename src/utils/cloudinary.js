import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// const uploadOnCloudinary = async (localFilePath) => {
//   try {
//     if (!localFilePath) return console.log(null, "file not upload properly");
//     // upload the file on cloudinary
//     const response = await cloudinary.uploader.upload(localFilePath, {
//       resource_type: "auto",
//     });
//     //file has uploaded successfuly
//     console.log(response.url, "file upload successfuly");
//     fs.unlinkSync(localFilePath);
//     return response;
//   } catch (error) {
//     fs.unlinkSync(localFilePath);
//     return null;
//     // unlike the which is not upload on server
//   }
// };

// const upload = (folderName) => {
//   const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//       folder: folderName,
//       allowed_formats: [
//         "jpg",
//         "jpeg",
//         "png",
//         "gif",
//         "pdf",
//         "mp4",
//         "avi",
//         "mov",
//       ],
//       quality: 80,
//     },
//   });
//   const upload = multer({ storage: storage });

//   return upload.fields([{ name: folderName, maxCount: 1 }]);
// };

const uploadToCloudinary = (fieldNames) => {
  const fieldsArray = Array.isArray(fieldNames) ? fieldNames : [fieldNames];
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: (req, file) => "some_default_folder",
      // allowed_formats: ["jpg", "jpeg", "png", "gif", "pdf", "webp", "svg"],
      quality: 80,
    },
  });
  const upload = multer({ storage: storage });
  const fields = fieldsArray.map((fieldName) => ({
    name: fieldName,
    maxCount: 1,
  }));
  return upload.fields(fields);
};

const uploadTo = (thumbnailField, imageFields) => {
  const fieldsArray = Array.isArray(imageFields) ? imageFields : [imageFields];
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "ProductImage",
      // allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'webp', 'svg'],
      quality: 80,
    },
  });
  const upload = multer({ storage: storage });

  // Prepare fields for multer
  const fields = [
    { name: thumbnailField, maxCount: 1 },
    ...fieldsArray.map((fieldName) => ({ name: fieldName, maxCount: 10 })),
  ];

  return upload.fields(fields);
};

export { uploadToCloudinary, uploadTo };
