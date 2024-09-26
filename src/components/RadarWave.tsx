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

    </>
  );
};

export default RadarWave;
