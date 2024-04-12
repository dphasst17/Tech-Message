import { createContext, useContext, useEffect } from "react";
import { StateContext } from "./stateContext";
import { GetToken } from "../utils/token";
import { getFriendByUser, getNotiByUser, getUser } from "../api/userApi";
import { getChatByUser } from "../api/chatApi";

export const ApiContext = createContext({});
export const ApiProvider = ({ children }: { children: React.ReactNode }) => {
    const {isLogin, setUser, setFriend, setNoti, setDataChat } = useContext(StateContext)
    useEffect(() => {
        const token = isLogin === true && GetToken();
      
        if (token) {
          const fetchData = async () => {
            try {
              const userRes = await getUser(token);
              if (userRes.status === 200) {
                setUser(userRes.data);
              }
      
              const friendRes = await getFriendByUser(token);
              if (friendRes.status === 200) {
                setFriend(friendRes.data);
              }
              
              const chatRes = await getChatByUser(token);
              if (chatRes.status === 200) {
                setDataChat(chatRes.data);
              }
      
              const notiRes = await getNotiByUser(token);
              if (notiRes.status === 200) {
                setNoti(notiRes.data);
              }
      
            } catch (error) {
              console.error('Error fetching data:', error);
            }
          };
      
          fetchData();
        }
      }, [isLogin]);
    return (
        <ApiContext.Provider value={{}}>
            {children}
        </ApiContext.Provider>
    )
}