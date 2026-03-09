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

const LAST_MOVE_STYLE: React.CSSProperties = {
  backgroundColor: 'rgba(255, 220, 50, 0.5)',
}

const SELECTED_STYLE: React.CSSProperties = {
  backgroundColor: 'rgba(255, 255, 0, 0.4)',
}

const PROMOTION_PIECES: { piece: PromotionPiece; label: string; unicode: string }[] = [
  { piece: 'q', label: 'Queen', unicode: '♛' },
  { piece: 'r', label: 'Rook', unicode: '♜' },
  { piece: 'b', label: 'Bishop', unicode: '♝' },
  { piece: 'n', label: 'Knight', unicode: '♞' },
]

export function Board({ game, boardWidth, lastMove, pendingPromotion, onPromotionSelect }: BoardProps) {
  /** Renders chessboard with move handling, highlight, and promotion dialog. */
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
      styles[lastMove.to] = LAST_MOVE_STYLE
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
      if (result === null) {
        // Could be a pawn promotion pending (result null but move was legal) or illegal move
        setSelectedSquare(square)
      }
    } else {
      setSelectedSquare(square)
    }
  }

  return (
    <div style={{ position: 'relative', width: boardWidth }}>
      <Chessboard
        position={fen}
        boardWidth={boardWidth}
        onPieceDrop={onPieceDrop}
        onSquareClick={onSquareClick}
        arePiecesDraggable={!isDraggingDisabled}
        customSquareStyles={buildCustomSquareStyles()}
      />
      {pendingPromotion && (
        <div
          role="dialog"
          aria-label="Choose promotion piece"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            zIndex: 10,
          }}
        >
          <p
            style={{
              color: '#fff',
              fontWeight: 700,
              fontSize: '1rem',
              margin: 0,
            }}
          >
            Promote pawn to:
          </p>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {PROMOTION_PIECES.map(({ piece, label, unicode }) => (
              <button
                key={piece}
                type="button"
                aria-label={label}
                onClick={() => {
                  onPromotionSelect(piece)
                }}
                style={{
                  fontSize: '2.5rem',
                  background: '#fff',
                  border: '2px solid #333',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  width: '3.5rem',
                  height: '3.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  lineHeight: 1,
                }}
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
