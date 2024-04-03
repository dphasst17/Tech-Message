export const getUser = async(token:string) => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/user`,{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'Authorization' : `Bearer ${token}`
        }
    }).then(res => res.json())
}
export const updateUser = async(token:string,data:{name:string,email:string}) => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/user`,{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'Authorization' : `Bearer ${token}`
        },
        body:JSON.stringify(data)
    }).then(res => res.json())
}
export const addFriend = async(token:string,data:{friendId:string}) => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/user/friend`,{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${token}`
        },
        body:JSON.stringify(data)
    }).
    then(res => res.json())
}
export const searchUser = async(value:string) => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/user/search/${value}`).
    then(res => res.json())
}
export const searchUserDetail = async(token:string,value:string) => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/user/search`,{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${token}`
        },
        body:JSON.stringify({value:value})
    }).
    then(res => res.json())
}
export const getNotiByUser = async(token:string) => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/noti`,{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${token}`
        }
    }).
    then(res => res.json())
}
export const changeFriendInvitations = async(token:string,id:string,idNoti:string,type:string) => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/user/friend`,{
        method:'PATCH',
        headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${token}`
        },
        body:JSON.stringify({type:type,id:id,idNoti:idNoti})
    }).
    then(res => res.json())
}