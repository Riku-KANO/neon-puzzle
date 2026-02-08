import type React from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface CameraRigProps {
  mode: "MENU" | "PLAY" | "WON";
}

const CameraRig: React.FC<CameraRigProps> = ({ mode }) => {
  const { camera } = useThree();

  useFrame((state, delta) => {
    // Target position based on mode
    const targetPos = new THREE.Vector3(0, 8, 8); // Default PLAY position
    const targetLookAt = new THREE.Vector3(0, 0, 0);

    if (mode === "MENU") {
      targetPos.set(0, 0, 10); // Front view for menu
      targetLookAt.set(0, 1, 0); // Look slightly up
    } else if (mode === "PLAY") {
      targetPos.set(0, 12, 8); // High angle isometric
      targetLookAt.set(0, 0, 0);
    } else if (mode === "WON") {
      // Orbit logic could go here, but keep simple for now
      const time = state.clock.elapsedTime;
      targetPos.set(Math.sin(time * 0.5) * 12, 8, Math.cos(time * 0.5) * 12);
      targetLookAt.set(0, 0, 0);
    }

    // Smooth transition
    camera.position.lerp(targetPos, delta * 2);

    // Custom lookAt lerp is tricky, so we lerp the target and use lookAt
    // Or just snap lookAt for now, maybe lerp orbit controls target if strictly using controls
    // But here we are manipulating camera directly.
    // We need to disable OrbitControls during transition or update its target.
    // Assuming OrbitControls in App handles user input, we might fight it.
    // For MVP, if in Menu, we override control. If in Play, we let OrbitControls take over?
    // Actually best to control everything here if we want cinematic entry.

    state.camera.lookAt(targetLookAt);
  });

  return null;
};

export default CameraRig;
