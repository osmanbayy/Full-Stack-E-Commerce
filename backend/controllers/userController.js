import validator from "validator";
import bcrypt from "bcryptjs";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendVerificationEmail, sendResendVerificationEmail } from "../utils/emailService.js";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Route for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User doesn't exists!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      // Check if email is verified
      if (!user.isEmailVerified) {
        return res.json({ 
          success: false, 
          message: "Please verify your email before logging in. Check your inbox for the verification link.",
          requiresVerification: true,
          email: user.email
        });
      }
      
      const token = createToken(user._id);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials!" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Route for user register
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // checking user already exist or not
    const exists = await userModel.findOne({ email });

    if (exists) {
      return res.json({ success: false, message: "User already exists!" });
    }

    // Validating email format and strong password
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email!",
      });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password must be greater than 8 characters!",
      });
    }

    // hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpiry = new Date();
    verificationTokenExpiry.setHours(verificationTokenExpiry.getHours() + 24); // 24 hours expiry

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      isEmailVerified: false,
      emailVerificationToken: verificationToken,
      emailVerificationTokenExpiry: verificationTokenExpiry,
    });

    const user = await newUser.save();

    // Send verification email
    const emailResult = await sendVerificationEmail(email, verificationToken, name);
    
    if (!emailResult.success) {
      console.error("Failed to send verification email:", emailResult.error);
      // Still return success but warn about email
      return res.json({ 
        success: true, 
        message: "Account created but verification email could not be sent. Please contact support.",
        requiresVerification: true
      });
    }

    res.json({ 
      success: true, 
      message: "Account created successfully! Please check your email to verify your account.",
      requiresVerification: true
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Route for admin login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.json({success: true, token})
    }else{
      res.json({success: false, message: 'Invalid credentials!'});
    }
  } catch (error) {
    console.log(error);
    res.json({success: false, message: error.message});
  }
};

// Get user data
const getUserData = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.json({
        success: false,
        message: "User ID is required.",
      });
    }

    const user = await userModel.findById(userId).select("-password");
    
    if (!user) {
      return res.json({ success: false, message: "User not found." });
    }

    res.json({ success: true, userData: user });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Verify email
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.json({ success: false, message: "Verification token is required." });
    }

    const user = await userModel.findOne({ emailVerificationToken: token });

    if (!user) {
      return res.json({ success: false, message: "Invalid or expired verification token." });
    }

    // Check if token is expired
    if (user.emailVerificationTokenExpiry < new Date()) {
      return res.json({ success: false, message: "Verification token has expired. Please request a new one." });
    }

    // Check if already verified
    if (user.isEmailVerified) {
      return res.json({ success: true, message: "Email is already verified." });
    }

    // Verify the email
    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationTokenExpiry = null;
    await user.save();

    res.json({ success: true, message: "Email verified successfully!" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Resend verification email
const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.json({ success: false, message: "Email is required." });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User not found." });
    }

    if (user.isEmailVerified) {
      return res.json({ success: false, message: "Email is already verified." });
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpiry = new Date();
    verificationTokenExpiry.setHours(verificationTokenExpiry.getHours() + 24);

    user.emailVerificationToken = verificationToken;
    user.emailVerificationTokenExpiry = verificationTokenExpiry;
    await user.save();

    // Send verification email
    const emailResult = await sendResendVerificationEmail(email, verificationToken, user.name);
    
    if (!emailResult.success) {
      return res.json({ 
        success: false, 
        message: "Failed to send verification email. Please try again later." 
      });
    }

    res.json({ success: true, message: "Verification email sent successfully!" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { loginUser, registerUser, adminLogin, getUserData, verifyEmail, resendVerificationEmail };
