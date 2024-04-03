import { collectionChat } from "./../models/collection";
import { Request, Response } from "express";
import { RequestCustom } from "./auth";
import * as NewResponse from "../utils/response";
import { Server } from "socket.io";
interface ChatType {
  idChat: string;
  from: string;
  to: string;
  message: string;
  timestamp: string;
  status: string;
}
export default class Chat {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }
  public getChatByUser = (req: RequestCustom, res: Response) => {
    const idUser = req.idUser;
    collectionChat.aggregate([
      { $match: { to: idUser } },
      { $sort: { timestamp: -1 } },
      { $group: { _id: "$from", message: { $first: "$message" } } },
    ]);
  };
  public sendMessage = (req: RequestCustom, res: Response) => {
    const idUser = req.idUser;
    const data = req.body;
    const resultData: ChatType = {
      idChat: data.id,
      from: idUser,
      to: data.iUser,
      message: data.message,
      timestamp: data.time,
      status: "sent",
    };
    collectionChat
      .insertOne(resultData)
      .then((result) => {
        if (result.acknowledged && result.insertedId) {
          this.io.emit("/message", resultData);
          NewResponse.responseDataMessage(
            res,
            201,
            [{ _id: result.insertedId }],
            "Sent message is success"
          );
        } else {
          NewResponse.responseMessage(res, 422, "Create ticket is failure");
        }
      })
      .catch((err) =>
        NewResponse.responseMessage(
          res,
          500,
          "A server error occurred. Please try again in 5 minutes."
        )
      );
  };
  public getChatDetail = (req: RequestCustom, res: Response) => {};
  public getChatDetailInGroup = (req: Request, res: Response) => {};
}
