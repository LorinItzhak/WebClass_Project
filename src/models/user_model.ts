import mongoose from "mongoose";
export interface iUser {
  username: string,
  email: string,
  password: string,
  picture?: string,
  _id?: string,
  refreshTokens?: string[],
  
}
const userSchema = new mongoose.Schema<iUser>({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
    default: "../../public/avatar.png"
    },
  refreshTokens: {
    type: [String],
    default: [],
  }
});
const userModel = mongoose.model<iUser>("users", userSchema);
export default userModel;