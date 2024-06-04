import path from "node:path";
import multer from "multer";
import crypto from "node:crypto";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve("tmp"))
    },
    filename: function (req, file, cb) {
        const suffix = crypto.randomUUID();
        const extname = path.extname(file.filename);
        console.log(extname);
        const basename = path.basename(file.originalname, extname);
        console.log(basename);
        const filename = `${basename}--${suffix}${extname}`;
        console.log(filename);
        cb(null, filename);
    }
});

export default multer({ storage });