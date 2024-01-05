const singlePlayerButtonListener = createSingleplayerButtonListener();
singlePlayerButtonListener.subscribe(singleplayerGameHandler);

function singleplayerGameHandler() {
  const keyboardListener = createKeyboardListener();
  const game = createGame();
  game.dropPieces();
  const screen = createScreen("singleplayer-screen", game.state);
  screen.renderScreen();
  keyboardListener.subscribe(game.movePiece);
}
