/** Interactive chessboard with last-move highlight and pawn promotion dialog. */
import { useState } from 'react'
import { Chessboard } from 'react-chessboard'
import type { Square } from 'chess.js'
import type { UseChessGameReturn, PendingPromotion, LastMove } from '../hooks/useChessGame'
import { GameStatus, type PromotionPiece } from '../types'

interface BoardProps {
  game: UseChessGameReturn
  boardWidth: number
  lastMove: LastMove | null
  pendingPromotion: PendingPromotion | null
  onPromotionSelect: (piece: PromotionPiece) => void
}

const LAST_MOVE_STYLE: React.CSSProperties = { backgroundColor: 'rgba(246, 246, 105, 0.45)' }
const SELECTED_STYLE:  React.CSSProperties = { backgroundColor: 'rgba(246, 246, 105, 0.65)' }

const PROMOTION_PIECES: { piece: PromotionPiece; label: string; unicode: string }[] = [
  { piece: 'q', label: 'Queen',  unicode: '♛' },
  { piece: 'r', label: 'Rook',   unicode: '♜' },
  { piece: 'b', label: 'Bishop', unicode: '♝' },
  { piece: 'n', label: 'Knight', unicode: '♞' },
]

export function Board({ game, boardWidth, lastMove, pendingPromotion, onPromotionSelect }: BoardProps) {
  const { fen, status, makeMove } = game
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null)

  const isGameOver =
    status === GameStatus.Checkmate ||
    status === GameStatus.Draw ||
    status === GameStatus.Stalemate

  const isDraggingDisabled = isGameOver || game.isComputerThinking || pendingPromotion !== null

  function buildCustomSquareStyles(): Record<string, React.CSSProperties> {
    const styles: Record<string, React.CSSProperties> = {}
    if (lastMove) {
      styles[lastMove.from] = LAST_MOVE_STYLE
      styles[lastMove.to]   = LAST_MOVE_STYLE
    }
    if (selectedSquare) {
      styles[selectedSquare] = SELECTED_STYLE
    }
    return styles
  }

  function onPieceDrop(sourceSquare: Square, targetSquare: Square): boolean {
    const result = makeMove(sourceSquare, targetSquare)
    setSelectedSquare(null)
    return result !== null
  }

  function onSquareClick(square: Square) {
    if (isDraggingDisabled) return
    if (selectedSquare) {
      const result = makeMove(selectedSquare, square)
      setSelectedSquare(null)
      if (result === null) setSelectedSquare(square)
    } else {
      setSelectedSquare(square)
    }
  }

  return (
    <div className="board-wrapper" style={{ width: boardWidth }}>
      <Chessboard
        position={fen}
        boardWidth={boardWidth}
        onPieceDrop={onPieceDrop}
        onSquareClick={onSquareClick}
        arePiecesDraggable={!isDraggingDisabled}
        customSquareStyles={buildCustomSquareStyles()}
        customDarkSquareStyle={{ backgroundColor: '#769656' }}
        customLightSquareStyle={{ backgroundColor: '#eeeed2' }}
        customBoardStyle={{ borderRadius: '4px', boxShadow: '0 4px 24px rgba(0,0,0,0.5)' }}
      />
      {pendingPromotion && (
        <div role="dialog" aria-label="Choose promotion piece" className="promotion-overlay">
          <p className="promotion-title">Promote pawn to:</p>
          <div className="promotion-pieces">
            {PROMOTION_PIECES.map(({ piece, label, unicode }) => (
              <button
                key={piece}
                type="button"
                aria-label={label}
                className="promotion-btn"
                onClick={() => { onPromotionSelect(piece) }}
              >
                {unicode}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
