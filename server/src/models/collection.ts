import { client } from "./connect";

const database = client.db("ChatDB");
export const collectionAuth = database.collection("auth");
export const collectionInfo = database.collection("info");
export const collectionChat = database.collection("chat");
export const collectionChatInfo = database.collection("chatInfo");
export const collectionFriend = database.collection("friend")
export const collectionNotification = database.collection("notification")
export const collectionGroupInfo = database.collection('groupInfo')