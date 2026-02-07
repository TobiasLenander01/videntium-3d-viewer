import { useState } from 'react';
import Sidebar from './Sidebar';
import Viewer from './Viewer';

export interface SplatTransform {
  rotationX: number;
  rotationY: number;
  rotationZ: number;
}

function App() {
  const [fileToLoad, setFileToLoad] = useState<File | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [splatTransform, setSplatTransform] = useState<SplatTransform>({
    rotationX: 0,
    rotationY: 0,
    rotationZ: 0,
  });

  const handleFileLoad = (file: File) => {
    setFileToLoad(file);
    // Reset transformations when loading new file
    setSplatTransform({ rotationX: 0, rotationY: 0, rotationZ: 0 });
  };

  return (
    <div className='relative h-screen w-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden'>
      <Viewer fileToLoad={fileToLoad} transform={splatTransform} />
      <Sidebar 
        onFileLoad={handleFileLoad} 
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        transform={splatTransform}
        onTransformChange={setSplatTransform}
      />
    </div>
  )
}

export default App
