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
        className="w-max min-w-[13vw] max-w-[19vw] flex flex-col justify-center items-center py-[1.6vw] px-[1.6vw] text-white inside-glow-imeta bg-dark-green shadow-2xl"
      >
        <div className=" flex h-full w-full flex-col gap-[1vw]">
          <motion.h1 variants={lineVariants} className="text-[1.3vw]">{currentData?.country}</motion.h1>

          <div>
            {currentData?.articles.map((item) => (
              <motion.h1 variants={lineVariants} key={item.heading} className="text-[0.9vw] leading-snug text-balance mb-[0.5vw]">{item?.heading}</motion.h1>
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

// Pin entrance: order by longitude so they land west to east
const PIN_START = 0.3;
const PIN_STAGGER = 0.12;
const PING_EVERY = 3.4;
const pinRank = new Map(
  [...markers].sort((a, b) => parseFloat(a.left) - parseFloat(b.left)).map((m, i) => [m.id, i])
);

// Main component
const MapComponent: React.FC = () => {
  // State for active country and its position
  const [activeCountry, setActiveCountry] = useState<string>("");
  const [position, setPosition] = useState<Marker | undefined>(undefined);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<HTMLImageElement | null>(null);
  // Pins wait for the map, so they never float over an empty background
  const [mapReady, setMapReady] = useState(false);
  // After the entrance, selection changes animate immediately instead of waiting for each pin's slot
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    if (!mapReady) return;
    const t = setTimeout(() => setEntered(true), (PIN_START + markers.length * PIN_STAGGER + 0.6) * 1000);
    return () => clearTimeout(t);
  }, [mapReady]);

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

        {/* Markers: drop in one by one west to east, then idle out of sync with a sonar wave sweeping across */}
        {mapReady && markers.map((marker) => {
          const rank = pinRank.get(marker.id) ?? 0;
          const land = PIN_START + rank * PIN_STAGGER;
          const isActive = activeCountry === marker.country;
          const dimmed = activeCountry !== "" && !isActive;
          return (
            <motion.div
              key={marker.id}
              onClick={() => handleClick(marker.country)}
              className="absolute w-[1.9%] cursor-pointer"
              style={{ top: marker.top, left: marker.left, x: "-50%", y: "-50%", zIndex: isActive ? 2 : 1 }}
              animate={{ opacity: dimmed ? 0.45 : 1 }}
              transition={{ duration: 0.3 }}
              title={marker.country}
            >
              {/* Soft glow behind the pin: swells and fades on landing, then pulses gently. All pins share the
                  period, so their landing offsets become a slow wave across the map rather than a unison blink */}
              <motion.span
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-[40%] w-[260%] aspect-square rounded-full"
                style={{
                  x: "-50%",
                  y: "-50%",
                  background: "radial-gradient(circle, rgba(0, 51, 38, 0.55) 0%, rgba(0, 51, 38, 0.25) 35%, transparent 70%)",
                }}
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: [0, 0.9, 0], scale: [0.3, 1, 1.25] }}
                transition={{ duration: 2.4, ease: "easeInOut", delay: land + 0.15, repeat: Infinity, repeatDelay: PING_EVERY - 1 }}
              />
              {/* Drop with a spring bounce, grow out of the pin tip */}
              <motion.div
                style={{ transformOrigin: "50% 100%" }}
                initial={{ opacity: 0, y: -40, scale: 0.4 }}
                animate={{ opacity: 1, y: 0, scale: isActive ? 1.15 : 1 }}
                transition={{
                  opacity: { duration: 0.2, delay: land },
                  y: { type: "spring", stiffness: 520, damping: 14, delay: land },
                  scale: isActive
                    ? { type: "spring", stiffness: 400, damping: 18 }
                    : { type: "spring", stiffness: 520, damping: 16, delay: entered ? 0 : land },
                }}
                whileHover={{ scale: isActive ? 1.18 : 1.06, transition: { duration: 0.2 } }}
              >
                {/* Idle float: each pin has its own pace so they never bob in unison */}
                <motion.img
                  src={pinImg}
                  alt="Pin"
                  className={`block w-full transition-[filter] duration-300 ${isActive ? "drop-shadow-[0_0_10px_#00e47c]" : ""}`}
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 1.8 + (marker.id % 4) * 0.35, ease: "easeInOut", repeat: Infinity, delay: land + 0.6 }}
                />
              </motion.div>
            </motion.div>
          );
        })}

        {/* Same coordinate space as the pins, so the card sits right next to its pin */}
        <AnimatePresence>
          {position && <CountryCard key={position.country} ref={cardRef} marker={position} />}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MapComponent;
