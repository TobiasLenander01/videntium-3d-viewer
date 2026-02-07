import { useState } from 'react';
import Sidebar from './Sidebar';
import Viewer from './Viewer';
import Header from './Header';

export interface SplatTransform {
  rotationX: number;
  rotationY: number;
  rotationZ: number;
  positionX: number;
  positionY: number;
  positionZ: number;
}

function App() {
  const [fileToLoad, setFileToLoad] = useState<File | null>(null);
  const [showGrid, setShowGrid] = useState(false);
  const [resetCameraTrigger, setResetCameraTrigger] = useState(0);
  const [movementSensitivity, setMovementSensitivity] = useState(0.2);
  const [rotationSensitivity, setRotationSensitivity] = useState(0.4);
  const [splatTransform, setSplatTransform] = useState<SplatTransform>({
    rotationX: 0,
    rotationY: 0,
    rotationZ: 0,
    positionX: 0,
    positionY: 0,
    positionZ: 0,
  });

  const handleFileLoad = (file: File | null) => {
    setFileToLoad(file);
    // Reset transformations when loading new file
    if (file) {
      setSplatTransform({ rotationX: 0, rotationY: 0, rotationZ: 0, positionX: 0, positionY: 0, positionZ: 0 });
    }
  };

  return (
    <div className='relative h-screen w-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden'>
      <Header />
      <Viewer 
        fileToLoad={fileToLoad} 
        transform={splatTransform} 
        showGrid={showGrid} 
        resetCameraTrigger={resetCameraTrigger}
        movementSensitivity={movementSensitivity}
        rotationSensitivity={rotationSensitivity}
      />
      <Sidebar 
        onFileLoad={handleFileLoad} 
        transform={splatTransform}
        onTransformChange={setSplatTransform}
        showGrid={showGrid}
        onToggleGrid={() => setShowGrid(!showGrid)}
        onResetCamera={() => setResetCameraTrigger(prev => prev + 1)}
        movementSensitivity={movementSensitivity}
        rotationSensitivity={rotationSensitivity}
        onMovementSensitivityChange={setMovementSensitivity}
        onRotationSensitivityChange={setRotationSensitivity}
      />
    </div>
  )
}

export default App
