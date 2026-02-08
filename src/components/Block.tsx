import React, { useMemo } from 'react';
import type { NodeType } from '../types';
import { Edges } from '@react-three/drei';

interface BlockProps {
    type: NodeType;
    rotation: number; // 0..3
    position: [number, number, number];
    onClick?: () => void;
    connected?: boolean; // For visualization
    marker?: 'Source' | 'Target';
}

const Block: React.FC<BlockProps> = ({ type, rotation, position, onClick, connected = false, marker }) => {
    // Rotation logic: Three.js uses radians. 
    // Assuming board is XZ plane, rotation '0' (North) might mean -Z.
    // Let's align later. standard generic rotation: -Math.PI / 2 * rotation
    const rotationY = -Math.PI / 2 * rotation;

    const color = connected ? '#00ffff' : '#333333';
    const emissive = connected ? '#00aaaa' : '#000000';

    const Geometry = useMemo(() => {
        switch (type) {
            case 'Straight':
                return (
                    <group>
                        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                            <cylinderGeometry args={[0.1, 0.1, 1, 8]} />
                            <meshStandardMaterial color={color} emissive={emissive} />
                        </mesh>
                    </group>
                );
            case 'Elbow':
                return (
                    <group>
                        {/* L shape: Center to North, Center to East */}
                        <mesh position={[0, 0, -0.25]} rotation={[Math.PI / 2, 0, 0]}>
                            <cylinderGeometry args={[0.1, 0.1, 0.5, 8]} />
                            <meshStandardMaterial color={color} emissive={emissive} />
                        </mesh>
                        <mesh position={[0.25, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                            <cylinderGeometry args={[0.1, 0.1, 0.5, 8]} />
                            <meshStandardMaterial color={color} emissive={emissive} />
                        </mesh>
                        <mesh position={[0,0,0]}>
                             <sphereGeometry args={[0.12]} />
                             <meshStandardMaterial color={color} emissive={emissive} />
                        </mesh>
                    </group>
                );
            case 'Tee':
                return (
                    <group>
                        {/* T shape: North, East, West */}
                        <mesh position={[0, 0, -0.25]} rotation={[Math.PI / 2, 0, 0]}>
                            <cylinderGeometry args={[0.1, 0.1, 0.5, 8]} />
                            <meshStandardMaterial color={color} emissive={emissive} />
                        </mesh>
                        <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                            <cylinderGeometry args={[0.1, 0.1, 1, 8]} />
                            <meshStandardMaterial color={color} emissive={emissive} />
                        </mesh>
                         <mesh position={[0,0,0]}>
                             <sphereGeometry args={[0.12]} />
                             <meshStandardMaterial color={color} emissive={emissive} />
                        </mesh>
                    </group>
                );
            case 'Cross':
                 return (
                    <group>
                        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                            <cylinderGeometry args={[0.1, 0.1, 1, 8]} />
                            <meshStandardMaterial color={color} emissive={emissive} />
                        </mesh>
                        <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                            <cylinderGeometry args={[0.1, 0.1, 1, 8]} />
                            <meshStandardMaterial color={color} emissive={emissive} />
                        </mesh>
                    </group>
                );
            case 'Source':
                return (
                    <group>
                        <mesh>
                            <boxGeometry args={[0.8, 0.2, 0.8]} />
                            <meshStandardMaterial color="#ff00ff" emissive="#aa00aa" />
                        </mesh>
                        <mesh position={[0, 0, 0.4]} rotation={[Math.PI/2, 0, 0]}>
                            <cylinderGeometry args={[0.1, 0.1, 0.2, 8]} />
                             <meshStandardMaterial color={color} emissive={emissive} />
                        </mesh>
                    </group>
                );
             case 'Target':
                return (
                    <group>
                        <mesh>
                            <boxGeometry args={[0.6, 0.6, 0.6]} />
                            <meshStandardMaterial color="#00ff00" emissive="#00aa00" />
                        </mesh>
                    </group>
                );
            case 'Empty':
            default:
                return null;
        }
    }, [type, color, emissive]);

    return (
        <group position={position} rotation={[0, rotationY, 0]} onClick={(e) => { e.stopPropagation(); onClick && onClick(); }}>
             {/* Base Tile */}
            <mesh position={[0, -0.1, 0]}>
                <boxGeometry args={[0.9, 0.1, 0.9]} />
                <meshStandardMaterial color="#222" transparent opacity={0.8} />
                <Edges color="#444" />
            </mesh>
            {Geometry}
            {marker === 'Source' && (
                <mesh position={[0, 0.2, 0]}>
                    <sphereGeometry args={[0.15]} />
                    <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={2} />
                </mesh>
            )}
            {marker === 'Target' && (
                <mesh position={[0, 0.2, 0]}>
                    <sphereGeometry args={[0.15]} />
                    <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={2} />
                </mesh>
            )}
        </group>
    );
};

export default Block;
