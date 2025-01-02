import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const WebSocketViewer = ({ wsUrl }) => {
  const mountRef = useRef(null);
  const wsRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(4, 4, 8); // Adjusted camera for better visibility

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    // Add OrbitControls for user interaction
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Smooth interactions

    // Create a cube with adjusted position and color
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x22aa99 }); // Pleasing green color
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(-1, 1, 0); // Higher and slightly to the left
    scene.add(cube);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update(); // Update controls
      renderer.render(scene, camera);
    };
    animate();

    // WebSocket setup
    if (wsUrl) {
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log("Connected to WebSocket.");
        if (wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(
            JSON.stringify({
              command: "initialize",
              show_grid: true,
              post_effect: "phosphor",
            })
          );
        }
      };

      wsRef.current.onmessage = async (event) => {
        if (event.data instanceof Blob) {
          const text = await event.data.text();
          try {
            const data = JSON.parse(text);
            console.log("Parsed WebSocket data:", data);

            if (data.type === "gltf") {
              loadModel(data.url, scene);
            }
          } catch (err) {
            console.error("Error parsing JSON:", err);
          }
        } else {
          console.error("Unsupported message type:", event.data);
        }
      };

      wsRef.current.onclose = () => console.log("WebSocket connection closed.");
      wsRef.current.onerror = (err) => console.error("WebSocket error:", err);
    }

    return () => {
      if (mountRef.current && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
      wsRef.current?.close();
    };
  }, [wsUrl]);

  const loadModel = (url, scene) => {
    const loader = new GLTFLoader();
    loader.load(
      url,
      (gltf) => {
        scene.add(gltf.scene);
        console.log("Model loaded successfully:", gltf.scene);
      },
      undefined,
      (error) => {
        console.error("Error loading model:", error);
      }
    );
  };

  return (
    <div
      ref={mountRef}
      style={{
        width: "100%",
        height: "500px",
        margin: "0 auto",
        border: "1px solid #ddd",
        borderRadius: "8px",
        overflow: "hidden",
        backgroundColor: "#f0f0f0",
      }}
    />
  );
};

export default WebSocketViewer;
