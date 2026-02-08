import type { Meta, StoryObj } from "@storybook/react-vite";
import Block from "../components/Block";

const meta: Meta<typeof Block> = {
  title: "Components/Block",
  component: Block,
  parameters: {
    r3f: true, // This enables the Canvas decorator we set up
    layout: "centered",
  },
  argTypes: {
    type: {
      control: "select",
      options: [
        "Straight",
        "Elbow",
        "Tee",
        "Cross",
        "Source",
        "Target",
        "Empty",
      ],
    },
    rotation: {
      control: { type: "range", min: 0, max: 3, step: 1 },
    },
    position: {
      control: "object",
    },
    connected: {
      control: "boolean",
    },
    marker: {
      control: "select",
      options: ["Source", "Target", undefined],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Block>;

export const Straight: Story = {
  args: {
    type: "Straight",
    rotation: 0,
    position: [0, 0, 0],
    connected: false,
  },
};

export const Elbow: Story = {
  args: {
    type: "Elbow",
    rotation: 0,
    position: [0, 0, 0],
    connected: false,
  },
};

export const Tee: Story = {
  args: {
    type: "Tee",
    rotation: 0,
    position: [0, 0, 0],
    connected: false,
  },
};

export const Cross: Story = {
  args: {
    type: "Cross",
    rotation: 0,
    position: [0, 0, 0],
    connected: false,
  },
};

export const Source: Story = {
  args: {
    type: "Source",
    rotation: 0,
    position: [0, 0, 0],
    connected: false,
    marker: "Source",
  },
};

export const Target: Story = {
  args: {
    type: "Target",
    rotation: 0,
    position: [0, 0, 0],
    connected: false,
    marker: "Target",
  },
};

export const Connected: Story = {
  args: {
    type: "Straight",
    rotation: 0,
    position: [0, 0, 0],
    connected: true,
  },
};
