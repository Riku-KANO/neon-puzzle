# Docs Overview

Neon Puzzle is a 3D circuit-routing game. The Rust/WASM core generates puzzle layouts and the React Three Fiber frontend renders the board and effects.

## Structure

- `docs/gameplay.md`: player flow, UI behavior, and controls.
- `docs/specs/mvp.md`: legacy draft (encoding issues); treat as archival.

## Key Systems

- **Game states**: `MENU`, `PLAY`, `WON`
- **Difficulty**: Easy/Normal/Hard map to level sizes, and can be selected in the menu or after a win.
- **Effects**:
  - Electric shader overlay for energized paths.
  - Celebration burst on puzzle completion.
