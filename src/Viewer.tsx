import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { SplatMesh } from '@sparkjsdev/spark';
import type { SplatTransform } from './App';

interface ViewerProps {
  fileToLoad: File | null;
  transform: SplatTransform;
  showGrid: boolean;
  resetCameraTrigger: number;
  movementSensitivity: number;
  rotationSensitivity: number;
}

function Viewer({ fileToLoad, transform, showGrid, resetCameraTrigger, movementSensitivity, rotationSensitivity }: ViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const splatMeshRef = useRef<SplatMesh | null>(null);
  const gridHelperRef = useRef<THREE.GridHelper | null>(null);
  const movementSensitivityRef = useRef(movementSensitivity);
  const rotationSensitivityRef = useRef(rotationSensitivity);
  const [isLoading, setIsLoading] = useState(false);

  // Update sensitivity refs when props change
  useEffect(() => {
    movementSensitivityRef.current = movementSensitivity;
  }, [movementSensitivity]);

  useEffect(() => {
    rotationSensitivityRef.current = rotationSensitivity;
  }, [rotationSensitivity]);

  // Camera control state
  const cameraStateRef = useRef({
    position: new THREE.Vector3(0, 3, 7),
    pitch: -0.4,
    yaw: Math.PI,
    isDragging: false,
    lastMouseX: 0,
    lastMouseY: 0,
    keys: {} as Record<string, boolean>,
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf2f2f2);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 3, 7);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Grid helper for reference
    const gridHelper = new THREE.GridHelper(10, 10, 0xcccccc, 0xe0e0e0);
    scene.add(gridHelper);
    gridHelperRef.current = gridHelper;

    // Handle window resize
    const handleResize = () => {
      if (!camera || !renderer) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Mouse controls
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0) {
        cameraStateRef.current.isDragging = true;
        cameraStateRef.current.lastMouseX = e.clientX;
        cameraStateRef.current.lastMouseY = e.clientY;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!cameraStateRef.current.isDragging) return;

      const deltaX = e.clientX - cameraStateRef.current.lastMouseX;
      const deltaY = e.clientY - cameraStateRef.current.lastMouseY;

      cameraStateRef.current.yaw -= deltaX * 0.005 * rotationSensitivityRef.current;
      cameraStateRef.current.pitch -= deltaY * 0.005 * rotationSensitivityRef.current;
      cameraStateRef.current.pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, cameraStateRef.current.pitch));

      cameraStateRef.current.lastMouseX = e.clientX;
      cameraStateRef.current.lastMouseY = e.clientY;
    };

    const handleMouseUp = () => {
      cameraStateRef.current.isDragging = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const state = cameraStateRef.current;
      
      // Calculate forward direction
      const forward = new THREE.Vector3(
        Math.cos(state.pitch) * Math.sin(state.yaw),
        Math.sin(state.pitch),
        Math.cos(state.pitch) * Math.cos(state.yaw)
      );
      
      // Move camera forward/backward
      const zoomSpeed = e.deltaY * 0.01 * movementSensitivityRef.current;
      state.position.x += forward.x * zoomSpeed;
      state.position.y += forward.y * zoomSpeed;
      state.position.z += forward.z * zoomSpeed;
    };

    // Keyboard controls
    const handleKeyDown = (e: KeyboardEvent) => {
      cameraStateRef.current.keys[e.key.toLowerCase()] = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      cameraStateRef.current.keys[e.key.toLowerCase()] = false;
    };

    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    renderer.domElement.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Animation loop
    const animate = () => {
      const state = cameraStateRef.current;
      const camera = cameraRef.current;
      const renderer = rendererRef.current;
      const scene = sceneRef.current;

      if (!camera || !renderer || !scene) return;

      // Calculate view direction from pitch and yaw
      const forward = new THREE.Vector3(
        Math.cos(state.pitch) * Math.sin(state.yaw),
        Math.sin(state.pitch),
        Math.cos(state.pitch) * Math.cos(state.yaw)
      );

      // Calculate right direction (perpendicular to forward, on horizontal plane)
      const right = new THREE.Vector3();
      right.crossVectors(forward, new THREE.Vector3(0, 1, 0));
      right.normalize();

      // Calculate up direction (perpendicular to both forward and right)
      const up = new THREE.Vector3();
      up.crossVectors(right, forward);
      up.normalize();

      // Keyboard movement - relative to camera direction
      let moveSpeed = 0.1 * movementSensitivityRef.current;
      
      // Apply shift boost
      if (state.keys['shift']) {
        moveSpeed *= 2;
      }
      
      // Apply movement
      if (state.keys['w']) {
        state.position.x += forward.x * moveSpeed;
        state.position.y += forward.y * moveSpeed;
        state.position.z += forward.z * moveSpeed;
      }
      if (state.keys['s']) {
        state.position.x -= forward.x * moveSpeed;
        state.position.y -= forward.y * moveSpeed;
        state.position.z -= forward.z * moveSpeed;
      }
      if (state.keys['a']) {
        state.position.x -= right.x * moveSpeed;
        state.position.z -= right.z * moveSpeed;
      }
      if (state.keys['d']) {
        state.position.x += right.x * moveSpeed;
        state.position.z += right.z * moveSpeed;
      }
      if (state.keys['q']) {
        state.position.x -= up.x * moveSpeed;
        state.position.y -= up.y * moveSpeed;
        state.position.z -= up.z * moveSpeed;
      }
      if (state.keys['e']) {
        state.position.x += up.x * moveSpeed;
        state.position.y += up.y * moveSpeed;
        state.position.z += up.z * moveSpeed;
      }

      // Update camera position and look-at target
      camera.position.copy(state.position);
      const target = new THREE.Vector3();
      target.addVectors(state.position, forward);
      camera.lookAt(target);

      renderer.render(scene, camera);
    };

    renderer.setAnimationLoop(animate);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      renderer.domElement.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      renderer.setAnimationLoop(null);
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  // Handle grid visibility
  useEffect(() => {
    if (gridHelperRef.current) {
      gridHelperRef.current.visible = showGrid;
    }
  }, [showGrid]);

  // Handle camera reset
  useEffect(() => {
    if (resetCameraTrigger > 0) {
      cameraStateRef.current.position.set(0, 3, 7);
      cameraStateRef.current.pitch = -0.4;
      cameraStateRef.current.yaw = Math.PI;
    }
  }, [resetCameraTrigger]);

  // Handle file loading
  useEffect(() => {
    if (!sceneRef.current) return;

    // If no file, remove existing splat mesh
    if (!fileToLoad) {
      if (splatMeshRef.current) {
        sceneRef.current.remove(splatMeshRef.current);
        splatMeshRef.current = null;
      }
      return;
    }

    const loadSplat = async () => {
      setIsLoading(true);
      try {
        // Remove existing splat mesh
        if (splatMeshRef.current && sceneRef.current) {
          sceneRef.current.remove(splatMeshRef.current);
          splatMeshRef.current = null;
        }

        // Create URL from file
        const url = URL.createObjectURL(fileToLoad);

        // Create new splat mesh
        const splatMesh = new SplatMesh({ url });
        splatMesh.position.set(0, 0, 0);
        if (sceneRef.current) {
          sceneRef.current.add(splatMesh);
        }
        splatMeshRef.current = splatMesh;

        // Reset camera
        cameraStateRef.current.position.set(0, 3, 7);
        cameraStateRef.current.pitch = -0.4;
        cameraStateRef.current.yaw = Math.PI;

        // Clean up URL
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error loading splat file:', error);
        alert('Error loading splat file. Please make sure it is a valid .ply or .splat file.');
      } finally {
        setIsLoading(false);
      }
    };

    loadSplat();
  }, [fileToLoad]);

  // Apply transformations to splat mesh
  useEffect(() => {
    if (splatMeshRef.current) {
      splatMeshRef.current.rotation.set(
        transform.rotationX,
        transform.rotationY,
        transform.rotationZ
      );
      splatMeshRef.current.position.set(
        transform.positionX,
        transform.positionY,
        transform.positionZ
      );
    }
  }, [transform]);

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full" />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm">
          <div className="text-gray-900 text-xl font-medium">Loading splat...</div>
        </div>
      )}
    </div>
  );
}

export default Viewer;
