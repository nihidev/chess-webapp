/** Shared types, enums, and interfaces — single source of truth for all features. */

export enum GameMode {
  HumanVsHuman = 'HumanVsHuman',
  HumanVsComputer = 'HumanVsComputer',
}

export enum PlayerColor {
  White = 'White',
  Black = 'Black',
}

export enum Difficulty {
  Easy = 'Easy',
  Medium = 'Medium',
  Hard = 'Hard',
}

export enum GameStatus {
  Idle = 'Idle',
  Playing = 'Playing',
  Check = 'Check',
  Checkmate = 'Checkmate',
  Draw = 'Draw',
  Stalemate = 'Stalemate',
}

export interface GameConfig {
  mode: GameMode
  playerColor: PlayerColor
  difficulty: Difficulty
}

export interface MoveResult {
  fen: string
  pgn: string
  status: GameStatus
  capturedPiece: string | null
}

export interface StockfishRequest {
  fen: string
  depth: number
}

export interface StockfishResponse {
  bestMove: string
}
