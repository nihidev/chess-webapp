/** Renders captured pieces for one side as a compact inline tray. */

const PIECE_VALUE: Record<string, number> = { q: 9, r: 5, b: 3, n: 3, p: 1 }

const UNICODE_BLACK: Record<string, string> = { q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' }
const UNICODE_WHITE: Record<string, string> = { q: '♕', r: '♖', b: '♗', n: '♘', p: '♙' }

interface CapturedPiecesProps {
  /** The list of captured pieces (piece type chars, e.g. 'q','r','p'). */
  pieces: string[]
  /** Which unicode set to render — 'black' for solid pieces, 'white' for outline pieces. */
  pieceColor: 'black' | 'white'
}

function sorted(pieces: string[]): string[] {
  return [...pieces].sort((a, b) => (PIECE_VALUE[b] ?? 0) - (PIECE_VALUE[a] ?? 0))
}

export function CapturedPieces({ pieces, pieceColor }: CapturedPiecesProps) {
  const map = pieceColor === 'black' ? UNICODE_BLACK : UNICODE_WHITE
  const list = sorted(pieces)

  if (list.length === 0) {
    return <span className="capture-tray-empty">—</span>
  }

  return (
    <span className="capture-tray" aria-label="Captured pieces">
      {list.map((p, i) => (
        <span key={i} title={p}>{map[p] ?? p}</span>
      ))}
    </span>
  )
}
