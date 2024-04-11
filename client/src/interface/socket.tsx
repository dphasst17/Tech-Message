export interface socketMessage {
    idChat: string,
    sender: string,
    message: string,
    timestamp: string,
    time: string
}
export interface socketFriendNoti {
    idNoti:string,
    from:string,
    to:string,
    avatar:string,
    createdAt:string,
    name:string,
}