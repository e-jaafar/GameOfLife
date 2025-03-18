"use client";

import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  OrbitControls,
  Box,
  PerspectiveCamera,
  Plane,
  Grid
} from '@react-three/drei';
import * as THREE from 'three';

// Glowing cell component without trail effect
const Cell = ({
  position,
  isAlive,
  color,
  onClick,
}: {
  position: [number, number, number],
  isAlive: boolean,
  color: THREE.Color,
  onClick: () => void,
}) => {
  // Reference to animate the glow intensity
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(({ clock }) => {
    if (materialRef.current && isAlive) {
      const t = clock.getElapsedTime();
      // Pulsating glow effect for living cells
      materialRef.current.emissiveIntensity = 0.9 + Math.sin(t * 2) * 0.3;
    }
  });

  return (
    <Box
      position={position}
      args={[0.9, 0.2, 0.9]}
      castShadow
      receiveShadow
      onClick={onClick}
    >
      <meshStandardMaterial
        ref={materialRef}
        color={isAlive ? color : 'black'}
        emissive={isAlive ? color : 'black'}
        emissiveIntensity={isAlive ? 0.9 : 0}
        metalness={isAlive ? 0.3 : 0.8}
        roughness={isAlive ? 0.4 : 0.8}
        toneMapped={false} // Important for bright neon colors
      />
    </Box>
  );
};

