import './App.css';
import mainBg from './assets/images/Main BG.svg';
import { Routes, Route, useLocation } from 'react-router-dom';
import GenerelLeyout from './components/GenerelLeyout';
import MapPage from './pages/MapPage';
import MoreStories from './pages/MoreStories';
import ParticlesBackground from './components/ParticlesBackground';
import StoryPage from './pages/StoryPage';
import CountryPage from './pages/CountryPage';


function App() {

  const  location = useLocation()

  console.log(location)
  return (
    <div className='app'>
      <img src={mainBg} alt="mainbg" 
      className='min-w-full min-h-[100vh] object-cover bg-no-repeat absolute z-[-100]' />
      <ParticlesBackground/>

      <Routes>
        <Route path='/' element={<GenerelLeyout />}>
          <Route path='/' element={<h1>This Is globe </h1>} /> 
          <Route path='more' element={<MoreStories/>} />
          <Route path='more/Ingelheim' element={<StoryPage/>} />  
          <Route path='world' element={<MapPage/>} /> 
          <Route path='world/kenya' element={<CountryPage/>} /> 
          <Route path='home' element={<h1>This Is home </h1>} /> 
        </Route>
      </Routes>
    </div>
  );
}

export default App;
