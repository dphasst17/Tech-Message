import { useContext, useEffect, useState } from "react"
import { Avatar, Button, Code, Input,useDisclosure } from "@nextui-org/react"
import { StateContext } from "../../../context/stateContext"
import { removeLocalStorage } from "../../../utils/localStorage"
import { useNavigate } from "react-router-dom"
import { FaUserEdit } from "react-icons/fa";
import { searchUser } from "../../../api/userApi"
import { CiSearch } from "react-icons/ci";
import Result from "./searchResult"
import ModalSearch from "../modal/search"
import BadgeNav from "./badget"
import FriendList from "./friendList"
import MessageList from "./messageList"
const ChatNav = () => {
    const navigate = useNavigate();
    const { user, isLogin, setIsLogin } = useContext(StateContext)
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [modalName, setModalName] = useState("")
    const [searchValue, setSearchValue] = useState("");
    const [resultData, setResultData] = useState([])
    const handleLogOut = () => {
        removeLocalStorage('chatLog');
        removeLocalStorage('exp')
        setIsLogin(false)
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
        <nav className="chatNav relative w-1/4 h-full flex flex-col items-center pt-1">
            <Input type="text"
                value={searchValue}
                onChange={(e) => { handleSearchChange(e) }}
                radius="sm"
                classNames={{
                    inputWrapper: ["border-zinc-400 border border-solid"],
                    input: ["text-white"]
                }}
                onKeyDown={(e: any) => { if (e.keyCode === 13 && searchValue !== "") { setModalName("search"), onOpen() } }}
                className="h-[38px]" placeholder="Search..."
                endContent={
                    <Button className="h-3/4" color="primary" radius="sm" isIconOnly onPress={onOpen} onClick={() => { searchValue !== "" && setModalName("search") }}><CiSearch className="font-bold text-[18px]" /></Button>
                }
            />
            {searchValue !== "" && <Result data={resultData} setSearchValue={setSearchValue} setModalName={setModalName} onOpen={onOpen} />}
            {user?.map((u: any) => <div className="user w-full h-[10%] flex justify-evenly items-center" key={u.idUser}>
                <div className="w-1/5">
                    <Avatar radius="lg" className="w-4/5 !h-[60px]"
                        src={u.avatar !== "" ? u.avatar
                            : "https://static0.gamerantimages.com/wordpress/wp-content/uploads/2023/07/gojo-vs-sukuna-jujutsu-kaisen.jpeg"}
                    />
                </div>
                <div className="info w-4/5 h-full flex flex-wrap content-around">
                    <Code className="w-[80%] h-2/5 text-[20px] flex items-center justify-center text-white" color="primary">{u.name}</Code>
                    <BadgeNav />
                    <FriendList/>
                    <Button isIconOnly className="mx-2 flex items-center justify-center" color="primary"><FaUserEdit className="text-[15px]" /></Button>
                    <Button radius="sm" className="font-bold" color="danger" onClick={handleLogOut}>{isLogin ? 'LOGOUT' : 'LOGIN'}</Button>
                </div>
            </div>)}
            <MessageList />
        </nav>
        {modalName === "search" && <ModalSearch value={searchValue} isOpen={isOpen} onOpenChange={onOpenChange} setModalName={setModalName} />}
    </>
}

export default ChatNav