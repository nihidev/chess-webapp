import { Chess } from 'chess.js'
import { GameStatus, PlayerColor } from '../types'

interface StatusBarProps {
  fen: string
  status: GameStatus
}

export function StatusBar({ fen, status }: StatusBarProps) {
  const chess = new Chess(fen)
  const turn = chess.turn() === 'w' ? PlayerColor.White : PlayerColor.Black

  let message: string
  switch (status) {
    case GameStatus.Checkmate:
      message = `Checkmate — ${turn === PlayerColor.White ? 'Black' : 'White'} wins!`
      break
    case GameStatus.Stalemate:
      message = 'Draw — Stalemate'
      break
    case GameStatus.Draw:
      message = 'Draw'
      break
    case GameStatus.Check:
      message = `${turn}'s turn — Check!`
      break
    default:
      message = `${turn}'s turn`
  }

  return (
    <p
      style={{
        fontSize: '1.1rem',
        fontWeight: 600,
        margin: '0.75rem 0',
        minHeight: '1.5rem',
      }}
    >
      {message}
    </p>
  )
}
