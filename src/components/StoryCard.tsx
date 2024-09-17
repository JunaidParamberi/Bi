import React from 'react'
import cardImg from '../assets/images/Asset 23.png'
import { Link } from 'react-router-dom'

function StoryCard() {

  
  return (
    <div className=' w-full flex flex-col gap-4 '>
      <img 
      src={cardImg} 
      alt="cardImg"
      className=' h-[40vh] w-full object-cover'
      />

      <div className=' flex flex-col gap-3'>
        <h2 className='text-[24px] xl:text-[60px]'>Ingelheim</h2>

        <p className=' text-[16px] text-white xl:text-[40px]'>
        The company headquarters of Boehringer Ingelheim are located in Ingelheim, Germany. It is the largest site, producing all new active ingredients and medications during the market launch.
        </p>

        <div>
        <Link 
        relative='path'
        to='Ingelheim'
        className='px-6 xl:px-10 xl:py-4 py-2 
                      text-[14px] xl:text-[35px]
                       border-accent-green border-[1px]
                        hover:bg-accent-green hover:text-dark-green active:opacity-70 duration-200 
                        transition-all' >
        Read More
        </Link>

        </div>
      </div>
    </div>
  )
}

export default StoryCard
