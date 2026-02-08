import React, { useMemo, useRef } from "react";
import { AdditiveBlending, Color } from "three";
import { shaderMaterial } from "@react-three/drei";
import { extend, useFrame, type ReactThreeFiber } from "@react-three/fiber";

const ElectricShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new Color("#00ffff"),
    uGlow: new Color("#88ffff"),
    uOpacity: 0.9,
  },
  `
    varying vec3 vPos;
    varying vec2 vUv;

    void main() {
      vUv = uv;
      vPos = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  `
    uniform float uTime;
    uniform vec3 uColor;
    uniform vec3 uGlow;
    uniform float uOpacity;
    varying vec3 vPos;
    varying vec2 vUv;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    void main() {
      float wave = sin((vPos.x + vPos.z) * 6.0 - uTime * 4.0);
      float pulse = sin(uTime * 12.0 + vPos.y * 8.0) * 0.5 + 0.5;
      float jitter = hash(vUv * 10.0 + uTime) * 0.3 + 0.7;
      float intensity = smoothstep(0.1, 1.0, wave * 0.5 + 0.5);
      intensity *= pulse * jitter;

      vec3 color = mix(uColor, uGlow, intensity);
      gl_FragColor = vec4(color, intensity * uOpacity);
    }
  `,
);

extend({ ElectricShaderMaterial });

type ElectricShaderMaterialImpl = InstanceType<typeof ElectricShaderMaterial>;

declare module "@react-three/fiber" {
  interface ThreeElements {
    electricShaderMaterial: ReactThreeFiber.Object3DNode<
      ElectricShaderMaterialImpl,
      typeof ElectricShaderMaterial
    >;
  }
}

interface ElectricMaterialProps {
  color?: string;
  glow?: string;
  opacity?: number;
}

const ElectricMaterial: React.FC<ElectricMaterialProps> = ({
  color = "#00ffff",
  glow = "#88ffff",
  opacity = 0.9,
}) => {
  const materialRef = useRef<ElectricShaderMaterialImpl>(null);
  const colorValue = useMemo(() => new Color(color), [color]);
  const glowValue = useMemo(() => new Color(glow), [glow]);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.elapsedTime;
    }
  });

  return (
    <electricShaderMaterial
      ref={materialRef}
      transparent={true}
      depthWrite={false}
      blending={AdditiveBlending}
      uColor={colorValue}
      uGlow={glowValue}
      uOpacity={opacity}
    />
  );
};

export default ElectricMaterial;
