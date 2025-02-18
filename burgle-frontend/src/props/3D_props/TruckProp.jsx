import React from 'react';
import { useGLTF } from '@react-three/drei';

// Define the Burger component
const Truck = () => {
    // Load the 3D model from Flask backend
    const { scene } = useGLTF('http://127.0.0.1:5000/static/ThreeJSModels/BurgerTruckModelFinal.glb');

    return <primitive object={scene} />;
};

export default Truck;