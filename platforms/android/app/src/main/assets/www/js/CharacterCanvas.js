/* Author: Derek O Reilly, Dundalk Institute of Technology, Ireland.       */
/* A CanvasGame that implements collision detection.                       */
/* The game allows the user to walk a Character around a maze.              */
/* If the Character is guided to the maze exit, then a win message appears. */

class CharacterCanvas extends CanvasGame {
  constructor() {
    super();

    /* this.mazeCtx will be used for collision detection */
    this.offScreenCanvas = document.createElement("canvas");
    this.offScreenCtx = this.offScreenCanvas.getContext("2d", {
      willReadFrequently: true,
    });
    offCtx = this.offScreenCtx;

    this.offScreenCanvas.width = canvas.width;
    this.offScreenCanvas.height = canvas.height;

    this.borderWidth = canvas.height / (CHARACTER_SCALE / 2);
    this.tileSize = canvas.height / (CHARACTER_SCALE - 2);
    this.everythingIsGenerated = false;
    this.arrOfObjects = [];
    this.generateBorder();
    this.generateObjectsOnCanvas();
    this.isBombShocking = false;

    this.canvasBack = document.createElement("canvas");
    this.canvasBack.width = canvas.width;
    this.canvasBack.height = canvas.height;
    this.canvasBack.ctx = this.canvasBack.getContext("2d");
    this.canvasBack.ctx.drawImage(this.offScreenCanvas, 0, 0);

    document.getElementById("btnReset").onclick = this.restartTheGame;
    //canvas offscreen backup
  }

  collisionDetection() {
    if (isGameOver) return;
    if (!this.offScreenCtx) {
      return;
    }

    if (gameObjects[CHARACTER].getDirection() === UP) {
      let imageData = this.offScreenCtx.getImageData(
        gameObjects[CHARACTER].getCentreX(),
        gameObjects[CHARACTER].getCentreY(),
        Character_WIDTH,
        1
      );

      if (
        this.isTransparent(
          imageData,
          gameObjects[CHARACTER].getCentreX(),
          gameObjects[CHARACTER].getCentreY()
        )
      )
        gameObjects[CHARACTER].setDirection(DOWN);
    } else if (gameObjects[CHARACTER].getDirection() === LEFT) {
      let imageData = this.offScreenCtx.getImageData(
        gameObjects[CHARACTER].getCentreX(),
        gameObjects[CHARACTER].getCentreY(),
        1,
        Character_WIDTH
      );

      if (
        this.isTransparent(
          imageData,
          gameObjects[CHARACTER].getCentreX(),
          gameObjects[CHARACTER].getCentreY()
        )
      )
        gameObjects[CHARACTER].setDirection(RIGHT);
    } else if (gameObjects[CHARACTER].getDirection() === DOWN) {
      let imageData = this.offScreenCtx.getImageData(
        gameObjects[CHARACTER].getCentreX(),
        gameObjects[CHARACTER].getCentreY() + Character_WIDTH,
        Character_WIDTH,
        1
      );

      if (
        this.isTransparent(
          imageData,
          gameObjects[CHARACTER].getCentreX(),
          gameObjects[CHARACTER].getCentreY()
        )
      )
        gameObjects[CHARACTER].setDirection(UP);

      if (gameObjects[CHARACTER].getCentreY() > canvas.height) {
        /* Player has won */
        for (
          let i = 0;
          i < gameObjects.length;
          i++ /* stop all gameObjects from animating */
        ) {
          gameObjects[i].stop();
        }
        gameObjects[WIN_MESSAGE] = new StaticText(
          "Well Done!",
          20,
          280,
          "Times Roman",
          100,
          "red"
        );
        gameObjects[WIN_MESSAGE].start(); /* render win message */
      }
    } else if (gameObjects[CHARACTER].getDirection() === RIGHT) {
      let imageData = this.offScreenCtx.getImageData(
        gameObjects[CHARACTER].getCentreX() + Character_WIDTH,
        gameObjects[CHARACTER].getCentreY(),
        1,
        Character_WIDTH
      );

      if (
        this.isTransparent(
          imageData,
          gameObjects[CHARACTER].getCentreX(),
          gameObjects[CHARACTER].getCentreY()
        )
      )
        gameObjects[CHARACTER].setDirection(LEFT);
    }
  }

