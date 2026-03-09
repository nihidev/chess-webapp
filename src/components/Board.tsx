import { useState } from 'react'
import { Chessboard } from 'react-chessboard'
import type { Square } from 'chess.js'
import type { UseChessGameReturn } from '../hooks/useChessGame'
import { GameStatus } from '../types'

interface BoardProps {
  game: UseChessGameReturn
}

export function Board({ game }: BoardProps) {
  const { fen, status, makeMove } = game
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null)

  const isGameOver =
    status === GameStatus.Checkmate ||
    status === GameStatus.Draw ||
    status === GameStatus.Stalemate

  function onPieceDrop(sourceSquare: Square, targetSquare: Square): boolean {
    const result = makeMove(sourceSquare, targetSquare)
    setSelectedSquare(null)
    return result !== null
  }

  function onSquareClick(square: Square) {
    if (isGameOver) return

    if (selectedSquare) {
      const result = makeMove(selectedSquare, square)
      setSelectedSquare(null)
      if (!result) {
        setSelectedSquare(square)
      }
    } else {
      setSelectedSquare(square)
    }
  }

  return (
    <div style={{ width: 'min(560px, 90vw)' }}>
      <Chessboard
        position={fen}
        onPieceDrop={onPieceDrop}
        onSquareClick={onSquareClick}
        arePiecesDraggable={!isGameOver}
        customSquareStyles={
          selectedSquare
            ? { [selectedSquare]: { backgroundColor: 'rgba(255, 255, 0, 0.4)' } }
            : {}
        }
      />
    </div>
  )
}
