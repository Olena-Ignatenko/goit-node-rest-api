import * as fs from "node:fs/promises";
import path from "node:path";
import User from "../models/user.js";
import Jimp from "jimp";
import { nanoid } from 'nanoid';

import mail from "../helpers/mail.js";


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




async function verifyEmail(req, res, next) {
  try {
    const { verificationToken } = req.params; // Отримання токена з параметрів запиту

    // Пошук користувача за токеном верифікації
    const user = await User.findOne({ verificationToken});

    // Якщо користувач не знайдений, повертаємо статус 404 та повідомлення "User not found"
    if (user === null) {
      return res.status(404).json({ message: "User not found" });
    }

    // Оновлення користувача: встановлюємо verify в true та обнуляємо verificationToken
    await User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: null,
    });

    // Повертаємо відповідь про успішну верифікацію
    res.json({ message: "Verification successful!" });
  } catch (error) {
    next(error);
  }
}

async function resendVerificationEmail(req, res, next) {
  try {
    const { email } = req.body;

    // Перевірка, чи вказана електронна пошта
    if (!email) {
      return res.status(400).json({ message: "Missing required field email" });
    }

    // Пошук користувача за електронною поштою
    const user = await User.findOne({ email });

    // Якщо користувач не знайдений, повертаємо статус 404 та повідомлення "User not found"
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Якщо користувач вже верифікований, повертаємо статус 400 та повідомлення
    if (user.verify) {
      return res
        .status(400)
        .json({ message: "Verification has already been passed" });
    }

    // Генерація нового токена, якщо користувач не має токена верифікації

    const verificationToken = user.verificationToken || nanoid();

    // Відправка електронного листа з токеном верифікації
    await mail.sendMail(
      {
        to: email,
        from: "ignatenkoa2103@gmail.com",
        subject: "Email Verification",
        html: `To confirm you email please click on <a href="http://localhost:3000/api/users/verify/${verificationToken}">link</a>`,
        text: `To confirm you email please open the link http://localhost:3000/api/users/verify/${verificationToken}`,
      },
      verificationToken
    );

    // Оновлення токена верифікації у користувача, якщо потрібно
    if (!user.verificationToken) {
      await User.findByIdAndUpdate(user._id, { verificationToken });
    }

    // Повертаємо відповідь про успішне відправлення листа
    res.status(200).json( { email: email });
  } catch (error) {
    next(error);
  }
}



export default {
  changeAvatar,
  verifyEmail,
  resendVerificationEmail
};