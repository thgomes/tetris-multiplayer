function createScreen(screenElementId, gameState) {
  document.getElementById("game-mode-menu").style.display = "none";
  document.getElementById("singleplayer-game-container").style.display = "flex";
  const screen = document.getElementById(screenElementId);
  const context = screen.getContext("2d");
  function renderScreen() {
    context.clearRect(0, 0, screen.width, screen.height);
    renderBoard();
    renderBlocks(gameState.droppedBlocks);
    renderPiece(gameState.droppingPiece);
    requestAnimationFrame(renderScreen);
  }
  function renderBoard() {
    const ROWS = 20;
    const COLUMNS = 10;
    context.fillStyle = "#E9C46A";
    context.fillRect(0, 0, CANVA_WIDTH, CANVA_HEIGHT);
    context.strokeStyle = "#E76F51";
    for (let i = 0; i <= ROWS; i++) {
      context.beginPath();
      context.moveTo(0, i * CELL_SIZE);
      context.lineTo(COLUMNS * CELL_SIZE, i * CELL_SIZE);
      context.stroke();
    }
    for (let j = 0; j <= COLUMNS; j++) {
      context.beginPath();
      context.moveTo(j * CELL_SIZE, 0);
      context.lineTo(j * CELL_SIZE, ROWS * CELL_SIZE);
      context.stroke();
    }
  }
  function renderBlocks(blocks) {
    for (const block of blocks) {
      context.fillStyle = block.color;
      context.strokeStyle = block.borderColor;
      context.lineWidth = block.borderWidth;
      context.fillRect(
        block.positionX * CELL_SIZE,
        block.positionY * CELL_SIZE,
        block.width * CELL_SIZE,
        block.height * CELL_SIZE
      );
      context.strokeRect(
        block.positionX * CELL_SIZE,
        block.positionY * CELL_SIZE,
        block.width * CELL_SIZE,
        block.height * CELL_SIZE
      );
    }
  }
  function renderPiece(piece) {
    renderBlocks(piece.blocks);
  }
  return {
    renderScreen,
  };
}