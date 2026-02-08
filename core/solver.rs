use crate::model::{Board, Direction, NodeType};
use std::collections::{HashSet, VecDeque};

pub fn get_energized_nodes(board: &Board) -> HashSet<(usize, usize)> {
    let (start_x, start_y) = board.start_pos;

    let mut visited = HashSet::new();
    let mut queue = VecDeque::new();

    queue.push_back((start_x, start_y));
    visited.insert((start_x, start_y));

    while let Some((cx, cy)) = queue.pop_front() {
        let curr_node = match board.get_node(cx, cy) {
            Some(n) => n,
            None => continue,
        };

        let ports = curr_node.ports();

        for dir in ports {
            let (dx, dy) = dir.to_delta();
            let nx = cx as isize + dx;
            let ny = cy as isize + dy;

            if nx >= 0 && nx < board.width as isize && ny >= 0 && ny < board.height as isize {
                let nx = nx as usize;
                let ny = ny as usize;

                // Check if neighbor connects back
                if let Some(neighbor) = board.get_node(nx, ny) {
                    let neighbor_ports = neighbor.ports();
                    if neighbor_ports.contains(&dir.opposite()) {
                        if !visited.contains(&(nx, ny)) {
                            visited.insert((nx, ny));
                            queue.push_back((nx, ny));
                        }
                    }
                }
            }
        }
    }

    visited
}
