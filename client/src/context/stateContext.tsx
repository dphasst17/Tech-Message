
import { createContext, useState,  } from "react";
import { getLocalStorage } from "../utils/localStorage";

export const StateContext = createContext<any>({});
export const StateProvider = ({children}:{children:React.ReactNode}) => {
    const [user,setUser] = useState<any[] | null>(null)
    const [dataChat,setDataChat] = useState<any[]>([])
    const [isLogin,setIsLogin] = useState<boolean>(getLocalStorage('chatLog',false))
    const [noti,setNoti] = useState()
    const [chatId,setChatId] = useState("")
    const [currentUserChat,setCurrentUserChat] = useState<any>({idUser:"",name:"",avatar:""})
    
    return (
        <StateContext.Provider value={{
            user,setUser,
            dataChat,setDataChat,
            isLogin,setIsLogin,
            noti,setNoti,
            chatId,setChatId,
            currentUserChat,setCurrentUserChat
        }}>
            {children}
        </StateContext.Provider>
    )
}