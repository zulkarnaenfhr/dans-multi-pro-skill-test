import express from "express";
import db from "./config/database.js";
import Users from "./models/userModels.js";
import userRouter from "./routers/userRouter.js";
import cookieParser from "cookie-parser";

const app = express();

try {
   await db.authenticate();
   await Users.sync();
   console.log("Database Online");
} catch (error) {
   console.log(error);
}

app.use(express.json());
app.use(cookieParser());
app.use(userRouter);

app.listen(5000, () => console.log("Server running on 5000"));
