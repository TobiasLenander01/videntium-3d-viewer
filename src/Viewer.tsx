import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { SplatMesh } from '@sparkjsdev/spark';

interface ViewerProps {
  fileToLoad: File | null;
}

function Viewer({ fileToLoad }: ViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const splatMeshRef = useRef<SplatMesh | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Camera control state
  const cameraStateRef = useRef({
    pitch: 0,
    yaw: 0,
    distance: 5,
    target: new THREE.Vector3(0, 0, 0),
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
    scene.background = new THREE.Color(0x1a1a1a);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 5);
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
    const gridHelper = new THREE.GridHelper(10, 10, 0x444444, 0x222222);
    scene.add(gridHelper);

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

      cameraStateRef.current.yaw -= deltaX * 0.005;
      cameraStateRef.current.pitch -= deltaY * 0.005;
      cameraStateRef.current.pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, cameraStateRef.current.pitch));

      cameraStateRef.current.lastMouseX = e.clientX;
      cameraStateRef.current.lastMouseY = e.clientY;
    };

    const handleMouseUp = () => {
      cameraStateRef.current.isDragging = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      cameraStateRef.current.distance += e.deltaY * 0.01;
      cameraStateRef.current.distance = Math.max(1, Math.min(50, cameraStateRef.current.distance));
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

      // Keyboard movement
      const moveSpeed = 0.1;
      if (state.keys['w']) state.target.z -= moveSpeed;
      if (state.keys['s']) state.target.z += moveSpeed;
      if (state.keys['a']) state.target.x -= moveSpeed;
      if (state.keys['d']) state.target.x += moveSpeed;
      if (state.keys['q']) state.target.y -= moveSpeed;
      if (state.keys['e']) state.target.y += moveSpeed;

      // Update camera position based on orbit controls
      const x = state.target.x + state.distance * Math.cos(state.pitch) * Math.sin(state.yaw);
      const y = state.target.y + state.distance * Math.sin(state.pitch);
      const z = state.target.z + state.distance * Math.cos(state.pitch) * Math.cos(state.yaw);

      camera.position.set(x, y, z);
      camera.lookAt(state.target);

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

  // Handle file loading
  useEffect(() => {
    if (!fileToLoad || !sceneRef.current) return;

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
        cameraStateRef.current.distance = 5;
        cameraStateRef.current.pitch = 0;
        cameraStateRef.current.yaw = 0;
        cameraStateRef.current.target.set(0, 0, 0);

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

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full" />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-white text-xl">Loading splat...</div>
        </div>
      )}
      {!splatMeshRef.current && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-gray-400 text-center">
            <p className="text-xl mb-2">No splat loaded</p>
            <p className="text-sm">Import a .ply or .splat file to begin</p>
            <p className="text-xs mt-4">Controls: Mouse drag to rotate, Scroll to zoom, WASD/QE to move</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Viewer;
