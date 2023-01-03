/* Author: Derek O Reilly, Dundalk Institute of Technology, Ireland. */

class Character extends GameObject {
  /* Each gameObject MUST have a constructor() and a render() method.        */
  /* If the object animates, then it must also have an updateState() method. */

  constructor(
    CharacterImage,
    centreX,
    centreY,
    CharacterWidth,
    CharacterHeight
  ) {
    super(
      40
    ); /* as this class extends from GameObject, you must always call super() */

    /* These variables depend on the object */

    this.centreX = centreX;
    this.centreY = centreY;
    this.bombPosX;
    this.bombPosY;

    this.NUMBER_OF_COLUMNS_IN_SPRITE_IMAGE = 3; // the number of rows and columns in the gameObject
    this.NUMBER_OF_ROWS_IN_SPRITE_IMAGE = 4; // the number of rows and columns in the gameObject
    this.isBombPlaced = false;
    this.column = 0;
    this.animationStartDelay = 0;
    this.CharacterImage = CharacterImage;

    this.maxBombs = 1;
    this.bombsToPlace = 0;

    //global variable
    Character_WIDTH = canvas.height / CHARACTER_SCALE;

    this.SPRITE_WIDTH =
      this.CharacterImage.width / this.NUMBER_OF_COLUMNS_IN_SPRITE_IMAGE / 5;
    this.SPRITE_HEIGHT =
      this.CharacterImage.height / this.NUMBER_OF_ROWS_IN_SPRITE_IMAGE / 2;
    this.WIDTH_OF_Character_ON_CANVAS =
      CharacterWidth; /* the width and height that the Character will take up on the canvas */
    this.HEIGHT_OF_Character_ON_CANVAS = CharacterHeight;

    this.Character_SPEED = 2;
    this.setDirection(STOPPED);
  }

  updateState() {
    // if (this.direction === UP) {
    //   this.centreY -= this.Character_SPEED;
    // } else if (this.direction === LEFT) {
    //   this.centreX -= this.Character_SPEED;
    // } else if (this.direction === DOWN) {
    //   this.centreY += this.Character_SPEED;
    // } else if (this.direction === RIGHT) {
    //   this.centreX += this.Character_SPEED;
    // }
    // if (this.direction !== STOPPED) {
    //   this.column++;
    //   this.currentgameObject++;
    //   if (this.currentgameObject >= this.endgameObject) {
    //     this.row = this.direction;
    //     this.column = 0;
    //     this.currentgameObject = this.startgameObject;
    //   } else if (this.column >= this.NUMBER_OF_COLUMNS_IN_SPRITE_IMAGE) {
    //     this.column = 0;
    //     this.row++;
    //   }
    // } // stopped
    // else {
    //   // this.column = 0;
    //   this.row = 2;
    //   this.currentgameObject = 0;
    // }
  }

  move = () => {
    if (this.direction === UP) {
      if (plane[this.centreX][this.centreY - this.Character_SPEED] != 1)
        this.centreY -= this.Character_SPEED;
    } else if (this.direction === LEFT) {
      if (plane[this.centreX - this.Character_SPEED][this.centreY] != 1)
        this.centreX -= this.Character_SPEED;
    } else if (this.direction === DOWN) {
      if (plane[this.centreX][this.centreY + this.Character_SPEED] != 1)
        this.centreY += this.Character_SPEED;
    } else if (this.direction === RIGHT) {
      if (plane[this.centreX + this.Character_SPEED][this.centreY] != 1)
        this.centreX += this.Character_SPEED;
    }

    if (this.direction !== STOPPED) {
      this.column++;
      this.currentgameObject++;

      if (this.currentgameObject >= this.endgameObject) {
        this.row = this.direction;
        this.column = 0;
        this.currentgameObject = this.startgameObject;
      } else if (this.column >= this.NUMBER_OF_COLUMNS_IN_SPRITE_IMAGE) {
        this.column = 0;
        this.row++;
      }
    } // stopped
    else {
      // this.column = 0;
      this.row = 2;
      this.currentgameObject = 0;
    }
  };

  drawCharacter = (x, y) => {
    ctx.drawImage(
      this.CharacterImage,
      this.column * this.SPRITE_WIDTH + 3 * this.SPRITE_WIDTH * 2,
      this.row * this.SPRITE_WIDTH + 4 * this.SPRITE_HEIGHT,
      this.SPRITE_WIDTH,
      this.SPRITE_HEIGHT,
      this.centreX * squareSizeX,
      this.centreY * squareSizeY,
      squareSizeX,
      squareSizeY
    );

    this.drawAnimation(x, y);
  };

  drawAnimation = (x, y) => {};

  setDirection(newDirection) {
    this.direction = newDirection;
    this.startgameObject =
      this.direction * this.NUMBER_OF_COLUMNS_IN_SPRITE_IMAGE;
    this.endgameObject =
      this.startgameObject + this.NUMBER_OF_COLUMNS_IN_SPRITE_IMAGE;
    this.currentgameObject = this.startgameObject;
    this.row = this.direction;
    this.column = 0;

    this.move();
  }

  getDirection() {
    return this.direction;
  }

  setCentreX(val) {
    this.centreX = val;
  }

  setCentreY(val) {
    this.centreY = val;
  }

  getCentreX() {
    return this.centreX;
  }

  getCentreY() {
    return this.centreY;
  }

  getIsBombPlaced = () => {
    return this.isBombPlaced;
  };

  recoverBomb = () => {
    ++this.maxBombs;
  };

  getMaxBombs = () => {
    return this.maxBombs;
  };

  getBombPosX = () => {
    return this.bombPosX;
  };

  getBombPosY = () => {
    return this.bombPosY;
  };

  getBombsToPlace = () => {
    return this.bombsToPlace;
  };

  decreaseBombsToPlace() {
    this.bombsToPlace > 0 && --this.bombsToPlace;
  }

  setBomb = (condition) => {
    // console.log("setBomb");
    if (this.bombsToPlace < this.maxBombs && condition) {
      this.isBombPlaced = true;
      this.bombPosX = this.centreX;
      this.bombPosY = this.centreY;
      ++this.bombsToPlace;
    } else {
      this.isBombPlaced = false;
    }
  };
}
