import express from "express";
import { getUsers, registerUsers } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/api/users", getUsers);
userRouter.post("/api/user", registerUsers);

export default userRouter;
