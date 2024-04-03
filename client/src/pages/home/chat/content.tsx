import { Button, Input, ScrollShadow } from "@nextui-org/react"
import MessageUi, { Color } from "../../../components/ui/message"
import { useEffect, useRef, useState } from "react"
import { MdOutlineInsertEmoticon } from "react-icons/md";
import { FaFileMedical } from "react-icons/fa";
import { IoImages } from "react-icons/io5";
import { IoIosSend } from "react-icons/io";
interface DataMessage {
    reverse: boolean,
    truncate: boolean,
    color: Color,
    content: string
}
const ChatContent = () => {
    const [dataMess, setDataMess] = useState<DataMessage[]>([])
    const [inputValue,setInputValue] = useState('')
    const messagesEndRef = useRef <HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [dataMess]);
    useEffect(() => {
        setDataMess([
            {
                reverse: false,
                truncate: false,
                color: 'danger',
                content: `New Yorkers are facing the winter chill with less warmth this year as the city's most revered soup stand unexpectedly shutters, following a series of events that have left the community puzzled.
                Node.js là một môi trường chạy mã nguồn mở, đa nền tảng để phát triển các ứng dụng mạng và phía máy chủ. Mọi người nên có kiến thức cơ bản về nodejs nhé.

                ExpressJS là một trong những framework thịnh hành nhất cho node.js. Nó được xây dựng trên mô-đun http node.js và thêm hỗ trợ cho định tuyến, phần mềm trung gian, hệ thống xem, v.v. Nó rất đơn giản và tối thiểu, không giống như các khung công tác khác.

                MySQL là một hệ quản trị cơ sở dữ liệu quan hệ mã nguồn mở. Tên của nó là sự kết hợp giữa “My”, tên của con gái đồng sáng lập Michael Widenius và “SQL”, tên viết tắt của Structured Query Language.
                EcmaScript (ES) là một ngôn ngữ kịch bản được chuẩn hóa cho JavaScript (JS). Phiên bản ES hiện tại được hỗ trợ trong các trình duyệt hiện đại là ES5. Tuy nhiên, ES6 giải quyết rất nhiều hạn chế của ngôn ngữ cốt lõi, giúp các nhà phát triển viết mã dễ dàng hơn.

                Postman là một công cụ phát triển API (giao diện lập trình ứng dụng) giúp xây dựng, kiểm tra và sửa đổi các API, nó có khả năng thực hiện các loại yêu cầu HTTP khác nhau (GET, POST, PUT, v.v.v).

                IDE (môi trường phát triển tích hợp) là một ứng dụng phần mềm cung cấp cơ sở vật chất toàn diện cho các lập trình viên máy tính để phát triển phần mềm. Một IDE thường bao gồm ít nhất một trình soạn thảo mã nguồn, xây dựng các công cụ tự động hóa và một trình gỡ lỗi. Trong trường hợp của tôi, tôi thích sử dụng mã studio trực quan hơn.

                Và cuối cùng là Docker`
            },
            {
                reverse: true,
                truncate: false,
                color: 'primary',
                content: `New Yorkers are facing the winter chill with less warmth this year as the city's most revered soup stand unexpectedly shutters, following a series of events that have left the community puzzled.
                Node.js là một môi trường chạy mã nguồn mở, đa nền tảng để phát triển các ứng dụng mạng và phía máy chủ. Mọi người nên có kiến thức cơ bản về nodejs nhé.

                ExpressJS là một trong những framework thịnh hành nhất cho node.js. Nó được xây dựng trên mô-đun http node.js và thêm hỗ trợ cho định tuyến, phần mềm trung gian, hệ thống xem, v.v. Nó rất đơn giản và tối thiểu, không giống như các khung công tác khác.

                MySQL là một hệ quản trị cơ sở dữ liệu quan hệ mã nguồn mở. Tên của nó là sự kết hợp giữa “My”, tên của con gái đồng sáng lập Michael Widenius và “SQL”, tên viết tắt của Structured Query Language.
                EcmaScript (ES) là một ngôn ngữ kịch bản được chuẩn hóa cho JavaScript (JS). Phiên bản ES hiện tại được hỗ trợ trong các trình duyệt hiện đại là ES5. Tuy nhiên, ES6 giải quyết rất nhiều hạn chế của ngôn ngữ cốt lõi, giúp các nhà phát triển viết mã dễ dàng hơn.

                Postman là một công cụ phát triển API (giao diện lập trình ứng dụng) giúp xây dựng, kiểm tra và sửa đổi các API, nó có khả năng thực hiện các loại yêu cầu HTTP khác nhau (GET, POST, PUT, v.v.v).

                IDE (môi trường phát triển tích hợp) là một ứng dụng phần mềm cung cấp cơ sở vật chất toàn diện cho các lập trình viên máy tính để phát triển phần mềm. Một IDE thường bao gồm ít nhất một trình soạn thảo mã nguồn, xây dựng các công cụ tự động hóa và một trình gỡ lỗi. Trong trường hợp của tôi, tôi thích sử dụng mã studio trực quan hơn.

                Và cuối cùng là Docker`
            },
        ])
    }, [])
    const sendMessage = (e:any) => {
        e.target.value !== "" && setDataMess([...dataMess, {
            reverse: true,
            truncate: false,
            color: 'primary',
            content: `${e.target.value}`

        }])
        setInputValue('')
    }
    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value)
    }
    return <div className="chatContent w-[70%] h-full flex flex-wrap justify-center content-start bg-zinc-800 rounded-lg p-1 overflow-y-auto">
        <ScrollShadow className="w-full h-[90%]">
            {dataMess?.map(e => <MessageUi className="w-auto h-auto overflow-hidden my-4 flex items-center" 
            color={e.color} isTruncate={e.truncate} reverse={e.reverse} content={e.content} height="auto" />)}
            <div ref={messagesEndRef} />
        </ScrollShadow>
        <div className="boxChat w-[99%] h-[10%] flex content-between rounded-lg">
            <Input type="text" placeholder="Message ..." radius="sm" className="w-full !outline-none"
                classNames={{
                    base: ["h-[75%]"],
                    mainWrapper: ["h-full"],
                    inputWrapper: ["h-full"],
                    innerWrapper: ["h-full"],
                    input: ["h-full","text-clip"]
                }}
                value={inputValue}
                onChange={(e) => {handleChange(e)}}
                onKeyDown={(e) => {if(e.key === 'Enter'){sendMessage(e)}}}
                variant="bordered" color="primary"
                startContent={<div className="w-[15%] h-4/5 flex justify-around items-center bg-zinc-600 rounded-lg">
                    <IoImages className="w-[40px] h-[40px]  rounded-lg p-3 cursor-pointer hover:bg-zinc-400"/>
                    <FaFileMedical className="w-[40px] h-[40px]  rounded-lg p-3 cursor-pointer hover:bg-zinc-400"/>
                    <MdOutlineInsertEmoticon className="w-[40px] h-[40px]  rounded-lg p-3 cursor-pointer hover:bg-zinc-400"/>
                </div>} 
                endContent={<Button isIconOnly color="success"><IoIosSend className="text-white text-[20px]" /></Button>} size="lg"
            />
        </div>
    </div>
}
export default ChatContent