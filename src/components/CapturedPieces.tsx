/** Displays captured pieces for each side, sorted by piece value descending. */

const PIECE_VALUE: Record<string, number> = {
  q: 9,
  r: 5,
  b: 3,
  n: 3,
  p: 1,
}

const WHITE_UNICODE: Record<string, string> = {
  q: '♛',
  r: '♜',
  b: '♝',
  n: '♞',
  p: '♟',
}

const BLACK_UNICODE: Record<string, string> = {
  q: '♕',
  r: '♖',
  b: '♗',
  n: '♘',
  p: '♙',
}

interface CapturedPiecesProps {
  /** Pieces captured by the White player (Black pieces taken). */
  capturedByWhite: string[]
  /** Pieces captured by the Black player (White pieces taken). */
  capturedByBlack: string[]
}

function sortedPieces(pieces: string[]): string[] {
  /** Sorts piece array by value descending. */
  return [...pieces].sort((a, b) => (PIECE_VALUE[b] ?? 0) - (PIECE_VALUE[a] ?? 0))
}

export function CapturedPieces({ capturedByWhite, capturedByBlack }: CapturedPiecesProps) {
  const whiteSorted = sortedPieces(capturedByWhite)
  const blackSorted = sortedPieces(capturedByBlack)

  const rowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    minHeight: '1.75rem',
    fontSize: '1.25rem',
    flexWrap: 'wrap',
  }

  const labelStyle: React.CSSProperties = {
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: '#666',
    minWidth: '3.5rem',
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',
        padding: '0.5rem 0',
        width: '100%',
      }}
      aria-label="Captured pieces"
    >
      <div style={rowStyle}>
        <span style={labelStyle}>White:</span>
        {whiteSorted.length === 0 ? (
          <span style={{ color: '#ccc', fontSize: '0.85rem' }}>—</span>
        ) : (
          whiteSorted.map((p, i) => (
            <span key={i} title={p} aria-label={`captured ${p}`}>
              {WHITE_UNICODE[p] ?? p}
            </span>
          ))
        )}
      </div>
      <div style={rowStyle}>
        <span style={labelStyle}>Black:</span>
        {blackSorted.length === 0 ? (
          <span style={{ color: '#ccc', fontSize: '0.85rem' }}>—</span>
        ) : (
          blackSorted.map((p, i) => (
            <span key={i} title={p} aria-label={`captured ${p}`}>
              {BLACK_UNICODE[p] ?? p}
            </span>
          ))
        )}
      </div>
    </div>
  )
}
