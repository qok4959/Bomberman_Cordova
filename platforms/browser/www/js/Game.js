/* Author: Derek O Reilly, Dundalk Institute of Technology, Ireland.       */
/* A CanvasGame that implements collision detection.                       */
/* The game allows the user to walk a Character around a maze.              */
/* If the Character is guided to the maze exit, then a win message appears. */

class Game extends CanvasGame {
  constructor() {
    super();
    this.widthOfAPlane = CHARACTER_SCALE;

    this.everythingIsGenerated = false;

    this.generateBorder();
    this.generateObjectsOnCanvas();

    this.isTempArrClearExecuted = false;

    this.movingProcess = false;

    document.getElementById("btnReset").onclick = this.restartTheGame;
  }

  collisionDetection() {
    tempArr.map((posX, indexX) => {
      posX.map((posY, indexY) => {
        if (
          tempArr[indexX][indexY] == EXPLOSION ||
          tempArr[indexX][indexY] == EXPLOSION_ENEMY
        ) {
          if (
            indexX == gameObjects[PLAYER_NUMBER].getCentreX() &&
            indexY == gameObjects[PLAYER_NUMBER].getCentreY()
          ) {
            console.log("player lose a point of health");
            navigator.vibrate(1000);
            this.decreaseCharacterLifes(PLAYER_NUMBER);
          }
          if (
            indexX == gameObjects[BOT_FIRST].getCentreX() &&
            indexY == gameObjects[BOT_FIRST].getCentreY() &&
            tempArr[indexX][indexY] == EXPLOSION
          ) {
            console.log("bot1 lose a point of health");
            this.decreaseCharacterLifes(BOT_FIRST);
          }

          if (
            indexX == gameObjects[BOT_SECOND].getCentreX() &&
            indexY == gameObjects[BOT_SECOND].getCentreY() &&
            tempArr[indexX][indexY] == EXPLOSION
          ) {
            console.log("bot2 lose a point of health");
            this.decreaseCharacterLifes(BOT_SECOND);
          }

          if (
            indexX == gameObjects[BOT_THIRD].getCentreX() &&
            indexY == gameObjects[BOT_THIRD].getCentreY() &&
            tempArr[indexX][indexY] == EXPLOSION
          ) {
            console.log("bot3 lose a point of health");
            this.decreaseCharacterLifes(BOT_THIRD);
          }
        }
      });
    });

    if (isGameOver) return;
  }

  generateBorder = () => {
    for (let i = 0; i < this.widthOfAPlane; i++) {
      let localArr = [];
      for (let j = 0; j < this.widthOfAPlane; j++) {
        if (i == 0 || i == this.widthOfAPlane - 1) {
          localArr.push(OBSTACLE);
          continue;
        }
        if (j == 0 || j == this.widthOfAPlane - 1) {
          localArr.push(OBSTACLE);
          continue;
        }

        localArr.push(0);
      }
      plane.push(localArr);
    }
  };

  generateObjectsOnCanvas = () => {
    for (let i = 0; i < plane.length; i += 1) {
      for (let j = 0; j < plane[i].length; j += 1) {
        if (
          (i == 3 && j == 3) ||
          (i == CHARACTER_SCALE - 4 && j == CHARACTER_SCALE - 4)
        ) {
          plane[i][j] = MOVABLE_TERRAIN;
          continue;
        }

        if (Math.random() * 10 > 9) {
          plane[i][j] = OBSTACLE;
        }
      }
    }

    plane[0][0] = PLAYER_NUMBER;
    plane[CHARACTER_SCALE - 1][CHARACTER_SCALE - 1] = BOT_FIRST;
    plane[CHARACTER_SCALE - 1][0] = BOT_SECOND;
    plane[0][CHARACTER_SCALE - 1] = BOT_THIRD;

    plane.map((x) => {
      backupPlane.push([...x]);
      tempArr.push([...x]);
    });

    this.everythingIsGenerated = true;
  };

  placeABomb = (CHARACTER_NUMBER) => {
    gameObjects[CHARACTER_NUMBER].decreaseAvailableBombsCount();
    let posBombX = gameObjects[CHARACTER_NUMBER].getBombPosX();
    let posBombY = gameObjects[CHARACTER_NUMBER].getBombPosY();

    plane[posBombX][posBombY] = UNDETONATED_BOMB;

    setTimeout(() => {
      this.detonateABomb(posBombX, posBombY, CHARACTER_NUMBER);
    }, 1800);
  };

