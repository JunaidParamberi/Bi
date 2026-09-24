import { ImgHTMLAttributes, useCallback, useState } from 'react';

type Status = 'loading' | 'loaded' | 'error';

// Drop-in <img>: same element and classes, plus a shimmer while loading and a fade-in once decoded.
// Layout is untouched because no wrapper element is added.
function SmartImage({ className = '', onLoad, onError, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  const [status, setStatus] = useState<Status>('loading');

  // Images served from cache can finish before React attaches onLoad
  const ref = useCallback((img: HTMLImageElement | null) => {
    if (img?.complete && img.naturalWidth > 0) setStatus('loaded');
  }, []);

  return (
    <img
      ref={ref}
      decoding='async'
      {...props}
      data-status={status}
      className={`smart-img ${className}`}
      onLoad={(e) => {
        setStatus('loaded');
        onLoad?.(e);
      }}
      onError={(e) => {
        setStatus('error');
        onError?.(e);
      }}
    />
  );
}

export default SmartImage;
