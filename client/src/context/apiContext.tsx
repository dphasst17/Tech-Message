import { createContext, useContext, useEffect } from "react";
import { StateContext } from "./stateContext";
import { GetToken } from "../utils/token";
import { getNotiByUser, getUser } from "../api/userApi";
import { getChatByUser } from "../api/chatApi";

export const ApiContext = createContext({});
export const ApiProvider = ({ children }: { children: React.ReactNode }) => {
    const { isLogin, setUser, setNoti, setDataChat } = useContext(StateContext)
    useEffect(() => {
        const token = GetToken()
        isLogin && token && (
            getUser(token)
                .then(res => {
                    if (res.status === 200) {
                        setUser(res.data)
                    }
                }),
            getNotiByUser(token)
                .then(res => {
                    if (res.status === 200) {
                        setNoti(res.data)
                    }
                }),
            getChatByUser(token)
                .then(res => {
                    if (res.status === 200) {
                        setDataChat(res.data)
                    }
                })
        )

    }, [isLogin])
    return (
        <ApiContext.Provider value={{}}>
            {children}
        </ApiContext.Provider>
    )
}