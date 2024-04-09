import express from "express";
import Auth from "../controllers/auth";
import MiddleWare from "../middleware/middle";
import { Server } from "socket.io";
const router = express.Router()
export default (io: Server) => {
    const AuthController = new Auth(io);
    const Middle = new MiddleWare()
    router.post('/register',AuthController.register)
    router.post('/login',AuthController.login)
    router.patch('/password/update',Middle.verify,AuthController.updatePassword)
    return router
}