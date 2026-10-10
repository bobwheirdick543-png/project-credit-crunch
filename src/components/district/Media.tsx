export function Media({ src, alt, className }: { src?: string; alt: string; className?: string }) {
  if (!src) return <div className={`media-fallback ${className ?? ''}`} aria-hidden />;
  return <img src={src} alt={alt} className={className} loading="lazy" />;
}
