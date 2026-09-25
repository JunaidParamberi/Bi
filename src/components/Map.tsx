import React, { useEffect, useState, useRef } from "react";
// Raster exports of Map.svg: the 1 MB vector took seconds to download and draw, so the pins
// appeared on an empty background. Same artwork, ~115 KB at 1x.
import mapImg from "../assets/images/map-1920.webp";
import mapImg2x from "../assets/images/map-3826.webp";
import pinImg from "../assets/images/Pin.svg";
import { countries } from "../content";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useFitInViewport } from "../hooks/useFitInViewport";
import BrandLoader from "./BrandLoader";

// Marker type definition
interface Marker {
  id: number;
  country: string;
  top: string;
  left: string;
}

// Popup is kept this far from the pin, on whichever side has room
const CARD_GAP = 15;

const cardVariants = {
  hidden: { opacity: 0, scale: 0.85, filter: "blur(6px)" },
  show: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1], when: "beforeChildren", staggerChildren: 0.05 },
  },
  exit: { opacity: 0, scale: 0.92, filter: "blur(4px)", transition: { duration: 0.18, ease: "easeIn" } },
} as const;

const lineVariants = {
  hidden: { opacity: 0, x: -8 },
  show: { opacity: 1, x: 0, transition: { duration: 0.25, ease: "easeOut" } },
} as const;

// Country popup anchored to its pin; flips/nudges itself so it never leaves the screen or covers the navbar
const CountryCard = React.forwardRef<HTMLDivElement, { marker: Marker }>(({ marker }, cardRef) => {
  const currentData = countries.find((data) => data.country === marker.country);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const fit = useFitInViewport(boxRef, { flipGap: CARD_GAP });

  return (
    // Unscaled box used for measuring; the motion child inside does the animating
    <div
      ref={(el) => {
        boxRef.current = el;
        if (typeof cardRef === "function") cardRef(el);
        else if (cardRef) cardRef.current = el;
      }}
      className="absolute z-50"
      style={{
        top: marker.top,
        left: marker.left,
        margin: CARD_GAP,
        transform: `translate(${fit.x}px, ${fit.y}px)`,
      }}
    >
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="show"
        exit="exit"
        // Grow out of the corner nearest the pin
        style={{ transformOrigin: `${fit.flipX ? "right" : "left"} ${fit.flipY ? "bottom" : "top"}` }}
        className="w-max flex flex-col justify-center items-center gap-5 py-8 pl-6 pr-16 xl:gap-10 xl:p-10 text-white inside-glow-imeta bg-dark-green shadow-2xl"
      >
        <div className=" flex h-full w-full flex-col gap-[1vw]">
          <motion.h1 variants={lineVariants} className="text-[1.3vw]">{currentData?.country}</motion.h1>

          <div>
            {currentData?.articles.map((item) => (
              <motion.h1 variants={lineVariants} key={item.heading} className="text-[0.9vw] mb-[0.3vw]  ">{item?.heading}</motion.h1>
            ))}
          </div>
          <motion.div variants={lineVariants}>
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
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
});
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

        {/* Same coordinate space as the pins, so the card sits right next to its pin */}
        <AnimatePresence>
          {position && <CountryCard key={position.country} ref={cardRef} marker={position} />}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MapComponent;
