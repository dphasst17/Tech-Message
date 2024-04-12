import { collectionFriend, collectionInfo, collectionNotification } from "./../models/collection";
import { Request, Response } from "express";
import * as NewResponse from "../utils/response";
import { Server } from "socket.io";
import { socketNoti, socketUserStatus } from "../utils/socket";
import { RequestCustom } from "../utils/interface";
export default class Users {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }
  public getUser = async (request: Request, res: Response) => {
    const req = request as RequestCustom
    const idUser = req.idUser;
    const update = {$set:{online:true}}
    collectionInfo
      .findOneAndUpdate({ idUser: idUser },update,{returnDocument:"after"})
      .then((result) => {
        if (!result) {
          return NewResponse.responseMessage(res, 401, "User doesn't exit");
        }
        socketUserStatus(this.io,'online',idUser)
        NewResponse.responseData(res, 200, [result]);
      })
      .catch((err) =>
        NewResponse.responseMessage(
          res,
          500,
          "A server error occurred. Please try again in 5 minutes."
        )
      );
  };
  public searchUserDetail = async (request: Request, res: Response) => {
    const req = request as RequestCustom
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
    collectionInfo
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
  public getFriendByUser = async(request: Request,res: Response) => {
    const req = request as RequestCustom
    const idUser = req.idUser
    try{
      const getFriend = await collectionFriend.find({$or:[{userId:idUser},{friendId:idUser}],status:'friends'}).toArray()
      const arrUserId = getFriend.map((e:any) => e.userId)
      const arrFriendId = getFriend.map((e:any) => e.friendId)
      const result = [...arrUserId,...arrFriendId].filter((f:string) => f !== idUser)
      const friendInfo = await collectionInfo.find({idUser:{$in:result}}).project({idUser:1,name:1,avatar:1,online:1,_id:0}).toArray()
      const appendData = friendInfo.map((f:any) => {
        const filter = getFriend.filter((data:any) => data.userId === f.idUser || data.friendId === f.idUser)[0]
        return {
          ...f,
          idFriend:filter.id,
          status:filter.status
        }

      })
      NewResponse.responseData(res,200,appendData)
    }
    catch{
      (err:any) =>{
        NewResponse.responseMessage(res,500,"A server error occurred. Please try again in 5 minutes.")
      }
    }
  }
  public addFriend = async (request: Request, res: Response) => {
    const req = request as RequestCustom
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
          const dataEmit = {
            idNoti:`noti-${idUser}-${data.friendId}`,
            from: idUser,
            to: data.friendId,
            avatar: info[0].avatar,
            createdAt: new Date().toISOString().split("T")[0].split("-").reverse().join("/"),
            name: info[0].name,
          }
          socketNoti(this.io,dataEmit)
          NewResponse.responseMessage(res, 201, "Invitation sent successfully");
        })
        .catch((err) => NewResponse.responseMessage(res, 500, "Internal Server Error"))
    }
    catch{(error:any) => 
      NewResponse.responseMessage(res, 500, "Internal Server Error");
    }
  };
  public changeFriendField = (request: Request, res: Response) => {
    const req = request as RequestCustom
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
