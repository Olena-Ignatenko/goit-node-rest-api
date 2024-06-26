import mongoose from "mongoose";
import gravatar from "gravatar";
import { verifyTokenRequired } from "../helpers/validationToken.js";

const userSchema = new mongoose.Schema(
  {
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
      default: null,
    },
    avatarURL: {
      type: String,
      default: function () {
        return gravatar.url(this.email, { s: "250", d: "identicon" }, true);
      },
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [function() { return !this.verify }, 'Verify token is required'],
    },
  },

  {
    versionKey: false,
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
