const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const { exec, spawn } = require("child_process");
//const WebSocket = require("ws");

const app = express();
const PORT = process.env.PORT || 3001;
//const WS_PORT = 8081;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve output folder for downloads
app.use("/output", express.static(path.join(__dirname, "output")));

// REST Endpoint: Generate CAD
app.post("/generate-cad", (req, res) => {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ status: "error", message: "Prompt is required" });
    }
  
    exec(`python ../python/text_to_cad.py "${prompt}"`, (error, stdout, stderr) => {
      if (error) {
        console.error("Error executing Python script:", stderr);
        return res.status(500).json({ status: "error", message: stderr.trim() });
      }
  
      try {
        // Log raw output from the Python script
        console.log("Raw output from Python script:", stdout);
  
        const result = JSON.parse(stdout);
  
        if (result.status === "completed") {
          // Dynamically construct file paths
          const files = Object.fromEntries(
            Object.entries(result.files).map(([name, filePath]) => [
              name,
              `/output/${path.basename(filePath.replace(/\\/g, "/"))}`,
            ])
          );          
  
          // Find the GLTF file dynamically
          const modelUrlKey = Object.keys(files).find((key) => key.endsWith(".gltf"));
          const modelUrl = files[modelUrlKey]; // Get the URL for the .gltf file
  
          // Log generated files and model URL
          console.log("Generated files:", files);
          console.log("Model URL:", modelUrl);
  
          // Respond to the frontend
          res.json({
            status: "completed",
            files,
            modelUrl, // Use the dynamically found model URL
          });
        } else {
          res.json({ status: result.status, message: result.message });
        }
      } catch (parseError) {
        console.error("JSON parse error:", stdout);
        res.status(500).json({ status: "error", message: "Invalid response from Python script" });
      }
    });
  });
  

// Start HTTP Server
app.listen(PORT, () => {
  console.log(`Node backend listening on port ${PORT}`);
});

// Add this new endpoint
app.post("/chat", (req, res) => {
  const message = req.body.message;
  if (!message) {
    return res.status(400).json({ error: 'No message provided' });
  }

  // Spawn a Python process to handle the AI chat
  const pythonProcess = spawn('python', [
    path.join(__dirname, '../python/aichat.py'),
    message
  ]);

  let result = '';
  pythonProcess.stdout.on('data', (data) => {
    result += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`[Python error]: ${data}`);
  });

  pythonProcess.on('close', (code) => {
    try {
      const jsonResponse = JSON.parse(result);
      res.json(jsonResponse);
    } catch (error) {
      res.status(500).json({ error: 'Failed to parse AI response' });
    }
  });
});

