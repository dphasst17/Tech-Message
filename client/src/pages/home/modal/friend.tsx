import { Avatar, Button, Code, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { useContext, useEffect, useState } from "react";
import { StateContext } from "../../../context/stateContext";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { Modals } from "../../../interface/modal";

const ModalFriend = ({ isOpen, onOpenChange, setModalName }: Modals) => {
  const { friend, setChatId, setCurrentUserChat } = useContext(StateContext)
  const [dataFriend,setDataFriend] = useState<any[] | null>(null)
  const setChat = (idChat: string, idUser: string, name: string, avatar: string) => {
    setChatId(idChat)
    setCurrentUserChat({ idUser: idUser, name: name, avatar: avatar })
    onOpenChange(); setModalName("")
  }
  useEffect(() => {friend && setDataFriend(friend)},[friend])
  return <Modal
    isOpen={isOpen}
    onOpenChange={() => { onOpenChange(); setModalName("") }}
  >
    <ModalContent>
      {(onClose) => (
        <>
          <ModalHeader className="flex flex-col gap-1">Friend list</ModalHeader>
          <ModalBody>
            {dataFriend?.map((f: any) =>
              <div className="flex items-center justify-around" key={`friend-${f.name}`}>
                <Avatar isBordered={f.online} color="success" radius="sm" src={f.avatar} />
                <Code className="w-3/4 h-full flex items-center" radius="sm">{f.name}</Code>
                <Button size="sm" color="primary" isIconOnly onClick={() => {setChat(`chat-${f.idFriend}`,f.idUser,f.name,f.avatar)}}>
                  <IoChatboxEllipsesOutline />
                  </Button>
              </div>
            )}
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

export default ModalFriend