  detonateABomb = (posX, posY, CHARACTER_NUMBER) => {
    const bombRadius = 3;
    let tempSquaresToClear = [];
    // this is to prevent bot destroying himself
    let typeOfExplosion;

    typeOfExplosion =
      CHARACTER_NUMBER == PLAYER_NUMBER ? EXPLOSION : EXPLOSION_ENEMY;

    let topColided = false,
      leftColided = false,
      bottomColided = false,
      rightColided = false;
    for (let i = 0; i < bombRadius; i++) {
      //middle
      if (i == 0) {
        plane[posX + i][posY] = typeOfExplosion;
        tempArr[posX][posY] = typeOfExplosion;
        tempSquaresToClear.push({ x: posX, y: posY });
        continue;
      }

      //right
      if (posX + i < this.widthOfAPlane) {
        if (plane[posX + i][posY] != OBSTACLE && !rightColided) {
          tempSquaresToClear.push({ x: posX + i, y: posY });
          tempArr[posX + 1][posY] = typeOfExplosion;
          plane[posX + i][posY] = typeOfExplosion;
        } else rightColided = true;
      }

      //left
      if (posX - i >= 0) {
        if (plane[posX - i][posY] != OBSTACLE && !leftColided) {
          tempSquaresToClear.push({ x: posX - i, y: posY });
          tempArr[posX - 1][posY] = typeOfExplosion;
          plane[posX - i][posY] = typeOfExplosion;
        } else leftColided = true;
      }

      //top
      if (posY + i < this.widthOfAPlane) {
        if (plane[posX][posY + i] != OBSTACLE && !topColided) {
          plane[posX][posY + i] = typeOfExplosion;
          tempSquaresToClear.push({ x: posX, y: posY + i });
          tempArr[posX][posY + i] = typeOfExplosion;
        } else topColided = true;
      }

      //bottom
      if (posY - i >= 0) {
        if (plane[posX][posY - i] != OBSTACLE && !bottomColided) {
          tempSquaresToClear.push({ x: posX, y: posY - i });
          tempArr[posX][posY - i] = typeOfExplosion;
          plane[posX][posY - i] = typeOfExplosion;
        } else bottomColided = true;
      }
    }

    // plane.map((x) => {
    //   tempArr.push([...x]);
    // });
    this.clearCollisionArrayAfterDelay(tempSquaresToClear);
  };

  clearCollisionArrayAfterDelay = (tArr) => {
    setTimeout(() => {
      tArr.map((pos) => {
        tempArr[pos.x][pos.y] = OBSTACLE;
      });
    }, 700);
  };

  displayGeneralInfo = (CHARACTER_NUMBER) => {
    gameObjects[INFO_BOMBS] = new StaticText(
      "Bombs: " + gameObjects[CHARACTER_NUMBER].getBombsInfoCount(),
      2 * squareSizeX,
      (squareSizeY * 5) / 6,
      "Times Roman",
      squareSizeY,
      "#7FFF00"
    );
    gameObjects[INFO_LIFES] = new StaticText(
      "Lifes: " + gameObjects[CHARACTER_NUMBER].getCharacterLifes(),
      this.widthOfAPlane * squareSizeX - 5 * squareSizeX,
      (squareSizeY * 5) / 6,
      "Times Roman",
      squareSizeY,
      "#7FFF00"
    );
    gameObjects[INFO_BOMBS].drawTxt();
    gameObjects[INFO_LIFES].drawTxt();
  };

