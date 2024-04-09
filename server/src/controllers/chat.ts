import {
  collectionChat,
  collectionChatInfo,
  collectionInfo,
} from "./../models/collection";
import { Request, Response } from "express";
import * as NewResponse from "../utils/response";
import { Server } from "socket.io";
import { socketMessage } from "../utils/socket";
import { chatInfo, ChatType, RequestCustom } from "../utils/interface";
export default class Chat {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }
  public getChatByUser = async (request: Request, res: Response) => {
    const req = request as RequestCustom
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
        .project({ _id: 0, name: 1, avatar: 1, idUser: 1, online:1})
        .toArray();
      const chatDetail = await collectionChat
        .aggregate([
          { $match: { idChat: { $in: getIdChat } } },
          { $sort: { timestamp:-1, time: -1 } },
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
          .sort({timestamp:1,time: 1 })
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
  public sendMessage = async (request: Request, res: Response) => {
    const req = request as RequestCustom
    const idUser = req.idUser;
    const data = req.body;
    const listUserSplit = data.id.split("-");
    const resultData: ChatType = {
      idChat: data.id,
      sender: idUser,
      message: data.message,
      timestamp: data.timestamp,
      time: data.time,
      status: "sent",
    };
    const chatInfo = {
      idChat: data.id,
      listUser: [listUserSplit[1], listUserSplit[2]],
      typeChat: "individual",
      timestampUpdate:data.timestamp,
      timeUpdate:data.time
    };
    const options = { returnOriginal: false, includeResultMetadata: false };
    const findChatInfo = await collectionChatInfo.find({ listUser: {$all:[listUserSplit[1], listUserSplit[2]] , $size:2} }).toArray()
    if(findChatInfo.length === 0){
      collectionChatInfo.insertOne(chatInfo)
    }else{
      collectionChatInfo.findOneAndUpdate(
        { listUser: {$all:[listUserSplit[1], listUserSplit[2]] , $size:2} },
        {$set:{timestampUpdate:data.timestamp,timeUpdate:data.time}},
        options
      )
    }
    collectionChat
      .insertOne(resultData)
      .then((result) => {
        if (result.acknowledged && result.insertedId) {
          socketMessage(this.io,resultData)
          /* this.io.emit("/message", resultData); */
          NewResponse.responseDataMessage(
            res,
            201,
            { _id: result.insertedId },
            "Sent message is success"
          );
        } else {
          NewResponse.responseMessage(res, 422, "Send message is failure");
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
