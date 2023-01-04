/* Author: Derek O Reilly, Dundalk Institute of Technology, Ireland.       */
/* A CanvasGame that implements collision detection.                       */
/* The game allows the user to walk a Character around a maze.              */
/* If the Character is guided to the maze exit, then a win message appears. */

class Game extends CanvasGame {
  constructor() {
    super();
    this.widthOfAPlane = CHARACTER_SCALE;

    /* this.mazeCtx will be used for collision detection */

    // squareSizeX = canvas.width / this.widthOfAPlane;
    // squareSizeY = canvas.height / this.widthOfAPlane;
    this.everythingIsGenerated = false;

    this.generateBorder();
    this.generateObjectsOnCanvas();

    this.isTempArrClearExecuted = false;
    this.arrReturn = [];

    document.getElementById("btnReset").onclick = this.restartTheGame;
  }

  clearPlane = () => {};

  collisionDetection() {
    // for
    tempArr.map((posX, indexX) => {
      posX.map((posY, indexY) => {
        if (tempArr[indexX][indexY] == 3) {
          if (
            indexX == gameObjects[PLAYER_NUMBER].getCentreX() &&
            indexY == gameObjects[PLAYER_NUMBER].getCentreY()
          ) {
            console.log("lose a point of health");
            this.decreaseCharacterLifes(PLAYER_NUMBER);
          }
        }
      });
    });
    // console.log(
    //   gameObjects[CHARACTER_NUMBER].getCentreX() +
    //     " " +
    //     gameObjects[CHARACTER_NUMBER].getCentreY()
    // );

    if (isGameOver) return;
  }

  generateBorder = () => {
    for (let i = 0; i < this.widthOfAPlane; i++) {
      let tempArr = [];
      for (let j = 0; j < this.widthOfAPlane; j++) {
        if (i == 0 || i == this.widthOfAPlane - 1) {
          tempArr.push(1);
          continue;
        }
        if (j == 0 || j == this.widthOfAPlane - 1) {
          tempArr.push(1);
          continue;
        }

        tempArr.push(0);
      }
      plane.push(tempArr);
    }
    // console.log(plane);
  };

  generateObjectsOnCanvas = () => {
    for (let i = 0; i < plane.length; i += 1) {
      for (let j = 0; j < plane[i].length; j += 1) {
        if (
          (i == 3 && j == 3) ||
          (i == CHARACTER_SCALE - 4 && j == CHARACTER_SCALE - 4)
        ) {
          plane[i][j] = 0;
          continue;
        }

        if (Math.random() * 10 > 9) {
          plane[i][j] = 1;
        }
      }
    }

    plane[0][0] = 2;
    plane[CHARACTER_SCALE - 1][CHARACTER_SCALE - 1] = 5;

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
    plane[posBombX][posBombY] = 4;

    setTimeout(() => {
      this.detonateABomb(posBombX, posBombY);
    }, 600);

    // gameObjects[CHARACTER_NUMBER].setBomb(false);
  };

  // TODO fix this

  detonateABomb = (posX, posY) => {
    // console.log("detonateABomb");

    const bombRadius = 3;
    let topColided = false,
      leftColided = false,
      bottomColided = false,
      rightColided = false;
    for (let i = 0; i < bombRadius; i++) {
      //middle
      if (i == 0) {
        plane[posX + i][posY] = 3;
        this.arrReturn.push({ x: posX, y: posY });
        continue;
      }

      //right
      if (posX + i < this.widthOfAPlane) {
        if (plane[posX + i][posY] != 1 && !rightColided) {
          this.arrReturn.push({ x: posX + i, y: posY });
          plane[posX + i][posY] = 3;
        } else rightColided = true;
      }

      //left
      if (posX - i >= 0) {
        if (plane[posX - i][posY] != 1 && !leftColided) {
          this.arrReturn.push({ x: posX - i, y: posY });
          plane[posX - i][posY] = 3;
        } else leftColided = true;
      }

      //top
      if (posY + i < this.widthOfAPlane) {
        if (plane[posX][posY + i] != 1 && !topColided) {
          plane[posX][posY + i] = 3;
          this.arrReturn.push({ x: posX, y: posY + i });
        } else topColided = true;
      }

      //bottom
      if (posY - i >= 0) {
        if (plane[posX][posY - i] != 1 && !bottomColided) {
          this.arrReturn.push({ x: posX, y: posY - i });
          plane[posX][posY - i] = 3;
        } else bottomColided = true;
      }
    }

    plane.map((x) => {
      tempArr.push([...x]);
    });
  };

