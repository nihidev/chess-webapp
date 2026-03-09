# Chess Webapp — Project Plan

## Overview

**Goal:** A browser-based chess game supporting Human vs Human and Human vs Computer modes with selectable AI difficulty levels.

**Stack:** React + TypeScript + Vite, react-chessboard, chess.js, Stockfish.js (WASM)

**Target users:** Chess players and enthusiasts who want to play directly in the browser without an account or install.

**Total features:** 5

---

## Architecture Summary

```
src/
  types.ts            # All shared types, enums, and interfaces (contracts)
  App.tsx             # Root component — mode selection and routing
  components/
    Board.tsx         # react-chessboard wrapper with move handling
    GameControls.tsx  # New game, resign, difficulty selector
    StatusBar.tsx     # Turn indicator, check/checkmate/draw display
  hooks/
    useChessGame.ts   # chess.js game state and move logic
    useStockfish.ts   # Stockfish.js WASM worker lifecycle and best-move requests
  workers/
    stockfish.worker.ts  # Web Worker wrapper for Stockfish WASM
```

All shared types live in `src/types.ts` — no feature may define its own competing type for a concept already defined there.

---

## Feature 1 — Scaffold, Types, and Contracts

**Slug:** `scaffold-and-contracts`

**Description:** Bootstrap the Vite + React + TypeScript project, install all required dependencies, and define every shared type and interface in `src/types.ts`. This file is the single source of truth that every subsequent feature imports from — no feature may redefine a type already declared here.

**Acceptance criteria:**
- Running `npm install` completes without errors.
- Running `npm run dev` serves the app at `localhost:5173` with a blank white page (no runtime errors in the browser console).
- Running `npm run build` produces a `dist/` folder without TypeScript errors.
- Running `npm run lint` passes with zero errors (ESLint + TypeScript strict).
- Running `npm run test` executes Vitest and exits 0 (zero test files is acceptable at this stage).
- `src/types.ts` exports the following and nothing else breaks when imported:
  - `GameMode` enum: `HumanVsHuman | HumanVsComputer`
  - `PlayerColor` enum: `White | Black`
  - `Difficulty` enum: `Easy | Medium | Hard`
  - `GameStatus` enum: `Idle | Playing | Check | Checkmate | Draw | Stalemate`
  - `GameConfig` interface: `{ mode: GameMode; playerColor: PlayerColor; difficulty: Difficulty }`
  - `MoveResult` interface: `{ fen: string; pgn: string; status: GameStatus; capturedPiece: string | null }`
  - `StockfishRequest` interface: `{ fen: string; depth: number }`
  - `StockfishResponse` interface: `{ bestMove: string }` (UCI format, e.g. `"e2e4"`)
- No `any` types anywhere in the codebase.
- `vite.config.ts` has `worker: { format: 'es' }` set to support the Stockfish WASM web worker.

**Dependencies:** None.

---

## Feature 2 — Chessboard UI and Human vs Human Game

**Slug:** `human-vs-human`

**Description:** Implement the full Human vs Human game flow: render the interactive chessboard using `react-chessboard`, validate and apply moves using `chess.js`, and display game status (whose turn it is, check, checkmate, draw). Both players share the same browser and alternate clicking pieces to move.

**Acceptance criteria:**
- The board renders on the page using `react-chessboard` in the starting position.
- A player can drag-and-drop or click-to-move pieces; illegal moves are rejected without changing the board state.
- After each legal move the board updates to reflect the new position.
- The `StatusBar` component displays:
  - "White's turn" or "Black's turn" between moves.
  - "Check!" when the current player's king is in check.
  - "Checkmate — [color] wins!" when the game ends by checkmate.
  - "Draw" when the game ends by stalemate, insufficient material, threefold repetition, or 50-move rule.
- Pawn promotion automatically promotes to a queen (no dialog required at this stage).
- A "New Game" button resets the board to the starting position and clears all status messages.
- Vitest unit tests pass for `useChessGame` hook:
  - Initial FEN matches the standard starting position.
  - A valid move (e.g. e2→e4) returns a `MoveResult` with updated FEN and `GameStatus.Playing`.
  - An invalid move (e.g. e2→e5) returns `null` and does not change the FEN.
  - Checkmate is detected and returns `GameStatus.Checkmate`.

**Dependencies:** Feature 1.

---

## Feature 3 — Stockfish.js WASM Integration

**Slug:** `stockfish-integration`

**Description:** Load Stockfish.js as a Web Worker, send positions to it via UCI protocol, and receive best-move responses. This feature delivers only the engine layer — no UI changes beyond a smoke-test page. The `useStockfish` hook exposes a `getBestMove(request: StockfishRequest): Promise<StockfishResponse>` interface.

