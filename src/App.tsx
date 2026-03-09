/** Root application component — mode selection and game routing. */
import { GameMode, GameStatus } from './types'

function App() {
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
      <h1>Chess</h1>
      <p>Select a game mode to begin.</p>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <button type="button">{GameMode.HumanVsHuman.replace('Vs', ' vs ')}</button>
        <button type="button">{GameMode.HumanVsComputer.replace('Vs', ' vs ')}</button>
      </div>
      <p style={{ color: '#888', marginTop: '2rem', fontSize: '0.875rem' }}>
        Status: {GameStatus.Idle}
      </p>
    </main>
  )
}

export default App
