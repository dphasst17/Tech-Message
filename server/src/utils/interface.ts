import { Request } from "express";
import jwt from "jsonwebtoken";
export interface JwtPayloadCustom extends jwt.JwtPayload {
  exp: number;
}
export interface RequestCustom extends Request {
  idUser: string;
}
export interface AuthReq {
  username: string;
  password: string;
}
export interface chatInfo {
  idChat: string;
  listUser: string[];
  typeChat: string;
  timeUpdate?:string,
  timestampUpdate?:string
}
export interface ChatType {
  idChat: string;
  sender: string;
  name?:string;
  avatar?:string;
  message: string;
  timestamp: string;
  time: string;
  status?: string;
}
export interface GroupChat{
  idGroup?:string,
  nameGroup?:string,
  avatarGroup?:string,
  updateAt?:string,
  userUpdateAt?:string,
  messageUpdate?:string
}