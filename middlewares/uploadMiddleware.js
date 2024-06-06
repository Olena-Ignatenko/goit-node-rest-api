import path from "node:path";
import multer from "multer";
import crypto from "node:crypto";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const destPath = path.resolve("tmp");
    console.log("Destination path:", destPath);
    cb(null, destPath);
  },
  filename: function (req, file, cb) {
    const suffix = crypto.randomUUID();
    const extname = path.extname(file.originalname);
    console.log("File extension:", extname);
    const basename = path.basename(file.originalname, extname);
    console.log("Base name:", basename);
    const filename = `${basename}--${suffix}${extname}`;
    console.log("Generated filename:", filename);
    cb(null, filename);
  },
});

const upload = multer({ storage });

export default upload;