import { useCallback, useEffect, useRef } from 'react'
import { Difficulty, GameMode, type StockfishRequest, type StockfishResponse } from '../types'

export const DEPTH_MAP: Record<Difficulty, number> = {
  [Difficulty.Easy]: 1,
  [Difficulty.Medium]: 8,
  [Difficulty.Hard]: 18,
}

export interface UseStockfishReturn {
  getBestMove: (request: StockfishRequest) => Promise<StockfishResponse>
}

export function useStockfish(mode: GameMode): UseStockfishReturn {
  const workerRef = useRef<Worker | null>(null)

  useEffect(() => {
    if (mode !== GameMode.HumanVsComputer) return

    const worker = new Worker('/stockfish-worker.js')
    workerRef.current = worker

    return () => {
      worker.terminate()
      workerRef.current = null
    }
  }, [mode])

  const getBestMove = useCallback(
    ({ fen, depth }: StockfishRequest): Promise<StockfishResponse> => {
      return new Promise<StockfishResponse>((resolve) => {
        const worker = workerRef.current
        if (!worker) {
          resolve({ bestMove: '' })
          return
        }

        const handler = (e: MessageEvent<string>) => {
          if (e.data.startsWith('bestmove')) {
            worker.removeEventListener('message', handler)
            const parts = e.data.split(' ')
            resolve({ bestMove: parts[1] ?? '' })
          }
        }

        worker.addEventListener('message', handler)
        worker.postMessage(`position fen ${fen}`)
        worker.postMessage(`go depth ${depth.toString()}`)
      })
    },
    [],
  )

  return { getBestMove }
}
