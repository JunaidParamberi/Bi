import React from 'react';

const RadarWave = () => {
  return (
    <svg
      viewBox="0 0 200 200"
      className="radar-wave"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      <circle cx="100" cy="100" r="10" stroke="#00e47c" fill="none" strokeWidth="0.2" />
      <circle cx="100" cy="100" r="20" stroke="#00e47c" fill="none" strokeWidth="0.2" />
      <circle cx="100" cy="100" r="20" stroke="#00e47c" fill="none" strokeWidth="0.2" />
      <circle cx="100" cy="100" r="40" stroke="#00e47c" fill="none" strokeWidth="0.2" />
      <circle cx="100" cy="100" r="50" stroke="#00e47c" fill="none" strokeWidth="0.2" />
      <circle cx="100" cy="100" r="60" stroke="#00e47c" fill="none" strokeWidth="0.2" />
      <circle cx="100" cy="100" r="70" stroke="#00e47c" fill="none" strokeWidth="0.2" />
      <circle cx="100" cy="100" r="80" stroke="#00e47c" fill="none" strokeWidth="0.2" />
      <circle cx="100" cy="100" r="90" stroke="#00e47c" fill="none" strokeWidth="0.2" />
      <circle cx="100" cy="100" r="100" stroke="#00e47c" fill="none" strokeWidth="0.2" />

      <style>
        {`
          .radar-wave {
            animation: pulse 2s infinite;
          }
          @keyframes pulse {
            0% {
              stroke-opacity: 1;
              transform: scale(1);
            }
            100% {
              stroke-opacity: 0;
              transform: scale(1.9);
            }
        
        `}
      </style>
    </svg>
  );
};

export default RadarWave;
