import express from "express";
import { Server } from "socket.io";
import MiddleWare from "../middleware/middle";
import Chat from "../controllers/chat";
const router = express.Router();
export default (io: Server) => {
    const ChatController = new Chat(io);
    const Middle = new MiddleWare()
    router.post('/',Middle.verify as any,ChatController.getChatByUser as any)
    router.get('/detail/:idChat',ChatController.getChatDetail)
    router.put('/send',Middle.verify as any,ChatController.sendMessage as any)
    return router;
};
