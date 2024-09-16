import './App.css';
import mainBg from './assets/images/Main BG.svg';
import { Routes, Route } from 'react-router-dom';
import GenerelLeyout from './components/GenerelLeyout';
import MapPage from './pages/MapPage';
import MoreStories from './pages/MoreStories';
import ParticlesBackground from './components/ParticlesBackground';


function App() {
  return (
    <div className='app'>
      <img src={mainBg} alt="mainbg" className='min-w-full min-h-[100vh] object-cover bg-no-repeat absolute z-[-100]' />
      <ParticlesBackground/>

      <Routes>
        <Route path='/' element={<GenerelLeyout />}>
          <Route index element={<MapPage />} /> 
          <Route path='more' element={<MoreStories/>} /> 
          <Route path='globe' element={<h1>This Is globe </h1>} /> 
          <Route path='home' element={<h1>This Is home </h1>} /> 
        </Route>
      </Routes>
    </div>
  );
}

export default App;
