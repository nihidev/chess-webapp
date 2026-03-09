import { useCallback, useEffect, useRef, useState } from 'react'
import { Chess } from 'chess.js'
import { GameMode, GameStatus, PlayerColor, type GameConfig, type MoveResult, type StockfishRequest, type StockfishResponse } from '../types'
import { DEPTH_MAP } from './useStockfish'

function deriveStatus(chess: Chess): GameStatus {
  if (chess.isCheckmate()) return GameStatus.Checkmate
  if (chess.isStalemate()) return GameStatus.Stalemate
  if (chess.isDraw()) return GameStatus.Draw
  if (chess.isCheck()) return GameStatus.Check
  return GameStatus.Playing
}

function isGameFinished(status: GameStatus): boolean {
  return (
    status === GameStatus.Checkmate ||
    status === GameStatus.Draw ||
    status === GameStatus.Stalemate
  )
}

export interface UseChessGameOptions {
  config?: GameConfig
  getBestMove?: (req: StockfishRequest) => Promise<StockfishResponse>
}

export interface UseChessGameReturn {
  fen: string
  status: GameStatus
  isComputerThinking: boolean
  makeMove: (from: string, to: string) => MoveResult | null
  resetGame: () => void
}

export function useChessGame(options: UseChessGameOptions = {}): UseChessGameReturn {
  const { config, getBestMove } = options
  const isHvC = config?.mode === GameMode.HumanVsComputer
  const humanColor = config?.playerColor ?? PlayerColor.White

  const chessRef = useRef(new Chess())
  // Keep refs in sync each render to avoid stale closures in async callbacks
  const getBestMoveRef = useRef(getBestMove)
  const configRef = useRef(config)
  getBestMoveRef.current = getBestMove
  configRef.current = config

  const [fen, setFen] = useState<string>(chessRef.current.fen())
  const [status, setStatus] = useState<GameStatus>(GameStatus.Playing)
  const [isComputerThinking, setIsComputerThinking] = useState(false)

  const runComputerMove = useCallback(async (chess: Chess): Promise<void> => {
    const fn = getBestMoveRef.current
    const cfg = configRef.current
    if (!fn || !cfg) return

    setIsComputerThinking(true)
    try {
      const depth = DEPTH_MAP[cfg.difficulty]
      const { bestMove } = await fn({ fen: chess.fen(), depth })
      if (bestMove && bestMove !== '(none)') {
        const from = bestMove.slice(0, 2)
        const to = bestMove.slice(2, 4)
        try {
          chess.move({ from, to, promotion: 'q' })
          setFen(chess.fen())
          setStatus(deriveStatus(chess))
        } catch {
          // Engine returned an illegal move — ignore
        }
      }
    } finally {
      setIsComputerThinking(false)
    }
  }, [])

  // If human plays Black, computer makes the first move
  const initialMoveTriggered = useRef(false)
  useEffect(() => {
    if (initialMoveTriggered.current) return
    if (!isHvC || humanColor !== PlayerColor.Black || !getBestMove) return
    initialMoveTriggered.current = true
    void runComputerMove(chessRef.current)
  }, [isHvC, humanColor, getBestMove, runComputerMove])

  const makeMove = useCallback(
    (from: string, to: string): MoveResult | null => {
      const chess = chessRef.current
      // In HvC mode, reject moves when it is not the human's turn
      if (isHvC) {
        const currentTurn = chess.turn() === 'w' ? PlayerColor.White : PlayerColor.Black
        if (currentTurn !== humanColor) return null
      }
      try {
        const move = chess.move({ from, to, promotion: 'q' })
        const capturedPiece = move.captured ?? null
        const newStatus = deriveStatus(chess)
        const result: MoveResult = {
          fen: chess.fen(),
          pgn: chess.pgn(),
          status: newStatus,
          capturedPiece,
        }
        setFen(chess.fen())
        setStatus(newStatus)
        if (isHvC && !isGameFinished(newStatus)) {
          void runComputerMove(chess)
        }
        return result
      } catch {
        return null
      }
    },
    [isHvC, humanColor, runComputerMove],
  )

  const resetGame = useCallback(() => {
    chessRef.current = new Chess()
    initialMoveTriggered.current = false
    setFen(chessRef.current.fen())
    setStatus(GameStatus.Playing)
    setIsComputerThinking(false)
  }, [])

  return { fen, status, isComputerThinking, makeMove, resetGame }
}
