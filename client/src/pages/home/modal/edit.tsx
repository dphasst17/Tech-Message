import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { useContext } from "react";
import { StateContext } from "../../../context/stateContext";
import { useForm } from "react-hook-form";
import { updateUser } from "../../../api/userApi";
import { GetToken } from "../../../utils/token";
import { Modals } from "../../../interface/index";

interface FormValue {
  name: string,
  email: string,
}
const ModalEdit = ({ isOpen, onOpenChange, setModalName }: Modals) => {
  const { user,setUser } = useContext(StateContext)
  const { register, handleSubmit,formState:{errors}} = useForm<FormValue>()
  const onSubmit = (data: FormValue) => {
    const checkData = user?.every((u:any) => data.name !== u.name || data.email !== u.email)
    const token = GetToken()
    token && checkData && updateUser(token,data)
    .then(res => {
      if(res.status === 200){
        setUser(user.map((u:any) => {
          return {
            ...u,
            name:data.name,
            email:data.email
          }
        }))
      }
      alert(res.message)
    })
    
  }
  return <Modal
    isOpen={isOpen}
    onOpenChange={() => { onOpenChange(); setModalName("") }}
  >
    <ModalContent>
      {(onClose) => (
        <>
          <ModalHeader className="flex flex-col gap-1">Edit</ModalHeader>
          <ModalBody>
            <form className="w-full">
              <Input {...register('name', { required: true })} type="text" label="Name" className="w-full my-2" radius="sm" defaultValue={user[0]?.name} />
              <Input {...register('email', {
                required: true, pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "invalid email address"
                }
              })} type="text" label="Email" className="w-full my-2" radius="sm" defaultValue={user[0]?.email} />
              {errors.email && <p>{errors.email.message}</p>}
            </form>
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

export default ModalEdit