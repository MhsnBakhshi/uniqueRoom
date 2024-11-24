import jwt, { JwtPayload } from "jsonwebtoken";
import { Socket } from "socket.io";
import UserModel, { IUser } from "../models/User";

export interface ICustomJwtPayload extends JwtPayload {
  userId: string;
}

export interface ICustomSocket extends Socket {
  user: IUser;
}
export default async (
  socket: Socket,
  next: (err?: Error) => void
): Promise<void> => {
  try {
    const token: string | undefined = socket.handshake.auth?.token;

    if (!token) {
      console.log("Authentication error: Token not provided");
      return next(new Error("Authentication error: Token not provided"));
    }

    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY!
    ) as ICustomJwtPayload;

    const user: IUser | null = await UserModel.findOne({ _id: payload.userId });

    if (!user) {
      console.log("User Not Found !!");
      return next(new Error("User Not Found !!"));
    }

    (socket as ICustomSocket).user = user;
    next();
  } catch (error) {
    console.log("Authentication error on socketConnection: ", error);
    return next(new Error("Authentication error on socketConnection"));
  }
};
