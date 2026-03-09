/** Root application component — mode selection and game routing. */
import { useEffect, useState } from 'react'
import { useChessGame } from './hooks/useChessGame'
import { useStockfish } from './hooks/useStockfish'
import { Board } from './components/Board'
import { StatusBar } from './components/StatusBar'
import { GameControls } from './components/GameControls'
import { ModeSelection } from './components/ModeSelection'
import { CapturedPieces } from './components/CapturedPieces'
import { GameMode, type GameConfig, type PromotionPiece } from './types'

const MIN_BOARD = 280
const MAX_BOARD = 560

function computeBoardWidth(): number {
  const vw = window.innerWidth
  const candidate = Math.floor(vw * 0.9)
  return Math.max(MIN_BOARD, Math.min(MAX_BOARD, candidate))
}

function useBoardWidth(): number {
  const [boardWidth, setBoardWidth] = useState<number>(computeBoardWidth)
  useEffect(() => {
    function onResize() { setBoardWidth(computeBoardWidth()) }
    window.addEventListener('resize', onResize)
    return () => { window.removeEventListener('resize', onResize) }
  }, [])
  return boardWidth
}

interface GameViewProps {
  config: GameConfig
  onNewGame: () => void
}

function GameView({ config, onNewGame }: GameViewProps) {
  const { getBestMove } = useStockfish(config.mode)
  const game = useChessGame({ config, getBestMove })
  const boardWidth = useBoardWidth()

  function handlePromotionSelect(piece: PromotionPiece) {
    game.confirmPromotion(piece)
  }

  const isHvC = config.mode === GameMode.HumanVsComputer
  const difficultyLabel = isHvC ? config.difficulty : null

  return (
    <div className="app">
      {/* ── Header ── */}
      <header className="header">
        <span className="header-logo">
          <span className="header-logo-icon">♔</span>
          Chess
        </span>
        {isHvC && difficultyLabel && (
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            vs Computer · {difficultyLabel}
          </span>
        )}
      </header>

      {/* ── Game Content ── */}
      <div className="game-page">
        <div className="game-content">

          {/* ── Board Column ── */}
          <div className="board-column">
            {/* Black player strip (top) */}
            <div className="player-strip player-strip--top">
              <div className="player-avatar player-avatar--black">♚</div>
              <span className="player-name">Black</span>
              <CapturedPieces pieces={game.capturedByBlack} pieceColor="white" />
            </div>

            {/* Board */}
            <Board
              game={game}
              boardWidth={boardWidth}
              lastMove={game.lastMove}
              pendingPromotion={game.pendingPromotion}
              onPromotionSelect={handlePromotionSelect}
            />

            {/* White player strip (bottom) */}
            <div className="player-strip player-strip--bottom">
              <div className="player-avatar player-avatar--white">♔</div>
              <span className="player-name">White</span>
              <CapturedPieces pieces={game.capturedByWhite} pieceColor="black" />
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="sidebar">
            <StatusBar
              fen={game.fen}
              status={game.status}
              isComputerThinking={game.isComputerThinking}
              moveHistory={game.moveHistory}
            />
            <GameControls onNewGame={onNewGame} />
          </div>
        </div>
      </div>
    </div>
  )
}

function App() {
  const [config, setConfig] = useState<GameConfig | null>(null)

  if (!config) {
    return (
      <div className="app">
        <header className="header">
          <span className="header-logo">
            <span className="header-logo-icon">♔</span>
            Chess
          </span>
        </header>
        <main className="mode-page">
          <ModeSelection onStart={setConfig} />
        </main>
      </div>
    )
  }

  return (
    <GameView
      config={config}
      onNewGame={() => { setConfig(null) }}
    />
  )
}

export default App
