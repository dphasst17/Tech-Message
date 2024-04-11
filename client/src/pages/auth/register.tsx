import { Button, Input, Tooltip } from "@nextui-org/react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { authRegister } from "../../api/authApi"
import { setLocalStorage } from "../../utils/localStorage"
import Cookies from "js-cookie"
import EyeFilledIcon from "../../components/icon/eyeFilledIcon"
import EyeSlashFilledIcon from "../../components/icon/eyeSlashFilledIcon"

interface FormValue {
  username: string,
  password: string,
  confirm: string,
  name: string,
  email: string
}
const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValue>()
  const [isPassword, setIsPassword] = useState(true)
  const onSubmit = (data: FormValue) => {
    if (data.confirm !== data.password) {
      alert('Confirm password does not match with password')
      return
    }
    const resultData = {
      username: data.username,
      password: data.password,
      name: data.name,
      email: data.email
    }
    authRegister(resultData)
      .then(res => {
        if (res.status === 200) {
          setLocalStorage('exp', res.data.exp)
          setLocalStorage('chatLog', true)
          Cookies.set('tk', res.data.token, {
            expires: new Date(res.data.exp * 1000),
            path: "/",
          })
        } else {
          alert(res.message)
        }

      })
  }
  return <>
    <form className="w-1/4">
      <Input {...register('username', { required: true })} type="text" label="Username" radius="sm" color="default" variant="bordered" className="my-2" />
      <Input {...register('password', { required: true,minLength:4 })} type={isPassword ? 'password' : 'text'} label="Password" radius="sm" color="default" variant="bordered" className="my-2" />
      <Input {...register('confirm', { required: true,minLength:4 })} type={isPassword ? 'password' : 'text'} label="Confirm password" radius="sm" color="default" variant="bordered" className="my-2" />
      <Input {...register('name', { required: true })} type="text" label="Full name" radius="sm" color="default" variant="bordered" className="my-2" />
      <Input {...register('email', {
        required: true, pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: "Invalid email address"
        }
      })} type="text" label="Email" radius="sm" color="default" variant="bordered" className="my-2" />
      {errors?.email && <Tooltip
        content={errors.email.message}
      >
      </Tooltip>}
    </form>
    <div className="w-1/4 h-[50px] flex justify-end items-center">
      <Button isIconOnly onClick={() => { setIsPassword(!isPassword) }} className="text-center cursor-pointer transition-all" radius="sm">
      {isPassword?<EyeFilledIcon className="text-[25px]"/>:<EyeSlashFilledIcon className="text-[25px]"/>}
      </Button>
    </div>
    <Button onClick={() => { handleSubmit(onSubmit)() }} className="w-[150px] text-white font-bold uppercase" radius="sm" color="success">Login</Button>
  </>
}

export default Register