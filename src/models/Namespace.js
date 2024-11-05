const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const locationSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    x: {
      type: Number,
      required: true,
    },
    y: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const mediaSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    path: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const roomSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      trim: true,
    },
    messages: {
      type: [messageSchema],
      default: [],
    },
    media: {
      type: [mediaSchema],
      default: [],
    },
    locations: {
      type: [locationSchema],
      default: [],
    },
  },
  { timestamps: true }
);

const namespaceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    href: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    rooms: {
      type: [roomSchema],
      default: [],
    },
  },
  { timestamps: true }
);

const model = mongoose.model("Namespace", namespaceSchema);

module.exports = model;
