import { Code, Avatar } from "@nextui-org/react"
export type Color = "default" | "primary" | "secondary" | "success" | "warning" | "danger";
interface PropsMessage {
    className: string,
    color: Color,
    title?: string,
    src:string
    content:string,
    isTruncate: boolean,
    isBorder?:boolean,
    reverse:boolean,
    height:string,
    width:string,
    time?:string
}
const MessageUi = ({ className, color, title, src, content, isTruncate,isBorder, reverse, height,width,time}: PropsMessage) => {
    return <div className={className}>
        <div className={`w-full h-full flex ${reverse ? 'flex-row-reverse': 'flex-row'} items-start justify-start`}>
            <Avatar isBordered={isBorder} color="success" radius="lg" className="w-[20%] max-w-[60px] !h-[60px]" src={src !== "" ? src : "https://static0.gamerantimages.com/wordpress/wp-content/uploads/2023/07/gojo-vs-sukuna-jujutsu-kaisen.jpeg"} />
            <div className="max-w-[80%] min-w-[5%] mx-2 flex flex-col"  style={{width:width,height:height}}>
                <Code className="w-full h-full !text-white" color={color}>
                    <p>{title}</p>
                    <div className={`${isTruncate ? 'truncate' : 'text-balance'} text-xl`}>
                        {content}
                    </div>
                </Code>
                {time && <div className="text-[8px] text-slate-300 ">
                    {time.slice(0,5)}
                </div>}
            </div>
        </div>
    </div>
}

export default MessageUi