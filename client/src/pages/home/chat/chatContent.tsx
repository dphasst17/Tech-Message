import { Avatar, Button, Code, Input, ScrollShadow,PopoverContent, Popover, PopoverTrigger } from "@nextui-org/react"
import MessageUi from "../../../components/ui/message"
import { useContext, useEffect, useRef, useState } from "react"
import { MdOutlineInsertEmoticon } from "react-icons/md";
import { FaFileMedical } from "react-icons/fa";
import { IoPersonAddOutline } from "react-icons/io5";
import { IoImages } from "react-icons/io5";
import { IoIosSend } from "react-icons/io";
import { getChatDetail, sendMessage } from "../../../api/chatApi";
import { StateContext } from "../../../context/stateContext";
import { CiSquareInfo, CiSearch, CiPhone } from "react-icons/ci";
import { GetToken } from "../../../utils/token";
import { io } from "socket.io-client";
const ChatContent = () => {
    const { toggleNav, chatId, user, currentUserChat } = useContext(StateContext)
    const [dataMess, setDataMess] = useState<any[]>([])
    const [inputValue, setInputValue] = useState('')
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    useEffect(() => {
        chatId !== "" && getChatDetail(chatId)
            .then(res => {
                const getTime = Array.from(new Set(res.data.map((e: any) => e.timestamp)))
                const result = getTime.map((t: any) => {
                    return {
                        time: t,
                        data: res.data.filter((f: any) => f.timestamp === t)
                    }
                })
                setDataMess(result)
            })
    }, [chatId])
    useEffect(() => {
        scrollToBottom();
    }, [dataMess]);
    useEffect(() => {
        const socket = io(`${import.meta.env.VITE_REACT_APP_URL}`)
        socket.on("/message", (data) => {
            console.log(data)
            if (data && chatId === data.idChat) {
                const checkTime = dataMess.filter((f: any) => f.time === data.timestamp)
                const addNew = [...dataMess, { time: data.timestamp, data: [data] }]
                const appendData = dataMess.map((d: any) => {
                    return {
                        ...d,
                        data: d.time === data.timestamp ? [...d.data, data] : d.data
                    }
                })
                checkTime.length === 0 ? setDataMess(addNew) : setDataMess(appendData)
            }
        })
        return () => {
            socket.close();
        };

    }, [dataMess])
    const send = () => {
        const token = GetToken()
        const date = (new Date().toISOString()).split("T")[0]
        const time = new Date().toLocaleTimeString()
        const addNew = [...dataMess, {
            time: date, data: [
                {
                    idChat: chatId,
                    message: inputValue,
                    sender: user[0].idUser,
                    time: time,
                    timestamp: date,
                }
            ]
        }]
        const appendObj = dataMess.map(e => {
            return {
                ...e,
                data: e.time !== date ? e.data : [...e.data, {
                    idChat: chatId,
                    message: inputValue,
                    sender: user[0].idUser,
                    time: time,
                    timestamp: date,
                }]
            }
        })
        const checkTime = dataMess.filter(f => f.time === date)
        token && sendMessage(token, {
            id: chatId,
            message: inputValue,
            time: time,
            timestamp: date,
            name: user[0]?.name,
            avatar: user[0]?.avatar
        })
            .then(res => {
                if (res.status === 201) {
                    setDataMess(checkTime.length !== 0 ? appendObj : addNew)
                    setInputValue('')
                }
            })
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value)
    }
    return <>
        <Button className="md:hidden m-1" radius="sm" isIconOnly onClick={toggleNav}>
            <Avatar src={user?.map((u: any) => u.avatar).toString()} radius="sm" />
        </Button>
        <div className="chatContent w-full md:w-[70%] h-[93%] md:h-full flex flex-wrap justify-center content-around bg-zinc-800 border border-solid border-zinc-400 rounded-lg p-1">
            {chatId !== "" && <div className="w-full h-[8%] flex items-center p-1 ">
                <Avatar radius="lg" className="w-1/5 sm:w-[10%] !h-full" src={currentUserChat.avatar !== "" ? currentUserChat.avatar : ""} />
                <Code className="w-3/4 sm:w-[65%] xl:w-[75%] h-full flex items-center p-2 mx-2 text-[20px] font-bold bg-zinc-900">{currentUserChat.name}</Code>
                <div className="w-0 sm:w-1/4 xl:w-[15%] h-full flex items-center justify-around bg-zinc-900 rounded-lg overflow-hidden">
                    <Button size="sm" radius="sm" isIconOnly className="w-1/4 h-3/4 bg-transparent ">
                        <CiSearch className="w-3/5 h-3/5" />
                    </Button>

                    <Button size="sm" radius="sm" isIconOnly className="w-1/4 h-3/4 bg-transparent ">
                        <CiPhone className="w-3/5 h-3/5 -scale-x-100" />
                    </Button>

                    <Popover backdrop="opaque" radius="sm">
                        <PopoverTrigger>
                            <Button size="sm" radius="sm" isIconOnly className="w-1/4 h-3/4 bg-transparent ">
                                <CiSquareInfo className="w-3/5 h-3/5" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[250px] min-h-[100px] flex justify-center items-start p-4">
                            <Avatar className="mx-auto" size="lg" radius="sm"
                            classNames={{base:['min-w-[100px] min-h-[80px]']}}
                               src={currentUserChat.avatar !== "" ? currentUserChat.avatar : ""}
                            />
                            <Code className="w-full flex items-center justify-center my-1 cursor-pointer" radius="sm">
                                {currentUserChat.name}
                            </Code>
                            {chatId.split("-")[1] === "group" && <Button size="sm" radius="sm" isIconOnly color="primary"><IoPersonAddOutline /></Button>}
                        </PopoverContent>
                    </Popover>
                </div>
            </div>}
            <ScrollShadow className="w-full h-[80%] overflow-y-auto">
                {dataMess?.map((d: any) => <>
                    <p className="text-center text-slate-300 font-bold">{d.time.split("-").reverse().join("/")}</p>
                    {d.data.map((e: any) => <>
                        <MessageUi className="w-auto h-auto overflow-hidden my-4 flex items-center"
                            color={e.sender === user[0].idUser ? 'primary' : 'danger'} isTruncate={true} reverse={e.sender === user[0].idUser ? true : false}
                            src={e.sender === user[0].idUser ? user[0].avatar : (e.avatar || currentUserChat.avatar)} content={e.message} height="auto" width="auto" />
                    </>)}
                </>)}
                <div ref={messagesEndRef} />
            </ScrollShadow>
            {chatId !== "" && <div className="boxChat w-[99%] h-[10%] flex content-between rounded-lg">
                <Input type="text" placeholder="Message ..." radius="sm" className="w-full !outline-none"
                    classNames={{
                        base: ["h-[75%]"],
                        mainWrapper: ["h-full"],
                        inputWrapper: ["h-full"],
                        innerWrapper: ["h-full"],
                        input: ["h-full", "text-clip"]
                    }}
                    value={inputValue}
                    onChange={(e) => { handleChange(e) }}
                    onKeyDown={(e) => { if (e.key === 'Enter') { send() } }}
                    variant="bordered" color="primary"
                    startContent={<div className="xl:w-[15%] h-4/5 hidden sm:flex justify-around items-center bg-zinc-600 rounded-lg">
                        <IoImages className="w-[40px] h-[40px]  rounded-lg p-3 cursor-pointer hover:bg-zinc-400" />
                        <FaFileMedical className="w-[40px] h-[40px]  rounded-lg p-3 cursor-pointer hover:bg-zinc-400" />
                        <MdOutlineInsertEmoticon className="w-[40px] h-[40px]  rounded-lg p-3 cursor-pointer hover:bg-zinc-400" />
                    </div>}
                    endContent={<Button onClick={send} isIconOnly color="success"><IoIosSend className="text-white text-[20px]" /></Button>} size="lg"
                />
            </div>}
        </div>
    </>
}
export default ChatContent