  displayGeneralInfo = (CHARACTER_NUMBER) => {
    // gameObjects[INFO_BOMBS] = new StaticText(
    //   "Bombs: " + gameObjects[CHARACTER_NUMBER].getBombsInfoCount(),
    //   3 * squareSizeX,
    //   (squareSizeY * 5) / 6,
    //   "Times Roman",
    //   squareSizeY,
    //   "#7FFF00"
    // );
    // gameObjects[INFO_LIFES] = new StaticText(
    //   "Lifes: " + characterLifes,
    //   this.widthOfAPlane * squareSizeX - 3 * squareSizeX,
    //   (squareSizeY * 5) / 6,
    //   "Times Roman",
    //   squareSizeY,
    //   "#7FFF00"
    // );
    // gameObjects[INFO_BOMBS].drawTxt();
    // gameObjects[INFO_LIFES].drawTxt();
  };

  renderPlane = () => {
    // console.log("renderPlane");
    plane.map((posX, indexX) => {
      posX.map((posY, indexY) => {
        switch (posY) {
          case 0:
            // ctx.drawImage(tileObstacle, 100, 100, 100, 100);
            // ctx.drawImage(
            //   tileObstacle,
            //   indexX * this.squareSize,
            //   indexY * this.squareSIze,
            //   this.squareSize,
            //   this.squareSize
            // );
            break;
          case 1:
            ctx.drawImage(
              tileObstacle,
              indexX * squareSizeX,
              indexY * squareSizeY,
              squareSizeX,
              squareSizeY
            );
            this.displayGeneralInfo();
            break;
          case 2:
            gameObjects[PLAYER_NUMBER].drawCharacter();
            ctx.drawImage(
              tileObstacle,
              indexX * squareSizeX,
              indexY * squareSizeY,
              squareSizeX,
              squareSizeY
            );
            break;
          case 3:
            let ind = Math.floor(Math.random() * (99999 - 10) + 10);
            gameObjects[ind] = new Explosion(
              explosionImage,
              indexX,
              indexY,
              squareSizeX,
              squareSizeY
            );
            gameObjects[ind].start();

            this.clearPlane(indexX, indexY);

            !this.isTempArrClearExecuted && this.tempArrClear(PLAYER_NUMBER);
            break;
          case 4:
            ctx.drawImage(
              tileBomb,
              indexX * squareSizeX,
              indexY * squareSizeY,
              squareSizeX,
              squareSizeY
            );
            break;
          case 5:
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
    plane[posX][posY] = 0;
  };

  tempArrClear = (CHARACTER_NUMBER) => {
    this.isTempArrClearExecuted = true;
    setTimeout(() => {
      tempArr = [];

      this.isTempArrClearExecuted = false;
      gameObjects[CHARACTER_NUMBER].increaseBombsInfoCount();
    }, 700);
  };

  decreaseCharacterLifes = (CHARACTER_NUMBER) => {
    if (characterLifes > 1) {
      gameObjects[CHARACTER_NUMBER].centreX = 3;
      gameObjects[CHARACTER_NUMBER].centreY = 3;
      --characterLifes;
    } else {
      characterLifes > 0 && --characterLifes;
      isGameOver = true;
      /* Player has lost */
      // for (
      //   let i = 0;
      //   i < gameObjects.length;
      //   i++ /* stop all gameObjects from animating */
      // ) {
      //   gameObjects[i].stop();
      // }

      document.getElementById("btnReset").style.visibility = "visible";
    }
  };

  restartTheGame = (CHARACTER_NUMBER, BOT_NUMBER) => {
    console.log("restarting!");
    isGameOver = false;
    characterLifes = 3;

    // gameObjects[this.CHARACTER_NUMBER].start();

    document.getElementById("btnReset").style.visibility = "hidden";

    plane = [];
    backupPlane.map((x) => {
      plane.push([...x]);
    });

    gameObjects[CHARACTER_NUMBER].centreX = 3;
    gameObjects[CHARACTER_NUMBER].centreY = 3;

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
    super.playGameLoop();
  }

  render() {
    super.render();
    if (this.renderPlane) this.renderPlane();
  }
}
