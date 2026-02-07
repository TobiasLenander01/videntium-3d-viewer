import { useState } from 'react';
import Sidebar from './Sidebar';
import Viewer from './Viewer';

function App() {
  const [fileToLoad, setFileToLoad] = useState<File | null>(null);

  const handleFileLoad = (file: File) => {
    setFileToLoad(file);
  };

  return (
    <div className='flex h-screen w-screen bg-gray-950 overflow-hidden'>
      <Sidebar onFileLoad={handleFileLoad} />
      <div className='flex-1'>
        <Viewer fileToLoad={fileToLoad} />
      </div>
    </div>
  )
}

export default App
