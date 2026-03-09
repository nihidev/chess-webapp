import { useCallback, useEffect, useRef, useState } from 'react'
import { Chess } from 'chess.js'
import {
  GameMode,
  GameStatus,
  PlayerColor,
  type GameConfig,
  type MoveResult,
  type PromotionPiece,
  type StockfishRequest,
  type StockfishResponse,
} from '../types'
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

/** Returns true when moving a pawn to its back rank (promotion required). */
function isPawnPromotion(chess: Chess, from: string, to: string): boolean {
  const piece = chess.get(from as Parameters<Chess['get']>[0])
  if (!piece || piece.type !== 'p') return false
  const toRank = to[1]
  return (piece.color === 'w' && toRank === '8') || (piece.color === 'b' && toRank === '1')
}

export interface UseChessGameOptions {
  config?: GameConfig
  getBestMove?: (req: StockfishRequest) => Promise<StockfishResponse>
}

export interface PendingPromotion {
  from: string
  to: string
}

export interface LastMove {
  from: string
  to: string
}

export interface MoveHistoryEntry {
  san: string
  color: 'w' | 'b'
}

export interface UseChessGameReturn {
  fen: string
  status: GameStatus
  isComputerThinking: boolean
  makeMove: (from: string, to: string, promotion?: PromotionPiece) => MoveResult | null
  resetGame: () => void
  pendingPromotion: PendingPromotion | null
  confirmPromotion: (piece: PromotionPiece) => MoveResult | null
  lastMove: LastMove | null
  capturedByWhite: string[]
  capturedByBlack: string[]
  moveHistory: MoveHistoryEntry[]
}

export function useChessGame(options: UseChessGameOptions = {}): UseChessGameReturn {
  /** Manages chess game state, computer moves, and pawn promotion. */
  const { config, getBestMove } = options
  const isHvC = config?.mode === GameMode.HumanVsComputer
  const humanColor = config?.playerColor ?? PlayerColor.White

  const chessRef = useRef(new Chess())
  const getBestMoveRef = useRef(getBestMove)
  const configRef = useRef(config)
  getBestMoveRef.current = getBestMove
  configRef.current = config

  const [fen, setFen] = useState<string>(chessRef.current.fen())
  const [status, setStatus] = useState<GameStatus>(GameStatus.Playing)
  const [isComputerThinking, setIsComputerThinking] = useState(false)
  const [pendingPromotion, setPendingPromotion] = useState<PendingPromotion | null>(null)
  const [lastMove, setLastMove] = useState<LastMove | null>(null)
  const [capturedByWhite, setCapturedByWhite] = useState<string[]>([])
  const [capturedByBlack, setCapturedByBlack] = useState<string[]>([])
  const [moveHistory, setMoveHistory] = useState<MoveHistoryEntry[]>([])

  /** Updates captured pieces state after a move is applied. */
  function recordCapture(capturedPiece: string | null, movingColor: 'w' | 'b'): void {
    if (!capturedPiece) return
    if (movingColor === 'w') {
      setCapturedByWhite((prev) => [...prev, capturedPiece])
    } else {
      setCapturedByBlack((prev) => [...prev, capturedPiece])
    }
  }

  /** Applies a validated move object and updates all derived state. */
  function applyChessMove(
    chess: Chess,
    from: string,
    to: string,
    promotion: PromotionPiece,
  ): MoveResult | null {
    try {
      const movingColor = chess.turn()
      const move = chess.move({ from, to, promotion })
      const capturedPiece = move.captured ?? null
      const newStatus = deriveStatus(chess)
      setFen(chess.fen())
      setStatus(newStatus)
      setLastMove({ from, to })
      recordCapture(capturedPiece, movingColor)
      setMoveHistory((prev) => [...prev, { san: move.san, color: move.color }])
      return { fen: chess.fen(), pgn: chess.pgn(), status: newStatus, capturedPiece }
    } catch {
      return null
    }
  }

  const runComputerMove = useCallback(async (chess: Chess): Promise<void> => {
    /** Calls getBestMove and applies the engine's response. */
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
        const promotionChar = bestMove.length === 5 ? (bestMove[4] as PromotionPiece) : 'q'
        const movingColor = chess.turn()
        try {
          const move = chess.move({ from, to, promotion: promotionChar })
          const capturedPiece = move.captured ?? null
          setFen(chess.fen())
          setStatus(deriveStatus(chess))
          setLastMove({ from, to })
          recordCapture(capturedPiece, movingColor)
          setMoveHistory((prev) => [...prev, { san: move.san, color: move.color }])
        } catch {
          // Engine returned an illegal move — ignore
        }
      }
    } finally {
      setIsComputerThinking(false)
    }
  }, [])

  const initialMoveTriggered = useRef(false)
  useEffect(() => {
    if (initialMoveTriggered.current) return
    if (!isHvC || humanColor !== PlayerColor.Black || !getBestMove) return
    initialMoveTriggered.current = true
    void runComputerMove(chessRef.current)
  }, [isHvC, humanColor, getBestMove, runComputerMove])

  const makeMove = useCallback(
    (from: string, to: string, promotion?: PromotionPiece): MoveResult | null => {
      /** Validates and applies a move; sets pendingPromotion if promotion piece is needed in HvH. */
      const chess = chessRef.current
      if (isHvC) {
        const currentTurn = chess.turn() === 'w' ? PlayerColor.White : PlayerColor.Black
        if (currentTurn !== humanColor) return null
      }

      // In HvH mode, if the move is a pawn promotion and no piece is specified, pend dialog
      if (!isHvC && !promotion && isPawnPromotion(chess, from, to)) {
        // Validate the move is otherwise legal before showing dialog
        const testChess = new Chess(chess.fen())
        try {
          testChess.move({ from, to, promotion: 'q' })
        } catch {
          return null
        }
        setPendingPromotion({ from, to })
        return null
      }

      const chosenPromotion: PromotionPiece = promotion ?? 'q'
      const result = applyChessMove(chess, from, to, chosenPromotion)
      if (result && isHvC && !isGameFinished(result.status)) {
        void runComputerMove(chess)
      }
      return result
    },
    [isHvC, humanColor, runComputerMove],
  )

  const confirmPromotion = useCallback(
    (piece: PromotionPiece): MoveResult | null => {
      /** Completes a pending pawn promotion with the chosen piece. */
      if (!pendingPromotion) return null
      const chess = chessRef.current
      const { from, to } = pendingPromotion
      setPendingPromotion(null)
      return applyChessMove(chess, from, to, piece)
    },
    [pendingPromotion],
  )

  const resetGame = useCallback(() => {
    /** Resets the board to the starting position and clears all state. */
    chessRef.current = new Chess()
    initialMoveTriggered.current = false
    setFen(chessRef.current.fen())
    setStatus(GameStatus.Playing)
    setIsComputerThinking(false)
    setPendingPromotion(null)
    setLastMove(null)
    setCapturedByWhite([])
    setCapturedByBlack([])
    setMoveHistory([])
  }, [])

  return {
    fen,
    status,
    isComputerThinking,
    makeMove,
    resetGame,
    pendingPromotion,
    confirmPromotion,
    lastMove,
    capturedByWhite,
    capturedByBlack,
    moveHistory,
  }
}
