import React from 'react';

const FileSelector = ({ projectStructure, onSelectFile }) => {
  if (!projectStructure || projectStructure.length === 0) return null;

  const handleFileClick = (file) => {
    const gltfFile = file.children?.find(child => 
      child.name.toLowerCase().endsWith('.gltf') || 
      child.name.toLowerCase().endsWith('.glb')
    );

    if (gltfFile) {
      onSelectFile(gltfFile.name);
    }
  };

  return (
    <div className="bg-[#222630] rounded-lg p-4 border-2 border-grey-500">
      <h3 className="text-lg font-medium text-gray-100 mb-4">Generated Models</h3>
      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {projectStructure.map((folder, index) => (
          <button
            key={index}
            onClick={() => handleFileClick(folder)}
            className="w-full text-left px-3 py-2 rounded text-gray-300 hover:bg-[#2a2f3a] transition-colors"
          >
            {folder.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FileSelector; 