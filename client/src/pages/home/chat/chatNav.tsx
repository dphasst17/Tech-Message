import { useContext, useEffect, useState } from "react"
import { Avatar, Badge, Button, Code, Input,useDisclosure } from "@nextui-org/react"
import { StateContext } from "../../../context/stateContext"
import { removeLocalStorage } from "../../../utils/localStorage"
import { useNavigate } from "react-router-dom"
import { FaUserEdit } from "react-icons/fa";
import { searchUser } from "../../../api/userApi"
import { CiSearch } from "react-icons/ci";
import { CgUserList } from "react-icons/cg";
import { FaRegWindowClose,FaRegEdit } from "react-icons/fa";
import { TbMessages } from "react-icons/tb";
import Result from "./searchResult"
import ModalSearch from "../modal/search"
import BadgeNav from "./badget"
import MessageList from "./messageList"
import ModalFriend from "../modal/friend"
import BtnNavIcon from "./btnNavIcon"
import ModalEdit from "../modal/edit"
import { RemoveToken } from "../../../utils/token"
import { io } from "socket.io-client"
import ModalMessage from "../modal/message"
import ModalEditAvatar from "../modal/avatar"
const ChatNav = () => {
    const navigate = useNavigate();
    const { nav,user, isLogin, setIsLogin,toggleNav } = useContext(StateContext)
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [modalName, setModalName] = useState("")
    const [searchValue, setSearchValue] = useState("");
    const [resultData, setResultData] = useState([])
    const handleLogOut = () => {
        const socket = io(`${import.meta.env.VITE_REACT_APP_URL}`)
        removeLocalStorage('chatLog');
        removeLocalStorage('exp');
        RemoveToken()
        setIsLogin(false)
        socket.emit('user_disconnect',user[0].idUser)
        navigate('/auth')
    }
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value)
    }
    useEffect(() => {
        const timer = setTimeout(() => {
            searchValue !== "" && searchUser(searchValue)
                .then(res => {
                    setResultData(res.data.filter((e: any) => user[0].idUser !== e.idUser))
                    console.log(res.data.filter((e: any) => user[0].idUser !== e.idUser))
                })
            searchValue === "" && setResultData([])
        }, 500);

        return () => clearTimeout(timer);
    }, [searchValue])

    return <>
        <nav className={`chatNav absolute md:relative w-full md:w-[55%] 2xl:w-1/4 h-lvh flex flex-col content-start p-2 md:pt-1  bg-zinc-900 md:bg-transparent ${nav ? 'translate-x-[0%]' : 'translate-x-[-150%]'} md:translate-x-[0%] transition-all z-50 md:z-0`}>
            <Button size="sm" radius="sm" color="danger" isIconOnly className="md:hidden" onClick={toggleNav}>
                <FaRegWindowClose className="text-[22px]" />
            </Button>
            <div className="w-[98%] relative flex flex-col items-center ">
                <Input type="text"
                    value={searchValue}
                    onChange={(e) => { handleSearchChange(e) }}
                    radius="sm"
                    classNames={{
                        inputWrapper: ["border-zinc-400 border border-solid"],
                        input: ["text-white"]
                    }}
                    onKeyDown={(e: any) => { if (e.keyCode === 13 && searchValue !== "") { setModalName("search"), onOpen() } }}
                    className="h-[38px] my-2" placeholder="Search..."
                    endContent={
                        <Button className="h-3/4" color="primary" radius="sm" isIconOnly onPress={onOpen} onClick={() => { searchValue !== "" && setModalName("search") }}><CiSearch className="font-bold text-[18px]" /></Button>
                    }
                />
            {searchValue !== "" && <Result data={resultData} setSearchValue={setSearchValue} setModalName={setModalName} onOpen={onOpen} />}
            </div>
            {user?.map((u: any) => <div className="user w-full h-1/5 sm:h-[15%] lg:h-[10%] flex flex-wrap sm:flex-nowrap justify-evenly items-center" key={u.idUser}>
                <div className="w-full sm:w-[15%] sm:block flex items-center justify-center">
                    <Badge placement="top-right" classNames={{badge:['w-[20px] rounded-md -ml-4 border-none']}} color="success" 
                        content={
                        <button onClick={() => {onOpen();setModalName("avatar")}} className="flex items-center justify-center !w-[30px] !h-[25px] rounded-none">
                            <FaRegEdit className="w-full h-4/5 text-white" />
                        </button>}>
                        <Avatar radius="lg" className="w-[95%] !h-[60px] object-contain"
                            src={u.avatar !== "" ? u.avatar
                                : "https://static0.gamerantimages.com/wordpress/wp-content/uploads/2023/07/gojo-vs-sukuna-jujutsu-kaisen.jpeg"}
                        />
                    </Badge>
                </div>
                <div className="info w-full sm:w-4/5 h-2/4 sm:h-full flex flex-wrap justify-start content-around">
                    <Code className="w-2/4 sm:w-[80%] max-h-[40px] h-2/5 text-[20px] flex items-center justify-center text-white" color="primary">{u.name}</Code>
                    <BadgeNav />
                    <BtnNavIcon onOpen={onOpen} setModalName={setModalName} name="friend" className="mr-2 my-auto flex items-center justify-center" icon={CgUserList}/>
                    <BtnNavIcon onOpen={onOpen} setModalName={setModalName} name="edit" className="mr-2 my-auto flex items-center justify-center" icon={FaUserEdit}/>
                    <BtnNavIcon onOpen={onOpen} setModalName={setModalName} name="message" className="mr-2 my-auto flex items-center justify-center" icon={TbMessages}/>
                    <Button radius="sm" className="font-bold" color="danger" onClick={handleLogOut}>{isLogin ? 'LOGOUT' : 'LOGIN'}</Button>
                </div>
            </div>)}
            <MessageList />
        </nav>
        {modalName === "search" && <ModalSearch value={searchValue} isOpen={isOpen} onOpenChange={onOpenChange} setModalName={setModalName} />}
        {modalName === "friend" && <ModalFriend isOpen={isOpen} onOpenChange={onOpenChange} setModalName={setModalName}/>}
        {modalName === "edit" && <ModalEdit isOpen={isOpen} onOpenChange={onOpenChange} setModalName={setModalName}/>}
        {modalName === "message" && <ModalMessage isOpen={isOpen} onOpenChange={onOpenChange} setModalName={setModalName}/>}
        {modalName === "avatar" && <ModalEditAvatar isOpen={isOpen} onOpenChange={onOpenChange} setModalName={setModalName}/>}
    </>
}

export default ChatNav