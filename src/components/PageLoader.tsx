import { PuffLoader } from 'react-spinners';

// Shown while a page chunk is downloading
function PageLoader() {
  return (
    <div className='w-full h-full flex justify-center items-center'>
      <PuffLoader color='#36d7b7' size={100} />
    </div>
  );
}

export default PageLoader;
