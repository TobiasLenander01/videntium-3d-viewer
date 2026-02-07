import { useRef, useState } from 'react';
import { 
  FiUpload, 
  FiFile, 
  FiX, 
  FiChevronLeft,
  FiChevronRight,
  FiRotateCw,
  FiMove,
  FiGrid,
  FiCamera
} from 'react-icons/fi';
import type { SplatTransform } from './App';
const ROTATION_STEP = 5; // degrees
const POSITION_STEP = 0.2; // units
interface SidebarProps {
  onFileLoad: (file: File | null) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  transform: SplatTransform;
  onTransformChange: (transform: SplatTransform) => void;
  showGrid: boolean;
  onToggleGrid: () => void;
  onResetCamera: () => void;
}

function Sidebar({ onFileLoad, isCollapsed, onToggleCollapse, transform, onTransformChange, showGrid, onToggleGrid, onResetCamera }: SidebarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const validateAndLoadFile = (file: File) => {
    const extension = file.name.toLowerCase().split('.').pop();
    if (extension === 'ply' || extension === 'splat' || extension === 'spz') {
      setCurrentFile(file);
      onFileLoad(file);
    } else {
      alert('Please select a valid .ply, .splat, or .spz file');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndLoadFile(file);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleClearFile = () => {
    setCurrentFile(null);
    onFileLoad(null);
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

  const handleRotationChange = (axis: 'X' | 'Y' | 'Z', degrees: number) => {
    const radians = (degrees * Math.PI) / 180;
    const key = `rotation${axis}` as keyof SplatTransform;
    onTransformChange({ ...transform, [key]: radians });
  };

  const handleResetRotation = () => {
    onTransformChange({ ...transform, rotationX: 0, rotationY: 0, rotationZ: 0 });
  };

  const handlePositionChange = (axis: 'X' | 'Y' | 'Z', value: number) => {
    const key = `position${axis}` as keyof SplatTransform;
    onTransformChange({ ...transform, [key]: value });
  };

  const handleResetPosition = () => {
    onTransformChange({ ...transform, positionX: 0, positionY: 0, positionZ: 0 });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndLoadFile(file);
    }
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

      {/* Unified Import/File Zone */}
      <div className={`p-4 space-y-3 ${isCollapsed ? 'hidden' : ''}`}>
        <div
          onClick={handleImportClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-lg p-6 transition-all cursor-pointer ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : currentFile
              ? 'border-gray-300 bg-gray-50 hover:bg-gray-100'
              : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50/50'
          }`}
        >
          {currentFile ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <FiFile className="text-blue-500 shrink-0 text-lg" />
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
                onClick={(e) => {
                  e.stopPropagation();
                  handleClearFile();
                }}
                className="text-gray-400 hover:text-gray-700 transition-colors shrink-0 ml-2 cursor-pointer"
                title="Clear file"
              >
                <FiX className="text-lg" />
              </button>
            </div>
          ) : (
            <div className="text-center">
              <FiUpload className="mx-auto text-3xl text-gray-400 mb-3" />
              <p className="text-sm font-medium text-gray-900 mb-1">
                {isDragging ? 'Drop file here' : 'Import File'}
              </p>
              <p className="text-xs text-gray-500">
                Click to browse or drag & drop
              </p>
              <p className="text-xs text-gray-400 mt-2">
                .PLY • .SPLAT • .SPZ
              </p>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".ply,.splat,.spz"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Rotation Controls */}
      {currentFile && !isCollapsed && (
        <div className="px-4 pb-4">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="text-gray-900 text-sm font-medium mb-3 flex items-center gap-2">
              <FiRotateCw className="text-blue-500" />
              Rotation
            </h3>
            <div className="space-y-2">
              {(['X', 'Y', 'Z'] as const).map((axis) => {
                const key = `rotation${axis}` as keyof SplatTransform;
                const radians = transform[key] as number;
                const degrees = Math.round((radians * 180) / Math.PI);
                return (
                  <div key={axis} className="flex items-center gap-2">
                    <span className="text-xs text-gray-600 w-4">{axis}</span>
                    <input
                      type="number"
                      value={degrees}
                      onChange={(e) => handleRotationChange(axis, parseFloat(e.target.value) || 0)}
                      step={ROTATION_STEP}
                      className="flex-1 px-2 py-1 text-xs bg-white border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </div>
                );
              })}
            </div>
            <button
              onClick={handleResetRotation}
              className="w-full px-3 py-2 bg-gray-200 hover:bg-gray-300 border border-gray-300 rounded text-xs text-gray-700 transition-colors cursor-pointer mt-3"
              title="Reset to original rotation"
            >
              Reset Rotation
            </button>
          </div>

          {/* Position Controls */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mt-3">
            <h3 className="text-gray-900 text-sm font-medium mb-3 flex items-center gap-2">
              <FiMove className="text-blue-500" />
              Position
            </h3>
            <div className="space-y-2">
              {(['X', 'Y', 'Z'] as const).map((axis) => {
                const key = `position${axis}` as keyof SplatTransform;
                const value = transform[key] as number;
                return (
                  <div key={axis} className="flex items-center gap-2">
                    <span className="text-xs text-gray-600 w-4">{axis}</span>
                    <input
                      type="number"
                      value={value.toFixed(2)}
                      onChange={(e) => handlePositionChange(axis, parseFloat(e.target.value) || 0)}
                      step={POSITION_STEP}
                      className="flex-1 px-2 py-1 text-xs bg-white border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </div>
                );
              })}
            </div>
            <button
              onClick={handleResetPosition}
              className="w-full px-3 py-2 bg-gray-200 hover:bg-gray-300 border border-gray-300 rounded text-xs text-gray-700 transition-colors cursor-pointer mt-3"
              title="Reset to original position"
            >
              Reset Position
            </button>
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className={`mt-auto p-4 ${isCollapsed ? 'hidden' : ''}`}>
        {/* Reset Camera Button */}
        <div className="mb-2">
          <button
            onClick={onResetCamera}
            className="w-full px-3 py-2 bg-gray-200 hover:bg-gray-300 border border-gray-300 rounded text-xs text-gray-700 transition-colors cursor-pointer flex items-center justify-center gap-2"
            title="Reset camera to default position"
          >
            <FiCamera />
            Reset Camera
          </button>
        </div>
        
        {/* Grid Toggle */}
        <div className="mb-4">
          <button
            onClick={onToggleGrid}
            className="w-full px-3 py-2 bg-gray-200 hover:bg-gray-300 border border-gray-300 rounded text-xs text-gray-700 transition-colors cursor-pointer flex items-center justify-center gap-2"
            title={showGrid ? 'Hide grid helper' : 'Show grid helper'}
          >
            <FiGrid />
            {showGrid ? 'Hide Grid' : 'Show Grid'}
          </button>
        </div>
        
        <div>
            <h3 className="text-gray-900 text-sm font-medium mb-2">Controls</h3>
            <ul className="text-gray-600 text-xs space-y-1">
              <li>• <span className="text-gray-800">Mouse Drag:</span> Rotate view</li>
              <li>• <span className="text-gray-800">Scroll:</span> Zoom in/out</li>
              <li>• <span className="text-gray-800">WASD:</span> Move horizontally</li>
              <li>• <span className="text-gray-800">Q/E:</span> Move up/down</li>
            </ul>
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
