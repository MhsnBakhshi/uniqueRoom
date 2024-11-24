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

export interface IMessage {
  _id: string;
  sender: PopulatedDoc<Document<ObjectId> & IUser>;
  content: string;
}

export interface IMedia {
  _id: string;
  sender: PopulatedDoc<Document<ObjectId> & IUser>;
  path: string;
  type: string;
}

export interface ILocation {
  _id: string;
  sender: PopulatedDoc<Document<ObjectId> & IUser>;
  x: number;
  y: number;
}
export interface IRooms {
  _id: string;
  title: string;
  image?: string;
  messages: Types.DocumentArray<IMessage>;
  media: Types.DocumentArray<IMedia>;
  locations: Types.DocumentArray<ILocation>;
}
export interface INamespace extends Document {
  _id: string;
  creator: PopulatedDoc<Document<ObjectId> & IUser>;
  title: string;
  href: string;
  rooms?: Types.DocumentArray<IRooms>;
}

const messageSchema = new Schema<IMessage>(
  {
    sender: {
      type: Schema.Types.ObjectId,
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

const locationSchema = new Schema<ILocation>(
  {
    sender: {
      type: Schema.Types.ObjectId,
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

const mediaSchema = new Schema<IMedia>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    path: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["media", "voice"],
      required: true,
    },
  },
  { timestamps: true }
);

const roomSchema = new Schema<IRooms>(
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

const namespaceSchema = new Schema<INamespace>(
  {
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
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

type NamespaceModelType = Model<INamespace>;

const NamespaceModel: NamespaceModelType = model<INamespace>(
  "Namespace",
  namespaceSchema
);

export default NamespaceModel;
