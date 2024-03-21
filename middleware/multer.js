// const path = require("path");
// const multer = require("multer");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     let ext = path.extname(file.originalname);
//     //let uniqueFilename = Date.now() + '-' + Math.floor(Math.random() * 1000) + ext;
//     cb(null, ext);
//   },
// });

// const fileFilter = function (req, file, callback) {
//   if (file.mimetype.startsWith("image/")) {
//     callback(null, true);
//   } else {
//     console.log("Only image files supported");
//     callback(null, false);
//   }
// };

// const limits = {
//   fileSize: 1024 * 1024 * 100,
// };

// const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter,
//   limits: limits,
// }).array("images", 10);
// module.exports = upload;






// const fs = require("fs");


// const multer = require("multer");
// const path = require("path");

// const fileFilter = function (req, file, callback) {
//   if (file.mimetype.startsWith("image/")) {
//     callback(null, true);
//   } else {
//     console.log("Only image files supported");
//     callback(null, false);
//   }
// };


// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     const uploadPath = "uploads/";
//     fs.mkdirSync(uploadPath, { recursive: true });
//     cb(null, uploadPath);
//   },
//   filename: function (req, file, cb) {
//     let ext = path.extname(file.originalname);
//     cb(null, Date.now() + ext);
//   },
// });

// const limits = {
//   fileSize: 1024 * 1024 * 100,
// };

// const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter,  // Make sure fileFilter is defined before it's used
//   limits: limits,
// }).array("productImages", 5);
const fs = require("fs");
const multer = require("multer");
const path = require("path");


// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = "uploads/";
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    let ext = path.extname(file.originalname);
    let uniqueFilename = Date.now() + '-' + Math.floor(Math.random() * 1000) + ext;
    cb(null, Date.now() + uniqueFilename);
  },
});

const fileFilter = function (req, file, callback) {
  if (file.mimetype.startsWith("image/")) {
    callback(null, true);
  } else {
    console.log("Only image files supported");
    callback(null, false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 100 }, // Limit file size to 100MB
}).array("productImages", 5); // Assuming "productImages" is the name of your file input


module.exports = upload;
