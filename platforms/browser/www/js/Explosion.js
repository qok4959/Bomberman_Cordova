/* Author: Derek O Reilly, Dundalk Institute of Technology, Ireland. */
/* The Explosion GameObject is an animated gameObject of an explosion    */

class Explosion extends GameObject {
  /* Each gameObject MUST have a constructor() and a render() method.        */
  /* If the object animates, then it must also have an updateState() method. */

  constructor(explosionImage, centreX, centreY, sizeX, sizeY, delay = 0) {
    super(
      30,
      delay
    ); /* as this class extends from GameObject, you must always call super() */

    /* These variables depend on the object */
    this.explosionImage = explosionImage;

    this.centreX = centreX;
    this.centreY = centreY;
    this.sizeX = sizeX;
    this.sizeY = sizeY;
    this.delay = delay;
    this.NUMBER_OF_SPRITES = 25; // the number of gameObjects in the gameObject image
    this.NUMBER_OF_COLUMNS_IN_SPRITE_IMAGE = 5; // the number of columns in the gameObject image
    this.NUMBER_OF_ROWS_IN_SPRITE_IMAGE = 5; // the number of rows in the gameObject image
    this.START_ROW = 0;
    this.START_COLUMN = 0;

    this.currentgameObject = 0; // the current gameObject to be displayed from the gameObject image
    this.row = this.START_ROW; // current row in gameObject image
    this.column = this.START_COLUMN; // current column in gameObject image

    this.SPRITE_WIDTH =
      this.explosionImage.width / this.NUMBER_OF_COLUMNS_IN_SPRITE_IMAGE;
    this.SPRITE_HEIGHT =
      this.explosionImage.height / this.NUMBER_OF_ROWS_IN_SPRITE_IMAGE;
  }

  updateState() {
    this.currentgameObject++;

    if (this.row > 5) this.stopAndHide();

    this.column++;
    if (this.column >= this.NUMBER_OF_COLUMNS_IN_SPRITE_IMAGE) {
      this.column = 0;
      this.row++;
    }
  }

  render() {
    console.log(
      "explosionRender",
      this.centreX +
        "\t" +
        this.centreY +
        "\t" +
        squareSizeX +
        "\t" +
        squareSizeY
    );
    ctx.drawImage(
      this.explosionImage,
      this.column * this.SPRITE_WIDTH,
      this.row * this.SPRITE_WIDTH,
      this.SPRITE_WIDTH,
      this.SPRITE_HEIGHT,
      this.centreX * this.sizeX,
      this.centreY * this.sizeY,
      this.sizeX,
      this.sizeY
    );
  }
}