  generateBorder = () => {
    for (let i = 0; i < canvas.width; i += this.tileSize) {
      for (let j = 0; j < canvas.height; j += this.tileSize) {
        if (j == 0) {
          this.arrOfObjects.push({ x: i, y: j });
          this.offScreenCtx.drawImage(
            tileObstacle,
            i,
            j,
            this.tileSize,
            this.tileSize
          );
          continue;
        }

        if (i == 0) {
          this.arrOfObjects.push({ x: i, y: j });
          this.offScreenCtx.drawImage(
            tileObstacle,
            i,
            j,
            this.tileSize,
            this.tileSize
          );
          continue;
        }

        if (j >= canvas.height - this.tileSize) {
          this.arrOfObjects.push({ x: i, y: j });
          this.offScreenCtx.drawImage(
            tileObstacle,
            i,
            canvas.height - this.tileSize,
            this.tileSize,
            this.tileSize
          );
        }

        if (i >= canvas.width - this.tileSize) {
          this.arrOfObjects.push({ x: i, y: j });
          this.offScreenCtx.drawImage(
            tileObstacle,
            canvas.width - this.tileSize,
            j,
            this.tileSize,
            this.tileSize
          );
        }
      }
    }
  };

  generateObjectsOnCanvas = () => {
    for (
      let i = this.borderWidth;
      i < canvas.width - this.borderWidth;
      i += this.tileSize
    ) {
      for (
        let j = this.borderWidth;
        j < canvas.height - this.borderWidth;
        j += this.tileSize
      ) {
        if (Math.random() * 10 > 9) {
          this.offScreenCtx.drawImage(
            tileObstacle,
            i,
            j,
            this.tileSize,
            this.tileSize
          );
          this.arrOfObjects.push({ x: i, y: j });
        }
      }
    }
    this.everythingIsGenerated = true;
  };

  placeABomb = () => {
    let posBombX = gameObjects[CHARACTER].getCentreX();
    let posBombY = gameObjects[CHARACTER].getCentreY();

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
    gameObjects[CHARACTER].setBomb(false);
  };

  detonateABomb = (posX, posY) => {
    this.isBombShocking = true;
    let isTopColided = false,
      isLeftColided = false,
      isRightColided = false,
      isBottomColided = false;
    for (let i = 0; i < 3; i++) {
      if (i == 0) {
        gameObjects[gameObjects.length] = new Explosion(
          explosionImage,
          posX,
          posY,
          this.tileSize
        );
        gameObjects[gameObjects.length - 1].start();
        continue;
      }

      //top
      if (!this.isWallNearby(posX, posY + i * this.tileSize) && !isTopColided) {
        gameObjects[gameObjects.length] = new Explosion(
          explosionImage,
          posX,
          posY + i * this.tileSize,
          this.tileSize
        );
        gameObjects[gameObjects.length - 1].start();
      } else {
        isTopColided = true;
      }

      //right radius
      if (
        !this.isWallNearby(posX + i * this.tileSize, posY) &&
        !isRightColided
      ) {
        gameObjects[gameObjects.length] = new Explosion(
          explosionImage,
          posX + i * this.tileSize,
          posY,
          this.tileSize
        );
        gameObjects[gameObjects.length - 1].start();
      } else {
        isRightColided = true;
      }

      //left radius
      if (
        !this.isWallNearby(posX - i * this.tileSize, posY) &&
        !isLeftColided
      ) {
        gameObjects[gameObjects.length] = new Explosion(
          explosionImage,
          posX - i * this.tileSize,
          posY,
          this.tileSize
        );
        gameObjects[gameObjects.length - 1].start();
      } else {
        isLeftColided = true;
      }

      //bottom radius
      if (
        !this.isWallNearby(posX, posY - i * this.tileSize) &&
        !isBottomColided
      ) {
        gameObjects[gameObjects.length] = new Explosion(
          explosionImage,
          posX,
          posY - i * this.tileSize,
          this.tileSize
        );
        gameObjects[gameObjects.length - 1].start();
      } else {
        isBottomColided = true;
      }

      //recurrency
      this.resetOffsetCtx(20);
    }

    this.bombRecovering();
  };

