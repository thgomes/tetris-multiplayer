function createGame() {
  let state = {
    score: 0,
    level: 1,
    nextPiece: generateRandomPiece(),
    droppingPiece: generateRandomPiece(),
    droppedBlocks: [],
    isMultiplayer: false,
    isPaused: false,
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
      const newX = center.x + (y - center.y);
      const newY = center.y - (x - center.x);
      if (newX < 0 || newX > 9 || newY > 19) {
        return;
      }
      const coordenatesAvailable = checkCoordenatesDisponibility(newX, newY);
      if (!coordenatesAvailable) {
        return;
      }
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
  function pauseGame() {
    state.pauseGame = true;
  }
  return {
    state,
    movePiece,
    dropPieces,
  };
}
