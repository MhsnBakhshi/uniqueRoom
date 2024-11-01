const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: false,
      trim: true,
    },
    profile: {
      type: String,
      required: false,
    },
    bio: {
      type: String,
      required: false,
      default: "Hey There I am using UniqueRoom WebApp.",
      trim: true,
    },
    roles: {
      type: [String],
      enum: ["ADMIN", "USER"],
      default: ["USER"],
    },
  },
  { timestamps: true }
);

const model = mongoose.model("User", schema);

module.exports = model;
