import { createContext, useContext, useEffect } from "react";
import { StateContext } from "./stateContext";
import { GetToken } from "../utils/token";
import { getNotiByUser, getUser } from "../api/userApi";

export const ApiContext = createContext({});
export const ApiProvider = ({ children }: { children: React.ReactNode }) => {
    const { isLogin, setUser,setNoti } = useContext(StateContext)
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
                if(res.status === 200){
                    setNoti(res.data)
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