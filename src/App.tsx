/** Root application component — mode selection and game routing. */
import { useEffect, useRef, useState } from 'react'
import { useChessGame } from './hooks/useChessGame'
import { useStockfish } from './hooks/useStockfish'
import { Board } from './components/Board'
import { StatusBar } from './components/StatusBar'
import { GameControls } from './components/GameControls'
import { ModeSelection } from './components/ModeSelection'
import { CapturedPieces } from './components/CapturedPieces'
import type { GameConfig } from './types'
import type { PromotionPiece } from './types'

const PAGE_STYLE: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  fontFamily: 'sans-serif',
  padding: '1rem',
  boxSizing: 'border-box',
}

const MIN_BOARD = 280
const MAX_BOARD = 560

/** Computes responsive board width clamped between MIN_BOARD and MAX_BOARD. */
function computeBoardWidth(): number {
  const vw = window.innerWidth
  const candidate = Math.floor(vw * 0.9)
  return Math.max(MIN_BOARD, Math.min(MAX_BOARD, candidate))
}

function useBoardWidth(): number {
  /** Tracks viewport width and returns a clamped board size. */
  const [boardWidth, setBoardWidth] = useState<number>(computeBoardWidth)

  useEffect(() => {
    function handleResize() {
      setBoardWidth(computeBoardWidth())
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return boardWidth
}

interface GameViewProps {
  config: GameConfig
  onNewGame: () => void
}

function GameView({ config, onNewGame }: GameViewProps) {
  /** Renders the main game layout with board, status, controls, and captured pieces. */
  const { getBestMove } = useStockfish(config.mode)
  const game = useChessGame({ config, getBestMove })
  const boardWidth = useBoardWidth()
  const boardContainerRef = useRef<HTMLDivElement>(null)

  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768)

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  function handlePromotionSelect(piece: PromotionPiece) {
    game.confirmPromotion(piece)
  }

  const gameAreaStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    alignItems: isMobile ? 'center' : 'flex-start',
    gap: '1.5rem',
    width: '100%',
    maxWidth: isMobile ? `${boardWidth}px` : '900px',
    justifyContent: 'center',
  }

  const sidebarStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    minWidth: isMobile ? `${boardWidth}px` : '180px',
    maxWidth: isMobile ? `${boardWidth}px` : '220px',
    width: isMobile ? `${boardWidth}px` : undefined,
  }

  return (
    <main style={PAGE_STYLE}>
      <h1 style={{ marginBottom: '0.5rem' }}>Chess</h1>
      <StatusBar fen={game.fen} status={game.status} />
      {game.isComputerThinking && (
        <p
          aria-live="polite"
          style={{ color: '#888', margin: '0.25rem 0' }}
        >
          Computer is thinking…
        </p>
      )}
      <div style={gameAreaStyle} ref={boardContainerRef}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Board
            game={game}
            boardWidth={boardWidth}
            lastMove={game.lastMove}
            pendingPromotion={game.pendingPromotion}
            onPromotionSelect={handlePromotionSelect}
          />
          <CapturedPieces
            capturedByWhite={game.capturedByWhite}
            capturedByBlack={game.capturedByBlack}
          />
        </div>
        <div style={sidebarStyle}>
          <GameControls onNewGame={onNewGame} />
        </div>
      </div>
    </main>
  )
}

function App() {
  const [config, setConfig] = useState<GameConfig | null>(null)

  if (!config) {
    return (
      <main style={PAGE_STYLE}>
        <h1 style={{ marginBottom: '1rem' }}>Chess</h1>
        <ModeSelection onStart={setConfig} />
      </main>
    )
  }

  return (
    <GameView
      config={config}
      onNewGame={() => {
        setConfig(null)
      }}
    />
  )
}

export default App
