import express from "express";
import { Server } from "socket.io";
import MiddleWare from "../middleware/middle";
import Chat from "../controllers/chat";
const router = express.Router();
export default (io: Server) => {
    const ChatController = new Chat(io);
    const Middle = new MiddleWare()
    router.post('/',Middle.verify as any)
    return router;
};
