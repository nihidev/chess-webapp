# ♔ Chess

A browser-based chess game built with React, TypeScript, and Stockfish WASM. No account or install required — just open and play.

**Live demo:** [chess-webapp-xi.vercel.app](https://chess-webapp-xi.vercel.app)

---

## Features

- **Human vs Human** — two players share the same device and alternate moves
- **Human vs Computer** — play against the Stockfish 16 engine at three difficulty levels
- **Pawn promotion dialog** — choose Queen, Rook, Bishop, or Knight (HvH mode)
- **Move history panel** — scrollable SAN move list with last-move highlight
- **Captured pieces tray** — displayed inline on each player strip, sorted by value
- **Last-move highlight** — yellow tint on the source and destination squares
- **Responsive layout** — works on viewports from 320 px to 1920 px
- **Dark theme** — chess.com-inspired colour palette

## Tech Stack

| Layer | Library |
|---|---|
| UI | React 18 + TypeScript (strict) |
| Build | Vite 5 |
| Chess logic | chess.js |
| Board component | react-chessboard |
| AI engine | Stockfish 16 WASM (single-threaded, runs in a Web Worker) |
| Tests | Vitest + Testing Library |

## Getting Started

```bash
npm install
npm run dev       # http://localhost:5173
```

## Available Scripts

```bash
npm run dev         # Start Vite dev server
npm run build       # Type-check + production build → dist/
npm run test        # Run Vitest test suite once
npm run test:watch  # Run Vitest in watch mode
npm run lint        # ESLint check
```

## Project Structure

```
src/
├── types.ts                  # Shared enums and interfaces (single source of truth)
├── App.tsx                   # Root component — mode selection and game routing
├── main.tsx                  # React entry point
├── index.css                 # Global dark theme styles
├── components/
│   ├── Board.tsx             # react-chessboard wrapper + promotion dialog
│   ├── ModeSelection.tsx     # Game setup cards (HvH / HvC config)
│   ├── StatusBar.tsx         # Move history list + current game status
│   ├── GameControls.tsx      # New Game button
│   └── CapturedPieces.tsx   # Inline captured-pieces tray
├── hooks/
│   ├── useChessGame.ts       # Game state, move logic, computer turn trigger
│   └── useStockfish.ts       # Stockfish Web Worker lifecycle + getBestMove
└── workers/
    └── stockfish.worker.ts   # UCI relay between main thread and engine
```

## Difficulty Levels

| Level | Stockfish Search Depth |
|---|---|
| Easy | 1 |
| Medium | 8 |
| Hard | 18 |

## Architecture Notes

- **No backend** — everything runs client-side. Stockfish WASM runs in a dedicated Web Worker.
- **No persistence** — refreshing the page starts a new game.
- **`src/types.ts` is the contracts file** — all shared types are defined there and imported everywhere else.
- The single-threaded Stockfish build (`stockfish-nnue-16-single`) is used to avoid the `SharedArrayBuffer` / Cross-Origin-Isolation requirement that the multi-threaded build needs.
