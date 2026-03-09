interface GameControlsProps {
  onNewGame: () => void
}

export function GameControls({ onNewGame }: GameControlsProps) {
  return (
    <div className="controls-panel">
      <button type="button" className="btn btn-secondary" style={{ width: '100%' }} onClick={onNewGame}>
        ↩ New Game
      </button>
    </div>
  )
}
