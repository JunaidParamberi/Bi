import './App.css';
import mainBg from './assets/images/Main BG.svg';
import { Routes, Route } from 'react-router-dom';
import GenerelLeyout from './components/GenerelLeyout';
import MapPage from './pages/MapPage';
import MoreStories from './pages/MoreStories';
import ParticlesBackground from './components/ParticlesBackground';
import StoryPage from './pages/StoryPage';
import CountryPage from './pages/CountryPage';
import GlobePage from './pages/GlobePage';

function App() {
  return (
    <div className='app'>
      <img
        src={mainBg}
        alt="mainbg"
        className='min-w-full min-h-[100vh] object-cover bg-no-repeat absolute z-[-100]'
      />
      <ParticlesBackground />
      <Routes>
        <Route path='/' element={<GenerelLeyout />}>
          <Route index element={<GlobePage />} /> 
          <Route path='more' element={<MoreStories />} />
          <Route path='more/Ingelheim' element={<StoryPage />} />  
          <Route path='world' element={<MapPage />} /> 
          <Route path='world/:country' element={<CountryPage />} /> 
          <Route path='team' element={<h1>This Is team</h1>} /> 
        </Route>
      </Routes>
    </div>
  );
}

export default App;
