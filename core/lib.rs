mod generator;
mod model;
mod solver;

use generator::{generate_solved_board, scramble_board};
use model::{Board, NodeType};
use solver::get_energized_nodes;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn greet() -> String {
    "Hello from Rust/WASM!".to_string()
}

#[wasm_bindgen]
pub fn generate_level(width: usize, height: usize) -> JsValue {
    // Generate solved board
    let mut board = generate_solved_board(width, height);

    // Scramble it
    scramble_board(&mut board);

    serde_wasm_bindgen::to_value(&board).unwrap()
}

#[wasm_bindgen]
pub fn check_connection_status(board_val: JsValue) -> JsValue {
    // Returns a Set/Array of energized node indices
    let board: Board = serde_wasm_bindgen::from_value(board_val).unwrap();
    let energized = get_energized_nodes(&board);

    // Convert (x, y) to index
    let indices: Vec<usize> = energized
        .into_iter()
        .map(|(x, y)| y * board.width + x)
        .collect();

    serde_wasm_bindgen::to_value(&indices).unwrap()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_generator_solvability() {
        let width = 5;
        let height = 5;
        let board = generate_solved_board(width, height);

        let energized = get_energized_nodes(&board);

        // In a solved board, Source (0,0) should reach Target (w-1, h-1)
        let target_pos = (width - 1, height - 1);
        assert!(
            energized.contains(&target_pos),
            "Target should be reachable in generated board"
        );
    }
}
