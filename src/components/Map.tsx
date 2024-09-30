import React, { useEffect, useState, useRef } from 'react';
import mapImg from "../assets/images/Map.svg";
import pinImg from "../assets/images/Pin.svg";
import { imetaData } from "../data/IMETA"; // Change to .js if necessary
import { Link } from 'react-router-dom';
import {motion } from "framer-motion"

// Marker type definition
interface Marker {
  id: number;
  country: string;
  top: string;
  left: string;
}

interface MyComponentProps {
  style?: React.CSSProperties; // Optional style prop with CSSProperties type
  title: string; // Title prop
  isVisible: boolean; // Added to the interface
}

// CountryCard component with props typed
const CountryCard: React.FC<MyComponentProps> = ({ style, title, isVisible }) => {
  const currentData = imetaData.find((data) => data.country === title);

  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  console.log(imetaData)
  useEffect(() => {
    if (!isVisible) {
      // Trigger exit animation before removing the card
      setIsAnimatingOut(true);
      const timer = setTimeout(() => {
        setIsAnimatingOut(false); // Ensure it's cleaned up properly
      }, 600); // Duration of the exit animation
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  return (
    <div
      style={style}
      className={`absolute w-fit flex flex-col justify-center items-center gap-5 py-8 pl-6 pr-16 xl:gap-10 xl:p-10 text-white inside-glow-imeta bg-dark-green z-50
        ${isVisible && !isAnimatingOut ? 'futuristic-enter' : 'futuristic-exit'}`}
    >
      <div className=' flex h-full w-full flex-col gap-[1vw]'>
      <h1 className="text-[1.3vw]">{currentData?.country}</h1>
      
      <div>
      {
        currentData?.articles.map(item => (
          
          <h1 className="text-[0.9vw]  ">
            {
            currentData.articles.length > 1 &&  
            currentData?.articles[0].heading ===  item?.heading ?  
            item?.heading + " ," 
            : item?.heading }</h1>
        ))
      }
      </div>
      <div>
        {currentData?.country ? (
          <Link 
          to={currentData.country} 
          state={currentData} 
          className='text-accent-green text-[0.8vw] '
          >
            Read More
          </Link>
        ) : (
          <span className='text-accent-green text-[14px]'>Read More</span>
        )}
      </div>
        </div>
    </div>
  );
};
// Marker data
const markers: Marker[] = [
  { id: 1, country: 'India', top: '50%', left: '70%' },
  { id: 2, country: 'UAE', top: '46%', left: '63%' },
  { id: 3, country: 'Turkey', top: '38%', left: '56%' },
  { id: 4, country: 'Kenya', top: '57%', left: '59%' },
  { id: 5, country: 'Rwanda', top: '58%', left: '56%' },
  { id: 6, country: 'South Africa', top: '72%', left: '54%' },
];

// Main component
const MapComponent: React.FC = () => {
  // State for active country and its position
  const [activeCountry, setActiveCountry] = useState<string>("");
  const [position, setPosition] = useState<Marker | undefined>(undefined);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const handleClick = (country: string) => {
    setActiveCountry(country);
  };

  useEffect(() => {
    // Find the position of the active country
    const positionNow = markers.find((item) => activeCountry === item.country);
    setPosition(positionNow); // This can be undefined if not found
  }, [activeCountry]);


    // Event handler to detect clicks outside the CountryCard
    useEffect(() => {
      const handleOutsideClick = (event: MouseEvent) => {
        if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
          setActiveCountry(""); // Close the CountryCard if clicked outside
        }
      };
  
      // Add event listener
      document.addEventListener("mousedown", handleOutsideClick);
  
      // Remove event listener on cleanup
      return () => {
        document.removeEventListener("mousedown", handleOutsideClick);
      };
    }, []);

  return (
    <div className="relative w-full h-full flex justify-center items-center" style={{ position: 'relative' }}>
      {/* Show CountryCard only if activeCountry is selected */}
      {activeCountry && position && (
        <div ref={cardRef}>
          <CountryCard
            title={activeCountry}
            style={{ top: position.top, left: position.left, margin: "15px" }}
            isVisible={!!activeCountry} // Control visibility
          />
        </div>
      )}
      {/* Container for responsive scaling */}
      <div
        className="relative"
        style={{ paddingBottom: '56.25%', position: 'relative', width: '100%' }}
      >
        {/* Map Image */}
        <img
          src={mapImg}
          loading='lazy'
          className="absolute top-0 left-0 object-contain"
          alt="Map"
        />

        {/* Markers */}
        {markers.map((marker) => (
          <div
          
         
            key={marker.id}
            onClick={() => handleClick(marker.country)}
            className="absolute w-[2%] cursor-pointer"
            style={{
              top: marker.top,
              left: marker.left,
              transform: 'translate(-50%, -50%)', // Center the marker
            }}
            title={marker.country}
          >
<motion.img
    initial={{ opacity: 1, y: 0 }} // Start fully visible at the original position
    animate={{ 
        y: [0, -3, 0], // Float effect
    }}    
    transition={{
        duration: 1 ,
        ease: "easeInOut",
        repeat: Infinity, // Repeat the animation
        repeatType: "reverse", // Reverse the animation instead of looping
    }}
    whileHover={{ 
        scale: 1.1, // Scale up on hover
        
        transition: { duration: 0.3 }, // Quick transition on hover
    }} // Scale slightly on hover
    src={pinImg} 
    alt="Pin" 
/>
 

   </div>
        ))}
      </div>
    </div>
  );
};

export default MapComponent;
