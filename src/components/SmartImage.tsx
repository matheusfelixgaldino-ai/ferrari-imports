import { useState, type ImgHTMLAttributes } from 'react';

interface SmartImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackClassName?: string;
}

export default function SmartImage({ src, alt, className = '', ...rest }: SmartImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div
        className={`flex items-center justify-center bg-neutral-200 ${className}`}
        aria-label={alt}
      >
        <div className="flex flex-col items-center gap-2 text-neutral-400">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-5-5L5 21" />
          </svg>
          <span className="text-xs font-medium">Imagem indisponível</span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onLoad={() => setLoaded(true)}
      onError={() => setErrored(true)}
      className={`image-fade ${loaded ? 'loaded' : ''} ${className}`}
      {...rest}
    />
  );
}
