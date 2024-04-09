import { Request, Response } from "express";
import { collectionNotification } from "../models/collection";
import * as NewResponse from "../utils/response"
import { RequestCustom } from "../utils/interface";

export default class Notification {
    public getNotiByUser = (request:Request,res:Response) => {
        const req = request as RequestCustom
        const idUser = req.idUser
        collectionNotification.find({to:idUser}).project({_id:0}).sort({createAt:-1}).toArray()
        .then(resNoti => {
            NewResponse.responseData(res,200,resNoti)
        })
        .catch((err) => {
            NewResponse.responseMessage(res,500,'A server error occurred. Please try again in 5 minutes.')
        })
    }
}