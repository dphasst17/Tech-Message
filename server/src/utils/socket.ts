export const socketUserStatus = (io:any,status:string,idUser:string) => {
    return io.emit(status,idUser)
}
export const socketMessage = (io:any,data:any) => {
    return io.emit('/message',data)
}
export const socketNoti = (io:any,data:any) => {
    return io.emit('friend',data)
}
export const socketCreateGroup = (io:any,data:any) => {
    return io.emit('group/create',data)
}