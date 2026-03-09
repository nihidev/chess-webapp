import { describe, it, expect, vi, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useStockfish, DEPTH_MAP } from '../hooks/useStockfish'
import { Difficulty, GameMode } from '../types'

function makeMockWorker() {
  return {
    postMessage: vi.fn<(msg: string) => void>(),
    terminate: vi.fn<() => void>(),
    addEventListener: vi.fn<(type: string, handler: EventListenerOrEventListenerObject) => void>(),
    removeEventListener: vi.fn<(type: string, handler: EventListenerOrEventListenerObject) => void>(),
  }
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('useStockfish', () => {
  it('does not create a Worker when mode is HumanVsHuman', () => {
    const MockWorker = vi.fn()
    vi.stubGlobal('Worker', MockWorker)

    renderHook(() => useStockfish(GameMode.HumanVsHuman))

    expect(MockWorker).not.toHaveBeenCalled()
  })

  it('calls terminate() when component unmounts', () => {
    const mockWorker = makeMockWorker()
    vi.stubGlobal('Worker', vi.fn(() => mockWorker))

    const { unmount } = renderHook(() => useStockfish(GameMode.HumanVsComputer))
    unmount()

    expect(mockWorker.terminate).toHaveBeenCalledOnce()
  })

  it('maps Difficulty.Easy to depth 1', () => {
    expect(DEPTH_MAP[Difficulty.Easy]).toBe(1)
  })

  it('maps Difficulty.Medium to depth 8', () => {
    expect(DEPTH_MAP[Difficulty.Medium]).toBe(8)
  })

  it('maps Difficulty.Hard to depth 18', () => {
    expect(DEPTH_MAP[Difficulty.Hard]).toBe(18)
  })

  it('sends position and go commands to worker when getBestMove is called', async () => {
    const mockWorker = makeMockWorker()
    // Simulate engine responding with bestmove
    mockWorker.addEventListener.mockImplementation(
      (event: string, handler: EventListenerOrEventListenerObject) => {
        if (event === 'message' && typeof handler === 'function') {
          setTimeout(() => {
            handler(new MessageEvent('message', { data: 'bestmove e2e4 ponder e7e5' }))
          }, 0)
        }
      },
    )
    vi.stubGlobal('Worker', vi.fn(() => mockWorker))

    const { result } = renderHook(() => useStockfish(GameMode.HumanVsComputer))
    const response = await result.current.getBestMove({
      fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      depth: DEPTH_MAP[Difficulty.Easy],
    })

    expect(mockWorker.postMessage).toHaveBeenCalledWith(
      expect.stringContaining('position fen'),
    )
    expect(mockWorker.postMessage).toHaveBeenCalledWith('go depth 1')
    expect(response.bestMove).toBe('e2e4')
  })
})
