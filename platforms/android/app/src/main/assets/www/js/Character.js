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

    this.NUMBER_OF_COLUMNS_IN_SPRITE_IMAGE = 3; // the number of rows and columns in the gameObject
    this.NUMBER_OF_ROWS_IN_SPRITE_IMAGE = 4; // the number of rows and columns in the gameObject

    this.column = 0;
    this.animationStartDelay = 0;
    this.CharacterImage = CharacterImage;
    this.isBombPlaced = false;
    this.bombsToPlace = 1;

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
    if (this.direction === UP) {
      this.centreY -= this.Character_SPEED;
    } else if (this.direction === LEFT) {
      this.centreX -= this.Character_SPEED;
    } else if (this.direction === DOWN) {
      this.centreY += this.Character_SPEED;
    } else if (this.direction === RIGHT) {
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
  }

  render() {
    ctx.drawImage(
      this.CharacterImage,
      this.column * this.SPRITE_WIDTH + 3 * this.SPRITE_WIDTH * 2,
      this.row * this.SPRITE_WIDTH + 4 * this.SPRITE_HEIGHT,
      this.SPRITE_WIDTH,
      this.SPRITE_HEIGHT,
      this.centreX,
      this.centreY,
      this.WIDTH_OF_Character_ON_CANVAS,
      this.HEIGHT_OF_Character_ON_CANVAS
    );
  }

  setDirection(newDirection) {
    this.direction = newDirection;
    this.startgameObject =
      this.direction * this.NUMBER_OF_COLUMNS_IN_SPRITE_IMAGE;
    this.endgameObject =
      this.startgameObject + this.NUMBER_OF_COLUMNS_IN_SPRITE_IMAGE;
    this.currentgameObject = this.startgameObject;
    this.row = this.direction;
    this.column = 0;
  }

  getDirection() {
    return this.direction;
  }

  getCentreX() {
    return this.centreX;
  }

  getCentreY() {
    return this.centreY;
  }

  getPlacingBomb = () => {
    return this.placingBomb;
  };

  recoverBomb = () => {
    ++this.bombsToPlace;
  };

  getIsBombPlaced = () => {
    return this.isBombPlaced;
  };

  getBombsToPlace = () => {
    return this.bombsToPlace;
  };

  setBomb = (condition) => {
    if (this.bombsToPlace > 0 && condition) {
      this.placingBomb = true;
      --this.bombsToPlace;
    } else {
      this.placingBomb = false;
    }
  };
}
