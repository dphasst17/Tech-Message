import { useContext, useEffect, useState } from "react"
import MessageUi from "../../../components/ui/message"
import { Avatar, Button, Code, Input,useDisclosure } from "@nextui-org/react"
import { NotificationIcon } from "../../../components/icon/notificate"
import { StateContext } from "../../../context/stateContext"
import { removeLocalStorage } from "../../../utils/localStorage"
import { useNavigate } from "react-router-dom"
import { FaUserEdit } from "react-icons/fa";
import { searchUser } from "../../../api/userApi"
import { CiSearch } from "react-icons/ci";
import Result from "./searchResult"
import ModalSearch from "../modal/search"
import BadgeNav from "./badget"
const ChatNav = () => {
    const navigate = useNavigate();
    const { user, isLogin, setIsLogin } = useContext(StateContext)
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [modalName, setModalName] = useState("")
    const [searchValue, setSearchValue] = useState("");
    const [resultData, setResultData] = useState([])
    const [slice, setSlice] = useState(6);
    const arrData: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
    const handleLogOut = () => {
        removeLocalStorage('chatLog');
        removeLocalStorage('exp')
        setIsLogin(false)
        navigate('/auth')
    }
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value)
    }
    const handleSetSlice = () => {
        slice < arrData.length ? setSlice(slice + 6 > arrData.length ? slice + (arrData.length - slice) : slice + 6) : setSlice(6)
    }
    useEffect(() => {
        const timer = setTimeout(() => {
            searchValue !== "" && searchUser(searchValue)
                .then(res => {
                    console.log(user[0].idUser)
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
                    
                    <Button isIconOnly className="mx-2 flex items-center justify-center" color="primary"><FaUserEdit className="text-[15px]" /></Button>
                    <Button radius="sm" className="font-bold" color="danger" onClick={handleLogOut}>{isLogin ? 'LOGOUT' : 'LOGIN'}</Button>
                </div>
            </div>)}
            <div className="navContent w-full h-[80%] flex flex-wrap items-center rounded-lg overflow-y-auto">
                {arrData.slice(0, slice).map(e =>
                    <div className="detail w-full flex justify-evenly min-h-[80px] h-[80px] my-1 cursor-pointer">
                        <MessageUi className="w-4/5 h-full overflow-hidden flex items-center"
                            color='default'
                            isTruncate={true}
                            reverse={false}
                            title={`Test messUI - ${e}`}
                            content="New Yorkers are facing the winter chill with less warmth this year as the city's most revered soup stand unexpectedly shutters, following a series of events that have left the community puzzled.
                    Node.js là một môi trường chạy mã nguồn mở, đa nền tảng để phát triển các ứng dụng mạng và phía máy chủ. Mọi người nên có kiến thức cơ bản về nodejs nhé.
                    ExpressJS là một trong những framework thịnh hành nhất cho node.js. Nó được xây dựng trên mô-đun http node.js và thêm hỗ trợ cho định tuyến, phần mềm trung gian, hệ thống xem, v.v. Nó rất đơn giản và tối thiểu, không giống như các khung công tác khác.
                    MySQL là một hệ quản trị cơ sở dữ liệu quan hệ mã nguồn mở. Tên của nó là sự kết hợp giữa “My”, tên của con gái đồng sáng lập Michael Widenius và “SQL”, tên viết tắt của Structured Query Language.
                    EcmaScript (ES) là một ngôn ngữ kịch bản được chuẩn hóa cho JavaScript (JS). Phiên bản ES hiện tại được hỗ trợ trong các trình duyệt hiện đại là ES5. Tuy nhiên, ES6 giải quyết rất nhiều hạn chế của ngôn ngữ cốt lõi, giúp các nhà phát triển viết mã dễ dàng hơn.
                    Postman là một công cụ phát triển API (giao diện lập trình ứng dụng) giúp xây dựng, kiểm tra và sửa đổi các API, nó có khả năng thực hiện các loại yêu cầu HTTP khác nhau (GET, POST, PUT, v.v.v).
                    IDE (môi trường phát triển tích hợp) là một ứng dụng phần mềm cung cấp cơ sở vật chất toàn diện cho các lập trình viên máy tính để phát triển phần mềm. Một IDE thường bao gồm ít nhất một trình soạn thảo mã nguồn, xây dựng các công cụ tự động hóa và một trình gỡ lỗi. Trong trường hợp của tôi, tôi thích sử dụng mã studio trực quan hơn.
                    Và cuối cùng là Docker"
                            height="80px"
                        />
                        <Button className="w-[30px] h-[30px]" radius="sm" isIconOnly><NotificationIcon /></Button>
                    </div>
                )}
            </div>
            <Button className="w-[150px] my-2" radius="sm" onClick={handleSetSlice}>{slice === arrData.length ? 'Hide' : 'Show more'}</Button>
        </nav>
        {modalName === "search" && <ModalSearch value={searchValue} isOpen={isOpen} onOpenChange={onOpenChange} setModalName={setModalName} />}
    </>
}

export default ChatNav