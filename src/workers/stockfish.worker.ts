/**
 * Web Worker wrapper for Stockfish.js WASM engine.
 * Relays UCI commands from the main thread to the engine and vice-versa.
 */
import Stockfish from 'stockfish'

const engine = Stockfish()

// Relay UCI commands from main thread → engine
self.onmessage = (e: MessageEvent<string>) => {
  engine.postMessage(e.data)
}

// Relay engine output → main thread
engine.addMessageListener((line: string) => {
  self.postMessage(line)
})

// Boot the engine
engine.postMessage('uci')
engine.postMessage('isready')
