/* Author: Derek O Reilly, Dundalk Institute of Technology, Ireland.       */
/* A CanvasGame that implements collision detection.                       */
/* The game allows the user to walk a Character around a maze.              */
/* If the Character is guided to the maze exit, then a win message appears. */

class BotCanvas extends CanvasGame {
  constructor(player_number) {
    super();
    this.PLAYER_NUMBER = player_number;
    /* this.mazeCtx will be used for collision detection */
    this.offScreenCanvas = document.createElement("canvas");
    this.offScreenCtx = this.offScreenCanvas.getContext("2d", {
      willReadFrequently: true,
    });

    // offCtx = this.offScreenCtx;

    this.offScreenCanvas.width = canvas.width;
    this.offScreenCanvas.height = canvas.height;

    this.borderWidth = canvas.height / (CHARACTER_SCALE / 2);
    this.tileSize = canvas.height / (CHARACTER_SCALE - 2);
    this.everythingIsGenerated = false;

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

    if (gameObjects[this.PLAYER_NUMBER].getDirection() === UP) {
      let imageData = this.offScreenCtx.getImageData(
        gameObjects[this.PLAYER_NUMBER].getCentreX(),
        gameObjects[this.PLAYER_NUMBER].getCentreY(),
        Character_WIDTH,
        1
      );

      if (
        this.isTransparent(
          imageData,
          gameObjects[this.PLAYER_NUMBER].getCentreX(),
          gameObjects[this.PLAYER_NUMBER].getCentreY()
        )
      )
        gameObjects[this.PLAYER_NUMBER].setDirection(DOWN);
    } else if (gameObjects[this.PLAYER_NUMBER].getDirection() === LEFT) {
      let imageData = this.offScreenCtx.getImageData(
        gameObjects[this.PLAYER_NUMBER].getCentreX(),
        gameObjects[this.PLAYER_NUMBER].getCentreY(),
        1,
        Character_WIDTH
      );

      if (
        this.isTransparent(
          imageData,
          gameObjects[this.PLAYER_NUMBER].getCentreX(),
          gameObjects[this.PLAYER_NUMBER].getCentreY()
        )
      )
        gameObjects[this.PLAYER_NUMBER].setDirection(RIGHT);
    } else if (gameObjects[this.PLAYER_NUMBER].getDirection() === DOWN) {
      let imageData = this.offScreenCtx.getImageData(
        gameObjects[this.PLAYER_NUMBER].getCentreX(),
        gameObjects[this.PLAYER_NUMBER].getCentreY() + Character_WIDTH,
        Character_WIDTH,
        1
      );

      if (
        this.isTransparent(
          imageData,
          gameObjects[this.PLAYER_NUMBER].getCentreX(),
          gameObjects[this.PLAYER_NUMBER].getCentreY()
        )
      )
        gameObjects[this.PLAYER_NUMBER].setDirection(UP);

      if (gameObjects[this.PLAYER_NUMBER].getCentreY() > canvas.height) {
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
        gameObjects[WIN_MESSAGE].stopAndHide();
        gameObjects[WIN_MESSAGE].start(); /* render win message */
      }
    } else if (gameObjects[this.PLAYER_NUMBER].getDirection() === RIGHT) {
      let imageData = this.offScreenCtx.getImageData(
        gameObjects[this.PLAYER_NUMBER].getCentreX() + Character_WIDTH,
        gameObjects[this.PLAYER_NUMBER].getCentreY(),
        1,
        Character_WIDTH
      );

      if (
        this.isTransparent(
          imageData,
          gameObjects[this.PLAYER_NUMBER].getCentreX(),
          gameObjects[this.PLAYER_NUMBER].getCentreY()
        )
      )
        gameObjects[this.PLAYER_NUMBER].setDirection(LEFT);
    }
  }

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

