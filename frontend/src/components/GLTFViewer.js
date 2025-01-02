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

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(ambientLight, directionalLight);

    const loader = new GLTFLoader();
    loader.load(
      modelUrl,
      (gltf) => {
        const model = gltf.scene;

        // Center the model in the scene
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        model.position.sub(center); // Center the model
        scene.add(model);

        // Adjust camera position based on model size
        const maxDimension = Math.max(size.x, size.y, size.z);
        const fitOffset = 1.2; // Adjust for padding
        const distance = fitOffset * maxDimension / Math.tan((Math.PI / 180) * camera.fov / 2);

        camera.position.set(0, center.y, distance);
        camera.lookAt(center);

        console.log("Model loaded and centered successfully:", model);
      },
      undefined,
      (error) => {
        console.error("Error loading GLTF model:", error);
      }
    );

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
