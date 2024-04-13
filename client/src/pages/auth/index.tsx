import { useState } from "react"
import Login from "./login"
import { ButtonGroup,Button } from "@nextui-org/react"
import Register from "./register"

const Auth = () => {
  const [formLogin,setFormLogin] = useState(true)
  
  return <section className='w-full h-screen flex flex-col items-center justify-center'>
    <ButtonGroup className="w-[95%] md:w-2/4 xl:w-1/4">
      <Button className="w-2/5 text-center text-[30px] !text-white font-bold cursor-pointer" 
        color={formLogin ? 'success' : 'default'} onClick={() => {setFormLogin(true)}}>
          LOGIN
        </Button>
      <Button className="w-2/5 text-center text-[30px] !text-white font-bold cursor-pointer" 
        color={!formLogin ? 'success' : 'default'} onClick={() => {setFormLogin(false)}}>
          REGISTER
      </Button>
    </ButtonGroup>
    {formLogin && <Login/>}
    {!formLogin && <Register/>}
  </section>
}

export default Auth