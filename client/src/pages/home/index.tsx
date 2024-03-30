import ChatContent from './chat/content'
import ChatNav from './chat/nav'

const Home = () => {
  return <div className='w-full h-full flex justify-around'>
    <ChatNav />
    <ChatContent />
  </div>
  
}

export default Home