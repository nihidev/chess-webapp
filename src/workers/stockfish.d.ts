declare module 'stockfish' {
  interface StockfishEngine {
    postMessage: (msg: string) => void
    addMessageListener: (cb: (msg: string) => void) => void
    removeMessageListener: (cb: (msg: string) => void) => void
    terminate: () => void
  }
  function Stockfish(): StockfishEngine
  export = Stockfish
}
