import { Button } from '@nextui-org/react'
import { IconType } from 'react-icons';

interface ButtonIcon{
  onOpen:() => void
  setModalName:React.Dispatch<React.SetStateAction<string>>,
  name:string,
  icon:IconType
}
const BtnNavIcon = ({onOpen,setModalName,name,icon:Icon}:ButtonIcon) => {
  return <Button onPress={onOpen} onClick={() => setModalName(name)} isIconOnly color='primary' className='mr-2'>
    <Icon className='text-[20px] font-bold' />
  </Button>
}

export default BtnNavIcon