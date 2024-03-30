import { Code, Avatar } from "@nextui-org/react"
type Color = "default" | "primary" | "secondary" | "success" | "warning" | "danger";
interface PropsMessage {
    className:string,
    color: Color,
    content: string
}
const MessageUi = ({ className,color, content }: PropsMessage) => {
    return <div className={className}>
        <Code className={`w-full h-full flex items-center justify-between`} color={color}>
            <Avatar radius="lg" className="w-[20%] h-4/5" src="https://static0.gamerantimages.com/wordpress/wp-content/uploads/2023/07/gojo-vs-sukuna-jujutsu-kaisen.jpeg" />
            <div className="w-[75%] h-auto">{content}</div>
        </Code>
    </div>
}

export default MessageUi