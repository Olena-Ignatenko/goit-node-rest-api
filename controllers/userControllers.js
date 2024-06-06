import * as fs from "node:fs/promises";
import path from "node:path";
import User from "../models/user.js";
import Jimp from "jimp";

async function changeAvatar(req, res, next) {
  try {
    const newPath = path.resolve("public", "avatars", req.file.filename);
    console.log(newPath);
    await fs.rename(req.file.path, newPath);

    // Обробка зображення за допомогою Jimp
    const image = await Jimp.read(newPath);
    await image.resize(250, 250).write(newPath);

    const avatarURL = `/avatars/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatarURL },
      { new: true }
    );
    res.json({ avatarURL: user.avatarURL });
  } catch (error) {
    next(error);
  }
}

// async function changeAvatar(req, res, next) {
//   try {
//     const { file } = req;
//     console.log("Uploaded file:", file);

//     if (!file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     // Зміна розміру зображення на 250x250
//     await jimpImage.resize(250, 250);

//     const avatarURL = `/avatars/${file.filename}`;
//     const user = await User.findByIdAndUpdate(
//       req.user.id,
//       { avatarURL },
//       { new: true }
//     );

//     res.json({ avatarURL: user.avatarURL });
//   } catch (error) {
//     next(error);
//   }
// }

export default { changeAvatar };
