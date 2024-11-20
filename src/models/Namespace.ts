import {
  Document,
  Model,
  model,
  ObjectId,
  PopulatedDoc,
  Schema,
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
  messages: IMessage[];
  media: IMedia[];
  locations: ILocation[];
}
export interface INamespace {
  _id: string;
  title: string;
  href: string;
  rooms?: IRooms[];
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