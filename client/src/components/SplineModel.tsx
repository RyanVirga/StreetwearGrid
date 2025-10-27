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

// Track if rotation error has been logged (to avoid spam)
let rotationErrorLogged = false;

function SplineModelContent({ sceneUrl, scrollProgress = 0, fallbackImage, className = "" }: SplineModelProps) {
  const viewerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const splineRuntimeRef = useRef<any>(null);
  
  const [isInView, setIsInView] = useState(false);
  const [isWebComponentReady, setIsWebComponentReady] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Check if spline-viewer web component is registered
  useEffect(() => {
    const checkWebComponent = () => {
      if (customElements.get('spline-viewer')) {
        console.log('Spline web component is registered');
        setIsWebComponentReady(true);
        return true;
      }
      return false;
    };

    // Check immediately
    if (checkWebComponent()) return;

    // If not ready, wait for it to be defined
    customElements.whenDefined('spline-viewer').then(() => {
      console.log('Spline web component registered after waiting');
      setIsWebComponentReady(true);
    }).catch((error) => {
      console.error('Error waiting for spline-viewer:', error);
      setHasError(true);
    });

    // Fallback timeout
    const timeout = setTimeout(() => {
      if (!customElements.get('spline-viewer')) {
        console.error('Spline web component failed to load within timeout');
        setHasError(true);
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);

  // Lazy loading with IntersectionObserver
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            console.log('Spline container entered viewport');
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

  // Callback ref to get spline-viewer element
  const splineViewerCallback = (element: any) => {
    if (!element) return;
    
    viewerRef.current = element;
    console.log('Spline viewer ref attached, element:', element.tagName);
    
    const checkSplineRuntime = () => {
      // Check both public and private property names
      const runtime = element.spline || element._spline || element.splineRuntime || element.app;
      if (runtime) {
        splineRuntimeRef.current = runtime;
        const propertyName = element.spline ? 'spline' : 
                           element._spline ? '_spline' : 
                           element.splineRuntime ? 'splineRuntime' : 'app';
        console.log('✅ Spline runtime found and stored from property:', propertyName);
        setIsLoaded(true);
        return true;
      }
      return false;
    };
    
    const handleSplineLoad = (e: any) => {
      console.log('✅ Spline "load" event fired');
      checkSplineRuntime();
    };

    const handleReady = (e: any) => {
      console.log('✅ Spline "ready" event fired');
      checkSplineRuntime();
    };

    const handleSplineError = (e: any) => {
      console.error('❌ Spline error event:', e);
      setHasError(true);
    };

    // Try multiple event names that Spline might use
    element.addEventListener('load', handleSplineLoad);
    element.addEventListener('ready', handleReady);
    element.addEventListener('error', handleSplineError);

    // Check if it's already loaded
    if (checkSplineRuntime()) {
      console.log('Spline was already loaded on mount');
      return;
    }

    // Log available properties on the element
    console.log('Spline viewer element properties:', Object.keys(element));
    console.log('Spline viewer element methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(element)));
    
    // Poll for spline runtime (some viewers don't fire events reliably)
    let pollCount = 0;
    const pollInterval = setInterval(() => {
      pollCount++;
      
      // Check multiple possible runtime locations including private _spline property
      const runtime = element.spline || element._spline || element.splineRuntime || element.app || element.runtime;
      
      if (pollCount <= 3) {
        // Only log detailed info for first few attempts to avoid spam
        console.log(`Polling attempt ${pollCount}/15 - checking for runtime...`, {
          hasSpline: !!element.spline,
          has_Spline: !!element._spline,
          hasSplineRuntime: !!element.splineRuntime,
          hasApp: !!element.app,
          hasRuntime: !!element.runtime,
          found: !!runtime
        });
      }
      
      if (runtime) {
        splineRuntimeRef.current = runtime;
        console.log('✅ Spline runtime found via polling on property:', 
          element.spline ? 'spline' : 
          element._spline ? '_spline' :
          element.splineRuntime ? 'splineRuntime' : 
          element.app ? 'app' : 'runtime');
        setIsLoaded(true);
        clearInterval(pollInterval);
      } else if (pollCount >= 15) {
        console.warn('⚠️ Spline runtime not accessible. Model will display without rotation control.');
        clearInterval(pollInterval);
        // Mark as loaded to hide loading overlay - viewer will show but without rotation
        setIsLoaded(true);
      }
    }, 500); // Poll every 500ms for up to 7.5 seconds
  };

  // Update rotation when scroll progress changes
  useEffect(() => {
    if (!isLoaded || !splineRuntimeRef.current) return;

    try {
      const spline = splineRuntimeRef.current;
      
      // Map scroll progress (0-1) to rotation (0 to -360 degrees)
      // Negative rotation for right-to-left (counter-clockwise) movement
      const rotation = -scrollProgress * Math.PI * 2;
      
      // Debug logging (only log first rotation update)
      if (scrollProgress > 0 && scrollProgress < 0.01) {
        console.log('🔄 Rotation effect triggered:', {
          scrollProgress,
          rotation,
          hasScene: !!spline.scene,
          sceneRotation: spline.scene?.rotation,
          childrenCount: spline.scene?.children?.length
        });
      }
      
      // Try to rotate the entire scene or the main group
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
      
      // Try using findObjectByName if available
      if (spline.findObjectByName) {
        try {
          const obj = spline.findObjectByName('Scene');
          if (obj && obj.rotation !== undefined) {
            obj.rotation.y = rotation;
          }
        } catch (e) {
          // Ignore errors from findObjectByName
        }
      }
      
      // Request a render update
      if (spline.requestRender) {
        spline.requestRender();
      }
    } catch (error) {
      // Only log rotation errors once to avoid spam
      if (!rotationErrorLogged) {
        console.error('Spline rotation update error:', error);
        rotationErrorLogged = true;
      }
    }
  }, [scrollProgress, isLoaded]);

  // Show fallback if error
  if (hasError) {
    console.log('Showing fallback due to error');
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
            3D Preview Unavailable
          </div>
        )}
      </div>
    );
  }

  const shouldRenderViewer = isInView && isWebComponentReady;
  console.log('Render state:', { isInView, isWebComponentReady, shouldRenderViewer, isLoaded });

  return (
    <div ref={containerRef} className={`relative w-full h-full ${className}`}>
      {shouldRenderViewer && (
        <spline-viewer
          ref={splineViewerCallback}
          url={sceneUrl}
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      )}
      {(!isLoaded || !shouldRenderViewer) && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 text-muted-foreground text-sm">
          {!isWebComponentReady ? 'Initializing 3D Viewer...' : 'Loading 3D Model...'}
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
