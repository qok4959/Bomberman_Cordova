/* Author: Derek O Reilly, Dundalk Institute of Technology, Ireland.       */
/* A CanvasGame that implements collision detection.                       */
/* The game allows the user to walk a Character around a maze.              */
/* If the Character is guided to the maze exit, then a win message appears. */

class BombermanCharacterCanvasGame extends CanvasGame {
  constructor(mazeGridImage) {
    super();

    /* this.mazeCtx will be used for collision detection */
    this.offScreenCanvas = document.createElement("canvas");
    this.offScreenCtx = this.offScreenCanvas.getContext("2d");
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
        1,
        1
      );
      if (imageData.data[3] !== 0) {
        console.log(imageData);
        gameObjects[CHARACTER].setDirection(DOWN);

        // this.destroyAWall();
      }
    } else if (gameObjects[CHARACTER].getDirection() === LEFT) {
      let imageData = this.offScreenCtx.getImageData(
        gameObjects[CHARACTER].getCentreX(),
        gameObjects[CHARACTER].getCentreY(),
        1,
        1
      );
      if (imageData.data[3] !== 0) {
        gameObjects[CHARACTER].setDirection(RIGHT);

        // this.destroyAWall();
      }
    } else if (gameObjects[CHARACTER].getDirection() === DOWN) {
      let imageData = this.offScreenCtx.getImageData(
        gameObjects[CHARACTER].getCentreX(),
        gameObjects[CHARACTER].getCentreY() + Character_WIDTH,
       100,
        100
      );
      if (imageData.data[3] !== 0) {
        gameObjects[CHARACTER].setDirection(UP);
        // this.destroyAWall();
      }

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
        1
      );
      if (imageData.data[3] !== 0) {
        gameObjects[CHARACTER].setDirection(LEFT);
        // this.destroyAWall();
      }
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
    const division = CHARACTER_SCALE;
    const widthIncrement = canvas.height / division;
    const heightIncrement = canvas.height / division;

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
        console.log(Math.random() * 10.0);
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
