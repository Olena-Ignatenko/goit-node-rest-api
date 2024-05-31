import express from "express";
import AuthController from "../controllers/authControllers.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const usersRouter = express.Router();
const jsonParser = express.json();

usersRouter.post("/register", jsonParser, AuthController.register);
usersRouter.post("/login", jsonParser, AuthController.login);
usersRouter.post("/logout", authMiddleware, AuthController.logout);
usersRouter.get("/current", authMiddleware, AuthController.getCurrentUser);


export default usersRouter;