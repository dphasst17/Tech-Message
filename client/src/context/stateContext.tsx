
import { createContext, useState,  } from "react";
import { getLocalStorage } from "../utils/localStorage";

export const StateContext = createContext<any>({});
export const StateProvider = ({children}:{children:React.ReactNode}) => {
    const [user,setUser] = useState<any[] | null>(null)
    const [isLogin,setIsLogin] = useState<boolean>(getLocalStorage('chatLog',false))
    const [noti,setNoti] = useState()
    return (
        <StateContext.Provider value={{
            user,setUser,
            isLogin,setIsLogin,
            noti,setNoti
        }}>
            {children}
        </StateContext.Provider>
    )
}