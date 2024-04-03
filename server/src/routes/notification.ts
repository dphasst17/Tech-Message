import express from "express";
import Notification from "../controllers/notification";
import MiddleWare from "../middleware/middle";
const router = express.Router()
const Notifications = new Notification();
const Middle = new MiddleWare()
router.post('/',Middle.verify as any,Notifications.getNotiByUser as any)
export default router