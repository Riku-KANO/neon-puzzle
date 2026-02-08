import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

interface MainMenuProps {
  onStart: (difficulty: "easy" | "normal" | "hard") => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onStart }) => {
  const [hovered, setHovered] = useState(false);
  const buttonRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (buttonRef.current) {
      const scale = hovered ? 1.1 : 1.0;
      buttonRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
      buttonRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <Text
          position={[0, 3, 0]}
          fontSize={2}
          color="#00ffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.05}
          outlineColor="#0000aa"
        >
          NEON
          <meshStandardMaterial
            color="#00ffff"
            emissive="#00ffff"
            emissiveIntensity={2}
          />
        </Text>
        <Text
          position={[0, 1.5, 0]}
          fontSize={1.5}
          color="#ff00ff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.05}
          outlineColor="#aa00aa"
        >
          PUZZLE
          <meshStandardMaterial
            color="#ff00ff"
            emissive="#ff00ff"
            emissiveIntensity={1.5}
          />
        </Text>
      </Float>

      <group
        ref={buttonRef}
        position={[0, -1, 0]}
        onClick={() => onStart("normal")}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[3, 1, 0.5]} />
          <MeshDistortMaterial
            color={hovered ? "#00ff00" : "#00aa00"}
            emissive={hovered ? "#00ff00" : "#00aa00"}
            emissiveIntensity={hovered ? 1 : 0.5}
            distort={0.4}
            speed={2}
          />
        </mesh>
        <Text
          position={[0, 0, 0.3]}
          fontSize={0.5}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          START SYSTEM
        </Text>
      </group>

      <mesh position={[0, -3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[5, 64]} />
        <meshBasicMaterial color="#000" transparent={true} opacity={0.5} />
      </mesh>
    </group>
  );
};

export default MainMenu;
