import React from "react";
import type { BoardData } from "../types";
import Block from "./Block";

interface BoardProps {
  data: BoardData;
  onRotate: (x: number, y: number) => void;
  connectedIndices: Set<number>;
}

const Board: React.FC<BoardProps> = ({ data, onRotate, connectedIndices }) => {
  // Center the board
  const offsetX = (data.width - 1) / 2;
  const offsetZ = (data.height - 1) / 2;

  return (
    <group position={[-offsetX, 0, -offsetZ]}>
      {data.nodes.map((node, i) => {
        const x = i % data.width;
        const y = Math.floor(i / data.width);

        const isStart = x === data.start_pos[0] && y === data.start_pos[1];
        const isEnd = x === data.end_pos[0] && y === data.end_pos[1];

        return (
          <Block
            key={`${x}-${y}`}
            type={node.node_type}
            rotation={node.rotation}
            position={[x, 0, y]}
            onClick={() => onRotate(x, y)}
            connected={connectedIndices.has(i)}
            marker={isStart ? "Source" : isEnd ? "Target" : undefined}
          />
        );
      })}
    </group>
  );
};

export default Board;
