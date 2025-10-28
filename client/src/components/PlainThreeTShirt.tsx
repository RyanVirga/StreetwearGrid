import { useRef, useEffect, useState } from "react";
import * as THREE from "three";

interface PlainThreeTShirtProps {
  scrollProgress?: number;
  color?: string;
  fallbackImage?: string;
}

// Check WebGL availability
function checkWebGLSupport(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!gl;
  } catch (e) {
    console.warn('WebGL not available:', e);
    return false;
  }
}

export default function PlainThreeTShirt({ 
  scrollProgress = 0, 
  color = "#2F6BFF",
  fallbackImage 
}: PlainThreeTShirtProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    tshirtGroup: THREE.Group;
    animationId?: number;
  } | null>(null);
  const [webglAvailable, setWebglAvailable] = useState<boolean | null>(null);

  // Check WebGL support on mount
  useEffect(() => {
    setWebglAvailable(checkWebGLSupport());
  }, []);

  useEffect(() => {
    if (!containerRef.current || webglAvailable === false) return;
    if (webglAvailable === null) return; // Still checking

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = null;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Renderer setup with error handling
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ 
        alpha: true,
        antialias: true,
        preserveDrawingBuffer: false
      });
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      containerRef.current.appendChild(renderer.domElement);
    } catch (error) {
      console.error('Failed to create WebGL renderer:', error);
      setWebglAvailable(false);
      return;
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight1.position.set(5, 5, 5);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.3);
    directionalLight2.position.set(-5, -5, -5);
    scene.add(directionalLight2);

    // Create t-shirt group
    const tshirtGroup = new THREE.Group();
    
    // Create material
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      metalness: 0.1,
      roughness: 0.85,
    });

    // Main torso
    const torsoGeometry = new THREE.BoxGeometry(1.4, 1.6, 0.35);
    const torso = new THREE.Mesh(torsoGeometry, material);
    torso.position.set(0, 0, 0);
    tshirtGroup.add(torso);

    // Left sleeve
    const leftSleeveGeometry = new THREE.BoxGeometry(0.5, 0.7, 0.35);
    const leftSleeve = new THREE.Mesh(leftSleeveGeometry, material);
    leftSleeve.position.set(-0.85, 0.45, 0);
    leftSleeve.rotation.z = 0.3;
    tshirtGroup.add(leftSleeve);

    // Right sleeve
    const rightSleeveGeometry = new THREE.BoxGeometry(0.5, 0.7, 0.35);
    const rightSleeve = new THREE.Mesh(rightSleeveGeometry, material);
    rightSleeve.position.set(0.85, 0.45, 0);
    rightSleeve.rotation.z = -0.3;
    tshirtGroup.add(rightSleeve);

    // Collar/neck area
    const collarGeometry = new THREE.CylinderGeometry(0.25, 0.28, 0.15, 32);
    const collar = new THREE.Mesh(collarGeometry, material);
    collar.position.set(0, 0.85, 0);
    tshirtGroup.add(collar);

    // Add fabric fold detail
    const foldMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      metalness: 0.05,
      roughness: 0.9,
      opacity: 0.3,
      transparent: true,
    });
    const foldGeometry = new THREE.BoxGeometry(1.2, 1.4, 0.02);
    const fold = new THREE.Mesh(foldGeometry, foldMaterial);
    fold.position.set(0, 0, 0.18);
    tshirtGroup.add(fold);

    scene.add(tshirtGroup);

    // Store references
    sceneRef.current = {
      scene,
      camera,
      renderer,
      tshirtGroup,
    };

    // Animation loop
    const animate = () => {
      if (!sceneRef.current) return;
      sceneRef.current.animationId = requestAnimationFrame(animate);
      sceneRef.current.renderer.render(sceneRef.current.scene, sceneRef.current.camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !sceneRef.current) return;

      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      sceneRef.current.camera.aspect = width / height;
      sceneRef.current.camera.updateProjectionMatrix();
      sceneRef.current.renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (sceneRef.current) {
        if (sceneRef.current.animationId) {
          cancelAnimationFrame(sceneRef.current.animationId);
        }
        
        // Dispose of geometries and materials
        sceneRef.current.tshirtGroup.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.geometry.dispose();
            if (Array.isArray(object.material)) {
              object.material.forEach(material => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        });
        
        sceneRef.current.renderer.dispose();
        
        if (containerRef.current?.contains(sceneRef.current.renderer.domElement)) {
          containerRef.current.removeChild(sceneRef.current.renderer.domElement);
        }
        
        sceneRef.current = null;
      }
    };
  }, [color, webglAvailable]);

  // Update rotation based on scroll
  useEffect(() => {
    if (sceneRef.current?.tshirtGroup) {
      sceneRef.current.tshirtGroup.rotation.y = scrollProgress * Math.PI * 2;
    }
  }, [scrollProgress]);

  // Show fallback if WebGL is not available
  if (webglAvailable === false && fallbackImage) {
    return (
      <div 
        className="w-full h-full flex items-center justify-center bg-muted/10"
        data-testid="plain-three-tshirt-fallback"
      >
        <img 
          src={fallbackImage} 
          alt="Product" 
          className="max-w-full max-h-full object-contain"
        />
      </div>
    );
  }

  // Show loading state while checking WebGL
  if (webglAvailable === null) {
    return (
      <div 
        className="w-full h-full flex items-center justify-center"
        data-testid="plain-three-tshirt-loading"
      >
        <div className="text-muted-foreground text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full"
      data-testid="plain-three-tshirt"
    />
  );
}
