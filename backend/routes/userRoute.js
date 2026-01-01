import express from "express";
import {loginUser,registerUser,adminLogin,getUserData,verifyEmail,resendVerificationEmail} from "../controllers/userController.js";
import authUser from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/admin", adminLogin);
userRouter.post("/user-data", authUser, getUserData);
userRouter.post("/verify-email", verifyEmail);
userRouter.post("/resend-verification", resendVerificationEmail);

export default userRouter;
