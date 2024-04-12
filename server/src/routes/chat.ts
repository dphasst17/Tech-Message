import express from "express";
import { Server } from "socket.io";
import MiddleWare from "../middleware/middle";
import Chat from "../controllers/chat";
const router = express.Router();
export default (io: Server) => {
    const ChatController = new Chat(io);
    const Middle = new MiddleWare()
    router.post('/',Middle.verify,ChatController.getChatByUser)
    router.post('/group',Middle.verify,ChatController.createGroupMessage)
    router.get('/detail/:idChat',ChatController.getChatDetail)
    router.put('/send',Middle.verify,ChatController.sendMessage)
    return router;
};
