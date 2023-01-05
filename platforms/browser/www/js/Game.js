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
    this.arrReturn = [];
    this.movingProcess = false;

    document.getElementById("btnReset").onclick = this.restartTheGame;
  }

  clearPlane = () => {};

  // TODO unable bot to destroy himself
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
            this.decreaseCharacterLifes(PLAYER_NUMBER);
          }
          if (
            indexX == gameObjects[BOT_NUMBER].getCentreX() &&
            indexY == gameObjects[BOT_NUMBER].getCentreY() &&
            tempArr[indexX][indexY] == EXPLOSION
          ) {
            console.log("bot lose a point of health");
            this.decreaseCharacterLifes(BOT_NUMBER);
          }
        }
      });
    });

    if (isGameOver) return;
  }

  generateBorder = () => {
    for (let i = 0; i < this.widthOfAPlane; i++) {
      let tempArr = [];
      for (let j = 0; j < this.widthOfAPlane; j++) {
        if (i == 0 || i == this.widthOfAPlane - 1) {
          tempArr.push(OBSTACLE);
          continue;
        }
        if (j == 0 || j == this.widthOfAPlane - 1) {
          tempArr.push(OBSTACLE);
          continue;
        }

        tempArr.push(0);
      }
      plane.push(tempArr);
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
    plane[CHARACTER_SCALE - 1][CHARACTER_SCALE - 1] = BOT_NUMBER;

    plane.map((x) => {
      backupPlane.push([...x]);
    });

    this.everythingIsGenerated = true;
  };

  placeABomb = (CHARACTER_NUMBER) => {
    gameObjects[CHARACTER_NUMBER].decreaseAvailableBombsCount();
    let posBombX = gameObjects[CHARACTER_NUMBER].getBombPosX();
    let posBombY = gameObjects[CHARACTER_NUMBER].getBombPosY();

    console.log(posBombX + " " + posBombY);
    plane[posBombX][posBombY] = UNDETONATED_BOMB;

    setTimeout(() => {
      this.detonateABomb(posBombX, posBombY, CHARACTER_NUMBER);
    }, 600);
  };

  detonateABomb = (posX, posY, CHARACTER_NUMBER) => {
    const bombRadius = 3;

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
        this.arrReturn.push({ x: posX, y: posY });
        continue;
      }

      //right
      if (posX + i < this.widthOfAPlane) {
        if (plane[posX + i][posY] != OBSTACLE && !rightColided) {
          this.arrReturn.push({ x: posX + i, y: posY });
          plane[posX + i][posY] = typeOfExplosion;
        } else rightColided = true;
      }

      //left
      if (posX - i >= 0) {
        if (plane[posX - i][posY] != OBSTACLE && !leftColided) {
          this.arrReturn.push({ x: posX - i, y: posY });
          plane[posX - i][posY] = typeOfExplosion;
        } else leftColided = true;
      }

      //top
      if (posY + i < this.widthOfAPlane) {
        if (plane[posX][posY + i] != OBSTACLE && !topColided) {
          plane[posX][posY + i] = typeOfExplosion;
          this.arrReturn.push({ x: posX, y: posY + i });
        } else topColided = true;
      }

      //bottom
      if (posY - i >= 0) {
        if (plane[posX][posY - i] != OBSTACLE && !bottomColided) {
          this.arrReturn.push({ x: posX, y: posY - i });
          plane[posX][posY - i] = typeOfExplosion;
        } else bottomColided = true;
      }
    }

    plane.map((x) => {
      tempArr.push([...x]);
    });
  };

  displayGeneralInfo = (CHARACTER_NUMBER) => {
    gameObjects[INFO_BOMBS] = new StaticText(
      "Bombs: " + gameObjects[CHARACTER_NUMBER].getBombsInfoCount(),
      3 * squareSizeX,
      (squareSizeY * 5) / 6,
      "Times Roman",
      squareSizeY,
      "#7FFF00"
    );
    gameObjects[INFO_LIFES] = new StaticText(
      "Lifes: " + gameObjects[CHARACTER_NUMBER].getCharacterLifes(),
      this.widthOfAPlane * squareSizeX - 3 * squareSizeX,
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
            gameObjects[PLAYER_NUMBER].drawCharacter();
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
          case BOT_NUMBER:
            gameObjects[BOT_NUMBER].drawCharacter();
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
      tempArr = [];

      this.isTempArrClearExecuted = false;
      gameObjects[PLAYER_NUMBER].getBombsInfoCount() < 1 &&
        gameObjects[PLAYER_NUMBER].increaseBombsInfoCount();
      gameObjects[BOT_NUMBER].getBombsInfoCount() < 1 &&
        gameObjects[BOT_NUMBER].increaseBombsInfoCount();
    }, 700);
  };

  decreaseCharacterLifes = (CHARACTER_NUMBER) => {
    if (gameObjects[CHARACTER_NUMBER].getCharacterLifes() > 1) {
      gameObjects[CHARACTER_NUMBER].centreX =
        gameObjects[CHARACTER_NUMBER].getDefaultPositionX();
      gameObjects[CHARACTER_NUMBER].centreY =
        gameObjects[CHARACTER_NUMBER].getDefaultPositionY();

      gameObjects[CHARACTER_NUMBER].decreaseCharacterLifes();
    } else {
      gameObjects[CHARACTER_NUMBER].getCharacterLifes() > 0 &&
        gameObjects[CHARACTER_NUMBER].decreaseCharacterLifes();
      isGameOver = true;

      if (CHARACTER_NUMBER == PLAYER_NUMBER) {
        document.getElementById("btnReset").style.visibility = "visible";
        document.getElementById("messageInfo").innerHTML = "You have lost!";
        document.getElementById("messageInfo").style.visibility = "visible";
      } else {
        document.getElementById("btnReset").style.visibility = "visible";
        document.getElementById("messageInfo").style.color = "#7FFF00";
        document.getElementById("messageInfo").innerHTML = "You have won!";
        document.getElementById("messageInfo").style.visibility = "visible";
      }
    }
  };

  randomMoveDelay = () => {
    // console.log("co jest");
    this.movingProcess = true;
    setTimeout(() => {
      gameObjects[BOT_NUMBER].randomMove();
      this.movingProcess = false;
    }, 200);
  };

  restartTheGame = () => {
    console.log("restarting!");
    isGameOver = false;

    gameObjects[BOT_NUMBER].resetLifes();
    gameObjects[PLAYER_NUMBER].resetLifes();
    document.getElementById("btnReset").style.visibility = "hidden";
    document.getElementById("messageInfo").style.visibility = "hidden";

    plane = [];
    backupPlane.map((x) => {
      plane.push([...x]);
    });

    gameObjects[PLAYER_NUMBER].centreX = 3;
    gameObjects[PLAYER_NUMBER].centreY = 3;

    gameObjects[BOT_NUMBER].centreX = CHARACTER_SCALE - 4;
    gameObjects[BOT_NUMBER].centreY = CHARACTER_SCALE - 4;
  };

  playGameLoop() {
    if (this.displayGeneralInfo && this.everythingIsGenerated) {
      this.displayGeneralInfo(PLAYER_NUMBER);
    }
    if (gameObjects[PLAYER_NUMBER])
      if (gameObjects[PLAYER_NUMBER].getAvailableBombs() > 0) {
        this.placeABomb(PLAYER_NUMBER);
      }

    if (gameObjects[BOT_NUMBER])
      if (gameObjects[BOT_NUMBER].getAvailableBombs() > 0) {
        this.placeABomb(BOT_NUMBER);
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
