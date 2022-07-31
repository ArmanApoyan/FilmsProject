const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "static/images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + Math.round(Math.random() * 100) + file.originalname);
  },
});
const upload = multer({ storage: storage })

module.exports = upload
