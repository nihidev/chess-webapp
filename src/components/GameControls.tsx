interface GameControlsProps {
  onNewGame: () => void
}

export function GameControls({ onNewGame }: GameControlsProps) {
  return (
    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
      <button type="button" onClick={onNewGame}>
        New Game
      </button>
    </div>
  )
}
