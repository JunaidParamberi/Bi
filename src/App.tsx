import './App.css';
import mainBg from './assets/images/Main BG.svg';
import { Routes, Route, useLocation } from 'react-router-dom';
import GenerelLeyout from './components/GenerelLeyout';
import MapPage from './pages/MapPage';
import MoreStories from './pages/MoreStories';
import ParticlesBackground from './components/ParticlesBackground';
import StoryPage from './pages/StoryPage';
import CountryPage from './pages/CountryPage';
import GlobePage from './pages/GlobePage';
import TeamPage from './pages/TeamPage';


function App() {

  const location = useLocation();  // To track route changes for animations
  return (
    <div className='app'>
      <img
        src={mainBg}
        alt="mainbg"
        className='min-w-full min-h-[100vh] object-cover bg-no-repeat absolute z-[-100]'
      />
      <ParticlesBackground />
      <Routes location={location} key={location.pathname}>
        <Route path='/' element={<GenerelLeyout />}>
          <Route index element={<GlobePage />} /> 
          <Route path='more' element={<MoreStories />} />
          <Route path='more/:title' element={<StoryPage />} />  
          <Route path='world' element={<MapPage />} /> 
          <Route path='world/:country' element={<CountryPage />} /> 
          <Route path='team' element={<TeamPage/>} /> 
          <Route path='*' element={<h1>ops 404</h1>} /> 
        </Route>
      </Routes>
    </div>
  );
}

export default App;
