import { describe, it, expect, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { Chess } from 'chess.js'
import { useChessGame } from '../hooks/useChessGame'
import { Difficulty, GameMode, GameStatus, PlayerColor, type StockfishResponse } from '../types'

const STARTING_FEN = new Chess().fen()

const HVC_WHITE_CONFIG = {
  mode: GameMode.HumanVsComputer,
  playerColor: PlayerColor.White,
  difficulty: Difficulty.Easy,
}

const HVC_BLACK_CONFIG = {
  mode: GameMode.HumanVsComputer,
  playerColor: PlayerColor.Black,
  difficulty: Difficulty.Easy,
}

describe('useChessGame — HvC integration', () => {
  it('calls getBestMove exactly once after a human move with the updated FEN', async () => {
    const mockGetBestMove = vi.fn<(req: { fen: string; depth: number }) => Promise<StockfishResponse>>()
      .mockResolvedValue({ bestMove: 'e7e5' })

    const { result } = renderHook(() =>
      useChessGame({ config: HVC_WHITE_CONFIG, getBestMove: mockGetBestMove }),
    )

    act(() => { result.current.makeMove('e2', 'e4') })

    await waitFor(() => { expect(mockGetBestMove).toHaveBeenCalledOnce() })

    const calledFen = mockGetBestMove.mock.calls[0]?.[0].fen
    expect(calledFen).not.toBe(STARTING_FEN)
  })

  it('applies the computer move after getBestMove resolves', async () => {
    const mockGetBestMove = vi.fn<(req: { fen: string; depth: number }) => Promise<StockfishResponse>>()
      .mockResolvedValue({ bestMove: 'e7e5' })

    const { result } = renderHook(() =>
      useChessGame({ config: HVC_WHITE_CONFIG, getBestMove: mockGetBestMove }),
    )

    const fenAfterHuman: string[] = []
    act(() => { result.current.makeMove('e2', 'e4') })

    // Capture FEN after human move before computer responds
    fenAfterHuman.push(result.current.fen)

    await waitFor(() => {
      // FEN should change again after computer applies e7e5
      expect(result.current.fen).not.toBe(STARTING_FEN)
      expect(result.current.fen).not.toBe(fenAfterHuman[0])
    })

    // After e4 (white) and e5 (black), it should be White's turn again
    expect(result.current.fen).toContain(' w ')
  })

  it('sets isComputerThinking to true while awaiting getBestMove', async () => {
    let resolveMove!: (value: StockfishResponse) => void
    const mockGetBestMove = vi.fn<(req: { fen: string; depth: number }) => Promise<StockfishResponse>>()
      .mockReturnValue(new Promise<StockfishResponse>((resolve) => { resolveMove = resolve }))

    const { result } = renderHook(() =>
      useChessGame({ config: HVC_WHITE_CONFIG, getBestMove: mockGetBestMove }),
    )

    act(() => { result.current.makeMove('e2', 'e4') })

    expect(result.current.isComputerThinking).toBe(true)

    act(() => { resolveMove({ bestMove: 'e7e5' }) })

    await waitFor(() => { expect(result.current.isComputerThinking).toBe(false) })
  })

  it('triggers computer first move when human plays as Black', async () => {
    const mockGetBestMove = vi.fn<(req: { fen: string; depth: number }) => Promise<StockfishResponse>>()
      .mockResolvedValue({ bestMove: 'e2e4' })

    const { result } = renderHook(() =>
      useChessGame({ config: HVC_BLACK_CONFIG, getBestMove: mockGetBestMove }),
    )

    await waitFor(() => { expect(mockGetBestMove).toHaveBeenCalledOnce() })
    // FEN should differ from starting after computer's first move
    await waitFor(() => { expect(result.current.fen).not.toBe(STARTING_FEN) })
  })

  it('returns GameStatus.Checkmate when computer delivers mate', async () => {
    // Fool's mate: 1.f3 e5 2.g4 Qh4#
    const moves: [string, string][] = [['f2', 'f3'], ['g2', 'g4']]
    // Computer responses: e7e5, then Qd8h4
    const mockGetBestMove = vi.fn<(req: { fen: string; depth: number }) => Promise<StockfishResponse>>()
      .mockResolvedValueOnce({ bestMove: 'e7e5' })
      .mockResolvedValueOnce({ bestMove: 'd8h4' })

    const { result } = renderHook(() =>
      useChessGame({ config: HVC_WHITE_CONFIG, getBestMove: mockGetBestMove }),
    )

    for (const [from, to] of moves) {
      act(() => { result.current.makeMove(from, to) })
      await waitFor(() => { expect(result.current.isComputerThinking).toBe(false) })
    }

    expect(result.current.status).toBe(GameStatus.Checkmate)
  })
})
