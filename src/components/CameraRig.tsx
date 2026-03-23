import type React from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface CameraRigProps {
  mode: "MENU" | "LOADING" | "PLAY" | "WON";
}

const CameraRig: React.FC<CameraRigProps> = ({ mode }) => {
  const { camera } = useThree();

  useFrame((state, delta) => {
    const targetPos = new THREE.Vector3(0, 8, 8);
    const targetLookAt = new THREE.Vector3(0, 0, 0);

    if (mode === "MENU") {
      targetPos.set(0, 0, 10);
      targetLookAt.set(0, 1, 0);
    } else if (mode === "LOADING") {
      // Dramatic zoom-out and top-down sweep during loading
      const t = state.clock.elapsedTime;
      targetPos.set(Math.sin(t * 1.5) * 3, 20, Math.cos(t * 1.5) * 3);
      targetLookAt.set(0, 0, 0);
    } else if (mode === "PLAY") {
      targetPos.set(0, 12, 8);
      targetLookAt.set(0, 0, 0);
    } else if (mode === "WON") {
      const time = state.clock.elapsedTime;
      targetPos.set(Math.sin(time * 0.5) * 12, 8, Math.cos(time * 0.5) * 12);
      targetLookAt.set(0, 0, 0);
    }

    // Faster lerp during loading for snappier camera movement
    const speed = mode === "LOADING" ? delta * 3 : delta * 2;
    camera.position.lerp(targetPos, speed);
    state.camera.lookAt(targetLookAt);
  });

  return null;
};

export default CameraRig;
