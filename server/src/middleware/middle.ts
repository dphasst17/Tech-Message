import { NextFunction,Response,Request } from "express";
import jwt from "jsonwebtoken";
import { RequestCustom } from "../utils/interface";

export default class MiddleWare {
    public verify = (request: Request, res: Response, next: NextFunction) => {
        const req = request as RequestCustom
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