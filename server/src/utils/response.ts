
export const responseMessage = (res:any,status:number,message:String) => {
    res.status(status).json({status:status,message:message})
}
export const responseData = (res:any,status:number,data:any) => {
    res.status(status).json({status:status,data:data})
}
export const responseDataMessage = (res:any,status:number,data:any,message:String) => {
    res.status(status).json({status:status,message:message,data:data})
}