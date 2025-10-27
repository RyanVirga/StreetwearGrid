import { useRef, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import ErrorBoundary from "./ErrorBoundary";

interface Product3DModelProps {
  type?: "tshirt" | "hoodie" | "cap" | "tote" | "crewneck" | "longsleeve";
  color?: string;
  scrollProgress?: number;
  fallbackImage?: string;
}

function TShirtMesh({ color = "#2F6BFF", rotation = 0 }: { color: string; rotation: number }) {
  const meshRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y = rotation;
    }
  }, [rotation]);

  return (
    <group ref={meshRef}>
      {/* Main torso */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.4, 1.6, 0.35]} />
        <meshStandardMaterial 
          color={color} 
          metalness={0.1} 
          roughness={0.85}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Left sleeve */}
      <mesh position={[-0.85, 0.45, 0]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.5, 0.7, 0.35]} />
        <meshStandardMaterial 
          color={color} 
          metalness={0.1} 
          roughness={0.85}
        />
      </mesh>

      {/* Right sleeve */}
      <mesh position={[0.85, 0.45, 0]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.5, 0.7, 0.35]} />
        <meshStandardMaterial 
          color={color} 
          metalness={0.1} 
          roughness={0.85}
        />
      </mesh>

      {/* Collar/neck area */}
      <mesh position={[0, 0.85, 0]}>
        <cylinderGeometry args={[0.25, 0.28, 0.15, 32]} />
        <meshStandardMaterial 
          color={color} 
          metalness={0.1} 
          roughness={0.85}
        />
      </mesh>

      {/* Add some fabric fold details */}
      <mesh position={[0, 0, 0.18]}>
        <boxGeometry args={[1.2, 1.4, 0.02]} />
        <meshStandardMaterial 
          color={color} 
          metalness={0.05} 
          roughness={0.9}
          opacity={0.3}
          transparent
        />
      </mesh>
    </group>
  );
}

function HoodieMesh({ color = "#2F6BFF", rotation = 0 }: { color: string; rotation: number }) {
  const meshRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y = rotation;
    }
  }, [rotation]);

  return (
    <group ref={meshRef}>
      {/* Main body - slightly larger than t-shirt */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.5, 1.7, 0.45]} />
        <meshStandardMaterial 
          color={color} 
          metalness={0.05} 
          roughness={0.95}
        />
      </mesh>

      {/* Left sleeve */}
      <mesh position={[-0.95, 0.4, 0]} rotation={[0, 0, 0.25]}>
        <cylinderGeometry args={[0.2, 0.25, 0.9, 16]} />
        <meshStandardMaterial 
          color={color} 
          metalness={0.05} 
          roughness={0.95}
        />
      </mesh>

      {/* Right sleeve */}
      <mesh position={[0.95, 0.4, 0]} rotation={[0, 0, -0.25]}>
        <cylinderGeometry args={[0.2, 0.25, 0.9, 16]} />
        <meshStandardMaterial 
          color={color} 
          metalness={0.05} 
          roughness={0.95}
        />
      </mesh>

      {/* Hood */}
      <mesh position={[0, 0.9, -0.05]}>
        <sphereGeometry args={[0.45, 32, 16, 0, Math.PI * 2, 0, Math.PI / 1.5]} />
        <meshStandardMaterial 
          color={color} 
          metalness={0.05} 
          roughness={0.95}
        />
      </mesh>

      {/* Front pocket */}
      <mesh position={[0, -0.3, 0.25]}>
        <boxGeometry args={[0.8, 0.4, 0.15]} />
        <meshStandardMaterial 
          color={color} 
          metalness={0.05} 
          roughness={0.95}
        />
      </mesh>

      {/* Drawstrings */}
      <mesh position={[-0.15, 0.75, 0.25]}>
        <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>
      <mesh position={[0.15, 0.75, 0.25]}>
        <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>
    </group>
  );
}

function CapMesh({ color = "#2F6BFF", rotation = 0 }: { color: string; rotation: number }) {
  const meshRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y = rotation;
    }
  }, [rotation]);

  return (
    <group ref={meshRef}>
      {/* Crown/dome */}
      <mesh position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.85, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial 
          color={color} 
          metalness={0.2} 
          roughness={0.8}
        />
      </mesh>

      {/* Brim */}
      <mesh position={[0, 0.22, 0.7]} rotation={[0.1, 0, 0]}>
        <boxGeometry args={[1.6, 0.03, 0.9]} />
        <meshStandardMaterial 
          color={color} 
          metalness={0.2} 
          roughness={0.8}
        />
      </mesh>

      {/* Button on top */}
      <mesh position={[0, 0.65, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.06, 16]} />
        <meshStandardMaterial 
          color={color} 
          metalness={0.3} 
          roughness={0.7}
        />
      </mesh>
    </group>
  );
}

