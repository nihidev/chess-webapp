/** Root application component — mode selection and game routing. */
import { useState } from 'react'
import { useChessGame } from './hooks/useChessGame'
import { useStockfish } from './hooks/useStockfish'
import { Board } from './components/Board'
import { StatusBar } from './components/StatusBar'
import { GameControls } from './components/GameControls'
import { ModeSelection } from './components/ModeSelection'
import type { GameConfig } from './types'

const mainStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  fontFamily: 'sans-serif',
}

interface GameViewProps {
  config: GameConfig
  onNewGame: () => void
}

function GameView({ config, onNewGame }: GameViewProps) {
  const { getBestMove } = useStockfish(config.mode)
  const game = useChessGame({ config, getBestMove })

  return (
    <main style={mainStyle}>
      <h1 style={{ marginBottom: '0.5rem' }}>Chess</h1>
      <StatusBar fen={game.fen} status={game.status} />
      {game.isComputerThinking && (
        <p style={{ color: '#888', margin: '0.25rem 0' }}>Computer is thinking…</p>
      )}
      <Board game={game} />
      <GameControls onNewGame={onNewGame} />
    </main>
  )
}

function App() {
  const [config, setConfig] = useState<GameConfig | null>(null)

  if (!config) {
    return (
      <main style={mainStyle}>
        <h1 style={{ marginBottom: '1rem' }}>Chess</h1>
        <ModeSelection onStart={setConfig} />
      </main>
    )
  }

  return <GameView config={config} onNewGame={() => { setConfig(null) }} />
}

export default App
