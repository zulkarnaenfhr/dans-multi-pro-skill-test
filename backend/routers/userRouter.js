import express from "express";
import { getUsers, loginUser, logoutUser, registerUsers } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/api/users", getUsers);
userRouter.post("/api/user", registerUsers);
userRouter.post("/api/login", loginUser);
userRouter.delete("/api/logout", logoutUser);

export default userRouter;
