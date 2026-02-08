import { useEffect, useState, useCallback, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
  Stars,
} from "@react-three/drei";
import init, {
  generate_level,
  check_connection_status,
} from "../pkg/neon_puzzle";
import type { BoardData } from "./types";
import Board from "./components/Board";
import MainMenu from "./components/MainMenu";
import Celebration from "./components/Celebration";
import CameraRig from "./components/CameraRig";

type GameState = "MENU" | "PLAY" | "WON";

function App() {
  const [boardData, setBoardData] = useState<BoardData | null>(null);
  const [connectedIndices, setConnectedIndices] = useState<Set<number>>(
    new Set(),
  );
  const [gameState, setGameState] = useState<GameState>("MENU");
  const [isWasmReady, setIsWasmReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const controlsRef = useRef<OrbitControlsImpl>(null);

  useEffect(() => {
    init()
      .then(() => {
        setIsWasmReady(true);
      })
      .catch((err: unknown) => {
        console.error("WASM init failed:", err);
        const message = err instanceof Error ? err.message : String(err);
        setLoadError(message);
      });
  }, []);

  const startGame = (difficulty: "easy" | "normal" | "hard") => {
    if (!isWasmReady) return;

    // Difficulty logic: adjust size later? For now MVP fixed 5x5
    const size = difficulty === "hard" ? 7 : 5;
    const data = generate_level(size, size) as BoardData;

    setBoardData(data);
    const energized = check_connection_status(data) as number[];
    setConnectedIndices(new Set(energized));
    setGameState("PLAY");

    // Reset camera controls target
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.object.position.set(0, 8, 8);
    }
  };

  const handleRotate = useCallback(
    (x: number, y: number) => {
      if (!boardData || gameState !== "PLAY") return;

      setBoardData((prev) => {
        if (!prev) return null;
        const newNodes = [...prev.nodes];
        const index = y * prev.width + x;
        const node = { ...newNodes[index] };

        // Rotate 90 degrees clockwise
        node.rotation = (node.rotation + 1) % 4;
        newNodes[index] = node;

        const newBoard = { ...prev, nodes: newNodes };

        // Check connectivity
        const energized = check_connection_status(newBoard) as number[];
        setConnectedIndices(new Set(energized));

        // Check win
        const targetIndex =
          (newBoard.height - 1) * newBoard.width + (newBoard.width - 1);
        const solved = energized.includes(targetIndex);
        if (solved) {
          setGameState("WON");
        }

        return newBoard;
      });
    },
    [boardData, gameState],
  );

  if (!isWasmReady)
    return (
      <div className="text-white flex flex-col items-center justify-center h-screen bg-black">
        <div className="text-2xl mb-4">
          {loadError ? "System Failure" : "Loading System..."}
        </div>
        {loadError && (
          <div className="text-red-400 font-mono bg-red-950/20 p-4 rounded border border-red-900/50 max-w-lg overflow-auto">
            {loadError}
          </div>
        )}
      </div>
    );

  return (
    <div className="w-full h-screen bg-gray-950 text-white relative select-none">
      {/* HUD UI */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        {gameState === "MENU" && (
          <h1 className="text-6xl font-bold text-cyan-400 drop-shadow-[0_0_10px_rgba(0,255,255,0.8)] animate-pulse">
            NEON CIRCUIT
          </h1>
        )}
        {gameState === "PLAY" && (
          <div className="bg-black/50 p-4 rounded-lg border border-cyan-500/30 backdrop-blur-sm">
            <p className="text-cyan-300">
              STATUS: <span className="text-white">CONNECTED</span>
            </p>
            <p className="text-xs text-gray-400">
              Rotate blocks to route power.
            </p>
          </div>
        )}
        {gameState === "WON" && (
          <div className="bg-black/80 p-6 rounded-xl border border-green-500 shadow-[0_0_30px_rgba(0,255,0,0.5)]">
            <h2 className="text-4xl font-bold text-green-400 text-center mb-2">
              SYSTEM RESTORED
            </h2>
            <button
              className="pointer-events-auto mt-4 px-6 py-2 bg-green-600 hover:bg-green-500 rounded text-white font-bold w-full transition-colors"
              onClick={() => setGameState("MENU")}
            >
              RETURN TO MENU
            </button>
          </div>
        )}
      </div>

      <Canvas shadows={true}>
        <PerspectiveCamera makeDefault={true} position={[0, 8, 12]} fov={50} />

        {/* Controls: Active only in PLAY/WON, but we manually control transition? 
            For Menu, we might want auto-rotation.
        */}
        {gameState !== "MENU" && (
          <OrbitControls
            ref={controlsRef}
            target={[0, 0, 0]}
            maxPolarAngle={Math.PI / 2.5}
            enablePan={false}
          />
        )}

        {/* Cinematic Camera for Menu */}
        {gameState === "MENU" && (
          <OrbitControls
            autoRotate={true}
            autoRotateSpeed={0.5}
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 2}
          />
        )}

        <ambientLight intensity={0.2} />
        <spotLight
          position={[5, 10, 5]}
          angle={0.5}
          penumbra={1}
          intensity={10}
          castShadow={true}
          color="#ccffff"
        />
        <pointLight position={[-5, 5, -5]} intensity={5} color="#ff00ff" />

        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade={true}
          speed={1}
        />
        <Environment preset="city" />
        <CameraRig mode={gameState} />

        {/* Content */}
        <group>
          {gameState === "MENU" && <MainMenu onStart={startGame} />}

          {(gameState === "PLAY" || gameState === "WON") && boardData && (
            <group>
              <Board
                data={boardData}
                onRotate={handleRotate}
                connectedIndices={connectedIndices}
              />
              {gameState === "WON" && <Celebration />}
            </group>
          )}
        </group>
      </Canvas>
    </div>
  );
}

export default App;
