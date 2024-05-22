import express from "express";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";
import contactsRouter from "./routes/contactsRouter.js";
import "./db.js";

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api", contactsRouter);

// Handle 404 Error
app.use((_, res) => {
  res.status(404).json({ message: "Not found" });
});

// Handle Application Error
app.use((error, req, res, next) => {
  console.error(error);
  res
    .status(error.status || 500)
    .send(error.message || "Internal Server Error");
});


app.listen(3000, () => {
  console.log("Server is running. Use our API on port: 3000");
});
