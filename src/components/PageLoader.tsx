import BrandLoader from './BrandLoader';

// Shown while a page chunk is downloading
function PageLoader() {
  return (
    <div className='w-full h-full flex justify-center items-center'>
      <BrandLoader />
    </div>
  );
}

export default PageLoader;
