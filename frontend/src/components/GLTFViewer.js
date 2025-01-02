import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const GLTFViewer = ({ modelUrl }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!modelUrl) {
      console.error("GLTFViewer: modelUrl is undefined.");
      return;
    }

    console.log("GLTFViewer received modelUrl:", modelUrl);

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    // Camera setup with adjusted near clipping plane
    const camera = new THREE.PerspectiveCamera(
      75, 
      mountRef.current.clientWidth / mountRef.current.clientHeight, 
      0.01, // Near clipping plane
      1000 // Far clipping plane
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(ambientLight, directionalLight);

    // Load GLTF model
    const loader = new GLTFLoader();
    loader.load(
      modelUrl,
      (gltf) => {
        const model = gltf.scene;
    
        // Calculate the bounding box of the model
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
    
        // Center the model
        model.position.sub(center);
        scene.add(model);
    
        // Calculate the max dimension of the model
        const maxDimension = Math.max(size.x, size.y, size.z);
    
        // Set the initial camera distance
        const fitOffset = 2; // Increase this value to zoom out more
        const distance = fitOffset * maxDimension / Math.tan((Math.PI / 180) * camera.fov / 2);
    
        // Adjust the camera position dynamically
        camera.position.set(distance, distance, distance); // Position the camera at an angle
        camera.lookAt(0, 0, 0); // Focus the camera on the center of the model
    
        console.log("Model loaded and camera adjusted:", model);
      },
      undefined,
      (error) => {
        console.error("Error loading GLTF model:", error);
      }
    );
    


    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup function
    return () => {
      if (renderer && renderer.domElement && mountRef.current?.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [modelUrl]);

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

export default GLTFViewer;
