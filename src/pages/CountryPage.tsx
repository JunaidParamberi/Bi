import { Key, useState } from 'react';
import cardImg from '../assets/images/Asset 24.png';
import smImg from '../assets/images/Asset 28.png';
import smImg2 from '../assets/images/Asset 29.png';
import smImg3 from '../assets/images/Asset 30.png';
import smImg4 from '../assets/images/Asset 31.png';

// Define the type for the items in the array
type DataType = {
  title: string;
  text: string;
  images : Array;
};

const CountryPage = () => {
  // Initialize state with the correct type
  
  // Define the array with typed items
  const arr: DataType[] = [
      {
          title: "Access to Health",
         
          text: `Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. 

                Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.

                Lorem ipsum dolor sit amet, cons ectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.

                Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. 

                Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.

                Lorem ipsum dolor sit amet, cons ectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. 
                `,
          images : [smImg, smImg2, smImg3, smImg4, smImg4, smImg4]
        },
        {
            title: "Stop Rabies",
            text: "Access to Healthcare is an end-to-end patient support program by Boehringer Ingelheim, in partnership with mPharma, offering equitable healthcare access for underserved communities in Kenya. Launched in September 2022, the initiative aims to enhance disease management, provide medical treatments through subsidized pricing models, and ensure patient adherence to medication for non-communicable diseases such as hypertension, Chronic Obstructive Pulmonary Disease (COPD) and type 2 diabetes. The program is set to expand across the region in the coming years",
            images : [
                    smImg4, smImg3, smImg2, smImg
]
        }
    ];
    
    const [data, setData] = useState<DataType | null>(arr[0]);

  // Correctly type the item parameter
  const handleClick = (item: DataType) => {
    setData(item);
  };


  console.log(`Data : ${data}`)

  return (
    <div className="w-full h-full flex flex-col py-6">
      <div className="bg-dark-green border-accent-green border-[0.5px] h-full w-full flex justify-center items-center py-7">
        <div className="w-[90%]  justify-end flex h-[90%]">

            <div className=' flex justify-between gap-5  items-end'>

      
            <img src={cardImg} alt="" className=' h-full w-[40%] object-cover' />
         

          <div className='h-full w-full flex flex-col  justify-between '>
            <h1 className='text-[40px] font-bold w-full text-left xl:text-[100px] text-white'>Kenya</h1>

            <div className=' w-full'>

            <div className=' flex w-full items-baseline'>
              {
                  arr.map((item, index) => (
                      <button
                      key={index}
                      onClick={() => handleClick(item)}
                      className={`  ${data?.title === item.title ? 
                        "bg-accent-green text-dark-green px-5 py-2 font-semibold xl:text-[35px] text-[14px]" 
                      : "bg-black xl:text-[32px] text-white text-[13px] px-5 py-[6px] font-semibold bg-opacity-20 s" }`}>
                    {item.title}
                  </button>
                ))
            }
            </div>
            </div>

            <div className='border-accent-green border-[0.5px] min-h-[52%] max-h-[52%] flex justify-center items-center mb-3'>
                <div className='overflow-y-auto custom-scrollbar h-[80%] w-[95%]'>
                <p className=' text-white p-3'>
                    {data?.text}
                </p>
                </div>
            </div>

            {/* <div className='h-full overflow-y-auto custom-scrollbar border-accent-green border-[0.5px] p-8'>
                <p className='h-full text-white'>
                {data?.text}
                </p>
                </div> */}

            <div className=' flex  gap-3 overflow-auto custom-scrollbar-y  '>
                {
                    data?.images.map((img: string | undefined, index: Key | null | undefined) => (
                        <img src={img} alt="" key={index} className=' h-full w-full' />
                    ))
                }
            </div>


         
          </div>
        </div>
    </div>
      </div>
    </div>
  );
}

export default CountryPage;
