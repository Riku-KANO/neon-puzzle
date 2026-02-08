export type NodeType = 'Empty' | 'Source' | 'Target' | 'Straight' | 'Elbow' | 'Tee' | 'Cross';

export const Direction = {
    North: 0,
    East: 1,
    South: 2,
    West: 3,
} as const;

export type Direction = typeof Direction[keyof typeof Direction];

export interface Node {
    node_type: NodeType;
    rotation: number; // 0..3
    fixed: boolean;
}

export interface BoardData {
    width: number;
    height: number;
    nodes: Node[];
    start_pos: [number, number];
    end_pos: [number, number];
}
