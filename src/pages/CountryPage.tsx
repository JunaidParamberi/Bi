import { Key, useState } from 'react';
import cardImg from '../assets/images/Asset 24.png';
import smImg from '../assets/images/Asset 28.png';
import smImg2 from '../assets/images/Asset 29.png';
import smImg3 from '../assets/images/Asset 30.png';
import smImg4 from '../assets/images/Asset 31.png';
import {imetaData} from "../data/IMETA.js"
import { useLocation } from 'react-router-dom';
// Define the type for the items in the array




const CountryPage = () => {
  // Initialize state with the correct type
  
  // Define the array with typed items
  const location = useLocation()

  const currentData = location.state

  const [data, setData] = useState(currentData.articles[0]);

  // Correctly type the item parameter
  const handleClick = (item: DataType) => {
    setData(item);
  };

  const img = [

    smImg, smImg2, smImg3, smImg4
  ]
  

 
console.log(data)

  return (
    <div className="w-full h-full flex flex-col py-6">
    <div className="bg-dark-green border-accent-green border-[0.5px] h-full w-full flex justify-center items-center py-7">
      <div className="w-[90%] justify-end flex h-[90%]">
        <div className="flex justify-between gap-5 items-end w-full">
          <img src={cardImg} alt="" className="h-full w-[40%] object-cover" />

          <div className="h-full w-full flex flex-col justify-between">
            <h1 className="text-[40px] font-bold w-full text-left xl:text-[100px] text-white">{currentData.country}</h1>

            <div className="w-full">
              <div className="flex w-full items-baseline">
                {currentData.articles.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleClick(item)}
                    className={`${
                      data?.heading === item.heading
                        ? 'bg-accent-green text-dark-green px-5 py-2 font-semibold xl:text-[35px] text-[14px]'
                        : 'bg-black xl:text-[32px] text-white text-[13px] px-5 py-[6px] font-semibold bg-opacity-20'
                    }`}
                  >
                    {item.heading}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-accent-green border-[0.5px] min-h-[52%] max-h-[52%] flex justify-center items-center mb-3">
              <div className="overflow-y-auto custom-scrollbar h-[80%] w-[95%]">
                <p className="text-white p-3">{data?.article}</p>
              </div>
            </div>

            {/* Image slider */}
            <div className="flex  overflow-x-auto  gap-4  custom-scrollbar-y">
              {img?.map((img: string | undefined, index: Key | null | undefined) => (
                <img
                  src={img}
                  alt=""
                  key={index}
                  className="h-auto w-[210px] object-cover"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}

export default CountryPage;
