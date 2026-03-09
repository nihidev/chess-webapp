import { Chess } from 'chess.js'
import { GameStatus, PlayerColor } from '../types'

interface StatusBarProps {
  fen: string
  status: GameStatus
  isComputerThinking: boolean
}

export function StatusBar({ fen, status, isComputerThinking }: StatusBarProps) {
  const chess = new Chess(fen)
  const turn = chess.turn() === 'w' ? PlayerColor.White : PlayerColor.Black

  let message: string
  let messageClass = 'status-message'

  switch (status) {
    case GameStatus.Checkmate:
      message = `${turn === PlayerColor.White ? 'Black' : 'White'} wins!`
      messageClass += ' status-message--checkmate'
      break
    case GameStatus.Stalemate:
      message = 'Stalemate — Draw'
      messageClass += ' status-message--draw'
      break
    case GameStatus.Draw:
      message = 'Draw'
      messageClass += ' status-message--draw'
      break
    case GameStatus.Check:
      message = `${turn}'s turn — Check!`
      messageClass += ' status-message--check'
      break
    default:
      message = `${turn}'s turn`
  }

  return (
    <div className="status-panel">
      <span className="status-section-label">Game Status</span>
      <p className={messageClass} aria-live="polite">{message}</p>
      {isComputerThinking && (
        <div className="thinking-row">
          <span className="thinking-dot" />
          Computer is thinking…
        </div>
      )}
    </div>
  )
}
