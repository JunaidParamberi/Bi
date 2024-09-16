import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import {
  type Container,
  type ISourceOptions,
  MoveDirection,
  OutMode,
} from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim"; // using slim version of tsparticles

const ParticlesBackground = () => {
  const [init, setInit] = useState(false);

  // this should be run only once per application lifetime
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      // load the slim version to reduce the bundle size
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = async (container?: Container): Promise<void> => {
    console.log(container);
  };

  const options: ISourceOptions = useMemo(
    () => ({
      background: {
        color: {
          value: "transparent", // Dark blue background
        },
      },
      fpsLimit: 120, // Frame rate limit
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
        color: {
          value: "#00e47d82", // White particles
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
            area: 800,
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
          random: true,
        },
      },
      detectRetina: true, // Enable retina detection
    }),
    [],
  );

  // Only render the particles if initialized
  return init ? (
    <Particles
      id="tsparticles"
      particlesLoaded={particlesLoaded}
      options={options}
    />
  ) : (
    <></>
  );
};

export default ParticlesBackground;
