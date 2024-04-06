import { useContext, useEffect, useState } from 'react'
import MessageUi from '../../../components/ui/message'
import { Button } from '@nextui-org/react';
import { StateContext } from '../../../context/stateContext';
import { io } from 'socket.io-client';

const MessageList = () => {
    const { dataChat,setChatId,setCurrentUserChat } = useContext(StateContext)
    const [listMess,setListMess] = useState<any[]>([])
    const [slice, setSlice] = useState(6);
    const [userOline,setUserOnline] = useState<string[]>([])
    const handleSetSlice = () => {
        slice < dataChat?.length ? setSlice(slice + 6 > dataChat?.length ? slice + (dataChat?.length - slice) : slice + 6) : setSlice(6)
    }
    useEffect(() => {
        dataChat.length !== 0 && setListMess(dataChat)
    },[dataChat])

    useEffect(() => {
        const socket = io(`${import.meta.env.VITE_REACT_APP_URL}`)
        socket.on('offline', (data: string) => {
            setUserOnline(userOline.filter((f:string) => f !== data))
        })
        socket.on('online', (data: string) => {
            setUserOnline([...userOline,data])
        })
        socket.on("/message",(data) => {
            const getObj = dataChat.filter((f:any) => f.idChat === data.idChat)[0]
            const spliceObj = dataChat.filter((f:any) => f.idChat !== data.idChat)
            const result = [{...getObj,detail:{sender:data.sender,message:data.message,timestamp:data.timestamp,time:data.time}},...spliceObj]
            console.log(spliceObj)
            console.log(result)
            dataChat.length !== 0 && setListMess(result)
        })
        // Dọn dẹp khi component unmount
        return () => {
            socket.off('offline');
            socket.off('online');
            socket.close();
        };
    }, [dataChat])
    const setChat = (idChat:string,idUser:string,name:string,avatar:string) => {
        setChatId(idChat)
        setCurrentUserChat({idUser:idUser,name:name,avatar:avatar})
    }
    return <>
        <div className="navContent w-full h-[80%] flex flex-wrap content-start items-center rounded-lg overflow-y-auto">
            {listMess.slice(0, slice).map((e: any) =>
                <div onClick={() => {setChat(e.idChat,e.userData.idUser,e.userData.name,e.userData.avatar)}} className="detail w-full flex justify-evenly min-h-[80px] h-[80px] my-1 cursor-pointer">
                    <MessageUi className={`w-full h-full overflow-hidden flex items-center p-2`}
                        color='default'
                        isTruncate={true}
                        isBorder={userOline.includes(e.userData.idUser) ? true : false}
                        reverse={false}
                        title={e.userData.name}
                        src={e.userData.avatar}
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