/* Author: Derek O Reilly, Dundalk Institute of Technology, Ireland. */

class Character extends GameObject {
  /* Each gameObject MUST have a constructor() and a render() method.        */
  /* If the object animates, then it must also have an updateState() method. */

  constructor(CharacterImage, posX, posY, speed, character_number) {
    super(
      40
    ); /* as this class extends from GameObject, you must always call super() */

    /* These variables depend on the object */

    this.CHARACTER_NUMBER = character_number;
    this.defaultPositionX = posX;
    this.defaultPositionY = posY;
    this.centreX = posX;
    this.centreY = posY;
    this.bombPosX;
    this.bombPosY;

    this.NUMBER_OF_COLUMNS_IN_SPRITE_IMAGE = 3; // the number of rows and columns in the gameObject
    this.NUMBER_OF_ROWS_IN_SPRITE_IMAGE = 4; // the number of rows and columns in the gameObject

    this.column = 0;
    this.animationStartDelay = 0;
    this.CharacterImage = CharacterImage;

    this.default_character_lifes = 3;
    this.character_lifes = this.default_character_lifes;

    this.bombsLimitCount = 1;
    this.availableBombs = 0;
    this.bombsInfoCount = this.bombsLimitCount;
    this.ableToMove = false;
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
      if (
        plane[this.centreX][this.centreY - this.Character_SPEED] != OBSTACLE &&
        plane[this.centreX][this.centreY - this.Character_SPEED] !=
          UNDETONATED_BOMB
      )
        this.centreY -= this.Character_SPEED;
    } else if (this.direction === LEFT) {
      if (
        plane[this.centreX - this.Character_SPEED][this.centreY] != OBSTACLE &&
        plane[this.centreX - this.Character_SPEED][this.centreY] !=
          UNDETONATED_BOMB
      )
        this.centreX -= this.Character_SPEED;
    } else if (this.direction === DOWN) {
      if (
        plane[this.centreX][this.centreY + this.Character_SPEED] != OBSTACLE &&
        plane[this.centreX][this.centreY + this.Character_SPEED] !=
          UNDETONATED_BOMB
      )
        this.centreY += this.Character_SPEED;
    } else if (this.direction === RIGHT) {
      if (
        plane[this.centreX + this.Character_SPEED][this.centreY] != OBSTACLE &&
        plane[this.centreX + this.Character_SPEED][this.centreY] !=
          UNDETONATED_BOMB
      )
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

  isAbleToMove = () => this.ableToMove;

  randomMove = () => {
    if (!this.ableToMove) return;
    let randomDirection = parseInt(Math.random() * 10);

    switch (randomDirection) {
      case 1:
        this.direction = UP;
        break;
      case 2:
        this.direction = LEFT;
        break;
      case 3:
        this.direction = DOWN;
        break;
      case 4:
        this.direction = RIGHT;
        break;
      case 5:
        gameObjects[this.CHARACTER_NUMBER].putABomb();
        break;
    }

    //1 - obstacle
    //2 - undetonated bomb
    if (this.direction === UP) {
      if (
        plane[this.centreX][this.centreY - this.Character_SPEED] != OBSTACLE &&
        plane[this.centreX][this.centreY - this.Character_SPEED] !=
          UNDETONATED_BOMB
      )
        this.centreY -= this.Character_SPEED;
    } else if (this.direction === LEFT) {
      if (
        plane[this.centreX - this.Character_SPEED][this.centreY] != OBSTACLE &&
        plane[this.centreX - this.Character_SPEED][this.centreY] !=
          UNDETONATED_BOMB
      )
        this.centreX -= this.Character_SPEED;
    } else if (this.direction === DOWN) {
      if (
        plane[this.centreX][this.centreY + this.Character_SPEED] != OBSTACLE &&
        plane[this.centreX][this.centreY + this.Character_SPEED] !=
          UNDETONATED_BOMB
      )
        this.centreY += this.Character_SPEED;
    } else if (this.direction === RIGHT) {
      if (
        plane[this.centreX + this.Character_SPEED][this.centreY] != OBSTACLE &&
        plane[this.centreX + this.Character_SPEED][this.centreY] !=
          UNDETONATED_BOMB
      )
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

  // TODO animation
  drawCharacter = (CHARACTER_NUMBER) => {
    if (!this.ableToMove && CHARACTER_NUMBER != PLAYER_NUMBER) return;
    let localWidthMultiplier;
    let localHeightMultiplier;
    if (CHARACTER_NUMBER == PLAYER_NUMBER) {
      localWidthMultiplier = 1; //= 3 * this.SPRITE_WIDTH;
      // localHeightMultiplier = 4;
    } else if (CHARACTER_NUMBER == BOT_FIRST) {
      localWidthMultiplier = 3 * this.SPRITE_WIDTH * 2;
      // localHeightMultiplier = 4;
    } else if (CHARACTER_NUMBER == BOT_SECOND) {
      localWidthMultiplier = 3 * this.SPRITE_WIDTH * 3;
      // localHeightMultiplier = 4;
    } else if (CHARACTER_NUMBER == BOT_THIRD) {
      localWidthMultiplier = 4 * this.SPRITE_WIDTH * 3;
      // localHeightMultiplier = 4;
    }

    ctx.drawImage(
      this.CharacterImage,
      // this.column * this.SPRITE_WIDTH + 3 * this.SPRITE_WIDTH * 2,
      this.column * this.SPRITE_WIDTH + localWidthMultiplier,
      this.row * this.SPRITE_WIDTH + 4 * this.SPRITE_HEIGHT,
      this.SPRITE_WIDTH,
      this.SPRITE_HEIGHT,
      this.centreX * squareSizeX,
      this.centreY * squareSizeY,
      squareSizeX,
      squareSizeY
    );

    this.drawAnimation();
  };

  // TODO animation
  drawAnimation = () => {
    // const tempX = this.centreX - 1;
    // const tempY = this.centreY - 1;
    // for (let i = tempX; i < tempX + 1; i += 0.1) {
    //   ctx.drawImage(
    //     this.CharacterImage,
    //     this.column * this.SPRITE_WIDTH + 3 * this.SPRITE_WIDTH * 2,
    //     this.row * this.SPRITE_WIDTH + 4 * this.SPRITE_HEIGHT,
    //     this.SPRITE_WIDTH,
    //     this.SPRITE_HEIGHT,
    //     i * squareSizeX,
    //     this.centreY * squareSizeY,
    //     squareSizeX,
    //     squareSizeY
    //   );
    //   ctx.clearRect(
    //     (this.centreX - 1) * i,
    //     this.centreX,
    //     this.squareSizeX,
    //     this.squareSizeY
    //   );
    // }
  };

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
  setAbleToMove(cond) {
    this.ableToMove = cond;
  }
  getCentreX = () => this.centreX;

  getCentreY = () => this.centreY;

  getBombPosX = () => this.bombPosX;

  getBombPosY = () => this.bombPosY;

  getDefaultPositionX = () => this.defaultPositionX;

  getDefaultPositionY = () => this.defaultPositionY;

  decreaseAvailableBombsCount = () => {
    if (this.availableBombs > 0) --this.availableBombs;
  };

  getAvailableBombs = () => this.availableBombs;

  getBombsLimitCount = () => this.bombsLimitCount;

  getBombsInfoCount = () => this.bombsInfoCount;

  increaseBombsInfoCount = () => ++this.bombsInfoCount;

  resetLifes = () => {
    this.character_lifes = this.default_character_lifes;
  };

  decreaseCharacterLifes = () => {
    if (this.character_lifes > 0) --this.character_lifes;
  };

  getCharacterLifes = () => this.character_lifes;

  putABomb = () => {
    if (this.bombsInfoCount > 0) {
      this.bombPosX = this.centreX;
      this.bombPosY = this.centreY;
      ++this.availableBombs;
      --this.bombsInfoCount;
    }
  };
}
