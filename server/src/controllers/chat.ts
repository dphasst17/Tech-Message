import {
  collectionChat,
  collectionChatInfo,
  collectionGroupInfo,
  collectionInfo,
} from "./../models/collection";
import { Request, Response } from "express";
import * as NewResponse from "../utils/response";
import { Server } from "socket.io";
import { socketCreateGroup, socketMessage } from "../utils/socket";
import {
  chatInfo,
  ChatType,
  RequestCustom,
  GroupChat,
} from "../utils/interface";
export default class Chat {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  public createGroupMessage = async (request: Request, res: Response) => {
    const req = request as RequestCustom;
    const idUser = req.idUser;
    const data = req.body;
    const insertChatData: chatInfo = {
      idChat: data.idChat,
      listUser: data.listUser,
      typeChat: "group",
      timestampUpdate: data.timestamp,
      timeUpdate: data.time,
    };
    const insertGroupData: GroupChat = {
      idGroup: data.idChat,
      avatarGroup: data.avatar,
      nameGroup: data.name,
      messageUpdate: data.message,
      updateAt: data.timestamp,
      userUpdateAt: idUser,
    };
    try {
      const [chatData, groupInfo] = await Promise.all([
        collectionChatInfo.insertOne(insertChatData),
        collectionGroupInfo.insertOne(insertGroupData),
      ]);
      if (!chatData.acknowledged || !groupInfo.acknowledged) {
        if (!chatData.acknowledged) {
          collectionGroupInfo.deleteOne({ idGroup: data.idChat });
        }
        if (!groupInfo.acknowledged) {
          collectionChatInfo.deleteOne({ idChat: data.idChat });
        }
        return NewResponse.responseMessage(res, 401, "Creating groups failed");
      }
      const dataCreateGroup = {
        listUser:data.listUser,
        idChat: data.idChat,
        typeChat: "group",
        userData: {
          idUser: data.idChat,
          name: data.name,
          avatar: data.avatar,
          online: false,
        },
        detail: {
          sender: idUser,
          message: data.message,
          timestamp: data.timestamp,
          time: data.time,
        },
      };
      socketCreateGroup(this.io, dataCreateGroup);
      NewResponse.responseMessage(res, 201, "Create a successful group");
    } catch {
      (err: any) =>
        NewResponse.responseMessage(
          res,
          500,
          "A server error occurred. Please try again in 5 minutes."
        );
    }
  };
  public getChatByUser = async (request: Request, res: Response) => {
    const req = request as RequestCustom;
    const idUser = req.idUser;
    try {
      const getChat = await collectionChatInfo
        .find({ listUser: { $in: [idUser] } })
        .project({ idChat: 1, listUser: 1, typeChat: 1, _id: 0 })
        .sort({ timestampUpdate: -1, timeUpdate: -1 })
        .toArray();

      const getIdUser = getChat.map(
        (e) => e.listUser.filter((f: string) => f !== idUser)[0]
      );
      const getGroupId = getChat.filter(e => e.typeChat === "group")[0]?.idChat

      const getIdChat = getChat.map((e) => e.idChat);
      const infoUser = await collectionInfo
        .find({ idUser: { $in: getIdUser } })
        .project({ _id: 0, name: 1, avatar: 1, idUser: 1, online: 1 })
        .toArray();
      const infoGroup = getGroupId && await collectionGroupInfo.find({idGroup:getGroupId}).toArray()

      const chatDetail = await collectionChat
        .aggregate([
          { $match: { idChat: { $in: getIdChat } } },
          { $sort: { timestamp: -1, time: -1 } },
          { $group: { _id: "$idChat", message: { $first: "$$ROOT" } } },
          { $replaceRoot: { newRoot: "$message" } },
        ])
        .project({ _id: 0, status: 0 })
        .toArray();
      const result = getChat.map((e) => {
        return {
          idChat: e.idChat,
          typeChat: e.typeChat,
          userData:e.typeChat !== "group" 
          ? infoUser.filter((f) => e.listUser.includes(f.idUser))[0]
          : infoGroup.filter((f:any) => f.idGroup === e.idChat).map((i:any) => ({
            idUser:i.idGroup,
            name:i.nameGroup,
            avatar:i.avatarGroup,
            online:false
          }))[0],
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
      NewResponse.responseData(res, 200, result);
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
        {$or:[
          { listUser: { $all: [listUserSplit[1], listUserSplit[2]], $size: 2 } },
          {idChat:idChat}
        ]},
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
        insertChat.typeChat === "group" ?
        collectionChat.aggregate([
          { $match: { idChat: idChat } },
          {
            $lookup: {
              from: "info",
              localField: "sender",
              foreignField: "idUser",
              as: "userInfo"
            }
          }

        ]).toArray()
        :collectionChat
        .find({ idChat: idChat })
        .project({ status: 0 })
        .sort({ timestamp: 1, time: 1 })
        .toArray()
        
      ]);
      const result = insertChat.typeChat !== "group" 
      ? getChat
      : getChat.map(e => {
        let copy = {...e};
        copy.avatar = copy.userInfo[0].avatar
        copy.name = copy.userInfo[0].name
        delete copy.userInfo; 
        return copy
      })
      NewResponse.responseData(res, 200, result);
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
    const req = request as RequestCustom;
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
      timestampUpdate: data.timestamp,
      timeUpdate: data.time,
    };
    const findChatInfo = await collectionChatInfo
      .find({
        $or:[{listUser: { $all: [listUserSplit[1], listUserSplit[2]], $size: 2 }},{idChat:data.id}]
      })
      .toArray();
    if (findChatInfo.length === 0) {
      collectionChatInfo.insertOne(chatInfo);
    }
    collectionChat
      .insertOne(resultData)
      .then((result) => {
        if (result.acknowledged && result.insertedId) {
          if(listUserSplit[1] === "group"){
            resultData.avatar = data.avatar
            resultData.name = data.name
            
          }
          socketMessage(this.io, resultData);
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
}
