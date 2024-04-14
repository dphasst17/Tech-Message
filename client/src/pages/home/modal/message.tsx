import { useContext, useState } from "react";
import { Avatar, Button, Checkbox, CheckboxGroup, Code, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { Modals } from "../../../interface/index";
import { useForm } from "react-hook-form";
import { GetToken } from "../../../utils/token";
import { StateContext } from "../../../context/stateContext";
import { GroupChat } from "../../../interface";
import { createGroupChat } from "../../../api/chatApi";
interface FormCreate{
    name:string,
    avatar:string
}
const ModalMessage = ({ isOpen, onOpenChange, setModalName }: Modals) => {
    const {user,friend,dataChat,setDataChat} = useContext(StateContext)
    const {register,handleSubmit} = useForm<FormCreate>();
    const [listUser,setListUser] = useState<string[] | any[]>([])
    const onSubmit = (data:{name:string,avatar:string}) => {
        const token = GetToken()
        const r = (Math.random() + 1).toString(36).substring(7);
        const time = new Date().toLocaleTimeString()
        const timestamp = new Date().toISOString().split("T")[0]
        const message = `${user[0]?.name} has created group chat`
        const list = [user[0]?.idUser,...listUser]
        const id = `chat-group-${r}`
        const dataInsert: GroupChat = {
            idChat:id,
            name:data.name,
            avatar:data.avatar,
            timestamp:timestamp,
            time:time,
            listUser:list,
            message:message
        }
        token && createGroupChat(token,dataInsert)
        .then(res => {
            if(res.status ===201){
                setDataChat([
                    {
                        idChat:id,
                        typeChat: "group",
                        userData:{
                            idUser:id,
                            name:data.name,
                            avatar:data.avatar,
                            online:false
                        },
                        detail:{
                            sender:user[0]?.idUser,
                            message:`You have created a chat group`,
                            timestamp:timestamp,
                            time:time
                        }
                    },
                    ...dataChat
                ])
                onOpenChange(); setModalName("")
            }
            alert(res.message)
        })
    }
    const addListUser = (idUser:string) => {
        !listUser.includes(idUser) ? setListUser([...listUser,idUser]) : setListUser(listUser.filter((l:string) => l !== idUser))
    }
    return <Modal
        isOpen={isOpen}
        onOpenChange={() => { onOpenChange(); setModalName("") }}
        placement="center"
    >
        <ModalContent>
            {(onClose) => (
                <>
                    <ModalHeader className="flex flex-col gap-1">Create group chat</ModalHeader>
                    <ModalBody>
                        <form className="w-full">
                            <Input {...register('name',{required:true})} radius="sm" className="my-1" type="text" placeholder="Group name" />
                            <Input {...register('avatar',{required:true})} radius="sm" className="my-1" type="text" placeholder="Group photo url"/>
                        </form>
                        <CheckboxGroup
                            label="Select member"
                            defaultValue={listUser}
                        >
                            {friend?.map((f:any) => <Checkbox onClick={() => {
                                addListUser(f.idUser)
                            }} 
                            value={f.idUser} 
                            key={f.idUser}
                            classNames={{wrapper:["flex"]}}
                            >
                                <Code className="flex items-center w-auto min-w-[150px]">
                                    <Avatar src={f.avatar} radius="sm" isBordered={f.online} color={f.online ? 'success' : 'default'} className="mr-2" /> 
                                    {f.name}
                                </Code>
                            </Checkbox>)}
                        </CheckboxGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="light" onPress={() => { onClose(); setModalName("") }}>
                            Close
                        </Button>
                        <Button color="success" onClick={() => {handleSubmit(onSubmit)()}}>Create</Button>
                    </ModalFooter>
                </>
            )}
        </ModalContent>
    </Modal>

}

export default ModalMessage;