import express from "express";
import path from "node:path";
import "dotenv/config";
import contactsRouter from "./routes/contactsRouter.js";
import "./db.js";
import usersRouter from "./routes/authRouter.js";
import authMiddleware from "./middlewares/authMiddleware.js";

const app = express();


app.use(express.json());

app.use("/api/contacts", authMiddleware, contactsRouter);
app.use("/api/users", usersRouter);
app.use("/api/avatars", express.static(path.resolve("public/avatars")));

// Handle 404 Error
app.use((_, res) => {
  res.status(404).json({ message: "Not found" });
});

// Handle Application Error
app.use((error, req, res, next) => {
  console.error(error);
  res
    .status(error.status || 500)
    .json(error.message || "Internal Server Error" );
});


app.listen(3001, () => {
  console.log("Server is running. Use our API on port: 3001");
});
