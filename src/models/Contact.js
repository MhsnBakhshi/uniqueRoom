const mongoose = require("mongoose");

const contactSchemaItem = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    nickname: {
      type: String,
      default: "",
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    contacts: {
      type: [contactSchemaItem],
      default: [],
    },
  },
  { timestamps: true }
);

const model = mongoose.model("Contact", schema);

module.exports = model;
