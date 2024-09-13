import './App.css'
import Button from './components/Button'
import Navbar from './components/Navbar'
import mainBg from './assets/images/Main BG.svg'

function App() {


  return (
    <div className='app'>
      <img src={mainBg} alt="mainbg" className='min-w-full min-h-[100vh] object-cover bg-no-repeat absolute z-[-100]' />
      <Navbar/>
      <Button/>
  
    </div>
  )
}

export default App
