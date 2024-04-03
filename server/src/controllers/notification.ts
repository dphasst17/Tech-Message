import { Request, Response } from "express";
import { RequestCustom } from "./auth";
import { collectionNotification } from "../models/collection";
import * as NewResponse from "../utils/response"

export default class Notification {
    public getNotiByUser = (req:RequestCustom,res:Response) => {
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