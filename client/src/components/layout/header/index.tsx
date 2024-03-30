import { Badge, Button, Input } from "@nextui-org/react"
import { FcSearch } from "react-icons/fc";
import { NotificationIcon } from "../../icon/notificate";
const Header = () => {
  return <header className='w-full !h-[7vh]'>
    <nav className="flex flex-wrap justify-around items-center w-full h-full">
      <Input className="w-1/5 " radius="sm" color="default" placeholder="Search..." endContent={<Button className="h-4/5 bg-zinc-500 hover:bg-zinc-300 transition-all" radius="sm"><FcSearch className="w-full h-full" /></Button>} />
      <Button radius="sm" color="default" variant="bordered" className="text-white h-2/5">Header</Button>
      <Badge color="danger" content={5} shape="circle">
        <NotificationIcon className="fill-current" size={30} />
      </Badge>
    </nav>
  </header>
}

export default Header