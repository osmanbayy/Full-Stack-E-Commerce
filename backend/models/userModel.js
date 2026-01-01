import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cartData: { type: Object, default: {} },
    wishList: { type: [String], default: [] },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String, default: null },
    emailVerificationTokenExpiry: { type: Date, default: null }
  },
  { minimize: false }
);

const userModel = mongoose.models.User || mongoose.model('User', userSchema);

export default userModel;