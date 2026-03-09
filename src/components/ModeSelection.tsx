import { useState } from 'react'
import { Difficulty, GameMode, PlayerColor, type GameConfig } from '../types'

interface ModeSelectionProps {
  onStart: (config: GameConfig) => void
}

export function ModeSelection({ onStart }: ModeSelectionProps) {
  const [step, setStep] = useState<'mode' | 'config'>('mode')
  const [playerColor, setPlayerColor] = useState<PlayerColor>(PlayerColor.White)
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Medium)

  function handleHvH() {
    onStart({ mode: GameMode.HumanVsHuman, playerColor: PlayerColor.White, difficulty: Difficulty.Medium })
  }

  function handleStart() {
    onStart({ mode: GameMode.HumanVsComputer, playerColor, difficulty })
  }

  if (step === 'config') {
    return (
      <div className="config-panel">
        <div>
          <h2>vs Computer</h2>
          <p style={{ color: 'var(--text-2)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            Configure your game
          </p>
        </div>

        <div className="config-section">
          <span className="config-label">Play as</span>
          <div className="config-options">
            {([PlayerColor.White, PlayerColor.Black] as const).map((c) => (
              <button
                key={c}
                type="button"
                className={`btn btn-toggle${playerColor === c ? ' active' : ''}`}
                onClick={() => { setPlayerColor(c) }}
              >
                {c === PlayerColor.White ? '♔' : '♚'} {c}
              </button>
            ))}
          </div>
        </div>

        <div className="config-section">
          <span className="config-label">Difficulty</span>
          <div className="config-options">
            {([Difficulty.Easy, Difficulty.Medium, Difficulty.Hard] as const).map((d) => (
              <button
                key={d}
                type="button"
                className={`btn btn-toggle${difficulty === d ? ' active' : ''}`}
                onClick={() => { setDifficulty(d) }}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="config-footer">
          <button type="button" className="btn btn-ghost" onClick={() => { setStep('mode') }}>
            ← Back
          </button>
          <button type="button" className="btn btn-primary" onClick={handleStart}>
            Start Game →
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="mode-hero">
        <h1>♔ Chess</h1>
        <p>Play chess in your browser — no account needed</p>
      </div>
      <div className="mode-cards">
        <button type="button" className="mode-card" onClick={handleHvH}>
          <span className="mode-card-icon">👥</span>
          <span className="mode-card-title">Human vs Human</span>
          <span className="mode-card-desc">Play with a friend on the same device</span>
        </button>
        <button type="button" className="mode-card" onClick={() => { setStep('config') }}>
          <span className="mode-card-icon">🤖</span>
          <span className="mode-card-title">vs Computer</span>
          <span className="mode-card-desc">Challenge the Stockfish engine</span>
        </button>
      </div>
    </>
  )
}
