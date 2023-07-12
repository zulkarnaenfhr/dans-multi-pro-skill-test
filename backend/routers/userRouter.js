import express from "express";
import { getUsers, loginUser, registerUsers } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/api/users", getUsers);
userRouter.post("/api/user", registerUsers);
userRouter.post("/api/login", loginUser);

export default userRouter;
