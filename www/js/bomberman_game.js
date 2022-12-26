/* Author: Derek O Reilly, Dundalk Institute of Technology, Ireland.             */
/* There should always be a javaScript file with the same name as the html file. */
/* This file always holds the playGame function().                               */
/* It also holds game specific code, which will be different for each game       */

/******************** Declare game specific global data and functions *****************/
/* images must be declared as global, so that they will load before the game starts  */

const CharacterImage = new Image();
CharacterImage.src = "images/characters_sheet.png";

const background = new Image();
background.src = "images/blue_background.jpg";

const tileObstacle = new Image();
tileObstacle.src = "images/tile_obstacle.png";

const tileBomb = new Image();
tileBomb.src = "images/bomb.png";

//###################################test explosion
const explosionBase = new Image();
explosionBase.src = "images/explosion_base.png";

let explosionImage = new Image();
explosionImage.src = "images/explosions_sheet.png";

let offCtx = null;
//###################################test explosion

/* Direction that the Character is walking */
/* Note that this matches the row in the gameObject image for the given direction */
const UP = 3;
const LEFT = 1;
const DOWN = 0;
const RIGHT = 2;
const STOPPED = 4;

/* The various gameObjects */

/* These are the positions that each gameObject is held in the gameObjects[] array */
const BACKGROUND = 0;
// const MAZE = 1;
const CHARACTER = 1;
const WIN_MESSAGE = 2;
const CHARACTER_SCALE = 15;
let Character_WIDTH;
/******************* END OF Declare game specific data and functions *****************/

/* Always have a playGame() function                                     */
/* However, the content of this function will be different for each game */
function playGame() {
  /* We need to initialise the game objects outside of the Game class */
  /* This function does this initialisation.                          */
  /* This function will:                                              */
  /* 1. create the various game game gameObjects                   */
  /* 2. store the game gameObjects in an array                     */
  /* 3. create a new Game to display the game gameObjects          */
  /* 4. start the Game                                                */

  /* Create the various gameObjects for this game. */
  /* This is game specific code. It will be different for each game, as each game will have it own gameObjects */

  gameObjects[BACKGROUND] = new StaticImage(
    background,
    0,
    0,
    canvas.width,
    canvas.height
  );

  //   gameObjects[MAZE] = new StaticImage(
  //     mazeGrid,
  //     0,
  //     0,
  //     canvas.width,
  //     canvas.height
  //   );

  gameObjects[CHARACTER] = new BombermanCharacter(
    CharacterImage,
    canvas.width / 10,
    canvas.width / 8
  );

  /* END OF game specific code. */

  /* Always create a game that uses the gameObject array */
  let game = new CharacterCanvas();

  /* Always play the game */
  game.start();

  /* If they are needed, then include any game-specific mouse and keyboard listners */
  document.addEventListener("keydown", function (e) {
    if (e.keyCode === 37) {
      // left
      gameObjects[CHARACTER].setDirection(LEFT);
    } else if (e.keyCode === 38) {
      // up
      gameObjects[CHARACTER].setDirection(UP);
    } else if (e.keyCode === 39) {
      // right
      gameObjects[CHARACTER].setDirection(RIGHT);
    } else if (e.keyCode === 40) {
      // down
      gameObjects[CHARACTER].setDirection(DOWN);
    } else if (e.keyCode === 32) {
      // down
      gameObjects[CHARACTER].setBomb(true);
    }
  });
}
