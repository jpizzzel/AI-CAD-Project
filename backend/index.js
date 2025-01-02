const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const { exec } = require("child_process");
//const WebSocket = require("ws");

const app = express();
const PORT = 5000;
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
            Object.entries(result.files).map(([name, filePath]) => [name, `/output/${path.basename(filePath)}`])
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
  console.log(`HTTP server is running on http://localhost:${PORT}`);
});

// // WebSocket Server
// const wss = new WebSocket.Server({ port: WS_PORT });

// wss.on("connection", (ws) => {
//   console.log("Client connected to WebSocket.");

//   // Open a connection to Zoo.dev's WebSocket
//   const zooSocket = new WebSocket("wss://api.zoo.dev/ws/modeling/commands");

//   zooSocket.on("open", () => {
//     console.log("Connected to Zoo.dev WebSocket.");

//     // Pass messages from the client to Zoo.dev WebSocket
//     ws.on("message", (message) => {
//       console.log("Client message:", message);
//       zooSocket.send(message);
//     });

//     // Pass messages from Zoo.dev WebSocket to the client
//     zooSocket.on("message", (data) => {
//       console.log("Zoo.dev message:", data);
//       ws.send(data);
//     });
//   });

//   zooSocket.on("error", (err) => {
//     console.error("Error connecting to Zoo.dev WebSocket:", err);
//     ws.close();
//   });

//   ws.on("close", () => {
//     console.log("Client disconnected.");
//     zooSocket.close();
//   });
// });

// console.log(`WebSocket server is running on ws://localhost:${WS_PORT}`);
