use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

#[derive(Serialize, Deserialize, Clone, Copy, Debug, PartialEq)]
pub enum NodeType {
    Empty,
    Source,
    Target,
    Straight,
    Elbow,
    Tee,
    Cross,
}

#[derive(Serialize, Deserialize, Clone, Copy, Debug, PartialEq)]
pub enum Direction {
    North = 0,
    East = 1,
    South = 2,
    West = 3,
}

impl Direction {
    pub fn rotate(self, steps: u8) -> Direction {
        let val = self as u8;
        match (val + steps) % 4 {
            0 => Direction::North,
            1 => Direction::East,
            2 => Direction::South,
            3 => Direction::West,
            _ => unreachable!(),
        }
    }

    pub fn opposite(self) -> Direction {
        self.rotate(2)
    }

    pub fn to_delta(self) -> (isize, isize) {
        match self {
            Direction::North => (0, -1),
            Direction::East => (1, 0),
            Direction::South => (0, 1),
            Direction::West => (-1, 0),
        }
    }
}

#[derive(Serialize, Deserialize, Clone, Copy, Debug)]
pub struct Node {
    pub node_type: NodeType,
    pub rotation: u8, // 0..3
    pub fixed: bool,
}

impl Node {
    pub fn new(node_type: NodeType) -> Self {
        Self {
            node_type,
            rotation: 0,
            fixed: false,
        }
    }

    pub fn ports(&self) -> Vec<Direction> {
        let base_ports = match self.node_type {
            NodeType::Empty => vec![],
            NodeType::Source | NodeType::Target => vec![Direction::South], // Default facing down? Or maybe all for S/T? Let's say South for now.
            NodeType::Straight => vec![Direction::North, Direction::South],
            NodeType::Elbow => vec![Direction::North, Direction::East],
            NodeType::Tee => vec![Direction::East, Direction::South, Direction::West],
            NodeType::Cross => vec![
                Direction::North,
                Direction::East,
                Direction::South,
                Direction::West,
            ],
        };

        base_ports
            .into_iter()
            .map(|d| d.rotate(self.rotation))
            .collect()
    }
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Board {
    pub width: usize,
    pub height: usize,
    pub nodes: Vec<Node>,
    pub start_pos: (usize, usize),
    pub end_pos: (usize, usize),
}

impl Board {
    pub fn new(width: usize, height: usize) -> Self {
        let nodes = vec![Node::new(NodeType::Empty); width * height];
        Self {
            width,
            height,
            nodes,
            start_pos: (0, 0),
            end_pos: (width - 1, height - 1),
        }
    }

    pub fn get_node(&self, x: usize, y: usize) -> Option<&Node> {
        if x < self.width && y < self.height {
            Some(&self.nodes[y * self.width + x])
        } else {
            None
        }
    }

    pub fn get_node_mut(&mut self, x: usize, y: usize) -> Option<&mut Node> {
        if x < self.width && y < self.height {
            Some(&mut self.nodes[y * self.width + x])
        } else {
            None
        }
    }
}
