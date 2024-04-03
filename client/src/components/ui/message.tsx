import { Code, Avatar } from "@nextui-org/react"
export type Color = "default" | "primary" | "secondary" | "success" | "warning" | "danger";
interface PropsMessage {
    className: string,
    color: Color,
    title?: string,
    content:string,
    isTruncate: boolean,
    reverse:boolean,
    height:string
}
const MessageUi = ({ className, color, title,content, isTruncate, reverse, height}: PropsMessage) => {
    return <div className={className}>
        <div className={`w-full h-full flex ${reverse ? 'flex-row-reverse': 'flex-row'} items-start justify-start`}>
            <Avatar radius="lg" className="w-[20%] max-w-[60px] !h-[60px]" src="https://static0.gamerantimages.com/wordpress/wp-content/uploads/2023/07/gojo-vs-sukuna-jujutsu-kaisen.jpeg" />
            <Code className="w-auto max-w-[80%] min-w-[5%] mx-2 !text-white" style={{height:height}} color={color}>
                <p>{title}</p>
                <div className={`${isTruncate ? 'truncate' : 'text-balance'}`}>
                    {content}
                </div>
            </Code>
        </div>
    </div>
}

export default MessageUi