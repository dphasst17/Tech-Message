import { Avatar, Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { useContext, useEffect, useState } from "react";
import { StateContext } from "../../../context/stateContext";
import { useForm } from "react-hook-form";
import { Modals } from "../../../interface/index";
import { GetToken } from "../../../utils/token";
import { updateUser } from "../../../api/userApi";

interface FormValue {
    avatar: string,
}
const ModalEditAvatar = ({ isOpen, onOpenChange, setModalName }: Modals) => {
    const { user,setUser } = useContext(StateContext)
    const [urlDefault, setUrlDefault] = useState<string | null>(null)
    const { register, handleSubmit } = useForm<FormValue>()
    useEffect(() => {
        user && setUrlDefault(user[0].avatar)
    }, [user])
    const changeUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.target.value !== "" ? setUrlDefault(e.target.value) : setUrlDefault(user ? user[0].avatar : "")
    }
    const onSubmit = (data: FormValue) => {
        const token = GetToken()
        if(data.avatar === user[0].avatar){
            onOpenChange(); setModalName("")
            return
        }
        token && updateUser(token,data)
        .then(res => {
            if(res.status === 200){
                setUser(user.map((u:any) => {
                    return {
                        ...u,
                        avatar:data.avatar
                    }
                }))
                onOpenChange(); setModalName("")
            }
            alert(res.message)
        })
    }
    return <Modal
        isOpen={isOpen}
        onOpenChange={() => { onOpenChange(); setModalName("") }}
        placement="center"
    >
        <ModalContent>
            {(onClose) => (
                <>
                    <ModalHeader className="flex flex-col gap-1">Edit</ModalHeader>
                    <ModalBody>
                        {urlDefault && <Avatar src={urlDefault} radius="sm" size="lg" className="w-[100px] h-[100px] mx-auto" classNames={{ img: ['w-[100px] h-[100px]'] }} />}
                        {urlDefault && <form className="w-full">
                            <Input {...register('avatar', { required: true })}
                                onChange={(e) => { changeUrl(e) }}
                                type="text"
                                label="Avatar url" className="w-full my-2" radius="sm" defaultValue={user[0]?.avatar} />
                            <label className="block">
                                <span className="sr-only">Choose profile photo</span>
                                <input type="file" className="block w-full text-sm text-gray-500
                                    file:me-4 file:py-2 file:px-4
                                    file:rounded-lg file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-blue-600 file:text-white
                                    hover:file:bg-blue-700
                                    file:disabled:opacity-50 file:disabled:pointer-events-none
                                    dark:file:bg-blue-500
                                    dark:hover:file:bg-blue-400
                                    "
                                    disabled
                                />
                            </label>
                        </form>}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="light" onPress={() => { onClose(); setModalName("") }}>
                            Close
                        </Button>
                        <Button onClick={() => { handleSubmit(onSubmit)() }} color="success" className="text-white font-bold">Update</Button>
                    </ModalFooter>
                </>
            )}
        </ModalContent>
    </Modal>

}

export default ModalEditAvatar