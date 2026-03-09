import { describe, it, expect } from 'vitest'
import {
  GameMode,
  PlayerColor,
  Difficulty,
  GameStatus,
} from '../types'
import type {
  GameConfig,
  MoveResult,
  StockfishRequest,
  StockfishResponse,
} from '../types'

// ── GameMode enum ─────────────────────────────────────────────────────────────

describe('GameMode enum', () => {
  it('has HumanVsHuman value', () => {
    expect(GameMode.HumanVsHuman).toBeDefined()
    expect(GameMode.HumanVsHuman).toBe('HumanVsHuman')
  })

  it('has HumanVsComputer value', () => {
    expect(GameMode.HumanVsComputer).toBeDefined()
    expect(GameMode.HumanVsComputer).toBe('HumanVsComputer')
  })

  it('has exactly two values', () => {
    const values = Object.values(GameMode)
    expect(values).toHaveLength(2)
    expect(values).toContain('HumanVsHuman')
    expect(values).toContain('HumanVsComputer')
  })
})

// ── PlayerColor enum ──────────────────────────────────────────────────────────

describe('PlayerColor enum', () => {
  it('has White value', () => {
    expect(PlayerColor.White).toBeDefined()
    expect(PlayerColor.White).toBe('White')
  })

  it('has Black value', () => {
    expect(PlayerColor.Black).toBeDefined()
    expect(PlayerColor.Black).toBe('Black')
  })

  it('has exactly two values', () => {
    const values = Object.values(PlayerColor)
    expect(values).toHaveLength(2)
    expect(values).toContain('White')
    expect(values).toContain('Black')
  })
})

// ── Difficulty enum ───────────────────────────────────────────────────────────

describe('Difficulty enum', () => {
  it('has Easy value', () => {
    expect(Difficulty.Easy).toBeDefined()
    expect(Difficulty.Easy).toBe('Easy')
  })

  it('has Medium value', () => {
    expect(Difficulty.Medium).toBeDefined()
    expect(Difficulty.Medium).toBe('Medium')
  })

  it('has Hard value', () => {
    expect(Difficulty.Hard).toBeDefined()
    expect(Difficulty.Hard).toBe('Hard')
  })

  it('has exactly three values', () => {
    const values = Object.values(Difficulty)
    expect(values).toHaveLength(3)
    expect(values).toContain('Easy')
    expect(values).toContain('Medium')
    expect(values).toContain('Hard')
  })
})

// ── GameStatus enum ───────────────────────────────────────────────────────────

describe('GameStatus enum', () => {
  it('has Idle value', () => {
    expect(GameStatus.Idle).toBeDefined()
    expect(GameStatus.Idle).toBe('Idle')
  })

  it('has Playing value', () => {
    expect(GameStatus.Playing).toBeDefined()
    expect(GameStatus.Playing).toBe('Playing')
  })

  it('has Check value', () => {
    expect(GameStatus.Check).toBeDefined()
    expect(GameStatus.Check).toBe('Check')
  })

  it('has Checkmate value', () => {
    expect(GameStatus.Checkmate).toBeDefined()
    expect(GameStatus.Checkmate).toBe('Checkmate')
  })

  it('has Draw value', () => {
    expect(GameStatus.Draw).toBeDefined()
    expect(GameStatus.Draw).toBe('Draw')
  })

  it('has Stalemate value', () => {
    expect(GameStatus.Stalemate).toBeDefined()
    expect(GameStatus.Stalemate).toBe('Stalemate')
  })

  it('has exactly six values', () => {
    const values = Object.values(GameStatus)
    expect(values).toHaveLength(6)
    expect(values).toContain('Idle')
    expect(values).toContain('Playing')
    expect(values).toContain('Check')
    expect(values).toContain('Checkmate')
    expect(values).toContain('Draw')
    expect(values).toContain('Stalemate')
  })
})

// ── GameConfig interface ──────────────────────────────────────────────────────

