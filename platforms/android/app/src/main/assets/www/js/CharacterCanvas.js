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
    this.offScreenCanvas.width = canvas.width;
    this.offScreenCanvas.height = canvas.height;

    this.borderWidth = canvas.height / 50;

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
    this.offScreenCtx.beginPath();
    this.offScreenCtx.lineWidth = this.borderWidth;
    this.offScreenCtx.strokeStyle = "cyan";
    this.offScreenCtx.rect(0, 0, canvas.width, canvas.height);
    this.offScreenCtx.stroke();
  };

  generateObjectsOnCanvas = () => {
    const widthIncrement = canvas.height / (CHARACTER_SCALE - 1);
    const heightIncrement = canvas.height / (CHARACTER_SCALE - 1);

    for (
      let i = this.borderWidth;
      i < canvas.width - widthIncrement * 2;
      i += widthIncrement
    ) {
      for (
        let j = this.borderWidth;
        j < canvas.height - widthIncrement;
        j += heightIncrement
      ) {
        // console.log(Math.random() * 10.0);
        if (Math.random() * 10 > 9)
          this.offScreenCtx.drawImage(
            tileObstacle,
            i,
            j,
            widthIncrement,
            heightIncrement
          );
      }
    }
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

  render() {
    super.render();
    if (this.offScreenCanvas) ctx.drawImage(this.offScreenCanvas, 0, 0);
  }
}
