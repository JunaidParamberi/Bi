import { lazy, useEffect } from 'react';
import './App.css';
import mainBg from './assets/images/main-bg.webp';
import { Routes, Route, useLocation } from 'react-router-dom';
import GenerelLeyout from './components/GenerelLeyout';
import ParticlesBackground from './components/ParticlesBackground';
import { bootReady } from './boot';

// Each page is split into its own chunk so the first screen only downloads what it needs
const loadGlobePage = () => import('./pages/GlobePage');
const loadMapPage = () => import('./pages/MapPage');
const loadMoreStories = () => import('./pages/MoreStories');
const loadStoryPage = () => import('./pages/StoryPage');
const loadCountryPage = () => import('./pages/CountryPage');
const loadTeamPage = () => import('./pages/TeamPage');

const GlobePage = lazy(loadGlobePage);
const MapPage = lazy(loadMapPage);
const MoreStories = lazy(loadMoreStories);
const StoryPage = lazy(loadStoryPage);
const CountryPage = lazy(loadCountryPage);
const TeamPage = lazy(loadTeamPage);

function App() {
  const location = useLocation();  // To track route changes for animations

  useEffect(() => {
    // Warm up the remaining page chunks once the browser is idle, so navigation stays instant
    const prefetch = () => {
      [loadMapPage, loadCountryPage, loadMoreStories, loadStoryPage, loadTeamPage, loadGlobePage]
        .forEach((load) => load());
    };
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(prefetch, { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(prefetch, 2000);
    return () => clearTimeout(id);
  }, []);

  return (
    <div className='app'>
      <img
        src={mainBg}
        alt="mainbg"
        fetchPriority="high"
        decoding="async"
        // cached images can finish before onLoad is attached
        ref={(img) => { if (img?.complete) bootReady('background'); }}
        onLoad={() => bootReady('background')}
        onError={() => bootReady('background')}
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
          <Route path='team' element={<TeamPage />} />
          <Route path='*' element={<h1>ops 404</h1>} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
