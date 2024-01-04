const CELL_SIZE = 35;
const CANVA_WIDTH = 350;
const CANVA_HEIGHT = 700;

const keyboardListener = createKeyboardListener();
const game = createGame();
game.dropPieces();

const screen = createScreen("screen", game.state);
screen.renderScreen();
keyboardListener.subscribe(game.movePiece);

function createGame() {
  let state = {
    score: 0,
    level: 1,
    nextPiece: generateRandomPiece(),
    droppingPiece: generateRandomPiece(),
    droppedBlocks: [],
  };
  const keyMap = {
    ArrowDown: movePieceDown,
    KeyS: movePieceDown,
    ArrowLeft: movePieceLeft,
    KeyA: movePieceLeft,
    ArrowRight: movePieceRight,
    KeyD: movePieceRight,
    KeyR: rotatePiece,
  };
  function movePieceDown() {
    for (block of state.droppingPiece.blocks) {
      if ((block.positionY + 1) * CELL_SIZE >= CANVA_HEIGHT) {
        pieceDropFinish();
        return;
      }
      const coordenatesAvailable = checkCoordenatesDisponibility(
        block.positionX,
        block.positionY + 1
      );
      if (!coordenatesAvailable) {
        pieceDropFinish();
        return;
      }
    }
    for (block of state.droppingPiece.blocks) {
      block.positionY += 1;
    }
  }
  function movePieceRight() {
    for (block of state.droppingPiece.blocks) {
      if ((block.positionX + 1) * CELL_SIZE >= CANVA_WIDTH) {
        return;
      }
      const coordenatesAvailable = checkCoordenatesDisponibility(
        block.positionX + 1,
        block.positionY
      );
      if (!coordenatesAvailable) {
        return;
      }
    }
    for (block of state.droppingPiece.blocks) {
      block.positionX += 1;
    }
  }
  function movePieceLeft() {
    for (block of state.droppingPiece.blocks) {
      if ((block.positionX - 1) * CELL_SIZE < 0) {
        return;
      }
      const coordenatesAvailable = checkCoordenatesDisponibility(
        block.positionX - 1,
        block.positionY
      );
      if (!coordenatesAvailable) {
        return;
      }
    }
    for (block of state.droppingPiece.blocks) {
      block.positionX -= 1;
    }
  }
  function checkCoordenatesDisponibility(x, y) {
    for (const block of state.droppedBlocks) {
      if (block.positionX == x && block.positionY == y) {
        return false;
      }
    }
    return true;
  }
  function rotatePiece() {
    let centerExists = false;
    const center = {};
    for (const block of state.droppingPiece.blocks) {
      if (block.isCenter) {
        centerExists = true;
        center.x = block.positionX;
        center.y = block.positionY;
        break;
      }
    }
    if (!centerExists) {
      return;
    }
    for (const block of state.droppingPiece.blocks) {
      const x = block.positionX;
      const y = block.positionY;
      block.positionX = center.x + (y - center.y);
      block.positionY = center.y - (x - center.x);
    }
  }
  function movePiece(command) {
    const keyPressed = keyMap[command.keyPressed];
    if (keyPressed) {
      keyPressed();
    }
  }
  function pieceDropFinish() {
    state.droppedBlocks.push(...state.droppingPiece.blocks);
    state.droppingPiece = state.nextPiece;
    state.nextPiece = generateRandomPiece();
  }
  function dropPieces() {
    movePieceDown();
    setTimeout(dropPieces, 1000);
  }
  return {
    state,
    movePiece,
    dropPieces,
  };
}

function createScreen(screenElementId, gameState) {
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

function createKeyboardListener() {
  const observers = [];
  function subscribe(observerHandler) {
    observers.push(observerHandler);
  }
  function notifyAll(command) {
    for (observerHandle of observers) {
      observerHandle(command);
    }
  }
  function handleKeyboard(event) {
    const command = {
      keyPressed: event.code,
    };
    notifyAll(command);
  }
  document.addEventListener("keydown", handleKeyboard);
  return {
    subscribe,
  };
}
