import { useCallback, useRef, useState } from 'react'
import { Chess } from 'chess.js'
import { GameStatus, type MoveResult } from '../types'

function deriveStatus(chess: Chess): GameStatus {
  if (chess.isCheckmate()) return GameStatus.Checkmate
  if (chess.isStalemate()) return GameStatus.Stalemate
  if (chess.isDraw()) return GameStatus.Draw
  if (chess.isCheck()) return GameStatus.Check
  return GameStatus.Playing
}

export interface UseChessGameReturn {
  fen: string
  status: GameStatus
  makeMove: (from: string, to: string) => MoveResult | null
  resetGame: () => void
}

export function useChessGame(): UseChessGameReturn {
  const chessRef = useRef(new Chess())
  const [fen, setFen] = useState<string>(chessRef.current.fen())
  const [status, setStatus] = useState<GameStatus>(GameStatus.Playing)

  const makeMove = useCallback((from: string, to: string): MoveResult | null => {
    const chess = chessRef.current
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
      return result
    } catch {
      return null
    }
  }, [])

  const resetGame = useCallback(() => {
    chessRef.current = new Chess()
    setFen(chessRef.current.fen())
    setStatus(GameStatus.Playing)
  }, [])

  return { fen, status, makeMove, resetGame }
}
