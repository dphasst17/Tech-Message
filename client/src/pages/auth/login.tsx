import { Button, Input } from "@nextui-org/react"
import { useContext, useState } from "react"
import { useForm } from "react-hook-form"
import { authLogin } from "../../api/authApi"
import { setLocalStorage } from "../../utils/localStorage"
import { useNavigate } from "react-router-dom"
import { SaveToken } from "../../utils/token"
import { StateContext } from "../../context/stateContext"
import EyeSlashFilledIcon from "../../components/icon/eyeSlashFilledIcon"
import EyeFilledIcon from "../../components/icon/eyeFilledIcon"
import { Auth } from "../../interface"
const Login =() => {
  const {register,handleSubmit} = useForm <Auth>();
  const {setIsLogin} = useContext(StateContext)
  const navigate = useNavigate()
  const [isPassword,setIsPassword] = useState(true)
  const onSubmit = (data:Auth) => {
    authLogin(data)
    .then(res => {
      if(res.status === 200){
        setLocalStorage('exp',res.data.exp)
        setLocalStorage('chatLog',true)
        SaveToken(res.data.token,res.data.exp)
        setIsLogin(true)
        navigate('/')
      }else{
        alert(res.message)
      }
      
    })
  }
  return <>
    <form className="w-4/5 md:w-2/5 xl:w-1/4">
      <h1 className="text-zinc-400">account test 2 : username:  dfast - pass:  dfast17</h1>
      <Input {...register('username', {required:true})} type="text" label="Username" radius="sm" color="default" 
      variant="bordered" className="my-2" 
      defaultValue="dfast17"
      />
      <Input {...register('password', {required:true})} type={isPassword ? 'password':'text'} label="Password" 
        radius="sm" color="default" variant="bordered" className="my-2"
        defaultValue="dfast17"
        onKeyDown={(e) => {if(e.key === "Enter"){handleSubmit(onSubmit)()}}} 
      />
    </form>
    <div className="w-4/5 md:w-2/5 xl:w-1/4 h-[50px] flex justify-start lg:justify-end items-center">
      <Button isIconOnly onClick={() => {setIsPassword(!isPassword)}} className="text-center cursor-pointer transition-all" radius="sm">
        {isPassword?<EyeFilledIcon className="text-[25px]"/>:<EyeSlashFilledIcon className="text-[25px]"/>}
      </Button>
    </div>
    <Button onClick={() => {handleSubmit(onSubmit)()}} className="w-[150px] text-white font-bold uppercase" radius="sm" color="success">Login</Button>
  </>
}

export default Login