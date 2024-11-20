import {
  Document,
  Model,
  model,
  ObjectId,
  PopulatedDoc,
  Schema,
} from "mongoose";
import { IMedia, ILocation, IMessage } from "./Namespace";
import { IUser } from "./User";

export interface IPvMessage extends IMessage {
  isRead?: boolean;
}

export interface IPv {
  _id: string;
  sender: PopulatedDoc<Document<ObjectId> & IUser>;
  receiver: PopulatedDoc<Document<ObjectId> & IUser>;
  isBlocked?: boolean;
  isPinned?: boolean;
  messages: IPvMessage[];
  media: IMedia[];
  locations: ILocation[];
}

const messageSchema = new Schema<IPvMessage>(
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
    isRead: {
      type: Boolean,
      default: false,
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
const PvSchema = new Schema<IPv>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      trim: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
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

type PvModelType = Model<IPv>;
const PvModel: PvModelType = model<IPv>("Pv", PvSchema);

export default PvModel;
