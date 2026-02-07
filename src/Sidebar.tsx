import { useRef, useState } from 'react';
import { 
  FiUpload, 
  FiFile, 
  FiX, 
  FiInfo,
  FiChevronLeft,
  FiChevronRight,
  FiRotateCw
} from 'react-icons/fi';
import type { SplatTransform } from './App';

interface SidebarProps {
  onFileLoad: (file: File) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  transform: SplatTransform;
  onTransformChange: (transform: SplatTransform) => void;
}

function Sidebar({ onFileLoad, isCollapsed, onToggleCollapse, transform, onTransformChange }: SidebarProps) {
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

  const handleFlipX = () => {
    onTransformChange({ ...transform, rotationX: transform.rotationX + Math.PI / 2 });
  };

  const handleFlipY = () => {
    onTransformChange({ ...transform, rotationY: transform.rotationY + Math.PI / 2 });
  };

  const handleFlipZ = () => {
    onTransformChange({ ...transform, rotationZ: transform.rotationZ + Math.PI / 2 });
  };

  const handleRotate90Y = () => {
    onTransformChange({ ...transform, rotationY: transform.rotationY + Math.PI / 2 });
  };

  const handleResetRotation = () => {
    onTransformChange({ rotationX: 0, rotationY: 0, rotationZ: 0 });
  };

  return (
    <div className={`absolute left-0 top-0 h-full bg-white/70 backdrop-blur-md border-r border-white/20 flex flex-col shadow-2xl transition-all duration-300 z-10 ${isCollapsed ? 'w-16' : 'w-80'}`}>
      {/* Toggle Button */}
      <button
        onClick={onToggleCollapse}
        className="absolute top-4 -right-3 z-10 w-6 h-6 bg-white border border-gray-200 rounded-full shadow-md hover:bg-gray-50 flex items-center justify-center cursor-pointer transition-colors"
        title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? <FiChevronRight className="text-gray-600 text-sm" /> : <FiChevronLeft className="text-gray-600 text-sm" />}
      </button>

      {/* Header */}
      <div className={`p-6 border-b border-gray-200 ${isCollapsed ? 'hidden' : ''}`}>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Videntium</h1>
        <p className="text-sm text-gray-600">Gaussian Splatting Viewer</p>
      </div>

      {/* File Actions */}
      <div className={`p-4 space-y-3 ${isCollapsed ? 'hidden' : ''}`}>
        <button
          onClick={handleImportClick}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors cursor-pointer shadow-sm"
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
      {currentFile && !isCollapsed && (
        <div className="px-4 pb-4 space-y-3">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <FiFile className="text-blue-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 text-sm font-medium truncate" title={currentFile.name}>
                    {currentFile.name}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {formatFileSize(currentFile.size)}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClearFile}
                className="text-gray-400 hover:text-gray-700 transition-colors shrink-0 ml-2 cursor-pointer"
                title="Clear file"
              >
                <FiX />
              </button>
            </div>
          </div>

          {/* Rotation Controls */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="text-gray-900 text-sm font-medium mb-3 flex items-center gap-2">
              <FiRotateCw className="text-blue-500" />
              Orientation
            </h3>
            <div className="grid grid-cols-3 gap-2 mb-2">
              <button
                onClick={handleFlipX}
                className="px-3 py-2 bg-white hover:bg-gray-100 border border-gray-300 rounded text-xs text-gray-700 transition-colors cursor-pointer"
                title="Rotate 90° around X axis"
              >
                ↻ X 90°
              </button>
              <button
                onClick={handleFlipY}
                className="px-3 py-2 bg-white hover:bg-gray-100 border border-gray-300 rounded text-xs text-gray-700 transition-colors cursor-pointer"
                title="Rotate 90° around Y axis"
              >
                ↻ Y 90°
              </button>
              <button
                onClick={handleFlipZ}
                className="px-3 py-2 bg-white hover:bg-gray-100 border border-gray-300 rounded text-xs text-gray-700 transition-colors cursor-pointer"
                title="Rotate 90° around Z axis"
              >
                ↻ Z 90°
              </button>
            </div>
            <button
              onClick={handleResetRotation}
              className="w-full px-3 py-2 bg-gray-200 hover:bg-gray-300 border border-gray-300 rounded text-xs text-gray-700 transition-colors cursor-pointer"
              title="Reset to original orientation"
            >
              Reset Orientation
            </button>
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className={`mt-auto p-4 border-t border-gray-200 ${isCollapsed ? 'hidden' : ''}`}>
        <div className="bg-gray-50/50 rounded-lg p-4">
          <div className="flex items-start gap-2 mb-3">
            <FiInfo className="text-blue-500 mt-0.5 shrink-0" />
            <div>
              <h3 className="text-gray-900 text-sm font-medium mb-1">Supported Formats</h3>
              <ul className="text-gray-600 text-xs space-y-1">
                <li>• .PLY (Gaussian Splatting)</li>
                <li>• .SPLAT (Antimatter15)</li>
                <li>• .SPZ (Compressed)</li>
              </ul>
            </div>
          </div>
          
          <div className="pt-3 border-t border-gray-200">
            <h3 className="text-gray-900 text-sm font-medium mb-2">Controls</h3>
            <ul className="text-gray-600 text-xs space-y-1">
              <li>• <span className="text-gray-800">Mouse Drag:</span> Rotate view</li>
              <li>• <span className="text-gray-800">Scroll:</span> Zoom in/out</li>
              <li>• <span className="text-gray-800">WASD:</span> Move horizontally</li>
              <li>• <span className="text-gray-800">Q/E:</span> Move up/down</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={`p-4 border-t border-gray-200 ${isCollapsed ? 'hidden' : ''}`}>
        <p className="text-xs text-gray-400 text-center">
          Powered by Spark & THREE.js
        </p>
      </div>
    </div>
  );
}

export default Sidebar;
