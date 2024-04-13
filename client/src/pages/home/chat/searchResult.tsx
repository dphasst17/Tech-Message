import { Avatar, Button, Listbox, ListboxItem } from "@nextui-org/react"
import { IoMdClose } from "react-icons/io";
interface SearchType { 
    data: { idUser: string, name: string, avatar: string }[], 
    setSearchValue: React.Dispatch<React.SetStateAction<string>>,
    setModalName:React.Dispatch<React.SetStateAction<string>>,
    onOpen:() => void
}
const Result = ({ data, setSearchValue,setModalName,onOpen }:SearchType) => {

    return <div className="w-full min-h-[100px] mt-2 h-auto absolute flex flex-wrap justify-center border border-solid border-zinc-100 rounded-lg bg-zinc-800 top-12 z-40 p-1">
        <Listbox className="w-full">
            {data?.slice(0, 5).map(u => <ListboxItem key={u.idUser}
                classNames={{ title: ["text-[20px] font-bold truncate"] }}
                className="!text-[25px] !fon-bold"
                startContent={
                    <Avatar radius="sm" src={u.avatar !== "" ? u.avatar : 'https://m.media-amazon.com/images/M/MV5BNGY4MTg3NzgtMmFkZi00NTg5LWExMmEtMWI3YzI1ODdmMWQ1XkEyXkFqcGdeQXVyMjQwMDg0Ng@@._V1_.jpg'} />
                }>
                {u.name}
            </ListboxItem>)}
        </Listbox>
        {data.length !== 0 && <Button onPress={onOpen} onClick={() => {setModalName("search")}} color="success" radius="sm" size="sm" className="w-1/4 text-white font-bold mr-2">View all</Button>}
        <Button className="flex" isIconOnly onClick={() => { setSearchValue("") }} color="danger" size="sm"><IoMdClose /></Button>
    </div>
}
export default Result