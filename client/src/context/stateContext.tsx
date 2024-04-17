
import { createContext, useState,  } from "react";
import { getLocalStorage } from "../utils/localStorage";

export const StateContext = createContext<any>({});
export const StateProvider = ({children}:{children:React.ReactNode}) => {
    const [user,setUser] = useState<any[] | null>(null)
    const [friend,setFriend] = useState<any[] | null>(null)
    const [dataChat,setDataChat] = useState<any[]>([])
    const [isLogin,setIsLogin] = useState<boolean>(getLocalStorage('chatLog',false))
    const [noti,setNoti] = useState()
    const [chatId,setChatId] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [currentUserChat,setCurrentUserChat] = useState<any>({idUser:"",name:"",avatar:""});
    const [nav,setNav] = useState<boolean>(true)
    const toggleNav = () => {
        setNav(!nav)
    }
    return (
        <StateContext.Provider value={{
            user,setUser,
            friend,setFriend,
            dataChat,setDataChat,
            isLogin,setIsLogin,
            noti,setNoti,
            chatId,setChatId,
            searchValue, setSearchValue,
            currentUserChat,setCurrentUserChat,
            nav,setNav,
            toggleNav
        }}>
            {children}
        </StateContext.Provider>
    )
}