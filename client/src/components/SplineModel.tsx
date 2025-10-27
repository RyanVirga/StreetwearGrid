import { useEffect, useRef, useState } from "react";
import ErrorBoundary from "./ErrorBoundary";

interface SplineModelProps {
  iframeUrl: string;
  scrollProgress?: number;
  fallbackImage?: string;
  className?: string;
}

function SplineModelContent({ iframeUrl, scrollProgress = 0, fallbackImage, className = "" }: SplineModelProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Lazy loading with IntersectionObserver
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  // Handle iframe load
  useEffect(() => {
    if (!iframeRef.current || !isInView) return;

    const handleLoad = () => {
      setIsLoaded(true);
    };

    const handleError = () => {
      setHasError(true);
    };

    const iframe = iframeRef.current;
    iframe.addEventListener('load', handleLoad);
    iframe.addEventListener('error', handleError);

    // Set timeout for load error
    const timeout = setTimeout(() => {
      if (!isLoaded) {
        setHasError(true);
      }
    }, 10000);

    return () => {
      iframe.removeEventListener('load', handleLoad);
      iframe.removeEventListener('error', handleError);
      clearTimeout(timeout);
    };
  }, [isInView, isLoaded]);

  // Note: Controlling rotation of Spline scenes loaded via iframe is limited
  // The Spline iframe doesn't expose the same API as the viewer component
  // For full rotation control, you'd need to export the scene and use the viewer component

  // Show fallback if error or not in view yet
  if (hasError || !isInView) {
    return (
      <div ref={containerRef} className={`w-full h-full flex items-center justify-center ${className}`}>
        {fallbackImage ? (
          <img 
            src={fallbackImage} 
            alt="Product preview" 
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="text-muted-foreground text-sm">
            {hasError ? '3D Preview Unavailable' : 'Loading 3D Model...'}
          </div>
        )}
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative w-full h-full ${className}`}>
      <iframe
        ref={iframeRef}
        src={iframeUrl}
        frameBorder="0"
        className="w-full h-full"
        style={{
          border: 'none',
          borderRadius: '0',
        }}
        title="3D Model"
      />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-background text-muted-foreground text-sm">
          Loading 3D Model...
        </div>
      )}
    </div>
  );
}

export default function SplineModel(props: SplineModelProps) {
  return (
    <ErrorBoundary>
      <SplineModelContent {...props} />
    </ErrorBoundary>
  );
}
