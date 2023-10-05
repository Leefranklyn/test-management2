import { Schema, model } from "mongoose";

const otpSchema = new Schema({
    email: String,
    otp: String,
    timestamp: Date,
  });

export default model("Otp", otpSchema)