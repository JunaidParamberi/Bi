import { useRef, useEffect } from 'react';
import Globe, { GlobeMethods } from 'react-globe.gl';
import gloImg from '../assets/images/globe-bg.png';
import RadarWave from '../components/RadarWave';

function RealisticGlobePage() {
  const globeEl = useRef<GlobeMethods | undefined>(undefined); // Change here

  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 5;
      globeEl.current.controls().enableZoom = false; // Disable zoom
      globeEl.current.controls().enablePan = false; // Disable panning
      globeEl.current.controls().enableRotate = false; // Disable rotation
    }
  }, []);

  return (
    <div className="w-screen h-screen flex justify-center items-center relative">
      <RadarWave />
      <Globe
        ref={globeEl}
        width={window.innerWidth}
        height={window.innerHeight}
        globeImageUrl={gloImg} // Realistic day-time texture
        showAtmosphere={true}
        atmosphereColor="#00e47c"
        atmosphereAltitude={0.2} // Increased altitude for a more pronounced glow
        backgroundColor="rgba(0, 0, 0, 0)" // Transparent background
        enablePointerInteraction={false} // Disable pointer interaction
      />
      <div className="inner-glow" /> {/* Inner glow effect */}
    </div>
  );
}

export default RealisticGlobePage;
