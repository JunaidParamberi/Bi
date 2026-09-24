import { useRef, useEffect, useState } from 'react';
import Globe, { GlobeMethods } from 'react-globe.gl';
import gloImg from '../assets/images/globe-bg.webp';
import RadarWave from '../components/RadarWave';
import { Link } from "react-router-dom";
import { motion } from 'framer-motion';
import BrandLoader from '../components/BrandLoader';
import { bootReady } from '../boot';

function RealisticGlobePage() {
  const globeEl = useRef<GlobeMethods | undefined>(undefined);
  const [isGlobeLoaded, setIsGlobeLoaded] = useState(false);
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    // Debounced so dragging a window edge does not rebuild the globe on every pixel
    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setDimensions({ width: window.innerWidth, height: window.innerHeight });
      }, 200);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Called by react-globe.gl once the scene and texture are ready
  const handleGlobeReady = () => {
    if (globeEl.current) {
      const controls = globeEl.current.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 5;
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.enableRotate = false;
    }
    setIsGlobeLoaded(true);
    bootReady('page');
  };

  return (
    <motion.div
      className="w-screen h-screen flex justify-center items-center relative"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 2, ease: "easeInOut" }}
    >
      <Link to="world" className="w-full h-full flex justify-center items-center relative">

        {/* Radar wave animation */}
        <div className="absolute w-full h-full flex justify-center items-center">
          <RadarWave />
        </div>

        {!isGlobeLoaded && (
          <div className="absolute w-full h-full flex justify-center items-center">
            <BrandLoader />
          </div>
        )}

        {/* Globe Container */}
        <div className="globe-container relative w-full h-full justify-center flex items-center">
          <div
            className="absolute globe-glow z-50"
            style={{ width: dimensions.width * 0.35, height: dimensions.width * 0.35 }}
          ></div>
          <Globe
            ref={globeEl}
            onGlobeReady={handleGlobeReady}
            globeImageUrl={gloImg}
            showAtmosphere={true}
            atmosphereColor="#00e47c"
            atmosphereAltitude={0.2}
            backgroundColor="rgba(0, 0, 0, 0)"
            enablePointerInteraction={false}
            width={dimensions.width * 0.55} // Adjusting width based on current dimensions
            height={dimensions.width * 0.55} // Adjusting height based on current dimensions
          />
        </div>

        <div className="inner-glow" />
      </Link>
    </motion.div>
  );
}

export default RealisticGlobePage;