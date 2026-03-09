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
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <h2 style={{ margin: 0 }}>Human vs Computer</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
          <span>Play as:</span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {([PlayerColor.White, PlayerColor.Black] as const).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => { setPlayerColor(c) }}
                style={{ fontWeight: playerColor === c ? 'bold' : 'normal' }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
          <span>Difficulty:</span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {([Difficulty.Easy, Difficulty.Medium, Difficulty.Hard] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => { setDifficulty(d) }}
                style={{ fontWeight: difficulty === d ? 'bold' : 'normal' }}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="button" onClick={() => { setStep('mode') }}>Back</button>
          <button type="button" onClick={handleStart}>Start Game</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
      <h2 style={{ margin: 0 }}>Select Mode</h2>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button type="button" onClick={handleHvH}>Human vs Human</button>
        <button type="button" onClick={() => { setStep('config') }}>Human vs Computer</button>
      </div>
    </div>
  )
}
