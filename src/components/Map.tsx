import React, { useEffect, useState } from 'react';
import mapImg from "../assets/images/Map.svg";
import pinImg from "../assets/images/Pin.svg";
import {imetaData} from "../data/IMETA.js"
import { Link, useLocation } from 'react-router-dom';

// Marker type definition
interface markers {
  id: number;
  country: string;
  top: string;
  left: string;
}

interface MyComponentProps {
  style?: React.CSSProperties; // Optional style prop with CSSProperties type
  title: string; // Some other props
}

// CountryCard component with props typed
const CountryCard: React.FC<MyComponentProps> = ({ style, title }) => {

    const currentData = imetaData.find((data: { country: unknown; }) => data.country === title)

  console.log(imetaData)
  console.log(title)
  const location = useLocation()
  console.log(location)
  
  return (
    <div
      style={style}
      className="absolute w-[15%] flex flex-col gap-5 py-8 px-4 rounded-none text-white inside-glow-imeta bg-dark-green z-50"
    >
      <h1 className="text-2xl">{currentData?.country}</h1>
      <h1 className="text-[14px] xl:text-[40px]">{currentData?.title}</h1>
      <div>
      <Link to={currentData.country} state={currentData} className=' text-accent-green text-[14px]'>Read More </Link>
      </div>
    </div>
  );
};

// Marker data
const markers: Marker[] = [
  { id: 1, country: 'India', top: '50%', left: '70%' },
  { id: 2, country: 'UAE', top: '46%', left: '63%' },
  { id: 3, country: 'Turkey', top: '38%', left: '56%' },
  { id: 4 , country: 'Kenya', top: '57%', left: '59%' },
  { id: 5, country: 'Rwanda', top: '58%', left: '56%' },
  { id: 6, country: 'South Africa', top: '72%', left: '54%' },
];

// Main component
const MapComponent = () => {
  // State for active country and its position
  const [activeCountry, setActiveCountry] = useState<string>("");
  const [position, setPosition] = useState<Marker | undefined>(undefined);

  const handleClick = (country: string) => {
    setActiveCountry(country);
  };

  useEffect(() => {
    // Find the position of the active country
    const positionNow = markers.find((item) => activeCountry === item.country);
    setPosition(positionNow); // This can be undefined if not found
  }, [activeCountry]);

  return (
    <div className="relative w-full h-full" style={{ position: 'relative' }}>
      {/* Show CountryCard only if activeCountry is selected */}
      {activeCountry && position && (
        <CountryCard title={activeCountry} style={{ top: position.top, left: position.left, margin : "20px" }} />
      )}
      {/* Container for responsive scaling */}
      <div
        className="relative"
        style={{ paddingBottom: '56.25%', position: 'relative', width: '100%' }}
      >
        {/* Map Image */}
        <img
          src={mapImg}
          className="absolute top-0 left-0 w-full object-contain"
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
            <img src={pinImg} alt="Pin" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapComponent;