// Simple grid floor
const GridFloor = ({ gridSize }: { gridSize: number }) => {
  return (
    <Plane
      position={[0, -0.1, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      args={[gridSize * 1.2, gridSize * 1.2]}
      receiveShadow
    >
      <meshStandardMaterial
        color="#111"
        roughness={0.8}
        metalness={0.2}
      />
      <Grid
        cellSize={1}
        cellThickness={0.3}
        cellColor="#222"
        sectionSize={5}
        sectionThickness={0.5}
        sectionColor="#333"
        fadeDistance={gridSize * 1.5}
        infiniteGrid
      />
    </Plane>
  );
};

// Conway's Game of Life implementation
const GameOfLife = () => {
  const gridSize = 30;
  const [grid, setGrid] = useState<boolean[][]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(500); // ms between updates
  const [pattern, setPattern] = useState("random"); // Pattern selection
  const [editMode, setEditMode] = useState(false); // Toggle cell edit mode
  const [showControls, setShowControls] = useState(true);
  const [generation, setGeneration] = useState(0); // Generation counter

  // Initialize the grid
  useEffect(() => {
    initGrid();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Animation loop
  useEffect(() => {
    if (!isRunning) return;

    const intervalId = setInterval(() => {
      updateGrid();
    }, speed);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, grid, speed]);

  // Initialize the grid with random values or patterns
  const initGrid = () => {
    const newGrid = Array(gridSize).fill(null)
      .map(() => Array(gridSize).fill(false));

    // Reset generation counter
    setGeneration(0);

    if (pattern === "random") {
      // Random pattern
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          newGrid[i][j] = Math.random() > 0.7;
        }
      }
    } else if (pattern === "empty") {
      // Empty grid for manual editing
    } else if (pattern === "glider") {
      // Glider pattern
      const centerX = Math.floor(gridSize / 2);
      const centerY = Math.floor(gridSize / 2);
      newGrid[centerX][centerY] = true;
      newGrid[centerX + 1][centerY] = true;
      newGrid[centerX + 2][centerY] = true;
      newGrid[centerX + 2][centerY - 1] = true;
      newGrid[centerX + 1][centerY - 2] = true;
    } else if (pattern === "pulsar") {
      // Pulsar pattern (period 3 oscillator)
      const centerX = Math.floor(gridSize / 2) - 6;
      const centerY = Math.floor(gridSize / 2) - 6;

      // Define the pulsar pattern
      const pulsarCoords = [
        // Top section
        [2, 0], [3, 0], [4, 0], [8, 0], [9, 0], [10, 0],
        // Middle top section
        [0, 2], [5, 2], [7, 2], [12, 2],
        [0, 3], [5, 3], [7, 3], [12, 3],
        [0, 4], [5, 4], [7, 4], [12, 4],
        // Middle bottom section
        [2, 5], [3, 5], [4, 5], [8, 5], [9, 5], [10, 5],
        // Bottom section
        [2, 7], [3, 7], [4, 7], [8, 7], [9, 7], [10, 7],
        // Middle bottom section
        [0, 8], [5, 8], [7, 8], [12, 8],
        [0, 9], [5, 9], [7, 9], [12, 9],
        [0, 10], [5, 10], [7, 10], [12, 10],
        // Bottom section
        [2, 12], [3, 12], [4, 12], [8, 12], [9, 12], [10, 12]
      ];

      // Apply the pattern
      for (const [x, y] of pulsarCoords) {
        if (centerX + x < gridSize && centerY + y < gridSize) {
          newGrid[centerX + x][centerY + y] = true;
        }
      }
    } else if (pattern === "blinker") {
      // Simple blinker pattern (period 2 oscillator)
      const centerX = Math.floor(gridSize / 2);
      const centerY = Math.floor(gridSize / 2);
      newGrid[centerX - 1][centerY] = true;
      newGrid[centerX][centerY] = true;
      newGrid[centerX + 1][centerY] = true;
    } else if (pattern === "glider-gun") {
      // Gosper Glider Gun pattern
      const startX = 5;
      const startY = 5;

      const gliderGunCoords = [
        // Left square
        [0, 4], [0, 5], [1, 4], [1, 5],
        // Left structure
        [10, 4], [10, 5], [10, 6],
        [11, 3], [11, 7],
        [12, 2], [12, 8],
        [13, 2], [13, 8],
        [14, 5],
        [15, 3], [15, 7],
        [16, 4], [16, 5], [16, 6],
        [17, 5],
        // Right structure
        [20, 2], [20, 3], [20, 4],
        [21, 2], [21, 3], [21, 4],
        [22, 1], [22, 5],
        [24, 0], [24, 1], [24, 5], [24, 6],
        // Right square
        [34, 2], [34, 3], [35, 2], [35, 3]
      ];

      // Apply the pattern
      for (const [x, y] of gliderGunCoords) {
        if (startX + x < gridSize && startY + y < gridSize) {
          newGrid[startX + x][startY + y] = true;
        }
      }
    }

    setGrid(newGrid);
  };

  // Update grid according to Conway's Game of Life rules
  const updateGrid = () => {
    setGrid(prevGrid => {
      const newGrid = prevGrid.map((row, i) =>
        row.map((cell, j) => {
          const neighbors = countNeighbors(prevGrid, i, j);

          // Rules of Conway's Game of Life
          if (cell) {
            // Any live cell with fewer than two live neighbors dies (underpopulation)
            // Any live cell with more than three live neighbors dies (overpopulation)
            if (neighbors < 2 || neighbors > 3) return false;
            // Any live cell with two or three live neighbors lives on
            return true;
          } else {
            // Any dead cell with exactly three live neighbors becomes a live cell (reproduction)
            return neighbors === 3;
          }
        })
      );

      return newGrid;
    });

    // Increment generation counter
    setGeneration(prev => prev + 1);
  };

  // Count live neighbors for a cell
  const countNeighbors = (grid: boolean[][], x: number, y: number) => {
    let count = 0;

    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;

        const newX = (x + i + gridSize) % gridSize;
        const newY = (y + j + gridSize) % gridSize;

        if (grid[newX][newY]) count++;
      }
    }

    return count;
  };

  // Create color map for the grid with neon colors
  const colorMap = useRef(
    Array(gridSize).fill(null).map(() =>
      Array(gridSize).fill(null).map(() => {
        // Generate bright neon colors
        const hue = Math.random() * 360; // Random hue around the color wheel
        const color = new THREE.Color();
        color.setHSL(hue / 360, 1, 0.6); // High saturation and medium-high lightness
        return color;
      })
    )
  ).current;

  // Handle pattern change
  const handlePatternChange = (newPattern: string) => {
    setPattern(newPattern);
    setIsRunning(false); // Pause the simulation
    setGrid([]); // Clear the grid
    setTimeout(() => {
      setPattern(newPattern);
      initGrid(); // Reinitialize with the new pattern
    }, 10);
  };

  // Toggle cell state
  const toggleCell = (x: number, z: number) => {
    if (!editMode) return; // Only toggle cells in edit mode

    setGrid(prevGrid => {
      const newGrid = [...prevGrid];
      newGrid[x][z] = !newGrid[x][z];
      return newGrid;
    });
  };

  // Generate preset patterns
  const presetPatterns = [
    { name: "Random", id: "random" },
    { name: "Empty", id: "empty" },
    { name: "Glider", id: "glider" },
    { name: "Blinker", id: "blinker" },
    { name: "Pulsar", id: "pulsar" },
    { name: "Glider Gun", id: "glider-gun" }
  ];

  // Count living cells
  const livingCells = grid.reduce((count, row) =>
    count + row.reduce((rowCount, cell) => rowCount + (cell ? 1 : 0), 0), 0
  );

  return (
    <div className="relative h-screen w-full">
      <Canvas shadows>
        <color attach="background" args={["#050505"]} />
        <PerspectiveCamera makeDefault position={[0, 25, 35]} />
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 20, 10]} intensity={0.5} castShadow />

        {/* Simple grid floor */}
        <GridFloor gridSize={gridSize} />

        {/* Conway's Game of Life cells */}
        <group position={[-gridSize / 2 + 0.5, 0, -gridSize / 2 + 0.5]}>
          {grid.map((row, x) =>
            row.map((isAlive, z) => (
              <Cell
                key={`${x}-${z}`}
                position={[x, 0, z]}
                isAlive={isAlive}
                color={colorMap[x][z]}
                onClick={() => toggleCell(x, z)}
              />
            ))
          )}
        </group>

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={!editMode} // Disable rotation when in edit mode
        />
      </Canvas>

      {/* Controls Toggle Button */}
      <button
        onClick={() => setShowControls(!showControls)}
        className="absolute top-4 right-4 bg-violet-600 px-3 py-2 rounded-md z-10 text-white"
      >
        {showControls ? 'Hide Controls' : 'Show Controls'}
      </button>

      {/* Controls Panel */}
      {showControls && (
        <div className="absolute top-4 left-4 bg-black/70 p-4 rounded-lg space-y-4 text-white backdrop-blur-sm">
          <h2 className="text-xl font-bold text-violet-300">Conway's Game of Life</h2>
          <h3 className="text-lg text-violet-200">Neon Edition</h3>

          <div className="flex space-x-2">
            <button
              className="bg-violet-600 px-4 py-2 rounded-md hover:bg-violet-700 transition-colors"
              onClick={() => setIsRunning(prev => !prev)}
            >
              {isRunning ? 'Pause' : 'Start'}
            </button>
            <button
              className="bg-violet-600 px-4 py-2 rounded-md hover:bg-violet-700 transition-colors"
              onClick={initGrid}
            >
              Reset
            </button>
          </div>

          <div>
            <label htmlFor="speed" className="block mb-2">Speed: {speed}ms</label>
            <input
              id="speed"
              type="range"
              min="100"
              max="1000"
              step="50"
              value={speed}
              onChange={(e) => setSpeed(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block mb-2">Pattern:</label>
            <div className="grid grid-cols-2 gap-2">
              {presetPatterns.map((preset) => (
                <button
                  key={preset.id}
                  className={`px-2 py-1 rounded-md transition-colors ${pattern === preset.id ? 'bg-violet-600' : 'bg-violet-800 hover:bg-violet-700'}`}
                  onClick={() => handlePatternChange(preset.id)}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2 mt-2">
            <input
              type="checkbox"
              id="editMode"
              checked={editMode}
              onChange={() => {
                if (isRunning) setIsRunning(false); // Pause while editing
                setEditMode(!editMode);
              }}
              className="w-4 h-4"
            />
            <label htmlFor="editMode" className="text-violet-200">
              Edit Mode {editMode ? '(Click cells to toggle)' : ''}
            </label>
          </div>

          <div className="text-sm text-violet-300 pt-2 border-t border-violet-800/50 space-y-1">
            <p>Living Cells: <span className="font-mono">{livingCells}</span></p>
            <p>Generation: <span className="font-mono">{generation}</span></p>
          </div>

          <div className="text-xs text-violet-300 mt-4">
            <p>Use mouse to rotate, zoom and pan</p>
            <p>Toggle Edit Mode to draw your own patterns</p>
            <p className="mt-2">
              <a
                href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-violet-400"
              >
                Learn about Conway's Game of Life
              </a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameOfLife;
