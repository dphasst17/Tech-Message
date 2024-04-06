import { Avatar, Badge, Button, Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react"
import { IoPersonAddOutline } from "react-icons/io5";
import { useContext, useEffect, useState } from "react";
import { StateContext } from "../../../context/stateContext";
import { AiOutlineDown, AiOutlineClose } from "react-icons/ai";
import { GetToken } from "../../../utils/token";
import { changeFriendInvitations } from "../../../api/userApi";
import { io } from "socket.io-client";
const BadgeNav = () => {
    const { user, noti, setNoti } = useContext(StateContext)
    const [isNew, setIsNew] = useState(false)
    useEffect(() => {
        const socket = io(`${import.meta.env.VITE_REACT_APP_URL}`)
        socket.on('connect', () => {
            console.log('Connected to the socket!');            
        })
        window.addEventListener('beforeunload', () => {
            socket.emit('user_disconnect',user[0].idUser)
        });
        /* socket.emit('user_disconnect',user[0].idUser) */
        socket?.on('friend', (friend: any) => {
            if (friend.to === user[0].idUser) {
                setIsNew(true)
                setNoti([...noti, friend])
            }
        });
        socket.on('offline',(data:string) => {
           console.log('User offline',data)     
        })
        socket.on('online',(data:string) => {
            console.log('User online',data)
        })
        // Dọn dẹp khi component unmount
        return () => {
            socket.off('friend');
            socket.close();
        };
    }, []);
    const handleChangeFriendInvitations = (idNoti: string, type: string) => {
        const token = GetToken()
        const arrSplit = idNoti.split("-")
        const id = `${arrSplit[1]}-${arrSplit[2]}`
        token && changeFriendInvitations(token, id, idNoti, type)
            .then((res: any) => {
                if (res.status === 200) {
                    setNoti(noti.filter((f: any) => f.idNoti !== idNoti))
                }
                alert(res.message)
            })

    }
    return <Popover placement="bottom-end" radius="sm" size="lg" className="w-[250px] sm:w-[300px]" showArrow={true}>
        <Badge content="" shape="rectangle" size="md" color={isNew ? "danger" : "primary"} placement="top-right">
            <PopoverTrigger>
                <Button isIconOnly className="ml-4" onClick={() => { setIsNew(false) }}><IoPersonAddOutline className="text-[20px] font-bold" /></Button>
            </PopoverTrigger>
        </Badge>
        <PopoverContent>
            <div className="px-1 py-2 w-full">
                {noti?.length !== 0 && <>
                    <div className="text-small font-bold">Friend request</div>
                    {noti?.map((n: any) => <div className="text-tiny w-full flex flex-wrap items-center">
                        <Avatar src={n.avatar} className="m-1" radius="sm" />
                        <span className="text-ellipsis w-4/5 text-[18px] mr-2">{n.name} sent you a friend request</span>
                        <Button isIconOnly color="success" radius="sm" className="m-1 text-white text-[20px] font-bold"
                            onClick={() => { handleChangeFriendInvitations(n.idNoti, 'confirm') }}
                        >
                            <AiOutlineDown />
                        </Button>
                        <Button isIconOnly color="danger" radius="sm" className="m-1 text-white text-[20px] font-bold"
                            onClick={() => { handleChangeFriendInvitations(n.idNoti, 'cancel') }}
                        >
                            <AiOutlineClose />
                        </Button>
                    </div>)}
                </>}
                {noti?.length === 0 && <div>There are no announcements</div>}
            </div>
        </PopoverContent>
    </Popover>
}

export default BadgeNav