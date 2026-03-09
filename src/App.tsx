/** Root application component — Human vs Human chess game. */
import { useChessGame } from './hooks/useChessGame'
import { Board } from './components/Board'
import { StatusBar } from './components/StatusBar'
import { GameControls } from './components/GameControls'

function App() {
  const game = useChessGame()

  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        fontFamily: 'sans-serif',
      }}
    >
      <h1 style={{ marginBottom: '0.5rem' }}>Chess</h1>
      <StatusBar fen={game.fen} status={game.status} />
      <Board game={game} />
      <GameControls onNewGame={game.resetGame} />
    </main>
  )
}

export default App
