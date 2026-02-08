import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles, Ring } from '@react-three/drei';
import * as THREE from 'three';

const Celebration: React.FC = () => {
    const ringRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (ringRef.current) {
            ringRef.current.rotation.z += 0.01;
            const s = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
            ringRef.current.scale.set(s, s, s);
        }
    });

    return (
        <group position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
             {/* Expanding Rings */}
            <Ring args={[4.5, 4.8, 64]} ref={ringRef}>
                <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={3} transparent opacity={0.8} />
            </Ring>
             <Ring args={[5.2, 5.3, 64]} rotation={[0, 0, 1]}>
                <meshStandardMaterial color="#00aa00" emissive="#00aa00" emissiveIntensity={2} transparent opacity={0.5} />
            </Ring>

            {/* Rising Particles */}
            <Sparkles 
                count={200} 
                scale={[10, 10, 10]} 
                size={6} 
                speed={0.4} 
                opacity={0.7} 
                color="#00ff00"
                position={[0, 0, 2]} // Relative to group rotation, this shoots up Y (which is Z here)
            />
        </group>
    );
};

export default Celebration;
