import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'


export default function StoryPage () {

    const location = useLocation()

    const state  = location.state

    return (
        <motion.div
        initial={{ opacity: 0, y: 20 }}  // Start below
          animate={{ opacity: 1, y: 0 }}   // Slide in from below
          exit={{ opacity: 0, y: 20 }}     // Slide out below
          transition={{ duration: 0.7, ease: "easeOut" }}
        
        className="w-full h-full flex flex-col py-6  justify-center items-center">
            <div className="bg-dark-green border-accent-green border-[0.5px] xl:h-[90%] h-full w-full flex justify-center items-center py-7">
                <div className="w-[90%] gap-7 xl:gap-16 flex h-[80%] justify-center items-start  ">

                    <div className='w-[50%] h-full'>
                        <img src={state.coverImage} alt="" className='w-full h-full object-cover' />
                    </div>

                    <motion.div
                       initial={{ opacity: 0, y: 20 }}  // Start below
                       animate={{ opacity: 1, y: 0 }}   // Slide in from below
                       exit={{ opacity: 0, y: 20 }}     // Slide out below
                       transition={{ duration: 0.9, ease: "easeOut" }}
                    
                    className='   w-[60%] flex flex-col h-fit gap-6'>
                        <h1 className='text-[40px] font-bold w-full text-left xl:text-[100px] text-white'>{state.title}</h1>

                        <div className='h-full overflow-y-auto custom-scrollbar'>
                            <p className='h-full text-white pr-4 xl:text-[40px] '>
                                {state.text}
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    )
}
