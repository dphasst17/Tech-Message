import { Avatar, Button, Code, Input, ScrollShadow } from "@nextui-org/react"
import MessageUi from "../../../components/ui/message"
import { useContext, useEffect, useRef, useState } from "react"
import { MdOutlineInsertEmoticon } from "react-icons/md";
import { FaFileMedical } from "react-icons/fa";
import { IoImages } from "react-icons/io5";
import { IoIosSend } from "react-icons/io";
import { getChatDetail, sendMessage } from "../../../api/chatApi";
import { StateContext } from "../../../context/stateContext";
import { CiSquareInfo,CiSearch,CiPhone  } from "react-icons/ci";
import { GetToken } from "../../../utils/token";
const ChatContent = () => {
    const { chatId, user,currentUserChat } = useContext(StateContext)
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
                data: e.time !== date ? e.data : [...e.data,{
                    idChat: chatId,
                    message:inputValue,
                    sender: user[0].idUser,
                    time: time,
                    timestamp: date,
                }]
            }
        })
        const checkTime = dataMess.filter(f => f.time === date)
        token && sendMessage(token,{
            id: chatId,
            message: inputValue,
            time: time,
            timestamp: date,
        })
        .then(res => {
            if(res.status === 201){
                setDataMess(checkTime.length !== 0 ? appendObj : addNew)
                setInputValue('')
            }
        })
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value)
    }
    return <div className="chatContent w-[70%] h-full flex flex-wrap justify-center content-around bg-zinc-800 border border-solid border-zinc-400 rounded-lg p-1">
        {chatId !== "" && <div className="w-full h-[8%] flex items-center p-1 ">
            <Avatar radius="lg" className="w-[10%] !h-full" src={currentUserChat.avatar !== "" ? currentUserChat.avatar : ""} />
            <Code className="w-[75%] h-full flex items-center p-2 mx-2 text-[20px] font-bold bg-zinc-900">{currentUserChat.name}</Code>
            <div className="w-[15%] h-full flex items-center justify-around bg-zinc-900 rounded-lg">
                <CiSearch className="w-1/4 h-2/4"/>
                <CiPhone className="w-1/4 h-2/4 -scale-x-100" />
                <CiSquareInfo className="w-1/4 h-2/4" />
            </div>
        </div>}
        <ScrollShadow className="w-full h-[80%] overflow-y-auto">
            {dataMess?.map((d: any) => <>
                <p className="text-center text-slate-300 font-bold">{d.time.split("-").reverse().join("/")}</p>
                {d.data.map((e: any) => <MessageUi className="w-auto h-auto overflow-hidden my-4 flex items-center"
                    color={e.sender === user[0].idUser ? 'primary' : 'danger'} isTruncate={true} reverse={e.sender === user[0].idUser ? true : false}
                    src={e.sender === user[0].idUser ? user[0].avatar : currentUserChat.avatar} content={e.message} height="auto" width="auto" />)}
            </>)}
            <div ref={messagesEndRef} />
        </ScrollShadow>
        {chatId !== "" &&<div className="boxChat w-[99%] h-[10%] flex content-between rounded-lg">
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
                startContent={<div className="w-[15%] h-4/5 flex justify-around items-center bg-zinc-600 rounded-lg">
                    <IoImages className="w-[40px] h-[40px]  rounded-lg p-3 cursor-pointer hover:bg-zinc-400" />
                    <FaFileMedical className="w-[40px] h-[40px]  rounded-lg p-3 cursor-pointer hover:bg-zinc-400" />
                    <MdOutlineInsertEmoticon className="w-[40px] h-[40px]  rounded-lg p-3 cursor-pointer hover:bg-zinc-400" />
                </div>}
                endContent={<Button onClick={send} isIconOnly color="success"><IoIosSend className="text-white text-[20px]" /></Button>} size="lg"
            />
        </div>}
    </div>
}
export default ChatContent