import mongoose from "mongoose";

// to create a model you need to create a schema for it first

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  isAdmin: { type: Boolean, required: true, default: false },
  }, {
    timestamps: true,
  }

);

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User 