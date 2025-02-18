import { useGLTF, OrbitControls } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// Define the Burger component
const Burger = () => {
    // Load the 3D model from Flask backend
    const { scene } = useGLTF('http://127.0.0.1:5000/static/ThreeJSModels/FinalBurglBurgerModel.glb');

    return (
        <div>
            <Canvas>
                {/* OrbitControls added to control camera view */}
                <OrbitControls
                    enableZoom={true} // Allows zooming in/out 
                    enableRotate={true} // Allows rotating the camera 
                    enablePan={true} // Allows panning the camera 
                    maxPolarAngle={Math.PI / 2} // Limits the vertical rotation to 90 degrees 
                    minDistance={2} // Minimum zoom distance 
                    maxDistance={10} // Maximum zoom distance
                /> {/* Lighting */}
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 5, 5]} intensity={1} />
                {/* Model */}
                <primitive object={scene} />
            </Canvas>

        </div>

    );
};

export default Burger;