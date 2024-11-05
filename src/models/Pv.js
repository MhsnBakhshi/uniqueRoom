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
    isRead: {
      type: Boolean,
      default: false,
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
const PvSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
      trim: true,
    },
    receiver: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
      trim: true,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    isPinned: {
      type: Boolean,
      default: false,
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

const model = mongoose.model("Pv", PvSchema);

module.exports = model;
