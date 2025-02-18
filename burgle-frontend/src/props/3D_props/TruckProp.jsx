import { useGLTF, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { modelScale } from 'three/src/nodes/TSL.js';

// Define the Burger component
const Truck = () => {
    // Load the 3D model from Flask backend
    const { scene } = useGLTF('http://127.0.0.1:5000/static/ThreeJSModels/BurgerTruckModelFinal.glb');

    return (
        <div id='3DTruckContainer' >
            <Canvas style={{ width: 900, height: 500 }} >
                {/* OrbitControls added to control camera view */}
                <PerspectiveCamera
                    makeDefault
                    position={[-1.5, 2.1, 5]}  // Blender Camera Position
                    rotation={[-0.25, -0.5, -0.15]} // Converted Blender Rotation
                    fov={55} // Adjust based on Blender FOV
                />
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 5, 5]} intensity={2} />
                {/* Model */}
                <primitive object={scene} scale={[0.15, 0.15, 0.15]} />
            </Canvas>

        </div>

    );;
};

export default Truck;