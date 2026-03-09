import { useEffect, useRef } from 'react'
import { Chess } from 'chess.js'
import { GameStatus, PlayerColor } from '../types'
import type { MoveHistoryEntry } from '../hooks/useChessGame'

interface StatusBarProps {
  fen: string
  status: GameStatus
  isComputerThinking: boolean
  moveHistory: MoveHistoryEntry[]
}

interface MovePair {
  num: number
  white: string
  black: string | null
}

function buildPairs(history: MoveHistoryEntry[]): MovePair[] {
  const pairs: MovePair[] = []
  for (let i = 0; i < history.length; i += 2) {
    pairs.push({
      num: Math.floor(i / 2) + 1,
      white: history[i]?.san ?? '',
      black: history[i + 1]?.san ?? null,
    })
  }
  return pairs
}

export function StatusBar({ fen, status, isComputerThinking, moveHistory }: StatusBarProps) {
  const chess = new Chess(fen)
  const turn = chess.turn() === 'w' ? PlayerColor.White : PlayerColor.Black
  const listRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when moves are added
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [moveHistory.length])

  let statusText: string
  let statusMod = ''
  switch (status) {
    case GameStatus.Checkmate:
      statusText = `${turn === PlayerColor.White ? 'Black' : 'White'} wins by checkmate`
      statusMod = 'status-message--checkmate'
      break
    case GameStatus.Stalemate:
      statusText = 'Draw — Stalemate'
      statusMod = 'status-message--draw'
      break
    case GameStatus.Draw:
      statusText = 'Draw'
      statusMod = 'status-message--draw'
      break
    case GameStatus.Check:
      statusText = `${turn}'s turn — Check!`
      statusMod = 'status-message--check'
      break
    default:
      statusText = `${turn}'s turn`
  }

  const pairs = buildPairs(moveHistory)
  const totalMoves = moveHistory.length
  // Index of the last move (0-based in the flat list)
  const lastMoveIdx = totalMoves - 1

  return (
    <div className="status-panel">
      {/* Current status */}
      <div className="status-header">
        <span className="status-section-label">Status</span>
        <p className={`status-message ${statusMod}`} aria-live="polite">
          {statusText}
        </p>
        {isComputerThinking && (
          <div className="thinking-row">
            <span className="thinking-dot" />
            Computer is thinking…
          </div>
        )}
      </div>

      <div className="divider" />

      {/* Move history */}
      <span className="status-section-label">
        Moves {totalMoves > 0 && <span className="move-count">{Math.ceil(totalMoves / 2)}</span>}
      </span>

      {totalMoves === 0 ? (
        <p className="moves-empty">No moves yet</p>
      ) : (
        <div className="move-list" ref={listRef}>
          {pairs.map(({ num, white, black }) => {
            const whiteIdx = (num - 1) * 2
            const blackIdx = whiteIdx + 1
            const whiteActive = whiteIdx === lastMoveIdx
            const blackActive = blackIdx === lastMoveIdx

            return (
              <div key={num} className={`move-pair${num % 2 === 0 ? ' move-pair--alt' : ''}`}>
                <span className="move-num">{num}.</span>
                <span className={`move-cell${whiteActive ? ' move-cell--active' : ''}`}>
                  {white}
                </span>
                {black !== null ? (
                  <span className={`move-cell${blackActive ? ' move-cell--active' : ''}`}>
                    {black}
                  </span>
                ) : (
                  <span className="move-cell move-cell--empty">…</span>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
