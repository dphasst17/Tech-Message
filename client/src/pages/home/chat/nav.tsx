import { useState } from "react"
import MessageUi from "../../../components/ui/message"
import { Button } from "@nextui-org/react"
const ChatNav = () => {
    const [slice,setSlice] = useState(10)
    const arrData:number[] = [1,2,3,4,5,6,7,8,9,10,11,12,13,14]
    const handleSetSlice = () => {
        slice < arrData.length ? setSlice(slice + 10 > arrData.length ? slice + (arrData.length - slice) : slice + 10) : setSlice(10)
    }
  return <nav className="chatNav w-1/4 h-full flex flex-col items-center">
    <div className="navContent w-full h-4/5 flex flex-col items-center rounded-lg overflow-y-auto">
        {arrData.slice(0,slice).map(e => 
            <MessageUi className="w-4/5 min-h-[60px] overflow-hidden my-1" color='default' content={`Test messUI - ${e}`} />
        )}
    </div>
    <Button className="w-[150px] my-2" onClick={handleSetSlice}>{slice === arrData.length ? 'Hide' : 'Show more' }</Button>
  </nav>
}

export default ChatNav