  renderPlane = () => {
    plane.map((posX, indexX) => {
      posX.map((posY, indexY) => {
        switch (posY) {
          case OBSTACLE:
            ctx.drawImage(
              tileObstacle,
              indexX * squareSizeX,
              indexY * squareSizeY,
              squareSizeX,
              squareSizeY
            );
            if (this.everythingIsGenerated && this.displayGeneralInfo)
              this.displayGeneralInfo(PLAYER_NUMBER);
            break;
          case PLAYER_NUMBER:
            gameObjects[PLAYER_NUMBER].drawCharacter(PLAYER_NUMBER);
            ctx.drawImage(
              tileObstacle,
              indexX * squareSizeX,
              indexY * squareSizeY,
              squareSizeX,
              squareSizeY
            );
            break;
          case EXPLOSION:
          case EXPLOSION_ENEMY:
            let tempIndex = Math.floor(Math.random() * (99999 - 10) + 10);
            gameObjects[tempIndex] = new Explosion(
              explosionImage,
              indexX,
              indexY,
              squareSizeX,
              squareSizeY
            );
            gameObjects[tempIndex].start();

            this.clearPlane(indexX, indexY);

            !this.isTempArrClearExecuted && this.tempArrClear();
            break;

          case UNDETONATED_BOMB:
            ctx.drawImage(
              tileBomb,
              indexX * squareSizeX,
              indexY * squareSizeY,
              squareSizeX,
              squareSizeY
            );
            break;
          case BOT_FIRST:
            gameObjects[BOT_FIRST].drawCharacter(BOT_FIRST);
            ctx.drawImage(
              tileObstacle,
              indexX * squareSizeX,
              indexY * squareSizeY,
              squareSizeX,
              squareSizeY
            );
            break;
          case BOT_SECOND:
            gameObjects[BOT_SECOND].drawCharacter(BOT_SECOND);
            ctx.drawImage(
              tileObstacle,
              indexX * squareSizeX,
              indexY * squareSizeY,
              squareSizeX,
              squareSizeY
            );
            break;
          case BOT_THIRD:
            gameObjects[BOT_THIRD].drawCharacter(BOT_THIRD);
            ctx.drawImage(
              tileObstacle,
              indexX * squareSizeX,
              indexY * squareSizeY,
              squareSizeX,
              squareSizeY
            );
            break;
        }
      });
    });
  };

  clearPlane = (posX, posY) => {
    plane[posX][posY] = MOVABLE_TERRAIN;
  };

  tempArrClear = () => {
    this.isTempArrClearExecuted = true;
    setTimeout(() => {
      // tempArr = [];

      this.isTempArrClearExecuted = false;
      gameObjects[PLAYER_NUMBER].getBombsInfoCount() < 1 &&
        gameObjects[PLAYER_NUMBER].increaseBombsInfoCount();
      gameObjects[BOT_FIRST].getBombsInfoCount() < 1 &&
        gameObjects[BOT_FIRST].increaseBombsInfoCount();
      gameObjects[BOT_SECOND].getBombsInfoCount() < 1 &&
        gameObjects[BOT_SECOND].increaseBombsInfoCount();
      gameObjects[BOT_THIRD].getBombsInfoCount() < 1 &&
        gameObjects[BOT_THIRD].increaseBombsInfoCount();
    }, 700);
  };

  decreaseCharacterLifes = (CHARACTER_NUMBER) => {
    if (gameObjects[CHARACTER_NUMBER].getCharacterLifes() > 1) {
      gameObjects[CHARACTER_NUMBER].centreX =
        gameObjects[CHARACTER_NUMBER].getDefaultPositionX();
      gameObjects[CHARACTER_NUMBER].centreY =
        gameObjects[CHARACTER_NUMBER].getDefaultPositionY();

      gameObjects[CHARACTER_NUMBER].decreaseCharacterLifes();
    } else if (gameObjects[CHARACTER_NUMBER].getCharacterLifes() > 0) {
      gameObjects[CHARACTER_NUMBER].getCharacterLifes() > 0 &&
        gameObjects[CHARACTER_NUMBER].decreaseCharacterLifes();

      gameObjects[CHARACTER_NUMBER].setAbleToMove(false);
      if (CHARACTER_NUMBER == PLAYER_NUMBER) {
        isGameOver = true;
        window.saveScore("lose", difficultyString);
        document.getElementById("mySelect").style.visibility = "visible";
        document.getElementById("btnReset").style.visibility = "visible";
        document.getElementById("messageInfo").innerHTML = "You have lost!";
        document.getElementById("messageInfo").style.visibility = "visible";
        document.getElementById("messageInfo").style.color = "#9d311e";
      } else {
        --this.aliveEnemies;
      }
      if (this.aliveEnemies == 0) {
        window.saveScore("winner", difficultyString);
        isGameOver = true;
        document.getElementById("mySelect").style.visibility = "visible";
        document.getElementById("btnReset").style.visibility = "visible";
        document.getElementById("messageInfo").style.color = "#e1ad01";
        document.getElementById("messageInfo").innerHTML = "You have won!";
        document.getElementById("messageInfo").style.visibility = "visible";
      }
    }
    console.log(this.aliveEnemies);
  };

  randomMoveDelay = () => {
    this.movingProcess = true;
    setTimeout(() => {
      gameObjects[BOT_FIRST].randomMove();
      gameObjects[BOT_SECOND].randomMove();
      gameObjects[BOT_THIRD].randomMove();
      this.movingProcess = false;
    }, 200);
  };

