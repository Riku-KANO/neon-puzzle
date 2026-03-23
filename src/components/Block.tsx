import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import type { NodeType } from "../types";
import { Edges } from "@react-three/drei";
import ElectricMaterial from "./ElectricMaterial";

interface BlockProps {
  type: NodeType;
  rotation: number; // 0..3
  fixed?: boolean;
  position: [number, number, number];
  onClick?: () => void;
  connected?: boolean;
  marker?: "Source" | "Target";
}

const Block: React.FC<BlockProps> = ({
  type,
  rotation,
  fixed = false,
  position,
  onClick,
  connected = false,
  marker,
}) => {
  const groupRef = useRef<Group>(null);

  // Use a cumulative target that always decreases by π/2 on each click,
  // so the animation always goes clockwise (no 270° reverse on 3→0 wrap).
  const prevRotation = useRef(rotation);
  const cumulativeTarget = useRef((-Math.PI / 2) * rotation);
  const currentRotRef = useRef((-Math.PI / 2) * rotation);

  if (rotation !== prevRotation.current) {
    // Determine the forward step (0→1→2→3→0 = always +1 mod 4)
    const step = (rotation - prevRotation.current + 4) % 4;
    cumulativeTarget.current -= (Math.PI / 2) * step;
    prevRotation.current = rotation;
  }

  useFrame((_state, delta) => {
    if (!groupRef.current) return;

    const current = currentRotRef.current;
    const target = cumulativeTarget.current;
    const diff = target - current;

    if (Math.abs(diff) > 0.01) {
      const speed = 10;
      const next = current + diff * Math.min(delta * speed, 1);
      currentRotRef.current = next;
      groupRef.current.rotation.y = next;
    } else {
      currentRotRef.current = target;
      groupRef.current.rotation.y = target;
    }
  });

  const color = connected ? "#00ffff" : "#333333";
  const emissive = connected ? "#00aaaa" : "#000000";
  const glowColor = "#7ffbff";

  const Geometry = useMemo(() => {
    const electricOverlay = (
      geometry: React.ReactNode,
      position?: [number, number, number],
      rotation?: [number, number, number],
      scale = 1.04,
    ) =>
      connected ? (
        <mesh position={position} rotation={rotation} scale={scale}>
          {geometry}
          <ElectricMaterial color={color} glow={glowColor} opacity={0.85} />
        </mesh>
      ) : null;

    switch (type) {
      case "Straight":
        return (
          <group>
            <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.1, 0.1, 1, 8]} />
              <meshStandardMaterial color={color} emissive={emissive} />
            </mesh>
            {electricOverlay(
              <cylinderGeometry args={[0.1, 0.1, 1, 8]} />,
              [0, 0, 0],
              [Math.PI / 2, 0, 0],
            )}
          </group>
        );
      case "Elbow":
        return (
          <group>
            <mesh position={[0, 0, -0.25]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.1, 0.1, 0.5, 8]} />
              <meshStandardMaterial color={color} emissive={emissive} />
            </mesh>
            {electricOverlay(
              <cylinderGeometry args={[0.1, 0.1, 0.5, 8]} />,
              [0, 0, -0.25],
              [Math.PI / 2, 0, 0],
            )}
            <mesh position={[0.25, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.1, 0.1, 0.5, 8]} />
              <meshStandardMaterial color={color} emissive={emissive} />
            </mesh>
            {electricOverlay(
              <cylinderGeometry args={[0.1, 0.1, 0.5, 8]} />,
              [0.25, 0, 0],
              [0, 0, Math.PI / 2],
            )}
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[0.12]} />
              <meshStandardMaterial color={color} emissive={emissive} />
            </mesh>
            {electricOverlay(<sphereGeometry args={[0.12]} />, [0, 0, 0])}
          </group>
        );
      case "Tee":
        return (
          <group>
            <mesh position={[0, 0, 0.25]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.1, 0.1, 0.5, 8]} />
              <meshStandardMaterial color={color} emissive={emissive} />
            </mesh>
            {electricOverlay(
              <cylinderGeometry args={[0.1, 0.1, 0.5, 8]} />,
              [0, 0, 0.25],
              [Math.PI / 2, 0, 0],
            )}
            <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.1, 0.1, 1, 8]} />
              <meshStandardMaterial color={color} emissive={emissive} />
            </mesh>
            {electricOverlay(
              <cylinderGeometry args={[0.1, 0.1, 1, 8]} />,
              [0, 0, 0],
              [0, 0, Math.PI / 2],
            )}
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[0.12]} />
              <meshStandardMaterial color={color} emissive={emissive} />
            </mesh>
            {electricOverlay(<sphereGeometry args={[0.12]} />, [0, 0, 0])}
          </group>
        );
      case "Cross":
        return (
          <group>
            <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.1, 0.1, 1, 8]} />
              <meshStandardMaterial color={color} emissive={emissive} />
            </mesh>
            {electricOverlay(
              <cylinderGeometry args={[0.1, 0.1, 1, 8]} />,
              [0, 0, 0],
              [Math.PI / 2, 0, 0],
            )}
            <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.1, 0.1, 1, 8]} />
              <meshStandardMaterial color={color} emissive={emissive} />
            </mesh>
            {electricOverlay(
              <cylinderGeometry args={[0.1, 0.1, 1, 8]} />,
              [0, 0, 0],
              [0, 0, Math.PI / 2],
            )}
          </group>
        );
      case "Source":
        return (
          <group>
            <mesh>
              <boxGeometry args={[0.8, 0.2, 0.8]} />
              <meshStandardMaterial color="#ff00ff" emissive="#aa00aa" />
            </mesh>
            {connected && (
              <mesh scale={1.03}>
                <boxGeometry args={[0.8, 0.2, 0.8]} />
                <ElectricMaterial
                  color="#ff66ff"
                  glow="#ffb3ff"
                  opacity={0.8}
                />
              </mesh>
            )}
            <mesh position={[0, 0, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.1, 0.1, 0.2, 8]} />
              <meshStandardMaterial color={color} emissive={emissive} />
            </mesh>
            {electricOverlay(
              <cylinderGeometry args={[0.1, 0.1, 0.2, 8]} />,
              [0, 0, 0.4],
              [Math.PI / 2, 0, 0],
              1.06,
            )}
          </group>
        );
      case "Target":
        return (
          <group>
            <mesh>
              <boxGeometry args={[0.6, 0.6, 0.6]} />
              <meshStandardMaterial color="#00ff00" emissive="#00aa00" />
            </mesh>
            {connected && (
              <mesh scale={1.05}>
                <boxGeometry args={[0.6, 0.6, 0.6]} />
                <ElectricMaterial
                  color="#00ff88"
                  glow="#66ffcc"
                  opacity={0.9}
                />
              </mesh>
            )}
          </group>
        );
      case "Empty":
      default:
        return null;
    }
  }, [type, color, emissive, connected]);

  return (
    <group
      ref={groupRef}
      position={position}
    >
      {/* Base Tile */}
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[0.9, 0.1, 0.9]} />
        <meshStandardMaterial
          color={fixed ? "#1a1a2e" : "#222"}
          transparent={true}
          opacity={0.8}
        />
        <Edges color={fixed ? "#555" : "#444"} />
      </mesh>
      {/* Clickable area — only for non-fixed blocks */}
      <mesh
        position={[0, 0, 0]}
        visible={false}
        onClick={(e) => {
          if (fixed) return;
          e.stopPropagation();
          onClick?.();
        }}
      >
        <boxGeometry args={[0.9, 0.5, 0.9]} />
      </mesh>
      {Geometry}
      {marker === "Source" && (
        <mesh position={[0, 0.2, 0]}>
          <sphereGeometry args={[0.15]} />
          <meshStandardMaterial
            color="#ff00ff"
            emissive="#ff00ff"
            emissiveIntensity={2}
          />
        </mesh>
      )}
      {marker === "Target" && (
        <mesh position={[0, 0.2, 0]}>
          <sphereGeometry args={[0.15]} />
          <meshStandardMaterial
            color="#00ff00"
            emissive="#00ff00"
            emissiveIntensity={2}
          />
        </mesh>
      )}
    </group>
  );
};

export default Block;
