import express from "express";
import {loginUser,registerUser,adminLogin,getUserData} from "../controllers/userController.js";
import authUser from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/admin", adminLogin);
userRouter.post("/user-data", authUser, getUserData);

export default userRouter;
