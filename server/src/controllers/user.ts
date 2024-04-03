import { collectionFriend, collectionInfo, collectionNotification } from "./../models/collection";
import { Request, Response } from "express";
import { RequestCustom } from "./auth";
import * as NewResponse from "../utils/response";
import { Server } from "socket.io";
export default class Users {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }
  public getUser = async (req: RequestCustom, res: Response) => {
    const idUser = req.idUser;
    collectionInfo
      .find({ idUser: idUser })
      .toArray()
      .then((result) => {
        if (result.length === 0) {
          return NewResponse.responseMessage(res, 401, "User doesn't exit");
        }

        NewResponse.responseData(res, 200, result);
      })
      .catch((err) =>
        NewResponse.responseMessage(
          res,
          500,
          "A server error occurred. Please try again in 5 minutes."
        )
      );
  };
  public searchUserDetail = async (req: RequestCustom, res: Response) => {
    const idUser = req.idUser;
    const data = req.body;
    try {
      const result = await collectionInfo
        .aggregate([
          {
            $match: {
              name: new RegExp(data.value, "i"),
              idUser: { $ne: idUser },
            },
          },
          {
            $lookup: {
              from: "friend",
              let: { idUser: idUser }, // sử dụng idUser của người tìm kiếm
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $or: [
                        {
                          $and: [
                            { $eq: ["$userId", "$$idUser"] },
                            { $eq: ["$status", "pending"] },
                          ],
                        },
                        {
                          $and: [
                            { $eq: ["$friendId", "$$idUser"] },
                            { $eq: ["$status", "accepted"] },
                          ],
                        },
                        {
                          $and: [
                            { $eq: ["$userId", "$$idUser"] },
                            { $eq: ["$status", "accepted"] },
                          ],
                        },
                        {
                          $and: [
                            { $eq: ["$friendId", "$$idUser"] },
                            { $eq: ["$status", "pending"] },
                          ],
                        },
                      ],
                    },
                  },
                },
              ],
              as: "friendInfo",
            },
          },
          {
            $addFields: {
              relationshipStatus: {
                $cond: [
                  {
                    $eq: [
                      { $arrayElemAt: ["$friendInfo.status", 0] },
                      "pending",
                    ],
                  },
                  {
                    $cond: [
                      {
                        $eq: [
                          { $arrayElemAt: ["$friendInfo.userId", 0] },
                          idUser,
                        ],
                      },
                      "pending",
                      "confirm",
                    ],
                  },
                  {
                    $ifNull: [
                      { $arrayElemAt: ["$friendInfo.status", 0] },
                      "none",
                    ],
                  },
                ],
              },
            },
          },
          {
            $project: {
              _id: 0,
              idUser: 1,
              name: 1,
              avatar: 1,
              relationshipStatus: 1,
            },
          },
        ])
        .toArray();

      NewResponse.responseData(res, 200, result);
    } catch (error) {
      NewResponse.responseMessage(res, 500, "Internal Server Error");
    }
  };

  public searchUser = (req: Request, res: Response) => {
    const value = req.params["key"];
    const result = collectionInfo
      .find({ name: new RegExp(value, "i") })
      .project({
        _id: 0,
        idUser: 1,
        name: 1,
        avatar: 1,
      })
      .limit(6)
      .toArray()
      .then((result) => {
        NewResponse.responseData(res, 200, result);
      })
      .catch((error) => {
        NewResponse.responseMessage(res, 500, "Internal Server Error");
      });
  };
  public updateUser = (req: Request, res: Response) => {
    const reqCustom = req as RequestCustom;
    const idUser = reqCustom.idUser;
    const data = req.body;
    const update = {
      $set: { name: data.name, email: data.email },
    };
    const options = { returnOriginal: false, includeResultMetadata: false };
    collectionInfo
      .findOneAndUpdate({ idUser: idUser }, update, options)
      .then((result) => {
        if (!result) {
          NewResponse.responseMessage(
            res,
            401,
            "There was an error during execution, please try again later."
          );
          return;
        }
        NewResponse.responseMessage(res, 200, "Update user is success");
      })
      .catch((err) =>
        NewResponse.responseMessage(
          res,
          500,
          "A server error occurred. Please try again in 5 minutes."
        )
      );
  };
  public addFriend = async (req: RequestCustom, res: Response) => {
    const idUser = req.idUser;
    const data = req.body;
    const result = {
      id: `${idUser}-${data.friendId}`,
      userId: idUser,
      friendId: data.friendId,
      status: "pending",
      createdAt: new Date().toISOString().split("T")[0],
      updateAt: new Date().toISOString().split("T")[0],
    };
    try{
      const [friend, info] = await Promise.all([
        collectionFriend.insertOne(result),
        collectionInfo.find({idUser:idUser}).toArray(),
      ])
      collectionNotification.insertOne({
          idNoti:`noti-${idUser}-${data.friendId}`,
          from: idUser,
          to: data.friendId,
          avatar: info[0].avatar,
          createdAt: new Date().toISOString().split("T")[0],
          name: info[0].name,
        })
        .then(n => {
          this.io.emit("friend", {
            idNoti:`noti-${idUser}-${data.friendId}`,
            from: idUser,
            to: data.friendId,
            avatar: info[0].avatar,
            createdAt: new Date().toISOString().split("T")[0].split("-").reverse().join("/"),
            name: info[0].name,
          });
          NewResponse.responseMessage(res, 201, "Add friend is success");
        })
        .catch((err) => NewResponse.responseMessage(res, 500, "Internal Server Error"))
    }
    catch{(error:any) => 
      NewResponse.responseMessage(res, 500, "Internal Server Error");
    }
  };
  //idUser,id,idNoti
  public changeFriendField = (req: RequestCustom, res: Response) => {
    const idUser = req.idUser
    const data = req.body
    collectionFriend.find({friendId:idUser,id:data.id}).toArray()
    .then(resFriend => {
      if(resFriend.length === 0){
        NewResponse.responseMessage(res,401,'Invitation does not exist')
        return
      }
      collectionNotification.findOneAndDelete({idNoti:data.idNoti})
      if(data.type === "confirm"){
        const update = {$set:{status:'friends',updateAt: new Date().toISOString().split("T")[0],}}
        const options = { returnOriginal: false, includeResultMetadata: false };
        collectionFriend.findOneAndUpdate({id:data.id},update,options)
        .then((result) => {
          if (!result) {
            NewResponse.responseMessage(res,401,"There was an error during execution, please try again later.");
            return;
          }
          NewResponse.responseMessage(res, 200, 'Confirm is success');
        })
        .catch((err) =>
          NewResponse.responseMessage(res,500,"A server error occurred. Please try again in 5 minutes.")
        );
      }
      if(data.type === "cancel"){
        collectionFriend.findOneAndDelete({id:data.id})
        .then((result:any) => {
          if (result === null) {
            NewResponse.responseMessage(res,401,"There was an error during execution, please try again later.");
            return
          }
          NewResponse.responseMessage(res, 200, 'Successfully declined a friend request');
        })
        .catch((err) =>{
          console.log(err)
          NewResponse.responseMessage(res,500,"A server error occurred. Please try again in 5 minutes.")
        }
        );
      }
    })

  };
}
