import { useEffect, useState } from "react"
import { GetToken } from "../../../utils/token"
import { addFriend, searchUserDetail } from "../../../api/userApi"
import { Button, Modal, ModalFooter, ModalContent, ModalHeader, ModalBody, Listbox, ListboxItem, Avatar } from "@nextui-org/react"
import { IoPersonAddOutline } from "react-icons/io5";
const ModalSearch = ({ value, isOpen, onOpenChange, setModalName }: { value: string, isOpen: boolean, onOpenChange: () => void, setModalName: React.Dispatch<React.SetStateAction<string>> }) => {
  const [result, setResult] = useState<any[]>([])
  useEffect(() => {
    const token = GetToken()
    token && searchUserDetail(token, value)
      .then(res => {
        setResult(res.data)
      })
  }, [value])
  const handleAddFriend = (idFriend:string) => {
    const token = GetToken()
    token && addFriend(token,{friendId:idFriend})
    .then(res=> {
      setResult(result.map((e:any) => {
        return {
          ...e,
          relationshipStatus:e.idUser === idFriend ? "pending": e.relationshipStatus
        }
      }))
      alert(res.message)
    })
    
  }
  return <Modal
    isOpen={isOpen}
    onOpenChange={() => { setModalName(""); onOpenChange() }}
  >
    <ModalContent>
      {(onClose) => (
        <>
          <ModalHeader className="flex flex-col gap-1">Search</ModalHeader>
          <ModalBody>
            <Listbox aria-label="Action">
              {result.map((u: any) => <ListboxItem key={u.idUser} classNames={{title:['text-[20px] font-bold truncate']}}
                startContent={
                  <Avatar src={u.avatar} radius="sm"/>
                }
                endContent={
                  <Button isIconOnly={u.relationshipStatus === "none" ? true : false} color="primary" onClick={() => {if(u.relationshipStatus === "none"){handleAddFriend(u.idUser)}}}>
                    {u.relationshipStatus === "none" ? <IoPersonAddOutline className="text-[17px] font-bold" /> : u.relationshipStatus.toUpperCase()}
                  </Button>
                }>
                {u.name}
              </ListboxItem>)}
            </Listbox>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={() => { onClose(); setModalName("") }}>
              Close
            </Button>
          </ModalFooter>
        </>
      )}
    </ModalContent>
  </Modal>
}

export default ModalSearch