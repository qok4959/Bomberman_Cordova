/* Author: Derek O Reilly, Dundalk Institute of Technology, Ireland. */

class BombermanCharacter extends Character {
  /* Each gameObject MUST have a constructor() and a render() method.        */
  /* If the object animates, then it must also have an updateState() method. */

  constructor(CharacterImage, centreX, centreY) {
    super(
      CharacterImage,
      25,
      25,
      canvas.height / CHARACTER_SCALE,
      canvas.height / CHARACTER_SCALE
    ); /* as this class extends from GameObject, you must always call super() */

    /* These variables depend on the object */
    // this.WIDTH_OF_Character_ON_CANVAS = 25; /* the width and height that the Character will take up on the canvas */
    // this.HEIGHT_OF_Character_ON_CANVAS = 25;

    this.centreX =
      centreX; /* set the start position of the Character in the maze */
    this.centreY = centreY;

    this.Character_SPEED =
      canvas.width / CHARACTER_SCALE / 10; /* set the Character's speed */
  }
}