describe('GameConfig interface', () => {
  it('can be constructed with valid enum values', () => {
    const config: GameConfig = {
      mode: GameMode.HumanVsHuman,
      playerColor: PlayerColor.White,
      difficulty: Difficulty.Medium,
    }
    expect(config.mode).toBe(GameMode.HumanVsHuman)
    expect(config.playerColor).toBe(PlayerColor.White)
    expect(config.difficulty).toBe(Difficulty.Medium)
  })

  it('can be constructed for HumanVsComputer with Hard difficulty', () => {
    const config: GameConfig = {
      mode: GameMode.HumanVsComputer,
      playerColor: PlayerColor.Black,
      difficulty: Difficulty.Hard,
    }
    expect(config.mode).toBe(GameMode.HumanVsComputer)
    expect(config.playerColor).toBe(PlayerColor.Black)
    expect(config.difficulty).toBe(Difficulty.Hard)
  })

  it('can be constructed with Easy difficulty', () => {
    const config: GameConfig = {
      mode: GameMode.HumanVsComputer,
      playerColor: PlayerColor.White,
      difficulty: Difficulty.Easy,
    }
    expect(config.difficulty).toBe(Difficulty.Easy)
  })
})

// ── MoveResult interface ──────────────────────────────────────────────────────

describe('MoveResult interface', () => {
  it('can be constructed with capturedPiece: null', () => {
    const result: MoveResult = {
      fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1',
      pgn: '1. e4',
      status: GameStatus.Playing,
      capturedPiece: null,
    }
    expect(result.fen).toBe('rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1')
    expect(result.pgn).toBe('1. e4')
    expect(result.status).toBe(GameStatus.Playing)
    expect(result.capturedPiece).toBeNull()
  })

  it('can be constructed with a captured piece string', () => {
    const result: MoveResult = {
      fen: 'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
      pgn: '1. e4 d5 2. exd5',
      status: GameStatus.Playing,
      capturedPiece: 'p',
    }
    expect(result.capturedPiece).toBe('p')
  })

  it('reflects GameStatus.Checkmate when game ends', () => {
    const result: MoveResult = {
      fen: 'rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 1 3',
      pgn: '1. f3 e5 2. g4 Qh4#',
      status: GameStatus.Checkmate,
      capturedPiece: null,
    }
    expect(result.status).toBe(GameStatus.Checkmate)
  })
})

// ── StockfishRequest interface ────────────────────────────────────────────────

describe('StockfishRequest interface', () => {
  it('can be constructed with fen and depth', () => {
    const request: StockfishRequest = {
      fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      depth: 5,
    }
    expect(request.fen).toBe('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
    expect(request.depth).toBe(5)
  })

  it('supports depth values for each Difficulty level', () => {
    const easyRequest: StockfishRequest = { fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', depth: 1 }
    const mediumRequest: StockfishRequest = { fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', depth: 8 }
    const hardRequest: StockfishRequest = { fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', depth: 18 }

    expect(easyRequest.depth).toBe(1)
    expect(mediumRequest.depth).toBe(8)
    expect(hardRequest.depth).toBe(18)
  })

  it('accepts a non-starting-position fen', () => {
    const request: StockfishRequest = {
      fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
      depth: 10,
    }
    expect(request.fen).toContain('KQkq')
    expect(request.depth).toBeGreaterThan(0)
  })
})

// ── StockfishResponse interface ───────────────────────────────────────────────

describe('StockfishResponse interface', () => {
  it('can be constructed with a UCI move string', () => {
    const response: StockfishResponse = {
      bestMove: 'e2e4',
    }
    expect(response.bestMove).toBe('e2e4')
  })

  it('accepts various valid UCI move formats', () => {
    const responses: StockfishResponse[] = [
      { bestMove: 'e2e4' },
      { bestMove: 'd2d4' },
      { bestMove: 'g1f3' },
      { bestMove: 'e7e8q' },
    ]
    expect(responses[0].bestMove).toBe('e2e4')
    expect(responses[1].bestMove).toBe('d2d4')
    expect(responses[2].bestMove).toBe('g1f3')
    expect(responses[3].bestMove).toBe('e7e8q')
  })

  it('bestMove is a non-empty string', () => {
    const response: StockfishResponse = { bestMove: 'a1a8' }
    expect(typeof response.bestMove).toBe('string')
    expect(response.bestMove.length).toBeGreaterThan(0)
  })
})
