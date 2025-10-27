import { useEffect, useRef, useState } from "react";
import ErrorBoundary from "./ErrorBoundary";

// TypeScript declaration for spline-viewer web component
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'spline-viewer': any;
    }
  }
}

interface SplineModelProps {
  sceneUrl: string;
  scrollProgress?: number;
  fallbackImage?: string;
  className?: string;
}

function SplineModelContent({ sceneUrl, scrollProgress = 0, fallbackImage, className = "" }: SplineModelProps) {
  const viewerRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  // Control rotation based on scroll progress
  useEffect(() => {
    if (!isLoaded || !viewerRef.current) return;

    try {
      const splineViewer = viewerRef.current;
      
      // Access the Spline runtime API
      splineViewer.addEventListener('load', () => {
        const spline = splineViewer.spline;
        
        // Find the main object to rotate (usually the root or a named object)
        // This assumes your Spline scene has an object we can rotate
        if (spline && spline.findObjectByName) {
          const mainObject = spline.findObjectByName('Scene') || spline.scene;
          
          if (mainObject) {
            // Map scroll progress (0-1) to rotation (0-360 degrees)
            const rotation = scrollProgress * Math.PI * 2;
            mainObject.rotation.y = rotation;
          }
        }
      });
    } catch (error) {
      console.error('Spline rotation control error:', error);
    }
  }, [scrollProgress, isLoaded]);

  // Handle viewer load
  const handleLoad = () => {
    setIsLoaded(true);
  };

  // Handle errors
  const handleError = () => {
    console.error('Spline viewer failed to load');
    setHasError(true);
  };

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
    <div ref={containerRef} className={`w-full h-full ${className}`}>
      <spline-viewer
        ref={viewerRef}
        url={sceneUrl}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          width: '100%',
          height: '100%',
        }}
      />
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
