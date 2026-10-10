import { useState } from 'react';
import { BrandMark } from '@/components/brands/BrandMark';

export function Media({
  src,
  alt,
  mark,
  className = '',
}: {
  src?: string | undefined;
  alt: string;
  mark?: string | undefined;
  className?: string | undefined;
}) {
  const [failed, setFailed] = useState(false);
  if (src && !failed) {
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onError={() => setFailed(true)}
        className={className}
        width={640}
        height={420}
      />
    );
  }
  return (
    <div className={`media-fallback ${className}`}>
      <BrandMark name={mark ?? 'District'} className="size-16" />
      <span>{alt}</span>
    </div>
  );
}
