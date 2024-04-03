export const authLogin = async(data:{username:string,password:string}) => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/auth/login`,{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(data)
    }).then(res => res.json())
}
export const authRegister = async(data:{username:string,password:string,name:string,email:string}) => {
    return fetch(`${import.meta.env.VITE_REACT_APP_URL}/auth/register`,{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(data)
    }).then(res => res.json())
}