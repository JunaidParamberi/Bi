import React, { useRef, useEffect } from 'react';
import Globe from 'react-globe.gl';
import gloImg from '../assets/images/globe-bg.png'

function RealisticGlobePage() {
  const globeEl = useRef(null);

  useEffect(() => {
    if (globeEl.current) {
      // Optional: Rotate the globe for a dynamic effect
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.7;
    }
  }, []);

  return (
    <div className="w-screen h-screen">
      <Globe
        ref={globeEl}
        width={window.innerWidth}
        height={window.innerHeight}
        globeImageUrl={gloImg} // Realistic day-time texture
       // Realistic night-time lights texture
        cloudsData={[{}]}  // Dummy data for enabling clouds layer
        cloudsOpacity={0.3}  // Cloud opacity for realism
        backgroundColor="rgba(0, 0, 0, 0)"  // Transparent background
      />
    </div>
  );
}

export default RealisticGlobePage;
