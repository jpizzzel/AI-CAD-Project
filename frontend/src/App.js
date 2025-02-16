import React, { useState, useEffect } from "react";
import "./App.css";
import GLTFViewer from "./components/GLTFViewer";
import AIButton from "./components/AIButton";
import Loader from "./components/Loader";
import Pattern from "./components/Pattern";
import AIAssistant from './components/AIAssistant';
import ProjectStructureTooltip from "./components/directory";
import FileSelector from './components/FileSelector';

function App() {
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState("");
  const [files, setFiles] = useState([]);
  const [projectStructure, setProjectStructure] = useState([]);
  const [modelUrl, setModelUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFileSelectorOpen, setIsFileSelectorOpen] = useState(true);
  const [isDirectoryOpen, setIsDirectoryOpen] = useState(true);

  const handleFileSelect = (filePath) => {
    setModelUrl(`http://localhost:3001${filePath}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Generating CAD model...");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3001/generate-cad", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
  
      const data = await response.json();
      console.log("API Response:", data);
  
      if (data.status === "completed") {
        setStatus("CAD model generated successfully!");
        
        // Create a more organized file structure
        const mappedFiles = Object.entries(data.files).map(([name, fullPath]) => {
          const fileType = name.toLowerCase().endsWith('.step') ? 'step' : 
                          name.toLowerCase().endsWith('.gltf') ? 'gltf' : 'other';
          
          return {
            name: fullPath,
            displayName: name,
            type: "file",
            fileType
          };
        });
  
        // Create new structure
        const newStructure = [
          {
            name: prompt,
            type: "folder",
            children: mappedFiles,
            timestamp: Date.now()
          },
          ...projectStructure
        ];
  
        setFiles(mappedFiles);
        setProjectStructure(newStructure);
  
        // Set the latest GLTF file as the model URL
        const gltfFile = mappedFiles.find(file => 
          file.name.toLowerCase().endsWith('.gltf') || 
          file.name.toLowerCase().endsWith('.glb')
        );
        
        if (gltfFile) {
          const filePath = gltfFile.name.replace("./output", "/output");
          setModelUrl(`http://localhost:3001${filePath}`);
        }
      } else {
        setStatus(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error fetching API:", error);
      setStatus("Failed to generate CAD model.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Pattern />
      <div className="min-h-screen flex flex-col items-center justify-center py-10 space-y-8">
        <div className="border-2 border-grey-500 bg-[#222630] rounded-lg shadow-lg p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-100 mb-6 text-center">
            AI-Powered CAD Generator
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400">
                Enter your project idea:
              </label>
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="E.g., Create a simple cube"
                className="bg-[#222630] px-4 py-3 outline-none w-full text-white rounded-lg border-2 transition-colors duration-100 border-solid focus:border-[#596A95] border-[#2B3040]"
              />
            </div>
            <div className="flex items-center space-x-6">
              <AIButton type="submit">
                Submit
              </AIButton>
              <Loader isVisible={isLoading} />
            </div>
          </form>
          {status && (
            <div className="mt-6 text-center">
              <h3 className="text-lg font-medium text-gray-400">Status:</h3>
              <p className={status.includes("Error") ? "text-red-500" : "text-green-500"}>
                {status}
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setIsFileSelectorOpen(!isFileSelectorOpen)}
            className="px-4 py-2 bg-[#222630] text-white rounded-lg hover:bg-[#2a2f3a] transition-colors"
          >
            {isFileSelectorOpen ? 'Hide File List' : 'Show File List'}
          </button>
          <button
            onClick={() => setIsDirectoryOpen(!isDirectoryOpen)}
            className="px-4 py-2 bg-[#222630] text-white rounded-lg hover:bg-[#2a2f3a] transition-colors"
          >
            {isDirectoryOpen ? 'Hide Directory' : 'Show Directory'}
          </button>
        </div>

        <div className={`w-full max-w-6xl flex gap-4 ${(!isFileSelectorOpen && !isDirectoryOpen) ? 'justify-center' : ''}`}>
          {(isFileSelectorOpen || isDirectoryOpen) && (
            <div className="flex flex-col gap-4 w-64">
              {isFileSelectorOpen && projectStructure.length > 0 && (
                <FileSelector 
                  projectStructure={projectStructure}
                  onSelectFile={handleFileSelect}
                />
              )}
              {isDirectoryOpen && projectStructure.length > 0 && (
                <ProjectStructureTooltip structure={projectStructure} />
              )}
            </div>
          )}

          {modelUrl && (
            <div className={`rounded-lg shadow-lg p-4 ${(!isFileSelectorOpen && !isDirectoryOpen) ? 'flex-initial w-full max-w-4xl' : 'flex-1'}`}>
              <GLTFViewer modelUrl={modelUrl} />
            </div>
          )}
        </div>

        <AIAssistant />
      </div>
    </>
  );
}

export default App;
