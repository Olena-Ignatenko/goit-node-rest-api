import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import gravatar from "gravatar";
import mail from "../helpers/mail.js";
import { nanoid } from "nanoid";



async function register(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user !== null) {
      return res.status(409).json({ message: "Email in use" });
    }
    const passwordHash = await bcrypt.hash(password, 10);

    const verificationToken = nanoid();

   await mail.sendMail({
     to: email,
     from: "goit_nodejs@meta.ua",
     subject: "Verify your email",
     html: `To confirm your email please click on <a target="_blank" href="http://localhost:3000/api/users/verify/${verificationToken}">link</a>`,
     text: `To confirm your email please open the link http://localhost:3000/api/users/verify/${verificationToken}`,
   });

    

    const avatarURL = gravatar.url(email, { s: "250", d: "identicon" });
    const newUser = await User.create({
      email,
      password: passwordHash,
      avatarURL,
      verificationToken,
    });
    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
        avatarURL: newUser.avatarURL,
      },
    });

    
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user === null) {
      console.log("Email");
      return res.status(401).json({ message: "Email or password is wrong" });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch === false) {
      console.log("Password");
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    if (user.verify === false) {
      return res.status(401).json({ message: "Email is not verified" });
    } 

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    user.token = token;
    await user.save(); // збереження оновленого користувача

    res.json({
      token,
      user: { email: user.email, subscription: user.subscription },
    });
  } catch (error) {
    next(error);
  }
}

async function logout(req, res, next) {
  try {
    await User.findByIdAndUpdate(req.user.id, { token: null }, { new: true });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

async function getCurrentUser(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }
    res.json({ email: user.email, subscription: user.subscription });
  } catch (error) {
    next(error);
  }
}
const AuthController = { register, login, logout, getCurrentUser };

export default AuthController;
