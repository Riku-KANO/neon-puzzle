import type { Meta, StoryObj } from "@storybook/react-vite";
import Board from "../components/Board";
import type { BoardData } from "../types";

const meta: Meta<typeof Board> = {
  title: "Components/Board",
  component: Board,
  parameters: {
    r3f: true,
    layout: "centered",
  },
  args: {
    data: {
      width: 3,
      height: 3,
      nodes: [
        { node_type: "Source", rotation: 0 },
        { node_type: "Straight", rotation: 0 },
        { node_type: "Target", rotation: 0 },
        { node_type: "Elbow", rotation: 0 },
        { node_type: "Cross", rotation: 0 },
        { node_type: "Tee", rotation: 0 },
        { node_type: "Empty", rotation: 0 },
        { node_type: "Empty", rotation: 0 },
        { node_type: "Empty", rotation: 0 },
      ],
      start_pos: [0, 0],
      end_pos: [2, 0],
    } as BoardData,
    connectedIndices: new Set([0, 1, 2]), // Mock some connected nodes
  },
  argTypes: {
    onRotate: { action: "rotated" },
    connectedIndices: { control: false }, // Difficult to control a Set via UI
  },
};

export default meta;
type Story = StoryObj<typeof Board>;

export const Default: Story = {};

export const SmallBoard: Story = {
  args: {
    data: {
      width: 2,
      height: 2,
      nodes: [
        { node_type: "Source", rotation: 0 },
        { node_type: "Target", rotation: 0 },
        { node_type: "Straight", rotation: 0 },
        { node_type: "Straight", rotation: 0 },
      ],
      start_pos: [0, 0],
      end_pos: [1, 0],
    } as BoardData,
    connectedIndices: new Set([0, 1]),
  },
};
