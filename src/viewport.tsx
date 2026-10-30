import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { SplatMesh } from '@sparkjsdev/spark';
import type { SplatSource } from '@/lib/splat-source';

export interface ViewportProps {
  splatToLoad: SplatSource | null;
  transform: SplatTransform;
  showGrid: boolean;
  resetCameraTrigger: number;
  movementSensitivity: number;
  rotationSensitivity: number;
}

export interface SplatTransform {
  rotationX: number;
  rotationY: number;
  rotationZ: number;
  positionX: number;
  positionY: number;
  positionZ: number;
  scaleX: number;
  scaleY: number;
  scaleZ: number;
}

function Viewport({ splatToLoad, transform, showGrid, resetCameraTrigger, movementSensitivity, rotationSensitivity }: ViewportProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const splatMeshRef = useRef<SplatMesh | null>(null);
  const gridHelperRef = useRef<THREE.GridHelper | null>(null);
  const movementSensitivityRef = useRef(movementSensitivity);
  const rotationSensitivityRef = useRef(rotationSensitivity);
  const [isLoading, setIsLoading] = useState(false);
  
  // Optimization: Only render when necessary
  const needsRender = useRef(true);
  const renderCountdown = useRef(0);

  // Function to convert HSL from CSS variable to THREE.Color
  const getBackgroundColor = (): THREE.Color => {
    const root = document.documentElement;
    const bgColor = getComputedStyle(root).getPropertyValue('--background').trim();
    console.log("CSS color variable retrieved: " + bgColor);
    
    // Parse HSL string: "hsl(223.8136 0.0000% 3.9388%)"
    const hslMatch = bgColor.match(/hsl\(([^)]+)\)/);
    if (hslMatch) {
      const [h, s, l] = hslMatch[1].split(/\s+/).map(val => parseFloat(val.replace('%', '')));
      
      // Convert HSL to RGB
      const hNorm = h / 360;
      const sNorm = s / 100;
      const lNorm = l / 100;
      
      let r, g, b;
      if (sNorm === 0) {
        r = g = b = lNorm;
      } else {
        const hue2rgb = (p: number, q: number, t: number) => {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1/6) return p + (q - p) * 6 * t;
          if (t < 1/2) return q;
          if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
          return p;
        };
        
        const q = lNorm < 0.5 ? lNorm * (1 + sNorm) : lNorm + sNorm - lNorm * sNorm;
        const p = 2 * lNorm - q;
        r = hue2rgb(p, q, hNorm + 1/3);
        g = hue2rgb(p, q, hNorm);
        b = hue2rgb(p, q, hNorm - 1/3);
      }
      
      const threeColor = new THREE.Color(r, g, b);
      console.log("Viewer themed background created from HSL");
      return threeColor;
    }
    
    // Try parsing as hex color (#fff, #ffffff, etc.)
    if (bgColor.startsWith('#')) {
      try {
        const threeColor = new THREE.Color(bgColor);
        console.log("Viewer themed background created from hex");
        return threeColor;
      } catch {
        console.warn("Failed to parse hex color:", bgColor);
      }
    }
    
    // Try parsing as rgb/rgba
    const rgbMatch = bgColor.match(/rgba?\(([^)]+)\)/);
    if (rgbMatch) {
      const values = rgbMatch[1].split(',').map(v => parseFloat(v.trim()));
      if (values.length >= 3) {
        const threeColor = new THREE.Color(values[0] / 255, values[1] / 255, values[2] / 255);
        console.log("Viewer themed background created from RGB");
        return threeColor;
      }
    }

    console.warn("Viewer falling back to black background color")
    
    // Fallback to black
    return new THREE.Color(0x000000);
  };

  // Update sensitivity refs when props change
  useEffect(() => {
    movementSensitivityRef.current = movementSensitivity;
  }, [movementSensitivity]);

  useEffect(() => {
    rotationSensitivityRef.current = rotationSensitivity;
  }, [rotationSensitivity]);

  // Trigger render on prop changes
  useEffect(() => {
    needsRender.current = true;
  }, [transform, showGrid, resetCameraTrigger]);

  // Update background color when theme changes
  useEffect(() => {
    const updateBackgroundColor = () => {
      if (sceneRef.current) {
        sceneRef.current.background = getBackgroundColor();
        needsRender.current = true;
        renderCountdown.current = 2;
      }
    };

    // Listen for class changes on document.documentElement (for dark mode)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          updateBackgroundColor();
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

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

  // Touch control state — tracks active touches by identifier
  const touchStateRef = useRef<Map<number, {
    startX: number;
    startY: number;
    lastX: number;
    lastY: number;
    zone: 'top' | 'bottom';
  }>>(new Map());

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = getBackgroundColor();
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

    // Renderer setup with performance optimizations
    const renderer = new THREE.WebGLRenderer({ 
      antialias: false, // OPTIMIZATION: Disable MSAA
      powerPreference: 'high-performance',
      stencil: false,
      depth: true,
      alpha: false
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    // OPTIMIZATION: Cap at 1.0 for better performance
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
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
      needsRender.current = true;
    };
    window.addEventListener('resize', handleResize);

    // Mouse controls
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0) {
        cameraStateRef.current.isDragging = true;
        cameraStateRef.current.lastMouseX = e.clientX;
        cameraStateRef.current.lastMouseY = e.clientY;
        needsRender.current = true;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!cameraStateRef.current.isDragging) return;

      const deltaX = e.clientX - cameraStateRef.current.lastMouseX;
      const deltaY = e.clientY - cameraStateRef.current.lastMouseY;
      
      if (deltaX === 0 && deltaY === 0) return;

      cameraStateRef.current.yaw -= deltaX * 0.005 * rotationSensitivityRef.current;
      cameraStateRef.current.pitch -= deltaY * 0.005 * rotationSensitivityRef.current;
      cameraStateRef.current.pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, cameraStateRef.current.pitch));

      cameraStateRef.current.lastMouseX = e.clientX;
      cameraStateRef.current.lastMouseY = e.clientY;
      needsRender.current = true;
    };

    const handleMouseUp = () => {
      cameraStateRef.current.isDragging = false;
      needsRender.current = true;
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
      needsRender.current = true;
    };

    // Keyboard controls
    const handleKeyDown = (e: KeyboardEvent) => {
      cameraStateRef.current.keys[e.key.toLowerCase()] = true;
      needsRender.current = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      cameraStateRef.current.keys[e.key.toLowerCase()] = false;
    };

    // Touch controls — top half rotates, bottom half moves
    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const rect = renderer.domElement.getBoundingClientRect();
      const midY = rect.top + rect.height / 2;

      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        const zone = touch.clientY <= midY ? 'top' : 'bottom';
        touchStateRef.current.set(touch.identifier, {
          startX: touch.clientX,
          startY: touch.clientY,
          lastX: touch.clientX,
          lastY: touch.clientY,
          zone,
        });
      }
      needsRender.current = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const state = cameraStateRef.current;

      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        const tracked = touchStateRef.current.get(touch.identifier);
        if (!tracked) continue;

        const deltaX = touch.clientX - tracked.lastX;
        const deltaY = touch.clientY - tracked.lastY;

        if (deltaX === 0 && deltaY === 0) continue;

        if (tracked.zone === 'top') {
          // Top half — rotate camera (inverted for natural feel)
          state.yaw += deltaX * 0.005 * rotationSensitivityRef.current;
          state.pitch += deltaY * 0.005 * rotationSensitivityRef.current;
          state.pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, state.pitch));
        } else {
          // Bottom half — move camera (strafe horizontal, forward/back vertical)
          const forward = new THREE.Vector3(
            Math.cos(state.pitch) * Math.sin(state.yaw),
            0,
            Math.cos(state.pitch) * Math.cos(state.yaw)
          ).normalize();

          const right = new THREE.Vector3();
          right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

          const speed = 0.01 * movementSensitivityRef.current;
          state.position.addScaledVector(right, -deltaX * speed);
          state.position.addScaledVector(forward, deltaY * speed);
        }

        tracked.lastX = touch.clientX;
        tracked.lastY = touch.clientY;
        needsRender.current = true;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        touchStateRef.current.delete(e.changedTouches[i].identifier);
      }
    };

    renderer.domElement.addEventListener('touchstart', handleTouchStart, { passive: false });
    renderer.domElement.addEventListener('touchmove', handleTouchMove, { passive: false });
    renderer.domElement.addEventListener('touchend', handleTouchEnd);
    renderer.domElement.addEventListener('touchcancel', handleTouchEnd);

    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    renderer.domElement.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Animation loop with frame rate limiting
    let lastFrameTime = performance.now();
    const targetFPS = 60;
    const frameInterval = 1000 / targetFPS;
    
    const animate = () => {
      const now = performance.now();
      const elapsed = now - lastFrameTime;
      
      // Skip frame if not enough time has passed
      if (elapsed < frameInterval) {
        return;
      }
      
      lastFrameTime = now - (elapsed % frameInterval);

      // PERFORMANCE: Demand-based rendering
      const state = cameraStateRef.current;
      const isMoving = Object.values(state.keys).some(k => k);
      
      // Keep rendering for a while after events (loading, etc.)
      if (renderCountdown.current > 0) {
        renderCountdown.current--;
      }

      const isTouching = touchStateRef.current.size > 0;
      const shouldRender = isMoving || state.isDragging || isTouching || needsRender.current || renderCountdown.current > 0;

      if (!shouldRender) {
        return;
      }

      // Reset one-shot render flag
      if (!isMoving && !state.isDragging && !isTouching) {
        needsRender.current = false;
      }
      
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
      renderer.domElement.removeEventListener('touchstart', handleTouchStart);
      renderer.domElement.removeEventListener('touchmove', handleTouchMove);
      renderer.domElement.removeEventListener('touchend', handleTouchEnd);
      renderer.domElement.removeEventListener('touchcancel', handleTouchEnd);
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
    if (!splatToLoad) {
      setIsLoading(false);
      if (splatMeshRef.current) {
        sceneRef.current.remove(splatMeshRef.current);
        splatMeshRef.current = null;
        needsRender.current = true;
        renderCountdown.current = 60; // Render for 1 second to ensure change is visible
      }
      return;
    }

    let cancelled = false;
    // Local files need an object URL, hosted files (e.g. the demo) already have one
    const isFile = splatToLoad instanceof File;
    const url = isFile ? URL.createObjectURL(splatToLoad) : splatToLoad.url;

    const loadSplat = async () => {
      setIsLoading(true);
      try {
        // Remove existing splat mesh
        if (splatMeshRef.current && sceneRef.current) {
          sceneRef.current.remove(splatMeshRef.current);
          splatMeshRef.current = null;
        }

        // Create new splat mesh
        const splatMesh = new SplatMesh({ 
          url: url,
          maxSplats: 500000
        });
        splatMesh.position.set(0, 0, 0);
        splatMesh.quaternion.set(1, 0, 0, 0); // 180° X-axis flip for correct orientation
        if (sceneRef.current) {
          sceneRef.current.add(splatMesh);
        }
        splatMeshRef.current = splatMesh;

        // Reset camera
        cameraStateRef.current.position.set(0, 3, 7);
        cameraStateRef.current.pitch = -0.4;
        cameraStateRef.current.yaw = Math.PI;

        // Wait for the splat to download and decode
        await splatMesh.initialized;
        needsRender.current = true;
      } catch (error) {
        console.error('Error loading splat file:', error);
        if (!cancelled) {
          alert('Error loading splat file. Please make sure it is a valid .ply, .splat, .spz or .sog file.');
        }
      } finally {
        if (isFile) {
          URL.revokeObjectURL(url);
        }
        if (!cancelled) {
          setIsLoading(false);
          // Force rendering for a set period to ensure splat is fully visible after loading
          renderCountdown.current = 120; // ~2 seconds at 60fps
        }
      }
    };

    loadSplat();

    return () => {
      cancelled = true;
    };
  }, [splatToLoad]);

  // Apply transformations to splat mesh
  useEffect(() => {
    if (splatMeshRef.current) {
      splatMeshRef.current.rotation.set(
        transform.rotationX + Math.PI, // Base 180° flip for correct orientation
        transform.rotationY,
        transform.rotationZ
      );
      splatMeshRef.current.position.set(
        transform.positionX,
        transform.positionY,
        transform.positionZ
      );
      splatMeshRef.current.scale.set(
        transform.scaleX,
        transform.scaleY,
        transform.scaleZ
      );
      splatMeshRef.current.updateMatrix();
      needsRender.current = true;
      renderCountdown.current = 60; // Render for 1 second to ensure change is visible
    }
  }, [transform]);

  return (
    <div className="w-full h-full">
      <div ref={containerRef} className="w-full h-full" />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm z-10">
          <div className="text-foreground text-xl font-medium">Loading {splatToLoad?.name ?? 'splat'}...</div>
        </div>
      )}
    </div>
  );
}

export default Viewport;
