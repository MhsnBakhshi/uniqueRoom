import { Document, model, Model, Schema } from "mongoose";

export interface IBan extends Document {
  _id: string;
  phone: string;
}

type BanModelType = Model<IBan>;

const schema = new Schema<IBan>(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const BanModel: BanModelType = model<IBan>("Ban", schema);

export default BanModel;
