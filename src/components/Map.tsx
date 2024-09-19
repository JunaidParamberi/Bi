import React from 'react';
import mapImg from "../assets/images/Map.svg";

const markers = [
  { id: 1, country: 'India', top: '50%', left: '65%' },
  { id: 2, country: 'Country 2', top: '50%', left: '60%' },
  { id: 3, country: 'Country 3', top: '70%', left: '20%' },
];

const MapComponent = () => {
  return (
    <div className="relative w-full h-full">
      <img src={mapImg} className='w-full h-full' alt="Map" />
      {markers.map(marker => (
        <div 
          key={marker.id} 
          className="absolute w-4 h-4 bg-red-500 rounded-full" 
          style={{ top: marker.top, left: marker.left }}
          title={marker.country} // Tooltip for country names
        ></div>
      ))}
    </div>
  );
};

export default MapComponent;
