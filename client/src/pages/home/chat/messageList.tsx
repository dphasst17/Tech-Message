import { useContext, useEffect, useState } from 'react'
import MessageUi from '../../../components/ui/message'
import { Button } from '@nextui-org/react';
import { StateContext } from '../../../context/stateContext';
import { socketMessage } from '../../../interface/socket';
import { io } from 'socket.io-client';

const MessageList = () => {
    const { user,dataChat,friend,setChatId,setCurrentUserChat,setFriend,toggleNav} = useContext(StateContext)
    const [listMess,setListMess] = useState<any[]>([])
    const [slice, setSlice] = useState(6);
    const [userOnline,setUserOnline] = useState<string[]>([])
    const handleSetSlice = () => {
        slice < dataChat?.length ? setSlice(slice + 6 > dataChat?.length ? slice + (dataChat?.length - slice) : slice + 6) : setSlice(6)
    }
    useEffect(() => {
        dataChat.length !== 0 ? (
            setListMess(dataChat),
            setUserOnline(dataChat.filter((f:any) => f.userData.online === true).map((e:any) => e.userData.idUser))
        ) : setListMess([])
    },[dataChat])
    useEffect(() => {
        const socket = io(`${import.meta.env.VITE_REACT_APP_URL}`)
        socket?.on('offline', (data: string) => {
            setUserOnline(userOnline.filter((f:string) => f !== data))
            friend && setFriend(friend.map((e:any) => {
                return {
                    ...e,
                    online:e.idUser === data ? false : e.online
                }
            }))
        })
        socket?.on('online', (data: string) => {
            const checkId = userOnline.includes(data)
            !checkId && setUserOnline([...userOnline,data])
            friend && setFriend(friend.map((e:any) => {
                return {
                    ...e,
                    online:e.idUser === data ? true : e.online
                }
            }))
            
        })
        return () => {
            socket.off('offline');
            socket.off('online');
            socket.close();
        };
    },[friend])
    
    useEffect(() => {
        const socket = io(`${import.meta.env.VITE_REACT_APP_URL}`)
        socket.on("/message",(data:socketMessage) => {
            if(data){
                const splitData = data.idChat.split("-")
                const getUser = [splitData[1],splitData[2]].filter((f:string) => f !== user[0].idUser)[0]
                const getDataUser = friend.filter((f:any) => f.idUser === getUser)
                const getObj = dataChat.filter((f:any) => f.idChat === data.idChat)
                const spliceObj = dataChat.filter((f:any) => f.idChat !== data.idChat)
                const appendData = [
                    {...getObj[0],detail:{sender:data.sender,message:data.message,timestamp:data.timestamp,time:data.time}},
                    ...spliceObj]
                const addNewData = [
                    {
                        idChat:data.idChat,
                        typeChat: "individual",
                        userData:{
                            idUser:getDataUser[0]?.idUser,
                            name:getDataUser[0]?.name,
                            avatar:getDataUser[0]?.avatar,
                            online:getDataUser[0]?.online
                        },
                        detail:{
                            sender:data.sender,
                            message:data.message,
                            timestamp:data.timestamp,
                            time:data.time
                        }
                    },
                    ...spliceObj
                ]
                console.log(getUser)
                console.log(getDataUser)
                console.log(addNewData)
                getObj.length === 0 && getDataUser[0]?.online === true && setUserOnline([...userOnline,getDataUser[0]?.idUser])
                const result = getObj.length !== 0 ? appendData : addNewData
                dataChat.length !== 0 && (splitData[1] === user[0].idUser || splitData[2] === user[0].idUser) && setListMess(result)
            }
        })
        // Dọn dẹp khi component unmount
        return () => {
            socket.off('/message');
            socket.close();
        };
    }, [dataChat,userOnline,friend,user])
    const setChat = (idChat:string,idUser:string,name:string,avatar:string) => {
        setChatId(idChat)
        setCurrentUserChat({idUser:idUser,name:name,avatar:avatar})
    }
    return <>
        <div className="navContent w-full h-[80%] flex flex-wrap content-start items-center rounded-lg overflow-y-auto">
            {listMess.slice(0, slice).map((e: any) =>
                <div key={e.idChat} onClick={() => {setChat(e.idChat,e.userData.idUser,e.userData.name,e.userData.avatar),toggleNav()}} className="detail w-full flex justify-evenly min-h-[80px] h-[80px] my-1 cursor-pointer">
                    <MessageUi className={`w-full h-full overflow-hidden flex items-center p-2`}
                        color='default'
                        isTruncate={true}
                        isBorder={userOnline.includes(e.userData?.idUser) ? true : false}
                        reverse={false}
                        title={e.userData?.name}
                        src={e.userData?.avatar}
                        content={e.detail.message}
                        height="100%"
                        width="80%"
                    />
                </div>
            )}
        </div>
        {listMess.length > 6 && <Button className="w-[150px] my-2" radius="sm" onClick={handleSetSlice}>
            {slice === dataChat?.length ? 'Hide' : 'Show more'}
        </Button>}
    </>
}

export default MessageList