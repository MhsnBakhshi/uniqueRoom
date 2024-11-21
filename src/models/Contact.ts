import {
  Document,
  Model,
  model,
  ObjectId,
  PopulatedDoc,
  Schema,
  Types,
} from "mongoose";
import { IUser } from "./User";

export interface IContact extends Document {
  _id: string;
  user: PopulatedDoc<Document<ObjectId> & IUser>;
  contacts: Types.DocumentArray<IContactItem>;
}

export interface IContactItem {
  _id: string;
  user: PopulatedDoc<Document<ObjectId> & IUser>;
  nickname?: string;
  favorite?: boolean;
}

const contactSchemaItem = new Schema<IContactItem>(
  {
    user: {
      type: Schema.Types.ObjectId,
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

const schema = new Schema<IContact>(
  {
    user: {
      type: Schema.Types.ObjectId,
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

type ContactModelType = Model<IContact>;

const ContactModel: ContactModelType = model<IContact>("Contact", schema);

export default ContactModel;
