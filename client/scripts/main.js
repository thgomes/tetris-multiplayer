"use strict";

const keyboardListener = createKeyboardListener();
const singlePlayerButtonListener = createSingleplayerButtonListener();
singlePlayerButtonListener.subscribe(singleplayerGameHandler);
let gamesCount = 0;
let currentGameState;

function singleplayerGameHandler() {
  if (currentGameState) {
    currentGameState.finish = true;
  }
  gamesCount++;
  keyboardListener.clearSubscribes();
  const game = createGame(gamesCount);
  game.dropPieces();
  const screen = createScreen("singleplayer-screen", game.state);
  screen.renderScreen();
  keyboardListener.subscribe(game.movePiece);
  currentGameState = game.state;
}
