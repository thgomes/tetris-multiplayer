function createGame(gamesCount) {
  let state = {
    gameId: gamesCount,
    score: 0,
    level: 1,
    nextPiece: generateRandomPiece(),
    droppingPiece: generateRandomPiece(),
    droppedBlocks: [],
    isMultiplayer: false,
    isPaused: false,
    isGameOver: false,
    finish: false,
  };
  const keyMap = {
    ArrowDown: movePieceDown,
    KeyS: movePieceDown,
    ArrowLeft: movePieceLeft,
    KeyA: movePieceLeft,
    ArrowRight: movePieceRight,
    KeyD: movePieceRight,
    KeyR: rotatePiece,
    Space: pauseAndUnpause,
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
    if (!keyPressed) {
      return;
    }
    if (state.isPaused && command.keyPressed != "Space") {
      return;
    }
    keyPressed();
  }
  function removeBlocksByRow(y) {
    state.droppedBlocks = state.droppedBlocks.filter(
      (block) => block.positionY != y
    );
    state.droppedBlocks = state.droppedBlocks.map((block) => {
      if (block.positionY <= y - 1) {
        return {
          ...block,
          positionY: block.positionY + 1,
        };
      }
      return block;
    });
  }
  function gameOver() {
    state.isPaused = true;
    state.isGameOver = true;
  }
  function calculatePoints() {
    const blocksPerRow = Array.from({ length: 20 }, () => 0);
    for (block of state.droppedBlocks) {
      blocksPerRow[block.positionY]++;
      if (block.positionY <= 0) {
        gameOver();
        return;
      }
    }
    let removedLines = 0;
    blocksPerRow.forEach((count, y) => {
      if (count > 9) {
        removeBlocksByRow(y);
        removedLines++;
      }
    });
    if (removedLines == 0) {
      return;
    }
    const pointsTable = {
      1: 100,
      2: 400,
      3: 1000,
      4: 5000,
    };
    if (!pointsTable[`${removedLines}`]) {
      return;
    }
    state.score += pointsTable[removedLines];
  }

  function pieceDropFinish() {
    state.droppedBlocks.push(...state.droppingPiece.blocks);
    calculatePoints();
    state.droppingPiece = state.nextPiece;
    state.nextPiece = generateRandomPiece();
  }
  function dropPieces() {
    if (!state.isPaused) {
      movePieceDown();
    }
    const timeoutId = setTimeout(dropPieces, 1000);
    if (state.finish) {
      clearTimeout(timeoutId);
    }
  }
  function pauseAndUnpause() {
    if (state.isPaused) {
      state.isPaused = false;
    } else {
      state.isPaused = true;
    }
  }
  return {
    state,
    movePiece,
    dropPieces,
  };
}
