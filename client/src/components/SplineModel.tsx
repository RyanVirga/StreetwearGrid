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
  const splineRuntimeRef = useRef<any>(null);

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

  // Set up Spline viewer event listeners
  useEffect(() => {
    if (!viewerRef.current || !isInView) return;

    const splineViewer = viewerRef.current;
    
    const handleSplineLoad = (e: any) => {
      try {
        setIsLoaded(true);
        // Spline viewer exposes runtime through event.detail.spline
        const spline = e.detail?.spline || e.target?.spline || splineViewer.spline;
        
        if (spline) {
          // Store spline reference for rotation control
          splineRuntimeRef.current = spline;
          console.log('Spline runtime loaded successfully');
        } else {
          console.warn('Spline runtime not found in load event');
        }
      } catch (error) {
        console.error('Spline load handler error:', error);
      }
    };

    const handleSplineError = (e: any) => {
      console.error('Spline loading error:', e);
      setHasError(true);
    };

    splineViewer.addEventListener('load', handleSplineLoad);
    splineViewer.addEventListener('error', handleSplineError);

    return () => {
      splineViewer.removeEventListener('load', handleSplineLoad);
      splineViewer.removeEventListener('error', handleSplineError);
    };
  }, [isInView]);

  // Update rotation when scroll progress changes
  // Right to left rotation as user scrolls top to bottom
  useEffect(() => {
    if (!isLoaded || !splineRuntimeRef.current) return;

    try {
      const spline = splineRuntimeRef.current;
      
      // Map scroll progress (0-1) to rotation (0 to -360 degrees)
      // Negative rotation for right-to-left (counter-clockwise) movement
      const rotation = -scrollProgress * Math.PI * 2;
      
      // Try different ways to access and rotate the scene
      if (spline.setVariable) {
        // Try using Spline's setVariable API if available
        spline.setVariable('rotation', rotation);
      }
      
      if (spline.findObjectByName) {
        // Try to find and rotate the main object
        const mainObject = spline.findObjectByName('Scene') || spline.scene?.children?.[0] || spline.scene;
        
        if (mainObject && mainObject.rotation !== undefined) {
          mainObject.rotation.y = rotation;
        }
      } else if (spline.scene?.rotation !== undefined) {
        // Fallback: rotate the entire scene
        spline.scene.rotation.y = rotation;
      }
      
      // Request a render update if the method exists
      if (spline.requestRender) {
        spline.requestRender();
      }
    } catch (error) {
      console.error('Spline rotation update error:', error);
    }
  }, [scrollProgress, isLoaded]);

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
      <spline-viewer
        ref={viewerRef}
        url={sceneUrl}
        style={{
          width: '100%',
          height: '100%',
        }}
      />
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 text-muted-foreground text-sm">
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
