import { useRef, useState } from 'react';
import { 
  FiUpload, 
  FiFile, 
  FiX, 
  FiInfo
} from 'react-icons/fi';

interface SidebarProps {
  onFileLoad: (file: File) => void;
}

function Sidebar({ onFileLoad }: SidebarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const extension = file.name.toLowerCase().split('.').pop();
      if (extension === 'ply' || extension === 'splat' || extension === 'spz') {
        setCurrentFile(file);
        onFileLoad(file);
      } else {
        alert('Please select a valid .ply, .splat, or .spz file');
      }
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleClearFile = () => {
    setCurrentFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="w-80 h-full bg-gray-900 border-r border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-white mb-1">Videntium</h1>
        <p className="text-sm text-gray-400">Gaussian Splatting Viewer</p>
      </div>

      {/* File Actions */}
      <div className="p-4 space-y-3">
        <button
          onClick={handleImportClick}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <FiUpload className="text-lg" />
          <span>Import Splat File</span>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".ply,.splat,.spz"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Current File Info */}
      {currentFile && (
        <div className="px-4 pb-4">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <FiFile className="text-blue-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate" title={currentFile.name}>
                    {currentFile.name}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {formatFileSize(currentFile.size)}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClearFile}
                className="text-gray-400 hover:text-white transition-colors shrink-0 ml-2"
                title="Clear file"
              >
                <FiX />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className="mt-auto p-4 border-t border-gray-700">
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="flex items-start gap-2 mb-3">
            <FiInfo className="text-blue-400 mt-0.5 shrink-0" />
            <div>
              <h3 className="text-white text-sm font-medium mb-1">Supported Formats</h3>
              <ul className="text-gray-400 text-xs space-y-1">
                <li>• .PLY (Gaussian Splatting)</li>
                <li>• .SPLAT (Antimatter15)</li>
                <li>• .SPZ (Compressed)</li>
              </ul>
            </div>
          </div>
          
          <div className="pt-3 border-t border-gray-700">
            <h3 className="text-white text-sm font-medium mb-2">Controls</h3>
            <ul className="text-gray-400 text-xs space-y-1">
              <li>• <span className="text-gray-300">Mouse Drag:</span> Rotate view</li>
              <li>• <span className="text-gray-300">Scroll:</span> Zoom in/out</li>
              <li>• <span className="text-gray-300">WASD:</span> Move horizontally</li>
              <li>• <span className="text-gray-300">Q/E:</span> Move up/down</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <p className="text-xs text-gray-500 text-center">
          Powered by Spark & THREE.js
        </p>
      </div>
    </div>
  );
}

export default Sidebar;
