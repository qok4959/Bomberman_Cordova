/* Author: Derek O Reilly, Dundalk Institute of Technology, Ireland.       */
/* A CanvasGame that implements collision detection.                       */
/* The game allows the user to walk a Character around a maze.              */
/* If the Character is guided to the maze exit, then a win message appears. */

class Game extends CanvasGame {
  constructor() {
    super();
    this.widthOfAPlane = CHARACTER_SCALE;
    this.PLAYER_NUMBER = 2;
    /* this.mazeCtx will be used for collision detection */

    // squareSizeX = canvas.width / this.widthOfAPlane;
    // squareSizeY = canvas.height / this.widthOfAPlane;
    this.everythingIsGenerated = false;

    this.generateBorder();
    this.generateObjectsOnCanvas();

    this.arrReturn = [];

    document.getElementById("btnReset").onclick = this.restartTheGame;
    //canvas offscreen backup
  }

  collisionDetection() {
    // plane.map((posX, indexX) => {
    //   posX.map((posY, indexY) => {
    //     if (plane[indexX][indexY] == 3) {
    //       if (
    //         indexX == gameObjects[PLAYER_NUMBER].getCentreX() &&
    //         indexY == gameObjects[PLAYER_NUMBER].getCentreY()
    //       ) {
    //         console.log("lose a point of health");
    //       }
    //     }
    //   });
    // });

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
        if (Math.random() * 10 > 9) {
          plane[i][j] = 1;
        }
      }
    }

    plane[3][3] = 2;

    gameObjects[PLAYER_NUMBER].setCentreX(3);
    gameObjects[PLAYER_NUMBER].setCentreY(3);
    this.everythingIsGenerated = true;
    console.log(plane);
  };

  placeABomb = () => {
    gameObjects[PLAYER_NUMBER].decreaseBombsToPlace();
    let posBombX = gameObjects[PLAYER_NUMBER].getBombPosX();
    let posBombY = gameObjects[PLAYER_NUMBER].getBombPosY();
    console.log(posBombX + " " + posBombY);
    plane[posBombX][posBombY] = 4;

    setTimeout(() => {
      this.detonateABomb(posBombX, posBombY);
    }, 600);

    // gameObjects[PLAYER_NUMBER].setBomb(false);
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

    this.bombRecovering();
  };

  // TODO
  bombRecovering = () => {
    // setTimeout(() => {
    //   // gameObjects[PLAYER_NUMBER].recoverBomb();
    //   for (let i = 0; i < this.arrReturn.length; i++) {
    //     plane[this.arrReturn[i].x][this.arrReturn[i].y] = 0;
    //   }
    //   // console.log("arrReturn" + this.arrReturn.length);
    //   // console.log(plane);
    // }, 100);
  };

  // TODO fix this
  isBombRadiusGoingThroughAWall = (posX, posY) => {};

  displayGeneralInfo = () => {
    gameObjects[INFO_BOMBS] = new StaticText(
      "Bombs: " +
        (gameObjects[PLAYER_NUMBER].getMaxBombs() -
          gameObjects[PLAYER_NUMBER].getBombsToPlace()),
      3 * squareSizeX,
      (squareSizeY * 5) / 6,
      "Times Roman",
      squareSizeY,
      "red"
    );
    gameObjects[INFO_LIFES] = new StaticText(
      "Lifes: " + characterLifes,
      this.widthOfAPlane * squareSizeX - 3 * squareSizeX,
      (squareSizeY * 5) / 6,
      "Times Roman",
      squareSizeY,
      "red"
    );

    gameObjects[INFO_BOMBS].drawTxt();
    gameObjects[INFO_LIFES].drawTxt();
  };

  // TODO fix this
  checkBombRadiusCollisionWithCharacter = (posX, posY) => {
    this.decreaseCharacterLifes();
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
            break;
          case 3:
            // console.log("case 3");

            if (
              gameObjects[PLAYER_NUMBER].getCentreX() == indexX &&
              gameObjects[PLAYER_NUMBER].getCentreY() == indexY
            ) {
              console.log("lose a point of health");
            }
            // let explo = new Explosion(
            //   explosionImage,
            //   indexX,
            //   indexY,
            //   squareSizeX,
            //   squareSizeY
            // );
            let ind = indexX * indexY;
            gameObjects[ind] = new Explosion(
              explosionImage,
              indexX,
              indexY,
              squareSizeX,
              squareSizeY
            );
            gameObjects[ind].start();

            // if (
            //    gameObjects[ind].isDisplayed() &&
            //   gameObjects[PLAYER_NUMBER].getCentreX() == indexX &&
            //   gameObjects[PLAYER_NUMBER].getCentreY() == indexY
            // ) {
            //   console.log("killed");
            // }
            // setTimeout(() => {
            // plane[indexX][indexY] = 0;
            // }, 1000);
            this.clearPlane(indexX, indexY);
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
        }
      });
    });
  };

  clearPlane = (posX, posY) => {
    setTimeout(() => {
      plane[posX][posY] = 0;
    }, 1000);
  };

  decreaseCharacterLifes = () => {
    if (characterLifes > 1) {
      gameObjects[this.PLAYER_NUMBER].centreX = this.tileSize * 2;
      gameObjects[this.PLAYER_NUMBER].centreY = this.tileSize * 2;
      --characterLifes;
    } else {
      --characterLifes;
      isGameOver = true;
      /* Player has lost */
      for (
        let i = 0;
        i < gameObjects.length;
        i++ /* stop all gameObjects from animating */
      ) {
        gameObjects[i].stop();
      }
      gameObjects[WIN_MESSAGE] = new StaticText(
        "Game over!",
        canvas.width / 2 - 3 * this.tileSize,
        canvas.height / 2,
        "Times Roman",
        this.tileSize,
        "red"
      );
      gameObjects[WIN_MESSAGE].start();
      document.getElementById("btnReset").style.visibility = "visible";
    }
  };

  restartTheGame = () => {
    console.log("restarting!");
    isGameOver = false;
    characterLifes = 1;

    gameObjects[this.PLAYER_NUMBER].start();

    document.getElementById("btnReset").style.visibility = "hidden";

    gameObjects[this.PLAYER_NUMBER].centreX = this.tileSize * 2;
    gameObjects[this.PLAYER_NUMBER].centreY = this.tileSize * 2;
  };

  playGameLoop() {
    if (this.displayGeneralInfo && this.everythingIsGenerated) {
      this.displayGeneralInfo();
    }
    if (gameObjects[PLAYER_NUMBER])
      if (gameObjects[PLAYER_NUMBER].getBombsToPlace() > 0) {
        this.placeABomb();
      }
    super.playGameLoop();
  }

  render() {
    super.render();
    if (this.renderPlane) this.renderPlane();
  }
}
