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
    // this.offScreenCtx.drawImage(
    //   mazeGridImage,
    //   0,
    //   0,
    //   canvas.width,
    //   canvas.height
    // );

    this.generateObjectsOnCanvas();
  }

  collisionDetection() {
    // console.log("posX " + gameObjects[CHARACTER].getCentreX());
    if (!this.offScreenCtx) {
      return;
    }

    if (gameObjects[CHARACTER].getDirection() === UP) {
      let imageData = this.offScreenCtx.getImageData(
        gameObjects[CHARACTER].getCentreX(),
        gameObjects[CHARACTER].getCentreY(),
        20,
        5
      );
      if (imageData.data[3] !== 0) {
        console.log(imageData);
        gameObjects[CHARACTER].setDirection(DOWN);

        this.destroyAWall();
      }
    } else if (gameObjects[CHARACTER].getDirection() === LEFT) {
      let imageData = this.offScreenCtx.getImageData(
        gameObjects[CHARACTER].getCentreX() + 3,
        gameObjects[CHARACTER].getCentreY(),
        1,
        Character_WIDTH
      );
      if (imageData.data[3] !== 0) {
        gameObjects[CHARACTER].setDirection(RIGHT);

        // this.destroyAWall();
      }
    } else if (gameObjects[CHARACTER].getDirection() === DOWN) {
      let imageData = this.offScreenCtx.getImageData(
        gameObjects[CHARACTER].getCentreX(),
        gameObjects[CHARACTER].getCentreY() + Character_WIDTH - 3,
        Character_WIDTH,
        1
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
        gameObjects[CHARACTER].getCentreX() + Character_WIDTH - 3,
        gameObjects[CHARACTER].getCentreY(),
        1,
        Character_WIDTH
      );
      if (imageData.data[3] !== 0) {
        gameObjects[CHARACTER].setDirection(LEFT);
        // this.destroyAWall();
      }
    }
  }

  generateObjectsOnCanvas = () => {
    const division = 15;
    const widthIncrement = canvas.width / division;
    const heightIncrement = canvas.height / division;

    for (let i = 0; i < canvas.width; i += widthIncrement) {
      for (let j = 0; j < canvas.height; j += heightIncrement) {
        console.log(Math.random() * 10.0);
        if (Math.random() * 10 > 9.8)
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
