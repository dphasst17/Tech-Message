import { NextFunction,Response } from "express";
import { RequestCustom } from "../controllers/auth";
import jwt from "jsonwebtoken";
export default class MiddleWare {
    public verify = (req: RequestCustom, res: Response, next: NextFunction) => {
        const authHeader = req.headers["authorization"];
        if (!authHeader) {return res.sendStatus(401)};
        const token = authHeader?.split(" ")[1];
        if(token){
            jwt.verify(token, process.env.SECRET_KEY as string, (err:any, data:any) => {
                if (err) res.sendStatus(403);
                req.idUser = data.id;
                next();
            });
        }else{
            res.sendStatus(403)
        }
    }
}