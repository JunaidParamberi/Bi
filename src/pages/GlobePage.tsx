import { useRef, useEffect, useState } from 'react';
import Globe, { GlobeMethods } from 'react-globe.gl';
import gloImg from '../assets/images/globe-bg.png';
import RadarWave from '../components/RadarWave';
import { Link } from "react-router-dom";
import { motion } from 'framer-motion';
import {PuffLoader} from 'react-spinners'

function RealisticGlobePage() {
  const globeEl = useRef<GlobeMethods | undefined>(undefined);
  const [isGlobeLoaded, setIsGlobeLoaded] = useState(false);

  useEffect(() => {
    if (globeEl.current) {
      const controls = globeEl.current.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 5;
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.enableRotate = false;
    }

    // Simulate loading time
    const loadTimeout = setTimeout(() => {
      setIsGlobeLoaded(true);
    }, 1500);

    return () => {
      clearTimeout(loadTimeout);
    };
  }, []);

  return (
    <motion.div
      className="w-screen h-screen flex justify-center items-center relative"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 2, ease: "easeInOut" }}
    >
      <Link to="world" className="w-full h-full flex justify-center items-center relative">

      <div className=' absolute w-full h-full flex justify-center items-center'>
        
        <RadarWave />
      </div>

        {!isGlobeLoaded && (
          <div className="absolute w-full h-full flex justify-center items-center">
            <PuffLoader size={100} />
          </div>
        )}

        {/* Globe component */}
        {/* Uncomment when you are ready to use it */}
        
        <Globe
          ref={globeEl}
          width={window.innerWidth }  // Responsive width (80% of the screen)
          height={window.innerHeight}  // Responsive height (80% of the screen)
          globeImageUrl={gloImg}
          showAtmosphere={true}
          atmosphereColor="#00e47c"
          atmosphereAltitude={0.2}
          backgroundColor="rgba(0, 0, 0, 0)"
          enablePointerInteraction={false}
        /> 
        

        <div className="inner-glow" />
      </Link>
    </motion.div>
  );
}

export default RealisticGlobePage;
