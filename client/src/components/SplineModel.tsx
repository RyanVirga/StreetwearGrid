import { useEffect, useRef, useState } from "react";
import Spline from '@splinetool/react-spline';
import ErrorBoundary from "./ErrorBoundary";

interface SplineModelProps {
  sceneUrl: string;
  scrollProgress?: number;
  fallbackImage?: string;
  className?: string;
}

function SplineModelContent({ sceneUrl, scrollProgress = 0, fallbackImage, className = "" }: SplineModelProps) {
  const splineRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Lazy loading with IntersectionObserver
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Handle Spline load
  const onLoad = (splineApp: any) => {
    console.log('✅ Spline loaded successfully');
    splineRef.current = splineApp;
    setIsLoaded(true);
    setHasError(false);
  };

  const onError = (error: any) => {
    console.error('❌ Spline load error:', error);
    setHasError(true);
  };

  // Update rotation when scroll progress changes
  useEffect(() => {
    if (!isLoaded || !splineRef.current) return;

    try {
      const spline = splineRef.current;
      
      // Map scroll progress (0-1) to rotation (0 to -360 degrees)
      // Negative rotation for right-to-left (counter-clockwise) movement
      const rotation = -scrollProgress * Math.PI * 2;

      // Debug logging (only log occasionally to avoid spam)
      if (scrollProgress > 0 && scrollProgress < 0.01) {
        console.log('🔄 Rotating Spline model:', {
          scrollProgress,
          rotation: (rotation * 180 / Math.PI).toFixed(2) + '°'
        });
      }

      // Rotate the scene
      if (spline.scene) {
        // Try rotating the scene directly
        if (spline.scene.rotation !== undefined) {
          spline.scene.rotation.y = rotation;
        }
        
        // Also try rotating the first child (main group)
        if (spline.scene.children && spline.scene.children.length > 0) {
          const mainObject = spline.scene.children[0];
          if (mainObject && mainObject.rotation !== undefined) {
            mainObject.rotation.y = rotation;
          }
        }
      }
      
      // Try using setVariable if available (for variables set in Spline editor)
      if (spline.setVariable) {
        try {
          spline.setVariable('rotation', rotation);
        } catch (e) {
          // Variable might not exist, ignore
        }
      }
    } catch (error) {
      console.error('Spline rotation update error:', error);
    }
  }, [scrollProgress, isLoaded]);

  // Show fallback if error
  if (hasError && fallbackImage) {
    return (
      <div ref={containerRef} className={`w-full h-full flex items-center justify-center ${className}`}>
        <img 
          src={fallbackImage} 
          alt="3D Model Fallback"
          className="w-full h-full object-contain"
        />
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`w-full h-full relative ${className}`}>
      {/* Loading overlay */}
      {!isLoaded && isInView && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-sm text-muted-foreground">Loading 3D Model...</p>
          </div>
        </div>
      )}

      {/* Only render Spline when in viewport */}
      {isInView && (
        <Spline
          scene={sceneUrl}
          onLoad={onLoad}
          onError={onError}
          className="w-full h-full"
        />
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
