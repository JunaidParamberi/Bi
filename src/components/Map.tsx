import React, { useEffect, useState, useRef } from "react";
// Raster exports of Map.svg: the 1 MB vector took seconds to download and draw, so the pins
// appeared on an empty background. Same artwork, ~115 KB at 1x.
import mapImg from "../assets/images/map-1920.webp";
import mapImg2x from "../assets/images/map-3826.webp";
import pinImg from "../assets/images/Pin.svg";
import { countries } from "../content";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import BrandLoader from "./BrandLoader";

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
const CountryCard: React.FC<MyComponentProps> = ({
  style,
  title,
  isVisible,
}) => {
  const currentData = countries.find((data) => data.country === title);

  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

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
        ${
          isVisible && !isAnimatingOut ? "futuristic-enter" : "futuristic-exit"
        }`}
    >
      <div className=" flex h-full w-full flex-col gap-[1vw]">
        <h1 className="text-[1.3vw]">{currentData?.country}</h1>

        <div>
          {currentData?.articles.map((item) => (
            <h1 key={item.heading} className="text-[0.9vw] mb-[0.3vw]  ">{item?.heading}</h1>
          ))}
        </div>
        <div>
          {currentData?.country ? (
            <Link
              to={currentData.country}
              state={currentData}
              className="text-accent-green text-[0.8vw] "
            >
              Read More
            </Link>
          ) : (
            <span className="text-accent-green text-[14px]">Read More</span>
          )}
        </div>
      </div>
    </div>
  );
};
// Marker data
const markers: Marker[] = [
  { id: 1, country: "India", top: "50%", left: "70%" },
  { id: 2, country: "UAE", top: "46%", left: "63%" },
  { id: 3, country: "Turkey", top: "38%", left: "56%" },
  { id: 4, country: "Kenya", top: "57%", left: "59%" },
  { id: 5, country: "Rwanda", top: "58%", left: "56%" },
  { id: 6, country: "South Africa", top: "72%", left: "54%" },
  { id: 7, country: "Egypt", top: "45%", left: "56%" },
  { id: 8, country: "Lebanon", top: "41.5%", left: "57.5%" },
];

// Main component
const MapComponent: React.FC = () => {
  // State for active country and its position
  const [activeCountry, setActiveCountry] = useState<string>("");
  const [position, setPosition] = useState<Marker | undefined>(undefined);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<HTMLImageElement | null>(null);
  // Pins wait for the map, so they never float over an empty background
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    // a cached image can finish before React attaches onLoad
    const img = mapRef.current;
    if (img?.complete && img.naturalWidth > 0) setMapReady(true);
  }, []);

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
    <div
      className="relative w-full h-full flex justify-center items-center"
      style={{ position: "relative" }}
    >
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
        style={{ paddingBottom: "56.25%", position: "relative", width: "100%" }}
      >
        {/* Map Image */}
        <img
          ref={mapRef}
          src={mapImg}
          srcSet={`${mapImg} 1920w, ${mapImg2x} 3826w`}
          sizes="85vw"
          width={1913}
          height={1000}
          fetchPriority="high"
          decoding="async"
          onLoad={() => setMapReady(true)}
          onError={() => setMapReady(true)}
          className={`absolute top-0 left-0 w-full h-auto transition-opacity duration-500 ${
            mapReady ? "opacity-100" : "opacity-0"
          }`}
          alt="Map"
        />

        {!mapReady && (
          <div className="absolute inset-0 flex justify-center items-center">
            <BrandLoader />
          </div>
        )}

        {/* Markers */}
        {mapReady && markers.map((marker) => (
          <div
            key={marker.id}
            onClick={() => handleClick(marker.country)}
            className="absolute w-[1.9%] cursor-pointer"
            style={{
              top: marker.top,
              left: marker.left,
              transform: "translate(-50%, -50%)", // Center the marker
            }}
            title={marker.country}
          >
            <motion.img
              initial={{ opacity: 0, y: -12 }} // Drop in once the map is on screen
              animate={{
                opacity: 1,
                y: [0, -3, 0], // Float effect
              }}
              transition={{
                opacity: { duration: 0.4, delay: 0.3 + marker.id * 0.06 },
                y: {
                  duration: 1,
                  ease: "easeInOut",
                  repeat: Infinity, // Repeat the animation
                  repeatType: "reverse", // Reverse the animation instead of looping
                },
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
