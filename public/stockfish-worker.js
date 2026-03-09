/* Classic Web Worker — loads Stockfish.js and relays UCI messages */
/* global Stockfish */

importScripts('/stockfish.js')

// eslint-disable-next-line no-undef
const engine = Stockfish()

self.onmessage = function (e) {
  engine.postMessage(e.data)
}

engine.addMessageListener(function (line) {
  self.postMessage(line)
})

engine.postMessage('uci')
engine.postMessage('isready')
