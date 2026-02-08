import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import type { Difficulty } from "../types";

interface MainMenuProps {
  difficulty: Difficulty;
  onSelectDifficulty: (difficulty: Difficulty) => void;
  onStart: (difficulty: Difficulty) => void;
}

const MainMenu: React.FC<MainMenuProps> = ({
  difficulty,
  onSelectDifficulty,
  onStart,
}) => {
  const [hovered, setHovered] = useState(false);
  const buttonRef = useRef<THREE.Group>(null);
  const optionsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (buttonRef.current) {
      const scale = hovered ? 1.1 : 1.0;
      buttonRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
      buttonRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
    if (optionsRef.current) {
      optionsRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.06;
    }
  });

  const difficultyButtons: {
    label: string;
    value: Difficulty;
    color: string;
  }[] = [
    { label: "EASY", value: "easy", color: "#2cffd5" },
    { label: "NORMAL", value: "normal", color: "#00ffff" },
    { label: "HARD", value: "hard", color: "#ff3bd5" },
  ];

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

      <group ref={optionsRef} position={[0, -0.8, 0]}>
        {difficultyButtons.map((button, index) => {
          const isActive = difficulty === button.value;
          return (
            <group
              key={button.value}
              position={[index * 2.6 - 2.6, 0, 0]}
              onClick={() => onSelectDifficulty(button.value)}
            >
              <mesh>
                <boxGeometry args={[2.2, 0.7, 0.3]} />
                <meshStandardMaterial
                  color={isActive ? button.color : "#1b1b1b"}
                  emissive={isActive ? button.color : "#000"}
                  emissiveIntensity={isActive ? 1.2 : 0.2}
                />
              </mesh>
              <Text
                position={[0, 0, 0.2]}
                fontSize={0.4}
                color={isActive ? "#00161b" : "#aaaaaa"}
                anchorX="center"
                anchorY="middle"
              >
                {button.label}
              </Text>
            </group>
          );
        })}
      </group>

      <group
        ref={buttonRef}
        position={[0, -2.5, 0]}
        onClick={() => onStart(difficulty)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[3.4, 1, 0.5]} />
          <MeshDistortMaterial
            color={hovered ? "#00ff99" : "#009966"}
            emissive={hovered ? "#00ff99" : "#007744"}
            emissiveIntensity={hovered ? 1.2 : 0.6}
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
