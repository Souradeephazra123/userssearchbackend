const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./Uploads");
  },
  filename: (req, file, callback) => {
    const filename = `image-${Date.now()}.${file.originallast_name}`;
    callback(null, filename);
  },
});

//filter

const fileFilter = (req, file, callback) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    callback(null, true);
  } else {
    callback(null, false);
    return callback(new Error("Only .png, .jpg, .jpeg formats are allowed"));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

module.exports = upload;
