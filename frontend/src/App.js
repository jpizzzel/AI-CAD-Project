import React, { useState, useEffect } from "react";
import "./App.css";
import GLTFViewer from "./components/GLTFViewer";
import AIButton from "./components/AIButton";
import Loader from "./components/Loader";
import Pattern from "./components/Pattern";
import AIAssistant from './components/AIAssistant';
import ProjectStructureTooltip from "./components/directory";

function App() {
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState("");
  const [files, setFiles] = useState([]);
  const [projectStructure, setProjectStructure] = useState([]);
  const [modelUrl, setModelUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Generating CAD model...");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/generate-cad", {
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
  
        // Create new structure with the latest files at the top
        const newStructure = [
          {
            name: prompt.substring(0, 30) + "...", // Use prompt as folder name
            type: "folder",
            children: mappedFiles,
            timestamp: Date.now() // Add timestamp for sorting
          },
          ...projectStructure // Add previous structures
        ];
  
        // Update state
        setFiles(mappedFiles); // Only store the latest files
        setProjectStructure(newStructure);
  
        // Always set the latest GLTF file as the model URL
        const latestGltfFile = mappedFiles.find(file => 
          file.name.toLowerCase().endsWith('.gltf') || 
          file.name.toLowerCase().endsWith('.glb')
        );
        
        if (latestGltfFile) {
          setModelUrl(`http://localhost:5000${latestGltfFile.name}`);
        } else if (data.modelUrl) {
          setModelUrl(`http://localhost:5000${data.modelUrl}`);
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

        {projectStructure.length > 0 && (
          <ProjectStructureTooltip structure={projectStructure} />
        )}

        {modelUrl && (
          <div className="w-full max-w-6xl rounded-lg shadow-lg p-4">
            <GLTFViewer modelUrl={modelUrl} />
          </div>
        )}

        <AIAssistant />
      </div>
    </>
  );
}

export default App;
