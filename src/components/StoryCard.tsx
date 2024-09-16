import React from 'react'
import cardImg from '../assets/images/Asset 23.png'

function StoryCard() {
  return (
    <div className=' w-full flex flex-col gap-4 '>
      <img 
      src={cardImg} 
      alt="cardImg"
      className=' h-[40vh] w-full object-cover'
      />

      <div className=' flex flex-col gap-3'>
        <h2 className='text-[24px]'>Ingelheim</h2>

        <p className=' text-[15px] text-white'>
        The company headquarters of Boehringer Ingelheim are located in Ingelheim, Germany. It is the largest site, producing all new active ingredients and medications during the market launch.
        </p>

        <div>
        <button className='px-6 py-2 border-accent-green border-[1px] hover:bg-accent-green hover:text-dark-green active:opacity-70 duration-200 transition-all'>
        Read More
        </button>

        </div>
      </div>
    </div>
  )
}

export default StoryCard
