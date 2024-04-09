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
}
export interface ChatType {
  idChat: string;
  sender: string;
  message: string;
  timestamp: string;
  time: string;
  status: string;
}
