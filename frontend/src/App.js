import React, { useState } from "react";
import "./App.css";
import ProjectStructureDropdown from "./components/directory";
import GLTFViewer from "./components/GLTFViewer";
import AIButton from "./components/AIButton";
import Loader from "./components/Loader";
import Pattern from "./components/Pattern";

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
    setFiles([]);
    setProjectStructure([]);
    setModelUrl("");
    setIsLoading(true);
  
    try {
      const response = await fetch("http://localhost:5000/generate-cad", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });
  
      const data = await response.json();
      console.log("API Response:", data);
  
      if (data.status === "completed") {
        setStatus("CAD model generated successfully!");
  
        // Map the backend response to include full paths for files
        const mappedFiles = Object.entries(data.files).map(([name, fullPath]) => ({
          name: fullPath, // Use the full path from the backend
          displayName: name, // Use the original key as a display name
          type: "file",
        }));
  
        setFiles(mappedFiles);
  
        // Create the project structure for the tooltip
        setProjectStructure([
          {
            name: "output",
            type: "folder",
            children: mappedFiles,
          },
        ]);
  
        if (data.modelUrl) {
          setModelUrl(`http://localhost:5000${data.modelUrl}`);
        } else {
          console.error("modelUrl is undefined in the backend response.");
          setStatus("Failed to load the 3D model.");
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
      <Pattern /> {/* Global background pattern */}
      <div className="min-h-screen flex flex-col items-center justify-center py-10 space-y-8">
        <div className="bg-[#222630] rounded-lg shadow-lg p-8 w-full max-w-md">
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
              <AIButton
                type="submit"
                className="bg-blue-500 text-white py-2 px-5 rounded-lg hover:bg-blue-600 transition"
              >
                Submit
              </AIButton>
              <Loader isVisible={isLoading} />
            </div>
          </form>
          {status && (
            <div className="mt-6 text-center">
              <h3 className="text-lg font-medium text-gray-400">Status:</h3>
              <p
                className={
                  status.includes("Error") ? "text-red-500" : "text-green-500"
                }
              >
                {status}
              </p>
            </div>
          )}
        </div>

        {projectStructure.length > 0 && (
          <ProjectStructureDropdown structure={projectStructure} />
        )}

        {modelUrl && (
          <div className="w-full max-w-6xl rounded-lg shadow-lg p-4">
            <GLTFViewer modelUrl={modelUrl} />
          </div>
        )}
      </div>
    </>
  );
}

export default App;
