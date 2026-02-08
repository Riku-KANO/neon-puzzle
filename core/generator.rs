use crate::model::{Board, Direction, Node, NodeType};
use rand::prelude::*;

pub fn generate_solved_board(width: usize, height: usize) -> Board {
    let mut board = Board::new(width, height);
    let mut rng = rand::thread_rng();

    // 1. Initialize with Empty nodes
    // Already done in Board::new

    // 2. DFS to create a spanning tree (Maze generation)
    let mut visited = vec![false; width * height];
    let start_x = 0;
    let start_y = 0;

    // Stack for DFS: (x, y, from_direction)
    let mut stack = vec![(start_x, start_y)];
    visited[start_y * width + start_x] = true;

    // We need to keep track of connections to assign NodeTypes later
    // connections[y][x] = list of directions connected
    let mut connections: Vec<Vec<Vec<Direction>>> = vec![vec![vec![]; width]; height];

    while let Some((cx, cy)) = stack.pop() {
        // Collect unvisited neighbors
        let mut neighbors = Vec::new();

        let dirs = [
            Direction::North,
            Direction::East,
            Direction::South,
            Direction::West,
        ];

        for dir in dirs {
            let (dx, dy) = dir.to_delta();
            let nx = cx as isize + dx;
            let ny = cy as isize + dy;

            if nx >= 0 && nx < width as isize && ny >= 0 && ny < height as isize {
                let nx = nx as usize;
                let ny = ny as usize;
                if !visited[ny * width + nx] {
                    neighbors.push((nx, ny, dir));
                }
            }
        }

        if !neighbors.is_empty() {
            stack.push((cx, cy)); // Push back current to backtrack later

            // Choose random neighbor
            let (nx, ny, dir) = neighbors[rng.gen_range(0..neighbors.len())];

            // Mark connection
            connections[cy][cx].push(dir);
            connections[ny][nx].push(dir.opposite());

            visited[ny * width + nx] = true;
            stack.push((nx, ny));
        }
    }

    // 3. Convert connections to NodeTypes
    for y in 0..height {
        for x in 0..width {
            let dirs = &mut connections[y][x];
            dirs.sort_by_key(|d| *d as u8); // Sort for easier matching

            let node_type = match dirs.len() {
                1 => NodeType::Source, // Terminals (End points of maze)
                2 => {
                    let d1 = dirs[0];
                    let d2 = dirs[1];
                    if d1 == Direction::North && d2 == Direction::South {
                        NodeType::Straight
                    } else if d1 == Direction::East && d2 == Direction::West {
                        NodeType::Straight
                    }
                    // Need rotation validation
                    else {
                        NodeType::Elbow
                    }
                }
                3 => NodeType::Tee,
                4 => NodeType::Cross,
                _ => NodeType::Empty,
            };

            // Determine rotation
            // Simplified logic: Assuming default ports and rotate to match
            let best_rotation = find_rotation(node_type, dirs);

            let final_type = node_type;

            if let Some(node) = board.get_node_mut(x, y) {
                node.node_type = final_type;
                node.rotation = best_rotation;

                // Allow (0,0) and (w-1, h-1) to be terminals if they have degree 1,
                // but if they are part of a path, they must be Straight/Elbow/etc.
                // We rely on Board::start_pos/end_pos to identify them.

                // Fix: Ensure fixed rotation for start/end if we wanted them fixed?
                // For MVP, allow rotation even for start/end to keep it simple,
                // or fix them if they are truly terminals.
                // But since we don't guarantee they are terminals, let them rotate.
            }
        }
    }

    // Ensure Source and Target are open
    // (A maze guarantees path, but we might have overwritten S/T logic above)
    // For MVP, S is at (0,0), T is at (w-1, h-1).
    // The maze ensures they are connected to *something*.

    board
}

fn find_rotation(node_type: NodeType, required_ports: &[Direction]) -> u8 {
    // Try all 4 rotations
    for r in 0..4 {
        let node = Node {
            node_type,
            rotation: r,
            fixed: false,
        };
        let ports = node.ports();

        // Check if all required ports are present
        let all_match = required_ports.iter().all(|req| ports.contains(req));
        if all_match {
            return r;
        }
    }
    0 // Fallback
}

pub fn scramble_board(board: &mut Board) {
    let mut rng = rand::thread_rng();
    for node in &mut board.nodes {
        if node.node_type != NodeType::Source
            && node.node_type != NodeType::Target
            && node.node_type != NodeType::Empty
        {
            node.rotation = rng.gen_range(0..4);
        }
    }
}
