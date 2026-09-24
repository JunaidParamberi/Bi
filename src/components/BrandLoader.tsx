import { useId } from 'react';

// Boehringer Ingelheim mark (from assets/icons/Icon_Accent Green.svg, viewBox 0 0 500 500)
const MARK =
  'M112.6,459c-35.8-25.8-54.8-44.8-72.6-72.1c-25.8-40-40-88.4-40-136.3C0,112.1,111.6,0,250,0s250,112.1,250,250c0,56.9-19.5,113.7-53.7,155.8c-14.2,17.9-26.3,28.4-59,53.2V312.6h24.8v100c18.4-21.6,27.4-34.8,36.3-50.5c18.4-32.7,28.4-73.2,28.4-112.1C476.8,123.7,375.2,21,250,21S23.2,123.7,23.2,251.6c0,58.4,20.6,110,64.2,161.1v-100h25.3C112.6,312.6,112.6,459,112.6,459z M162.1,484.2c-4.7-1.1-15.8-6.3-24.8-11.1V312.6h24.8V484.2z M312.7,131.6L250,83.1l-62.6,48.4l-13.7-17.9L250,54.2l76.3,59.5L312.7,131.6z M212.1,497.4c-9-1.6-9.5-1.6-12.7-2.6c-2.6-0.5-3.7-0.5-12.1-2.6V150h24.8L212.1,497.4L212.1,497.4z M262.1,499.5c-3.7,0.5-4.7,0.5-10,0.5c-7.9,0-10.5,0-14.8-0.5V150h24.8V499.5L262.1,499.5z M312.1,491.6c-7.9,2.6-14.8,4.2-24.8,6.3V150h24.8V491.6L312.1,491.6z M362.7,473.2c-7.9,3.7-12.7,5.8-25.3,11.6V312.6h25.3C362.7,312.6,362.7,473.2,362.7,473.2z';

interface BrandLoaderProps {
  className?: string;
}

// Loading indicator built from the BI mark: light rises through the logo while a radar ring
// ripples outward, echoing the pulse rings around the globe
function BrandLoader({ className = 'w-[6vw] min-w-16' }: BrandLoaderProps) {
  const clipId = useId();

  return (
    <div role='status' aria-label='Loading' className={`brand-loader relative aspect-square ${className}`}>
      <span className='brand-loader-ring' aria-hidden='true' />
      <svg viewBox='0 0 500 500' className='relative w-full h-full' aria-hidden='true'>
        <defs>
          <clipPath id={clipId}>
            <path d={MARK} />
          </clipPath>
        </defs>
        <path d={MARK} className='brand-loader-base' />
        <g clipPath={`url(#${clipId})`}>
          <rect x='0' y='0' width='500' height='500' className='brand-loader-fill' />
        </g>
      </svg>
    </div>
  );
}

export default BrandLoader;