  detonateABomb = (posX, posY) => {
    this.isBombShocking = true;
    let isTopColided = false,
      isLeftColided = false,
      isRightColided = false,
      isBottomColided = false;
    for (let i = 0; i < 3; i++) {
      if (i == 0) {
        gameObjects.push(
          new Explosion(explosionImage, posX, posY, this.tileSize)
        );
        gameObjects[gameObjects.length - 1].start();
        gameObjects[gameObjects.length - 1].stopAndHide();
        continue;
      }

      //top
      if (
        !this.isBombRadiusGoingThroughAWall(posX, posY + i * this.tileSize) &&
        !isTopColided
      ) {
        gameObjects.push(
          new Explosion(
            explosionImage,
            posX,
            posY + i * this.tileSize,
            this.tileSize
          )
        );
        gameObjects[gameObjects.length - 1].start();
        gameObjects[gameObjects.length - 1].stopAndHide();
      } else {
        isTopColided = true;
      }

      //right radius
      if (
        !this.isBombRadiusGoingThroughAWall(posX + i * this.tileSize, posY) &&
        !isRightColided
      ) {
        gameObjects.push(
          new Explosion(
            explosionImage,
            posX + i * this.tileSize,
            posY,
            this.tileSize
          )
        );
        gameObjects[gameObjects.length - 1].start();
        gameObjects[gameObjects.length - 1].stopAndHide();
      } else {
        isRightColided = true;
      }

      //left radius
      if (
        !this.isBombRadiusGoingThroughAWall(posX - i * this.tileSize, posY) &&
        !isLeftColided
      ) {
        gameObjects.push(
          new Explosion(
            explosionImage,
            posX - i * this.tileSize,
            posY,
            this.tileSize
          )
        );
        gameObjects[gameObjects.length - 1].start();
        gameObjects[gameObjects.length - 1].stopAndHide();
      } else {
        isLeftColided = true;
      }

      //bottom radius
      if (
        !this.isBombRadiusGoingThroughAWall(posX, posY - i * this.tileSize) &&
        !isBottomColided
      ) {
        gameObjects.push(
          new Explosion(
            explosionImage,
            posX,
            posY - i * this.tileSize,
            this.tileSize
          )
        );
        gameObjects[gameObjects.length - 1].start();
        gameObjects[gameObjects.length - 1].stopAndHide();
      } else {
        isBottomColided = true;
      }

      //recurrency
      this.resetOffsetCtx(1, 0);
      this.resetOffsetCtx(1, 900);
    }

    this.bombRecovering();
  };

  bombRecovering = () => {
    setTimeout(() => {
      gameObjects[this.PLAYER_NUMBER].recoverBomb();
      this.isBombShocking = false;
      this.clearUnnecessaryGameObjects();
    }, 1000);
  };

  resetOffsetCtx = (x, delay) => {
    setTimeout(() => {
      offCtx.clearRect(0, 0, canvas.width, canvas.height);

      offCtx.drawImage(this.canvasBack, 0, 0);
      if (this.displayGeneralInfo) {
        this.displayGeneralInfo();
      }

      if (x > 0) this.resetOffsetCtx(x - 1);
    }, delay);
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

  isBombRadiusGoingThroughAWall = (posX, posY) => {
    for (let el of plane) {
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

  checkBombRadiusCollisionWithCharacter = (posX, posY) => {
    this.isBombShocking &&
      !this.isBombRadiusGoingThroughAWall(posX, posY) &&
      this.decreaseCharacterLifes();
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
        "WINNER!!",
        canvas.width / 2 - 3 * this.tileSize,
        canvas.height / 2,
        "Times Roman",
        this.tileSize,
        "green"
      );
      gameObjects[WIN_MESSAGE].start();
      document.getElementById("btnReset").style.visibility = "visible";
    }
  };

  clearUnnecessaryGameObjects = () => {
    for (let i = gameObjects.length; i >= 6; i--) {
      console.log("clearObjects" + gameObjects.length);
      gameObjects[gameObjects.length - 1].stopAndHide();
      gameObjects.pop();
    }
  };

  playGameLoop() {
    if (this.PLAYER_NUMBER) {
      if (gameObjects[this.PLAYER_NUMBER].getPlacingBomb()) {
        this.placeABomb();
      }
    }

    if (this.displayGeneralInfo && this.everythingIsGenerated) {
      this.displayGeneralInfo();
    }
    super.playGameLoop();
  }

  moveRandomly = () => {
    setTimeout(() => {
      let moveDirection = Math.floor(Math.random() * 100);
      //   gameObjects[this.PLAYER_NUMBER].setDirection(UP)
      switch (moveDirection) {
        case 1:
          gameObjects[this.PLAYER_NUMBER].setDirection(UP);
          break;
        case 2:
          gameObjects[this.PLAYER_NUMBER].setDirection(LEFT);
          break;
        case 3:
          gameObjects[this.PLAYER_NUMBER].setDirection(DOWN);
          break;
        case 4:
          gameObjects[this.PLAYER_NUMBER].setDirection(RIGHT);
          break;
      }
    }, 10);
  };
  render() {
    super.render();
    if (this.moveRandomly) this.moveRandomly();
    if (this.offScreenCanvas) ctx.drawImage(offCtx, 0, 0);
  }
}
