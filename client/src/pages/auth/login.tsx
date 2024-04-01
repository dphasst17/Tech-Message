import { Button, Input } from "@nextui-org/react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { authLogin } from "../../api/authApi"
import { setLocalStorage } from "../../utils/localStorage"
import Cookies from "js-cookie"
import { useNavigate } from "react-router-dom"
interface FormValue {
  username:string,
  password:string
}
const Login =() => {
  const {register,handleSubmit} = useForm <FormValue>();
  const navigate = useNavigate()
  const [isPassword,setIsPassword] = useState(true)
  const onSubmit = (data:FormValue) => {
    authLogin(data)
    .then(res => {
      if(res.status === 200){
        setLocalStorage('exp',res.data.exp)
        setLocalStorage('chatLog',true)
        Cookies.set('tk',res.data.token,{
          expires: new Date(res.data.exp * 1000),
          path: "/",
        })
        navigate('/')
      }else{
        alert(res.message)
      }
      
    })
  }
  return <>
    <form className="w-1/4">
      <Input {...register('username', {required:true})} type="text" label="Username" radius="sm" color="default" variant="bordered" className="my-2" />
      <Input {...register('password', {required:true})} type={isPassword ? 'password':'text'} label="Password" radius="sm" color="default" variant="bordered" className="my-2" />
    </form>
    <div className="w-1/4 h-[50px] flex justify-end items-center">
      <Button onClick={() => {setIsPassword(!isPassword)}} className="w-[100px] h-2/4 text-center cursor-pointer transition-all" radius="sm">{isPassword?'SHOW':'HIDE'}</Button>
    </div>
    <Button onClick={() => {handleSubmit(onSubmit)()}} className="w-[150px] text-white font-bold uppercase" radius="sm" color="success">Login</Button>
  </>
}

export default Login