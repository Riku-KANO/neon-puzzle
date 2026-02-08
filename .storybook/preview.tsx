import type { Preview } from "@storybook/react-vite";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import React from "react";
import "../src/index.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: "todo",
    },
  },
  decorators: [
    (Story, context) => {
      // Check if the story explicitly disables r3f canvas
      // Or if it requests it via parameters 'r3f' or tag 'three'
      if (
        context.parameters.r3f !== false &&
        (context.tags?.includes("three") || context.parameters.r3f)
      ) {
        return (
          <div style={{ width: "100%", height: "500px" }}>
            <Canvas camera={{ position: [2, 2, 2], fov: 50 }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} />
              <Story />
              <OrbitControls makeDefault />
            </Canvas>
          </div>
        );
      }
      return <Story />;
    },
  ],
};

export default preview;