function ToteMesh({ color = "#2F6BFF", rotation = 0 }: { color: string; rotation: number }) {
  const meshRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y = rotation;
    }
  }, [rotation]);

  return (
    <group ref={meshRef}>
      {/* Main bag body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.2, 1.3, 0.25]} />
        <meshStandardMaterial 
          color={color} 
          metalness={0.05} 
          roughness={0.95}
        />
      </mesh>

      {/* Bottom gusset */}
      <mesh position={[0, -0.65, 0]}>
        <boxGeometry args={[1.2, 0.02, 0.25]} />
        <meshStandardMaterial 
          color={color} 
          metalness={0.05} 
          roughness={0.95}
        />
      </mesh>

      {/* Left handle */}
      <mesh position={[-0.35, 0.85, 0]}>
        <torusGeometry args={[0.15, 0.03, 16, 32, Math.PI]} />
        <meshStandardMaterial 
          color={color} 
          metalness={0.1} 
          roughness={0.9}
        />
      </mesh>

      {/* Right handle */}
      <mesh position={[0.35, 0.85, 0]}>
        <torusGeometry args={[0.15, 0.03, 16, 32, Math.PI]} />
        <meshStandardMaterial 
          color={color} 
          metalness={0.1} 
          roughness={0.9}
        />
      </mesh>
    </group>
  );
}

function ProductMesh({ type = "tshirt", color = "#2F6BFF", scrollProgress = 0 }: Product3DModelProps) {
  // Convert scroll progress (0-1) to rotation (0 to 2π)
  const rotation = scrollProgress * Math.PI * 2;

  return (
    <>
      <ambientLight intensity={0.6} />
      <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={0.8} />
      <pointLight position={[-10, 5, -10]} intensity={0.4} />
      <pointLight position={[0, -5, 5]} intensity={0.3} />
      
      {type === "tshirt" || type === "longsleeve" ? (
        <TShirtMesh color={color} rotation={rotation} />
      ) : type === "hoodie" || type === "crewneck" ? (
        <HoodieMesh color={color} rotation={rotation} />
      ) : type === "cap" ? (
        <CapMesh color={color} rotation={rotation} />
      ) : type === "tote" ? (
        <ToteMesh color={color} rotation={rotation} />
      ) : (
        <TShirtMesh color={color} rotation={rotation} />
      )}
    </>
  );
}

function Product3DModelCanvas({ type, color, scrollProgress, fallbackImage }: Product3DModelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [webglError, setWebglError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Lazy load - only render when visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleContextLost = (event: Event) => {
      event.preventDefault();
      console.warn("WebGL context lost");
      setWebglError(true);
    };

    const handleContextRestored = () => {
      console.log("WebGL context restored");
      setWebglError(false);
    };

    canvas.addEventListener("webglcontextlost", handleContextLost);
    canvas.addEventListener("webglcontextrestored", handleContextRestored);

    return () => {
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      canvas.removeEventListener("webglcontextrestored", handleContextRestored);
    };
  }, [isVisible]);

  // Show fallback image if WebGL fails
  if (webglError && fallbackImage) {
    return (
      <div ref={containerRef} className="w-full h-full flex items-center justify-center">
        <img 
          src={fallbackImage} 
          alt="Product preview" 
          className="w-full h-full object-contain opacity-70"
        />
      </div>
    );
  }

  // Show placeholder until visible
  if (!isVisible) {
    return (
      <div ref={containerRef} className="w-full h-full flex items-center justify-center bg-muted/20">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted animate-pulse" />
          <p className="text-xs text-muted-foreground">Loading 3D preview...</p>
        </div>
      </div>
    );
  }

  if (webglError) {
    return (
      <div ref={containerRef} className="w-full h-full flex items-center justify-center bg-muted/30">
        <div className="text-center p-6">
          <p className="text-sm text-muted-foreground mb-2">3D Preview Unavailable</p>
          <p className="text-xs text-muted-foreground">WebGL not supported</p>
        </div>
      </div>
    );
  }

  try {
    return (
      <div ref={containerRef} className="w-full h-full">
        <Canvas
          ref={canvasRef}
          gl={{ 
            preserveDrawingBuffer: false, 
            antialias: true,
            alpha: true,
            failIfMajorPerformanceCaveat: false,
          }}
          dpr={[1, 2]}
          performance={{ min: 0.5 }}
        >
          <PerspectiveCamera makeDefault position={[0, 0, 5]} />
          <ProductMesh type={type} color={color} scrollProgress={scrollProgress} />
        </Canvas>
      </div>
    );
  } catch (error) {
    console.error("Error creating Canvas:", error);
    setWebglError(true);
    return null;
  }
}

export default function Product3DModel({ 
  type = "tshirt", 
  color = "#2F6BFF", 
  scrollProgress = 0,
  fallbackImage 
}: Product3DModelProps) {
  return (
    <div className="w-full h-full">
      <ErrorBoundary
        fallback={
          fallbackImage ? (
            <div className="w-full h-full flex items-center justify-center">
              <img 
                src={fallbackImage} 
                alt="Product preview" 
                className="w-full h-full object-contain opacity-70"
              />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted/30">
              <div className="text-center p-6">
                <p className="text-sm text-muted-foreground mb-2">3D Preview Unavailable</p>
                <p className="text-xs text-muted-foreground">Your browser doesn't support WebGL</p>
              </div>
            </div>
          )
        }
      >
        <Product3DModelCanvas 
          type={type} 
          color={color} 
          scrollProgress={scrollProgress}
          fallbackImage={fallbackImage}
        />
      </ErrorBoundary>
    </div>
  );
}
