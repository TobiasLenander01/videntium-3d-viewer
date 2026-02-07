import { useState } from 'react';
import Sidebar from './Sidebar';
import Viewer from './Viewer';

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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [resetCameraTrigger, setResetCameraTrigger] = useState(0);
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
      <Viewer fileToLoad={fileToLoad} transform={splatTransform} showGrid={showGrid} resetCameraTrigger={resetCameraTrigger} />
      <Sidebar 
        onFileLoad={handleFileLoad} 
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        transform={splatTransform}
        onTransformChange={setSplatTransform}
        showGrid={showGrid}
        onToggleGrid={() => setShowGrid(!showGrid)}
        onResetCamera={() => setResetCameraTrigger(prev => prev + 1)}
      />
    </div>
  )
}

export default App
