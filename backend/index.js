import express from "express";
import db from "./config/database.js";
import Users from "./models/userModels.js";
import userRouter from "./routers/userRouter.js";
import cookieParser from "cookie-parser";
import JobModel from "./models/jobModels.js";
import cors from "cors";

import dotenv from "dotenv";
import jobRouter from "./routers/jobRouter.js";

dotenv.config();

const app = express();
app.use(
   cors({
      methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
      credentials: true,
      origin: ["http://localhost:3000"],
   })
);

try {
   await db.authenticate();
   await Users.sync();
   await JobModel.sync();
   console.log("Database Online");
} catch (error) {
   console.log(error);
}

app.use(express.json());
app.use(cookieParser());
app.use(userRouter);
app.use(jobRouter);

app.listen(5000, () => console.log("Server running on 5000"));
