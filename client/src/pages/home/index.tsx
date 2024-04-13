import ChatContent from './chat/chatContent'
import ChatNav from './chat/chatNav'

const Home = () => {
  return <div className='w-full h-svh flex flex-wrap md:flex-nowrap md:justify-around'>
    <ChatNav/>
    <ChatContent/>
  </div>
  
}

export default Home