import { Document, model, Model, Schema } from "mongoose";

export interface IUser extends Document {
  _id: string;
  phone: string;
  name?: string;
  profile?: string;
  bio?: string;
  email?: string;
  roles?: string[];
}

type UserModelType = Model<IUser>;

const schema = new Schema<IUser>(
  {
    name: {
      type: String,
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
      trim: true,
    },
    profile: {
      type: String,
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

const UserModel: UserModelType = model<IUser>("User", schema);

export default UserModel;
