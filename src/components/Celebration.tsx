import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sparkles, Ring } from "@react-three/drei";
import type * as THREE from "three";

interface PulseConfig {
  speed: number;
  delay: number;
  color: string;
}

const PulseRing: React.FC<PulseConfig> = ({ speed, delay, color }) => {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ringRef.current) return;
    const t = (state.clock.elapsedTime * speed + delay) % 1;
    const scale = 1 + t * 8;
    ringRef.current.scale.set(scale, scale, scale);
    const material = ringRef.current.material as THREE.MeshBasicMaterial;
    material.opacity = Math.max(0, 0.6 - t);
  });

  return (
    <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.2, 0.35, 64]} />
      <meshBasicMaterial
        color={color}
        transparent={true}
        opacity={0.6}
        depthWrite={false}
      />
    </mesh>
  );
};

const Celebration: React.FC = () => {
  const ringRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const pulseConfigs = useMemo<PulseConfig[]>(
    () => [
      { speed: 0.25, delay: 0, color: "#00ff99" },
      { speed: 0.35, delay: 0.4, color: "#00d8ff" },
      { speed: 0.3, delay: 0.7, color: "#7effff" },
    ],
    [],
  );

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.01;
      const s = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      ringRef.current.scale.set(s, s, s);
    }
    if (lightRef.current) {
      lightRef.current.intensity =
        3 + Math.sin(state.clock.elapsedTime * 6) * 1.5;
    }
  });

  return (
    <group position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <pointLight ref={lightRef} position={[0, 2, 0]} color="#44ffaa" />

      {/* Expanding Rings */}
      <Ring args={[4.5, 4.8, 64]} ref={ringRef}>
        <meshStandardMaterial
          color="#00ff00"
          emissive="#00ff00"
          emissiveIntensity={3}
          transparent={true}
          opacity={0.8}
        />
      </Ring>
      <Ring args={[5.2, 5.3, 64]} rotation={[0, 0, 1]}>
        <meshStandardMaterial
          color="#00aa00"
          emissive="#00aa00"
          emissiveIntensity={2}
          transparent={true}
          opacity={0.5}
        />
      </Ring>

      {/* Shockwave Pulses */}
      {pulseConfigs.map((config) => (
        <PulseRing key={config.color + config.delay} {...config} />
      ))}

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
