/* Author: Derek O Reilly, Dundalk Institute of Technology, Ireland.       */
/* A CanvasGame that implements collision detection.                       */
/* The game allows the user to walk a Character around a maze.              */
/* If the Character is guided to the maze exit, then a win message appears. */

class CharacterCanvas extends CanvasGame {
  constructor() {
    super();

    /* this.mazeCtx will be used for collision detection */
    this.offScreenCanvas = document.createElement("canvas");
    offCtx = this.offScreenCtx = this.offScreenCanvas.getContext("2d", {
      willReadFrequently: true,
    });
    this.offScreenCanvas.width = canvas.width;
    this.offScreenCanvas.height = canvas.height;

    this.borderWidth = canvas.height / (CHARACTER_SCALE / 2);
    this.tileSize = canvas.height / (CHARACTER_SCALE - 2);

    this.generateBorder();
    this.generateObjectsOnCanvas();
  }

  collisionDetection() {
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

      if (this.isTransparent(imageData))
        gameObjects[CHARACTER].setDirection(DOWN);
    } else if (gameObjects[CHARACTER].getDirection() === LEFT) {
      let imageData = this.offScreenCtx.getImageData(
        gameObjects[CHARACTER].getCentreX(),
        gameObjects[CHARACTER].getCentreY(),
        1,
        Character_WIDTH
      );

      if (this.isTransparent(imageData))
        gameObjects[CHARACTER].setDirection(RIGHT);
    } else if (gameObjects[CHARACTER].getDirection() === DOWN) {
      let imageData = this.offScreenCtx.getImageData(
        gameObjects[CHARACTER].getCentreX(),
        gameObjects[CHARACTER].getCentreY() + Character_WIDTH,
        Character_WIDTH,
        1
      );

      if (this.isTransparent(imageData))
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

      if (this.isTransparent(imageData))
        gameObjects[CHARACTER].setDirection(LEFT);
    }
  }

  generateBorder = () => {
    for (let i = 0; i < canvas.width; i += this.tileSize) {
      for (let j = 0; j < canvas.height; j += this.tileSize) {
        if (j == 0) {
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
          this.offScreenCtx.drawImage(
            tileObstacle,
            i,
            canvas.height - this.tileSize,
            this.tileSize,
            this.tileSize
          );
        }

        if (i >= canvas.width - this.tileSize) {
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
        if (Math.random() * 10 > 9)
          this.offScreenCtx.drawImage(
            tileObstacle,
            i,
            j,
            this.tileSize,
            this.tileSize
          );
      }
    }
  };

  placeABomb = () => {
    console.log("bomb has been placed");

    let posBombX = gameObjects[CHARACTER].getCentreX();
    let posBombY = gameObjects[CHARACTER].getCentreY();

    // this.offScreenCtx.drawImage(
    //   tileBomb,
    //   posBombX,
    //   posBombY,
    //   this.tileSize,
    //   this.tileSize
    // );
    setTimeout(() => {
      this.detonateABomb(posBombX, posBombY);
    }, 3000);
    gameObjects[CHARACTER].setBomb(false);
  };

  detonateABomb = (posX, posY) => {
    // for (let i = 0; i < 3; i++) {
    //   this.offScreenCtx.drawImage(
    //     explosionBase,
    //     posX + i * this.tileSize,
    //     posY,
    //     this.tileSize,
    //     this.tileSize
    //   );

    //   this.offScreenCtx.drawImage(
    //     explosionBase,
    //     posX,
    //     posY + i * this.tileSize,
    //     this.tileSize,
    //     this.tileSize
    //   );

    //   this.offScreenCtx.drawImage(
    //     explosionBase,
    //     posX - i * this.tileSize,
    //     posY,
    //     this.tileSize,
    //     this.tileSize
    //   );

    //   this.offScreenCtx.drawImage(
    //     explosionBase,
    //     posX,
    //     posY - i * this.tileSize,
    //     this.tileSize,
    //     this.tileSize
    //   );
    // }
    for (let i = 0; i < 3; i++) {
      gameObjects[gameObjects.length] = new Explosion(
        explosionImage,
        posX,
        posY + i * this.tileSize,
        this.tileSize
      );
      gameObjects[gameObjects.length - 1].start();
      this.removeObject();

      gameObjects[gameObjects.length] = new Explosion(
        explosionImage,
        posX + i * this.tileSize,
        posY,
        this.tileSize
      );
      gameObjects[gameObjects.length - 1].start();
      this.removeObject();
      gameObjects[gameObjects.length] = new Explosion(
        explosionImage,
        posX - i * this.tileSize,
        posY,
        this.tileSize
      );
      gameObjects[gameObjects.length - 1].start();
      this.removeObject();

      gameObjects[gameObjects.length] = new Explosion(
        explosionImage,
        posX,
        posY - i * this.tileSize,
        this.tileSize
      );
      gameObjects[gameObjects.length - 1].start();
      this.removeObject();
    }

    // gameObjects[5] = new Explosion(explosionImage, posX, posY, this.tileSize);
    // gameObjects[5].start();

    // gameObjects.pop();
    // console.log(gameObjects.length);
    // gameObjects[gameObjects.length] = new Explosion(
    //   explosionImage,
    //   posX,
    //   posY,
    //   this.tileSize
    // );
    // console.log(gameObjects.length);
    // gameObjects[gameObjects.length - 1].start();
    // console.log(gameObjects.length);
    // gameObjects.pop();
    // console.log(gameObjects.length);

    // gameObjects[5].start();

    console.log("detonating " + posX + " " + posY);
  };

  removeObject = () => {
    setTimeout(() => {
      gameObjects.pop();
      console.log("popping");
    }, 3000);
  };

  isTransparent = (arr) => {
    for (let i = 3; i < arr.data.length - 4; i += 4) {
      if (arr.data[i] === 255) return true;
    }

    return false;
  };

  destroyAWall = () => {
    let imageData = this.offScreenCtx.getImageData(
      gameObjects[CHARACTER].getCentreX(),
      gameObjects[CHARACTER].getCentreY(),
      Character_WIDTH,
      3
    );
    for (let i = 0; i < imageData.data.length; i++) {
      imageData.data[i + 3] = 0;
    }

    this.offScreenCtx.putImageData(
      imageData,
      gameObjects[CHARACTER].getCentreX(),
      gameObjects[CHARACTER].getCentreY()
    );
  };

  playGameLoop() {
    if (gameObjects[CHARACTER].getPlacingBomb()) {
      this.placeABomb();
    }
    super.playGameLoop();
  }

  render() {
    super.render();

    if (this.offScreenCanvas) ctx.drawImage(this.offScreenCanvas, 0, 0);
  }
}
