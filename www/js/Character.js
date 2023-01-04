/* Author: Derek O Reilly, Dundalk Institute of Technology, Ireland. */

class Character extends GameObject {
  /* Each gameObject MUST have a constructor() and a render() method.        */
  /* If the object animates, then it must also have an updateState() method. */

  constructor(CharacterImage, posX, posY, speed) {
    super(
      40
    ); /* as this class extends from GameObject, you must always call super() */

    /* These variables depend on the object */

    this.centreX = posX;
    this.centreY = posY;
    this.bombPosX;
    this.bombPosY;

    this.NUMBER_OF_COLUMNS_IN_SPRITE_IMAGE = 3; // the number of rows and columns in the gameObject
    this.NUMBER_OF_ROWS_IN_SPRITE_IMAGE = 4; // the number of rows and columns in the gameObject

    this.column = 0;
    this.animationStartDelay = 0;
    this.CharacterImage = CharacterImage;

    this.bombsLimitCount = 1;
    this.availableBombs = 0;
    this.bombsInfoCount = this.bombsLimitCount;

    //global variable

    this.SPRITE_WIDTH =
      this.CharacterImage.width / this.NUMBER_OF_COLUMNS_IN_SPRITE_IMAGE / 5;
    this.SPRITE_HEIGHT =
      this.CharacterImage.height / this.NUMBER_OF_ROWS_IN_SPRITE_IMAGE / 2;

    this.Character_SPEED = speed;
    this.setDirection(STOPPED);
  }

  updateState() {}

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

  getDirection = () => this.direction;

  setCentreX(val) {
    this.centreX = val;
  }

  setCentreY(val) {
    this.centreY = val;
  }

  getCentreX = () => this.centreX;

  getCentreY = () => this.centreY;

  getBombPosX = () => this.bombPosX;

  getBombPosY = () => this.bombPosY;

  decreaseAvailableBombsCount = () => {
    if (this.availableBombs > 0) --this.availableBombs;
  };

  getAvailableBombs = () => this.availableBombs;

  getBombsLimitCount = () => this.bombsLimitCount;

  getBombsInfoCount = () => this.bombsInfoCount;

  increaseBombsInfoCount = () => ++this.bombsInfoCount;

  putABomb = () => {
    if (this.bombsInfoCount > 0) {
      this.bombPosX = this.centreX;
      this.bombPosY = this.centreY;
      ++this.availableBombs;
      --this.bombsInfoCount;
    }
  };
}
BOT_NUMBER