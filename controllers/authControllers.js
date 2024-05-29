import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import HttpError from "../helpers/HttpError.js";

async function register(req, res, next) {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user !== null) {
            throw HttpError(409, "Email in use");
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = await User.create({ email, password: passwordHash });
        res.status(201).json({
            user: {
                email: newUser.email,
                subscription: newUser.subscription,
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
            throw HttpError(401,  "Email or password is wrong");
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch === false) {
            console.log("Password");
            throw HttpError(401,  "Email or password is wrong");
        }

        const token = jwt.sign(
          { id: user._id, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        // user.token = token; 
        // await user.save(); // збереження оновленого користувача

        res.json({
          token,
          user: { email: user.email, subscription: user.subscription },
        });

        // await user.findByIdAndUpdate(user._id, { token }, { new: true });
        // res.json({ token: "TOKEN"});
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

const AuthController = {register, login, logout}

export default AuthController;