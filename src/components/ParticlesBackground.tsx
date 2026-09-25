import { useMemo } from "react";
import Particles, { ParticlesProvider, useParticlesProvider } from "@tsparticles/react";
import {
  type Engine,
  type ISourceOptions,
  MoveDirection,
  OutMode,
} from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim"; // using slim version of tsparticles

// load the slim version to reduce the bundle size; runs once per application lifetime
const loadEngine = (engine: Engine) => loadSlim(engine);

const ParticlesField = () => {
  const { loaded } = useParticlesProvider();

  const options: ISourceOptions = useMemo(
    () => ({
      background: {
        color: {
          value: "transparent", // Dark blue background
        },
      },
      fpsLimit: 60, // Same motion as before; halves GPU work on high refresh LED panels
      interactivity: {
        events: {
          onClick: {
            enable: true,
            mode: "push", // Push particles on click
          },
          onHover: {
            enable: false,
            mode: "repulse", // Repulse particles on hover
          },
        },
        modes: {
          push: {
            quantity: 4, // Push 4 particles at a time
          },
          repulse: {
            distance: 200,
            duration: 0.4,
          },
        },
      },
      particles: {
        // v4 moved particle colour from `color` to `paint.fill`; the old key is silently ignored (particles went grey-white)
        paint: {
          fill: {
            enable: true,
            color: { value: "#00e47d82" },
          },
        },
        links: {
          color: "#ffffff", // Link color
          distance: 150, // Link distance
          enable: false, // Enable linking particles
          opacity: 0.5,
          width: 1,
        },
        move: {
          direction: MoveDirection.none,
          enable: true,
          outModes: {
            default: OutMode.out, // Particles move out of bounds
          },
          random: false,
          speed: { min: 0.5, max: 1 },
          straight: false,
        },
        number: {
          density: {
            enable: true, // Enable particle density
          },
          value: 300, // Number of particles
        },
        opacity: {
          value: 0.5, // Particle opacity
        },
        shape: {
          type: "circle", // Shape of particles
        },
        size: {
          value: { min: 0.5, max: 3 }, // Smaller size range
        },
      },
      detectRetina: true, // Enable retina detection
    }),
    [],
  );

  // Only render the particles once the engine has loaded
  return loaded ? <Particles id="tsparticles" options={options} /> : null;
};

const ParticlesBackground = () => (
  <ParticlesProvider init={loadEngine}>
    <ParticlesField />
  </ParticlesProvider>
);

export default ParticlesBackground;
