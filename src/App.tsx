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
import type { BoardData, Difficulty } from "./types";
import Board from "./components/Board";
import MainMenu from "./components/MainMenu";
import Celebration from "./components/Celebration";
import CameraRig from "./components/CameraRig";

type GameState = "MENU" | "LOADING" | "PLAY" | "WON";

function App() {
  const [boardData, setBoardData] = useState<BoardData | null>(null);
  const [connectedIndices, setConnectedIndices] = useState<Set<number>>(
    new Set(),
  );
  const [gameState, setGameState] = useState<GameState>("MENU");
  const [difficulty, setDifficulty] = useState<Difficulty>("normal");
  const [isWasmReady, setIsWasmReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const controlsRef = useRef<OrbitControlsImpl>(null);

  const difficultyConfig: Record<Difficulty, { label: string; size: number }> =
    {
      easy: { label: "EASY", size: 4 },
      normal: { label: "NORMAL", size: 5 },
      hard: { label: "HARD", size: 9 },
    };

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

  const startGame = (nextDifficulty: Difficulty) => {
    if (!isWasmReady) return;

    setDifficulty(nextDifficulty);
    setBoardData(null);
    setGameState("LOADING");

    // Generate level after a brief delay to allow the loading transition
    setTimeout(() => {
      const size = difficultyConfig[nextDifficulty].size;
      const data = generate_level(size, size) as BoardData;


      setBoardData(data);
      const energized = check_connection_status(data) as number[];
      setConnectedIndices(new Set(energized));

      // Let the camera settle into position before revealing the board
      setTimeout(() => {
        setGameState("PLAY");

        // Reset camera controls target
        if (controlsRef.current) {
          controlsRef.current.target.set(0, 0, 0);
          controlsRef.current.object.position.set(0, 8, 8);
        }
      }, 800);
    }, 700);
  };

  const handleRotate = useCallback(
    (x: number, y: number) => {
      if (!boardData || gameState !== "PLAY") return;

      setBoardData((prev) => {
        if (!prev) return null;
        const newNodes = [...prev.nodes];
        const index = y * prev.width + x;
        const node = { ...newNodes[index] };

        if (node.fixed) return prev;

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
      {/* Loading Overlay */}
      {gameState === "LOADING" && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="text-center animate-pulse">
            <div className="text-3xl font-bold text-cyan-400 drop-shadow-[0_0_20px_rgba(0,255,255,0.8)] mb-3">
              INITIALIZING
            </div>
            <div className="text-sm text-cyan-200/60 tracking-[0.3em]">
              {difficultyConfig[difficulty].label} MODE
            </div>
            <div className="mt-6 mx-auto w-48 h-0.5 bg-gray-800 rounded overflow-hidden">
              <div className="h-full bg-cyan-400 rounded shadow-[0_0_8px_rgba(0,255,255,0.6)] animate-[loading_1.5s_ease-in-out_infinite]" />
            </div>
          </div>
        </div>
      )}

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
            <p className="text-xs text-cyan-200/80">
              DIFFICULTY: {difficultyConfig[difficulty].label}
            </p>
            <p className="text-xs text-gray-400">
              Rotate blocks to route power.
            </p>
            <button
              className="pointer-events-auto mt-3 px-3 py-1.5 bg-gray-800/80 hover:bg-gray-700 rounded text-xs text-cyan-300 border border-cyan-500/30 transition-colors w-full"
              onClick={() => setGameState("MENU")}
            >
              MENU
            </button>
          </div>
        )}
        {gameState === "WON" && (
          <div className="bg-black/80 p-6 rounded-xl border border-green-500 shadow-[0_0_30px_rgba(0,255,0,0.5)]">
            <h2 className="text-4xl font-bold text-green-400 text-center mb-2">
              SYSTEM RESTORED
            </h2>
            <p className="text-center text-green-200 text-sm">
              Difficulty: {difficultyConfig[difficulty].label}
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <button
                className="pointer-events-auto px-6 py-2 bg-cyan-600 hover:bg-cyan-500 rounded text-white font-bold transition-colors"
                onClick={() => startGame(difficulty)}
              >
                NEW PUZZLE
              </button>
              <div className="grid grid-cols-3 gap-2">
                {(["easy", "normal", "hard"] as const).map((level) => (
                  <button
                    key={level}
                    className={`pointer-events-auto px-2 py-2 rounded font-bold text-xs transition-colors ${
                      difficulty === level
                        ? "bg-emerald-500 text-black"
                        : "bg-gray-800 hover:bg-gray-700 text-white"
                    }`}
                    onClick={() => startGame(level)}
                  >
                    {difficultyConfig[level].label}
                  </button>
                ))}
              </div>
            </div>
            <button
              className="pointer-events-auto mt-3 px-6 py-2 bg-green-600 hover:bg-green-500 rounded text-white font-bold w-full transition-colors"
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
        {gameState === "PLAY" || gameState === "WON" ? (
          <OrbitControls
            ref={controlsRef}
            target={[0, 0, 0]}
            maxPolarAngle={Math.PI / 2.5}
            enablePan={false}
          />
        ) : null}

        {/* Cinematic Camera for Menu / Loading */}
        {(gameState === "MENU" || gameState === "LOADING") && (
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
          {gameState === "MENU" && (
            <MainMenu
              difficulty={difficulty}
              onSelectDifficulty={setDifficulty}
              onStart={startGame}
            />
          )}

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