  bombRecovering = () => {
    setTimeout(() => {
      gameObjects[CHARACTER].recoverBomb();
      this.isBombShocking = false;
    }, 1000);
  };

  resetOffsetCtx = (x) => {
    setTimeout(() => {
      offCtx.reset();

      offCtx.drawImage(this.canvasBack, 0, 0);
      if (this.displayGeneralInfo) {
        this.displayGeneralInfo();
      }

      if (x > 0) this.resetOffsetCtx(x - 1);
    }, 40);
  };

  isTransparent = (arr, posX, posY) => {
    let tempIsTransparent = false;
    for (let i = 3; i < arr.data.length - 4; i += 4) {
      if (arr.data[i] === 255) tempIsTransparent = true;
    }

    //bomb radius collision
    tempIsTransparent && this.checkBombRadiusCollisionWithCharacter(posX, posY);

    return tempIsTransparent;
  };

  isWallNearby = (posX, posY) => {
    for (let el of this.arrOfObjects) {
      if (
        (posX >= el.x &&
          posX <= el.x + this.tileSize &&
          posY >= el.y &&
          posY <= el.y + this.tileSize) ||
        (posX + this.tileSize >= el.x &&
          posX + this.tileSize <= el.x + this.tileSize &&
          posY >= el.y &&
          posY <= el.y + this.tileSize) ||
        (posX + this.tileSize >= el.x &&
          posX + this.tileSize <= el.x + this.tileSize &&
          posY + this.tileSize >= el.y &&
          posY + this.tileSize <= el.y + this.tileSize) ||
        (posX >= el.x &&
          posX <= el.x + this.tileSize &&
          posY + this.tileSize >= el.y &&
          posY + this.tileSize <= el.y + this.tileSize)
      ) {
        return true;
      }
    }

    return false;
  };

  displayGeneralInfo = () => {
    gameObjects[INFO_BOMBS] = new StaticText(
      "Bombs: " + gameObjects[CHARACTER].getBombsToPlace(),
      this.tileSize,
      this.tileSize * 0.9,
      "Times Roman",
      this.tileSize,
      "red"
    );

    gameObjects[INFO_LIFES] = new StaticText(
      "Lifes: " + characterLifes,
      (canvas.width / this.tileSize - 4) * this.tileSize,
      this.tileSize * 0.9,
      "Times Roman",
      this.tileSize,
      "red"
    );

    gameObjects[INFO_BOMBS].start();
    gameObjects[INFO_LIFES].start();
  };

  checkBombRadiusCollisionWithCharacter = (posX, posY) => {
    this.isBombShocking &&
      !this.isWallNearby(posX, posY) &&
      this.decreaseCharacterLifes();
  };

  decreaseCharacterLifes = () => {
    if (characterLifes > 1) {
      gameObjects[CHARACTER].centreX = this.tileSize;
      gameObjects[CHARACTER].centreY = this.tileSize;
      --characterLifes;
    } else {
      --characterLifes;
      isGameOver = true;
      /* Player has won */
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
      gameObjects[WIN_MESSAGE].start(); /* render win message */
      document.getElementById("btnReset").style.visibility = "visible";
    }
  };

  restartTheGame = () => {
    console.log("restarting!");
    isGameOver = false;
    characterLifes = 1;

    for (let i = gameObjects.length; i >= 3; i--) {
      gameObjects.pop();
    }
    console.log("length:" + gameObjects.length);
    for (
      let i = 0;
      i < gameObjects.length;
      i++ /* stop all gameObjects from animating */
    ) {
      gameObjects[i].start();
    }
    this.resetOffsetCtx(1);
    document.getElementById("btnReset").style.visibility = "hidden";

    gameObjects[CHARACTER].centreX = this.tileSize;
    gameObjects[CHARACTER].centreY = this.tileSize;
    // onAllAssetsLoaded();
  };
  playGameLoop() {
    if (gameObjects[CHARACTER].getPlacingBomb()) {
      this.placeABomb();
    }

    if (this.displayGeneralInfo && this.everythingIsGenerated) {
      this.displayGeneralInfo();
    }
    // this.displayGeneralInfo();
    super.playGameLoop();
  }

  render() {
    super.render();

    if (this.offScreenCanvas) ctx.drawImage(this.offScreenCanvas, 0, 0);
  }
}
