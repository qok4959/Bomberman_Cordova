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

    this.squareSizeX = canvas.width / this.widthOfAPlane;
    this.squareSizeY = canvas.height / this.widthOfAPlane;
    this.everythingIsGenerated = false;

    this.generateBorder();
    this.generateObjectsOnCanvas();

    this.isBombShocking = false;

    document.getElementById("btnReset").onclick = this.restartTheGame;
    //canvas offscreen backup
  }

  collisionDetection() {
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
    console.log(plane);
  };

  generateObjectsOnCanvas = () => {
    for (let i = 0; i < plane.length; i += 1) {
      for (let j = 0; j < plane[i].length; j += 1) {
        if (Math.random() * 10 > 9) {
          plane[i][j] = 1;
        }
      }
    }
    console.log(plane);

    plane[3][3] = 2;
    // plane[4][4] = 2;
    // plane[5][5] = 2;
    // plane[6][6] = 2;
    this.everythingIsGenerated = true;
  };

  placeABomb = () => {
    let posBombX = gameObjects[this.PLAYER_NUMBER].getCentreX();
    let posBombY = gameObjects[this.PLAYER_NUMBER].getCentreY();

    this.offScreenCtx.drawImage(
      tileBomb,
      posBombX,
      posBombY,
      this.tileSize,
      this.tileSize
    );
    setTimeout(() => {
      this.detonateABomb(posBombX, posBombY);
    }, 1000);
    gameObjects[this.PLAYER_NUMBER].setBomb(false);
  };

  // TODO fix this
  detonateABomb = (posX, posY) => {
    this.isBombShocking = true;

    this.bombRecovering();
  };

  //@TODO
  bombRecovering = () => {
    setTimeout(() => {
      gameObjects[this.PLAYER_NUMBER].recoverBomb();
      this.isBombShocking = false;
    }, 1000);
  };

  // TODO fix this
  isBombRadiusGoingThroughAWall = (posX, posY) => {};

  // TODO fix this
  displayGeneralInfo = () => {
    // gameObjects[INFO_BOMBS] = new StaticText(
    //   "Bombs: fix this",
    //   this.tileSize,
    //   this.tileSize * 0.9,
    //   "Times Roman",
    //   this.tileSize,
    //   "red"
    // );
    // gameObjects[INFO_LIFES] = new StaticText(
    //   "Lifes: " + characterLifes,
    //   (canvas.width / this.tileSize - 4) * this.tileSize,
    //   this.tileSize * 0.9,
    //   "Times Roman",
    //   this.tileSize,
    //   "red"
    // );
  };

  // TODO fix this
  checkBombRadiusCollisionWithCharacter = (posX, posY) => {
    this.isBombShocking &&
      !this.isBombRadiusGoingThroughAWall(posX, posY) &&
      this.decreaseCharacterLifes();
  };

  renderPlane = () => {
    console.log("renderPlane");
    plane.map((posX, indexX) => {
      posX.map((posY, indexY) => {
        console.log(indexX + " " + indexY + " " + this.squareSizeX);
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
              indexX * this.squareSizeX,
              indexY * this.squareSizeY,
              this.squareSizeX,
              this.squareSizeY
            );

            break;
          case 2:
            gameObjects[PLAYER_NUMBER].drawCharacter();
            break;
          case 3:
            break;
          case 4:
            break;
        }
      });
    });
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
    super.playGameLoop();
  }

  render() {
    super.render();
    if (this.renderPlane) this.renderPlane();
  }
}