**Acceptance criteria:**
- `npm run build` completes without errors after adding the Stockfish WASM worker.
- The Stockfish worker initializes correctly and the browser console shows no errors on page load.
- `useStockfish` hook exposes `getBestMove(request: StockfishRequest): Promise<StockfishResponse>`.
- Calling `getBestMove` with the starting FEN and depth 5 resolves with a valid UCI move string (e.g. `"e2e4"`) within 10 seconds in a browser environment.
- Difficulty maps to Stockfish search depth:
  - `Easy` → depth 1
  - `Medium` → depth 8
  - `Hard` → depth 18
- The worker is torn down (`.terminate()`) when the component using the hook unmounts — verified by a Vitest test that mocks the Worker and asserts `terminate` is called on unmount.
- No Stockfish calls are made when the game mode is `HumanVsHuman`.

**Dependencies:** Feature 1.

---

## Feature 4 — Human vs Computer Mode

**Slug:** `human-vs-computer`

**Description:** Wire the Stockfish engine from Feature 3 into the game loop so that after the human player makes a move, Stockfish automatically responds as the opponent. The player chooses their color (White or Black) and a difficulty level before the game starts.

**Acceptance criteria:**
- A mode-selection screen is shown before any game starts with two options: "Human vs Human" and "Human vs Computer".
- Selecting "Human vs Computer" shows a configuration panel with:
  - Color picker: "Play as White" / "Play as Black".
  - Difficulty selector with three options: Easy / Medium / Hard.
  - A "Start Game" button that starts the game with the chosen settings.
- When it is the computer's turn the board shows a loading indicator (spinner or "Computer is thinking..." text) and piece dragging is disabled.
- After Stockfish returns a move, it is applied to the board automatically within 10 seconds on any difficulty setting.
- If the human plays as Black, Stockfish makes the first move immediately after "Start Game" is clicked.
- The computer never makes an illegal move (chess.js validates before applying).
- "New Game" returns the player to the mode-selection screen.
- Vitest tests pass for `useChessGame` integration with a mocked Stockfish hook:
  - After a human move, `getBestMove` is called exactly once with the updated FEN.
  - The board FEN changes again after the mocked Stockfish response is applied.
  - While the computer is thinking, `isComputerThinking` is `true`.

**Dependencies:** Features 2 and 3.

---

## Feature 5 — Polish, Responsive Layout, and Pawn Promotion Dialog

**Slug:** `polish-and-ux`

**Description:** Finalize the UI to a clean, responsive layout that works on both desktop and mobile viewports. Add a pawn promotion dialog so players can choose their promotion piece, improve visual feedback (last-move highlight, captured pieces list), and ensure the app is production-build-ready.

**Acceptance criteria:**
- The board scales correctly on viewport widths from 320px to 1920px — the board is never wider than the viewport and never smaller than 280px.
- On mobile (< 768px), the `GameControls` panel stacks below the board rather than beside it.
- When a pawn reaches the back rank in Human vs Human mode, a promotion dialog appears offering Queen, Rook, Bishop, and Knight; selecting one completes the move with that piece.
- In Human vs Computer mode, pawn promotion always auto-promotes to a Queen (no dialog shown).
- The last move is visually highlighted on the board (using `react-chessboard`'s `customSquareStyles` prop).
- A captured-pieces tray displays the pieces each side has captured, ordered by value.
- `npm run build` produces a `dist/` with no TypeScript errors and no ESLint warnings.
- Lighthouse accessibility score is 80 or higher on the production build (run via `npx lighthouse` or browser DevTools).
- All existing Vitest tests continue to pass.

**Dependencies:** Features 2, 3, and 4.

---

## Implementation Order

| # | Feature | Slug | Depends On |
|---|---------|------|-----------|
| 1 | Scaffold, Types, and Contracts | `scaffold-and-contracts` | — |
| 2 | Chessboard UI and Human vs Human Game | `human-vs-human` | 1 |
| 3 | Stockfish.js WASM Integration | `stockfish-integration` | 1 |
| 4 | Human vs Computer Mode | `human-vs-computer` | 2, 3 |
| 5 | Polish, Responsive Layout, and Pawn Promotion Dialog | `polish-and-ux` | 2, 3, 4 |

Features 2 and 3 may be developed in parallel after Feature 1 is merged.

---

## Key Constraints and Decisions

- **No backend.** Everything runs client-side. Stockfish WASM runs in a Web Worker.
- **No user accounts or game persistence.** Refreshing the page starts a new game.
- **Pawn promotion defaults to Queen** in Human vs Computer mode to simplify AI move handling.
- **Stockfish depth caps at 18** for Hard difficulty to avoid browser timeouts.
- **`src/types.ts` is the contracts file.** Implementers must not add types elsewhere for concepts already defined there.
- **Worker format is `'es'`** in Vite config — required for Stockfish WASM to load correctly.
