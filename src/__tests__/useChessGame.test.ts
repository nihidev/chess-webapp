import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { Chess } from 'chess.js'
import { useChessGame } from '../hooks/useChessGame'
import { GameStatus, type MoveResult } from '../types'

const STARTING_FEN = new Chess().fen()

// Scholar's mate: 1.e4 e5 2.Qh5 Nc6 3.Bc4 Nf6?? 4.Qxf7#
const SCHOLARS_MATE_MOVES: [string, string][] = [
  ['e2', 'e4'],
  ['e7', 'e5'],
  ['d1', 'h5'],
  ['b8', 'c6'],
  ['f1', 'c4'],
  ['g8', 'f6'],
  ['h5', 'f7'],
]

describe('useChessGame', () => {
  it('starts at the standard starting position', () => {
    const { result } = renderHook(() => useChessGame())
    expect(result.current.fen).toBe(STARTING_FEN)
  })

  it('returns a MoveResult with updated FEN and Playing status for a valid move', () => {
    const { result } = renderHook(() => useChessGame())
    const results: (MoveResult | null)[] = []

    act(() => {
      results.push(result.current.makeMove('e2', 'e4'))
    })

    const moveResult = results[0]
    expect(moveResult).not.toBeNull()
    expect(moveResult?.fen).not.toBe(STARTING_FEN)
    expect(moveResult?.status).toBe(GameStatus.Playing)
  })

  it('returns null and does not change FEN for an invalid move', () => {
    const { result } = renderHook(() => useChessGame())
    const results: (MoveResult | null)[] = []

    act(() => {
      results.push(result.current.makeMove('e2', 'e5'))
    })

    expect(results[0]).toBeNull()
    expect(result.current.fen).toBe(STARTING_FEN)
  })

  it('detects checkmate and returns GameStatus.Checkmate', () => {
    const { result } = renderHook(() => useChessGame())
    const results: (MoveResult | null)[] = []

    act(() => {
      for (const [from, to] of SCHOLARS_MATE_MOVES) {
        results.push(result.current.makeMove(from, to))
      }
    })

    const lastResult = results[results.length - 1]
    expect(lastResult).not.toBeNull()
    expect(lastResult?.status).toBe(GameStatus.Checkmate)
    expect(result.current.status).toBe(GameStatus.Checkmate)
  })

  it('resets to starting position after resetGame', () => {
    const { result } = renderHook(() => useChessGame())

    act(() => {
      result.current.makeMove('e2', 'e4')
    })

    expect(result.current.fen).not.toBe(STARTING_FEN)

    act(() => {
      result.current.resetGame()
    })

    expect(result.current.fen).toBe(STARTING_FEN)
    expect(result.current.status).toBe(GameStatus.Playing)
  })
})
