import {
  collectionChat,
  collectionChatInfo,
  collectionInfo,
} from "./../models/collection";
import { Request, Response } from "express";
import { RequestCustom } from "./auth";
import * as NewResponse from "../utils/response";
import { Server } from "socket.io";
interface chatInfo {
  idChat: string;
  listUser: string[];
  typeChat: string;
}
interface ChatType {
  idChat: string;
  sender: string;
  message: string;
  timestamp: string;
  time: string;
  status: string;
}
export default class Chat {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }
  public getChatByUser = async (req: RequestCustom, res: Response) => {
    const idUser = req.idUser;
    try {
      const getChat = await collectionChatInfo
        .find({ listUser: { $in: [idUser] } })
        .project({ idChat: 1, listUser: 1, typeChat: 1, _id: 0 })
        .sort({timestampUpdate:-1,timeUpdate:-1})
        .toArray();
      const getIdUser = getChat.map(
        (e) => e.listUser.filter((f: string) => f !== idUser)[0]
      );
      const getIdChat = getChat.map((e) => e.idChat);
      const infoUser = await collectionInfo
        .find({ idUser: { $in: getIdUser } })
        .project({ _id: 0, name: 1, avatar: 1, idUser: 1 })
        .toArray();
      const chatDetail = await collectionChat
        .aggregate([
          { $match: { idChat: { $in: getIdChat } } },
          { $sort: { time: -1 } },
          { $group: { _id: "$idChat", message: { $first: "$$ROOT" } } },
          { $replaceRoot: { newRoot: "$message" } },
        ])
        .project({ _id: 0, status: 0 })
        .toArray();
      const result = getChat.map((e) => {
        return {
          idChat: e.idChat,
          typeChat: e.typeChat,
          userData: infoUser.filter((f) => e.listUser.includes(f.idUser))[0],
          detail: chatDetail
            .filter((f) => e.idChat === f.idChat)
            .flatMap((c) => {
              return {
                sender: c.sender,
                message: c.message,
                timestamp: c.timestamp,
                time: c.time,
              };
            })[0],
        };
      });
      NewResponse.responseData(res,200,result)
    } catch {
      (error: any) =>
        NewResponse.responseMessage(
          res,
          500,
          "A server error occurred. Please try again in 5 minutes."
        );
    }
  };
  public getChatDetail = async (req: Request, res: Response) => {
    const idChat = req.params["idChat"];
    const listUserSplit = idChat.split("-");
    const chatInfo: chatInfo = {
      idChat: idChat,
      listUser: [listUserSplit[1], listUserSplit[2]],
      typeChat: "individual",
    };
    try {
      const insertChat = await collectionChatInfo.findOneAndUpdate(
        { listUser: {$all:[listUserSplit[1], listUserSplit[2]] , $size:2} },
        { $setOnInsert: chatInfo },
        { upsert: true }
      );
      if (insertChat === null) {
        return NewResponse.responseData(res, 200, []);
      }
      const [updateChat, getChat] = await Promise.all([
        collectionChat.updateMany(
          { idChat: idChat, status: "sent" },
          { $set: { status: "received" } }
        ),
        collectionChat
          .find({ idChat: idChat })
          .project({ status: 0 })
          .sort({ time: 1 })
          .limit(10)
          .toArray(),
      ]);
      NewResponse.responseData(res, 200, getChat);
    } catch {
      (error: any) =>
        NewResponse.responseMessage(
          res,
          500,
          "A server error occurred. Please try again in 5 minutes."
        );
    }
  };
  public sendMessage = (req: RequestCustom, res: Response) => {
    const idUser = req.idUser;
    const data = req.body;
    const resultData: ChatType = {
      idChat: data.id,
      sender: idUser,
      message: data.message,
      timestamp: data.timestamp,
      time: data.time,
      status: "sent",
    };
    const options = { returnOriginal: false, includeResultMetadata: false };
    collectionChatInfo.findOneAndUpdate({idChat:data.id},{$set:{timestampUpdate:data.timestamp,timeUpdate:data.time}},options)
    collectionChat
      .insertOne(resultData)
      .then((result) => {
        if (result.acknowledged && result.insertedId) {
          this.io.emit("/message", resultData);
          NewResponse.responseDataMessage(
            res,
            201,
            { _id: result.insertedId },
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
  public getChatDetailInGroup = (req: Request, res: Response) => {};
}
