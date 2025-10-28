import { useRef, useEffect, useState } from "react";
import { Application } from "@splinetool/runtime";

interface SplineTShirtProps {
  scrollProgress?: number;
  fallbackImage?: string;
}

export default function SplineTShirt({ 
  scrollProgress = 0, 
  fallbackImage 
}: SplineTShirtProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Initialize Spline scene
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const app = new Application(canvas);
    
    app
      .load('https://prod.spline.design/HN9Zy45KS-veyNHt/scene.splinecode')
      .then(() => {
        console.log('Spline scene loaded successfully');
        appRef.current = app;
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Failed to load Spline scene:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        console.error('Error message:', error?.message);
        console.error('Error stack:', error?.stack);
        setHasError(true);
        setIsLoading(false);
      });

    return () => {
      if (appRef.current) {
        // Dispose of Spline Application to release GPU/context resources
        if (typeof appRef.current.dispose === 'function') {
          appRef.current.dispose();
        }
        appRef.current = null;
      }
    };
  }, []);

  // Update rotation based on scroll
  useEffect(() => {
    if (!appRef.current) return;

    try {
      // Try to find and rotate the main object
      const allObjects = appRef.current.getAllObjects();
      
      if (allObjects && allObjects.length > 0) {
        // Find the main object - might be named differently
        const mainObject = allObjects.find(obj => 
          obj.name?.toLowerCase().includes('tshirt') || 
          obj.name?.toLowerCase().includes('t-shirt') ||
          obj.name?.toLowerCase().includes('shirt')
        ) || allObjects[0];
        
        if (mainObject && 'rotation' in mainObject) {
          mainObject.rotation.y = scrollProgress * Math.PI * 2;
        }
      }
    } catch (error) {
      console.warn('Could not update rotation:', error);
    }
  }, [scrollProgress]);

  if (hasError && fallbackImage) {
    return (
      <div 
        className="w-full h-full flex items-center justify-center"
        data-testid="spline-tshirt-fallback"
      >
        <img 
          src={fallbackImage} 
          alt="T-Shirt" 
          className="max-w-full max-h-full object-contain"
        />
      </div>
    );
  }

  return (
    <div className="w-full h-full relative" data-testid="spline-tshirt">
      {isLoading && (
        <div 
          className="absolute inset-0 flex items-center justify-center text-white/60 text-sm"
          data-testid="spline-tshirt-loading"
        >
          Loading 3D Model...
        </div>
      )}
      <canvas 
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: hasError ? 'none' : 'block' }}
      />
    </div>
  );
}
