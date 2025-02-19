import { useGLTF, OrbitControls, useCursor } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';


// Define the Burger component
const BurgerProp = ({ onPartClick = () => { } }) => {
    // Load the 3D model from Flask backend
    const { scene } = useGLTF('http://127.0.0.1:5000/static/ThreeJSModels/FinalBurglBurgerModel.glb');
    // State to track the part of the model the user's cursor is "touching"
    const [hovered, setHovered] = useState(null);
    const nav = useNavigate();

    useCursor(hovered);

    const handleClick = (part) => {
        onPartClick(part);
    };

    return (
        <div id='3DBurgerContainer' >
            <Canvas style={{ width: 900, height: 500 }} camera={[0, 0, 10]}>
                {/* OrbitControls added to control camera view */}
                <OrbitControls
                    enableZoom={false} // Allows zooming in/out 
                    enableRotate={true} // Allows rotating the camera 
                    enablePan={true} // Allows panning the camera 
                    maxPolarAngle={Math.PI / 2} // Limits the vertical rotation to 90 degrees 
                    minDistance={10} // Minimum zoom distance 
                    maxDistance={20} // Maximum zoom distance
                /> {/* Lighting */}
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 5, 5]} intensity={1} />
                {/* Model */}
                <primitive
                    object={scene}
                    position={[0, -6, -0.5]}
                    onClick={(e) => handleClick(e.object.name)}
                    onPointerOver={() => setHovered(true)}  // Set cursor to pointer on hover
                    onPointerOut={() => setHovered(false)}
                />
            </Canvas>

        </div>

    );
};

export default BurgerProp;