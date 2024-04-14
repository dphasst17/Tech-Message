import { Button } from '@nextui-org/react'
import { IconType } from 'react-icons';

interface ButtonIcon{
  onOpen:() => void
  setModalName:React.Dispatch<React.SetStateAction<string>>,
  name:string,
  icon:IconType,
  className?:string
}
const BtnNavIcon = ({onOpen,setModalName,name,icon:Icon, className}:ButtonIcon) => {
  return <Button  onPress={onOpen} onClick={() => setModalName(name)} isIconOnly color='primary' size="sm" className={className ? className : 'mr-2'}>
    <Icon className='w-3/5 h-3/5 font-bold' />
  </Button>
}

export default BtnNavIcon