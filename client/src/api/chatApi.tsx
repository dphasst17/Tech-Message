export const getChatByUser = async(token:string) => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/chat`,{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${token}`
        }
    }).then(res => res.json())
}
export const getChatDetail = async(idChat:string) => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/chat/detail/${idChat}`)
    .then(res => res.json())
}
export const sendMessage = async(token:string,data:{id:string,message:string,timestamp:string,time:string}) => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/chat/send`,{
        method:'PUT',
        headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${token}`
        },
        body:JSON.stringify(data)
    }).then(res => res.json()) 
}