const multer = require("multer");

const MIME_TYPES = {
  //received from the front sides
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};
//what to save and how
const storage = multer.diskStorage({
  destination: (req, file, chooseDirectory) => {
    chooseDirectory(null, "images");
  },
  filename: (req, file, fullFileName) => {
    const name = file.originalname.split(" ").join("_"); //give the file the original name, avoiding whitespace
    const extension = MIME_TYPES[file.mimetype]; //define file extension
    fullFileName(null, name + Date.now() + "." + extension); //provide the full file name
  },
});
module.exports = multer({ storage: storage }).single("image"); //multer conf steps
