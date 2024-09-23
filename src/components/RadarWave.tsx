import buttonImg from '../assets/images/button-line.svg';

const RadarWave = () => {
  return (
    <>
      <div className="pulse">
        {[...Array(6)].map((_, index) => (
          <span 
            key={index} 
            style={{ ['--i' as string]: index + 1 }} // bracket notation to access custom property
          ></span>
        ))}
        <img src={buttonImg} alt="" className='w-[60%] absolute bottom-[0.2%] right-[-46%]' />
      </div>
      {/* <GlobeButton/> */}
    </>
  );
};

export default RadarWave;


export const GlobeButton = ()=> {
  return (
    
        <div className="absolute bottom-[20%] right-[5%] z-50">
          <div className="flex items-center justify-center">
            {/* Connecting line to the globe */}
            <div className="h-[2px] w-[120px] bg-accent-green animate-pulse"></div>
            
            {/* Glowing Button */}
            <button className="ml-4 text-white bg-transparent border border-accent-green rounded-full px-4 py-2 text-sm relative group hover:bg-accent-green hover:text-black transition duration-300">
              Click to Explore
              <span className="absolute w-12 h-12 bg-accent-green opacity-20 blur-lg group-hover:animate-pulse inset-0 m-auto"></span>
            </button>
          </div>
        </div>
      )
    }
    
 
{/* <svg */}
    //   viewBox="0 0 200 200"
    //   className="radar-wave"
    //   style={{
    //     position: 'absolute',
    //     top: 0,
    //     left: 0,
    //     width: '100%',
    //     height: '100%',
    //     pointerEvents: 'none',
    //   }}
    // >
    //   <circle cx="100" cy="100" r="10" stroke="#00e47c" fill="none" strokeWidth="0.2" />
    //   <circle cx="100" cy="100" r="20" stroke="#00e47c" fill="none" strokeWidth="0.2" />
    //   <circle cx="100" cy="100" r="30" stroke="#00e47c" fill="none" strokeWidth="0.2" />
    //   <circle cx="100" cy="100" r="40" stroke="#00e47c" fill="none" strokeWidth="0.2" />
    //   <circle cx="100" cy="100" r="50" stroke="#00e47c" fill="none" strokeWidth="0.2" />
    //   <circle cx="100" cy="100" r="60" stroke="#00e47c" fill="none" strokeWidth="0.2" />
    //   <circle cx="100" cy="100" r="70" stroke="#00e47c" fill="none" strokeWidth="0.2" />
    //   <circle cx="100" cy="100" r="80" stroke="#00e47c" fill="none" strokeWidth="0.2" />
    //   <circle cx="100" cy="100" r="90" stroke="#00e47c" fill="none" strokeWidth="0.2" />
    //   <circle cx="100" cy="100" r="100" stroke="#00e47c" fill="none" strokeWidth="0.2" />

    //   <style>
    //     {`
    //       .radar-wave {
    //         animation: pulse 4s infinite ease-out;
    //       }
    //       @keyframes pulse {
    //         0% {
    //           stroke-opacity: 1;
    //           transform: scale(1);
    //         }
    //         100% {
    //           stroke-opacity: 0;
    //           transform: scale(2);
    //         }
    //       }
    //     `}
    //   </style>
    // </svg>

