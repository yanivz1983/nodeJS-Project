import { Document, Schema, model } from "mongoose";

export interface ILoginAttempt extends Document {
  email: string;
  status: string;
  password: string;
}

const loginAttemptSchema = new Schema({
  email: { type: String, required: true },
  status: { type: String, required: true },
  password: { type: String, required: true },
});

const LoginAttempt = model<ILoginAttempt>("LoginAttempt", loginAttemptSchema);

export default LoginAttempt;
