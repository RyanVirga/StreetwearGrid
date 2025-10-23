import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import type { Mesh, Group } from "three";

interface Product3DModelProps {
  type?: "tshirt" | "hoodie" | "cap" | "tote" | "crewneck" | "longsleeve";
  color?: string;
}

function RotatingProduct({ type = "tshirt", color = "#2F6BFF" }: Product3DModelProps) {
  const meshRef = useRef<Mesh>(null);
  const groupRef = useRef<Group>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.3;
    }
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  const renderShape = () => {
    switch (type) {
      case "cap":
        return (
          <group ref={groupRef}>
            <mesh position={[0, 0.3, 0]}>
              <sphereGeometry args={[0.8, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color={color} metalness={0.2} roughness={0.8} />
            </mesh>
            <mesh position={[0, 0.25, 0.6]}>
              <boxGeometry args={[1.5, 0.02, 0.8]} />
              <meshStandardMaterial color={color} metalness={0.2} roughness={0.8} />
            </mesh>
          </group>
        );
      case "tote":
        return (
          <mesh ref={meshRef}>
            <cylinderGeometry args={[0.6, 0.7, 1.2, 32]} />
            <meshStandardMaterial color={color} metalness={0.1} roughness={0.9} />
          </mesh>
        );
      case "hoodie":
      case "crewneck":
        return (
          <group ref={groupRef}>
            <mesh>
              <boxGeometry args={[1.2, 1.5, 0.4]} />
              <meshStandardMaterial color={color} metalness={0.1} roughness={0.9} />
            </mesh>
            <mesh position={[-0.7, 0.3, 0]}>
              <cylinderGeometry args={[0.15, 0.15, 0.9, 16]} />
              <meshStandardMaterial color={color} metalness={0.1} roughness={0.9} />
            </mesh>
            <mesh position={[0.7, 0.3, 0]}>
              <cylinderGeometry args={[0.15, 0.15, 0.9, 16]} />
              <meshStandardMaterial color={color} metalness={0.1} roughness={0.9} />
            </mesh>
          </group>
        );
      default:
        return (
          <mesh ref={meshRef}>
            <boxGeometry args={[1, 1.3, 0.3]} />
            <meshStandardMaterial color={color} metalness={0.1} roughness={0.9} />
          </mesh>
        );
    }
  };

  return (
    <>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      {renderShape()}
    </>
  );
}

export default function Product3DModel({ type, color }: Product3DModelProps) {
  return (
    <div className="w-full h-full">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <RotatingProduct type={type} color={color} />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}