  restartTheGame = () => {
    gameObjects[BOT_FIRST].setAbleToMove(false);
    gameObjects[BOT_SECOND].setAbleToMove(false);
    gameObjects[BOT_THIRD].setAbleToMove(false);

    document.getElementById("mySelect").style.visibility = "hidden";
    Difficulty_status = document.querySelector(
      'input[name="difficulty"]:checked'
    ).value;
    console.log(Difficulty_status, Difficulty.EASY);
    console.log(Difficulty_status == Difficulty.EASY);
    if (Difficulty_status == Difficulty.EASY) this.aliveEnemies = 1;
    else if (Difficulty_status == Difficulty.MEDIUM) this.aliveEnemies = 2;
    else this.aliveEnemies = 3;

    switch (parseInt(Difficulty_status)) {
      case Difficulty.HARD:
        console.log("case 1");
        difficultyString = "HARD";
        gameObjects[BOT_SECOND].setAbleToMove(true);
        gameObjects[BOT_THIRD].setAbleToMove(true);
        break;
      case Difficulty.MEDIUM:
        console.log("case 2");
        difficultyString = "MEDIUM";
        gameObjects[BOT_SECOND].setAbleToMove(true);
        break;
      case Difficulty.EASY:
        console.log("case 3");
        difficultyString = "EASY";
        break;
    }

    gameObjects[BOT_FIRST].setAbleToMove(true);
    console.log("restarting!");
    isGameOver = false;

    // gameObjects[BOT_SECOND].setAbleToMove(true);
    // gameObjects[BOT_THIRD].setAbleToMove(true);

    gameObjects[BOT_FIRST].resetLifes();
    gameObjects[PLAYER_NUMBER].resetLifes();
    gameObjects[BOT_SECOND].resetLifes();
    gameObjects[BOT_THIRD].resetLifes();
    document.getElementById("btnReset").style.visibility = "hidden";
    document.getElementById("messageInfo").style.visibility = "hidden";

    plane = [];
    backupPlane.map((x) => {
      plane.push([...x]);
    });

    gameObjects[PLAYER_NUMBER].centreX =
      gameObjects[PLAYER_NUMBER].getDefaultPositionX();
    gameObjects[PLAYER_NUMBER].centreY =
      gameObjects[PLAYER_NUMBER].getDefaultPositionY();

    gameObjects[BOT_FIRST].centreX =
      gameObjects[BOT_FIRST].getDefaultPositionX();
    gameObjects[BOT_FIRST].centreY =
      gameObjects[BOT_FIRST].getDefaultPositionY();

    gameObjects[BOT_SECOND].centreX =
      gameObjects[BOT_SECOND].getDefaultPositionX();
    gameObjects[BOT_SECOND].centreY =
      gameObjects[BOT_SECOND].getDefaultPositionY();

    gameObjects[BOT_THIRD].centreX =
      gameObjects[BOT_THIRD].getDefaultPositionX();
    gameObjects[BOT_THIRD].centreY =
      gameObjects[BOT_THIRD].getDefaultPositionY();
  };

  playGameLoop() {
    if (this.displayGeneralInfo && this.everythingIsGenerated) {
      this.displayGeneralInfo(PLAYER_NUMBER);
    }
    if (gameObjects[PLAYER_NUMBER])
      if (gameObjects[PLAYER_NUMBER].getAvailableBombs() > 0) {
        this.placeABomb(PLAYER_NUMBER);
      }

    if (gameObjects[BOT_FIRST])
      if (
        gameObjects[BOT_FIRST].getAvailableBombs() > 0 &&
        gameObjects[BOT_FIRST].isAbleToMove()
      ) {
        this.placeABomb(BOT_FIRST);
      }
    if (gameObjects[BOT_SECOND])
      if (
        gameObjects[BOT_SECOND].getAvailableBombs() > 0 &&
        gameObjects[BOT_SECOND].isAbleToMove()
      ) {
        this.placeABomb(BOT_SECOND);
      }
    if (gameObjects[BOT_THIRD])
      if (
        gameObjects[BOT_THIRD].getAvailableBombs() > 0 &&
        gameObjects[BOT_THIRD].isAbleToMove()
      ) {
        this.placeABomb(BOT_THIRD);
      }
    if (
      this.randomMoveDelay &&
      this.everythingIsGenerated &&
      !this.movingProcess &&
      !isGameOver
    )
      this.randomMoveDelay();
    super.playGameLoop();
  }

  render() {
    super.render();
    if (this.renderPlane) this.renderPlane();
  }
}
