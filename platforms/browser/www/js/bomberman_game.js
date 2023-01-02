/* Author: Derek O Reilly, Dundalk Institute of Technology, Ireland.             */
/* There should always be a javaScript file with the same name as the html file. */
/* This file always holds the playGame function().                               */
/* It also holds player specific code, which will be different for each player       */

/******************** Declare player specific global data and functions *****************/
/* images must be declared as global, so that they will load before the player starts  */

const CharacterImage = new Image();
CharacterImage.src = "images/characters_sheet.png";

const background = new Image();
background.src = "images/blue_background.jpg";

const tileObstacle = new Image();
tileObstacle.src = "images/tile_obstacle.png";

const tileBomb = new Image();
tileBomb.src = "images/bomb.png";

let explosionImage = new Image();
explosionImage.src = "images/explosions_sheet.png";

let offCtx = null;

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
const PLAYER_NUMBER = 1;
const INFO_BOMBS = 2;
const INFO_LIFES = 3;
const WIN_MESSAGE = 4;
const BOT_NUMBER = 5;
const CHARACTER_SCALE = 25;
let board = [];
let TILE_SIZE;

let characterLifes = 1;
let botLifes = 1;
let Character_WIDTH;
let isGameOver = false;
let plane = [];
/******************* END OF Declare player specific data and functions *****************/

/* Always have a playGame() function                                     */
/* However, the content of this function will be different for each player */
function playGame() {
  TILE_SIZE = canvas.height / (CHARACTER_SCALE - 2);
  /* We need to initialise the player objects outside of the player class */
  /* This function does this initialisation.                          */
  /* This function will:                                              */
  /* 1. create the various player player gameObjects                   */
  /* 2. store the player gameObjects in an array                     */
  /* 3. create a new player to display the player gameObjects          */
  /* 4. start the player                                                */

  /* Create the various gameObjects for this player. */
  /* This is player specific code. It will be different for each player, as each player will have it own gameObjects */

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
  //     canvas.width,`
  //     canvas.height
  //   );

  gameObjects[PLAYER_NUMBER] = new BombermanCharacter(
    CharacterImage,
    canvas.width / 10,
    canvas.width / 8,
    canvas.height / CHARACTER_SCALE,
    canvas.height / CHARACTER_SCALE
  );

  // gameObjects[BOT_NUMBER] = new BombermanCharacter(
  //   CharacterImage,
  //   canvas.width - 2 * TILE_SIZE,
  //   canvas.height - 2 * TILE_SIZE,
  //   canvas.height / CHARACTER_SCALE,
  //   canvas.height / CHARACTER_SCALE
  // );

  /* END OF player specific code. */

  /* Always create a player that uses the gameObject array */
  let player = new Game(PLAYER_NUMBER);
  // let bot = new BotCanvas(BOT_NUMBER);

  /* Always play the player */
  player.start();
  // bot.start();

  /* If they are needed, then include any player-specific mouse and keyboard listners */
  document.addEventListener("keydown", function (e) {
    if (isGameOver) return;
    if (e.keyCode === 37) {
      // left
      gameObjects[PLAYER_NUMBER].setDirection(LEFT);
    } else if (e.keyCode === 38) {
      // up
      gameObjects[PLAYER_NUMBER].setDirection(UP);
    } else if (e.keyCode === 39) {
      // right
      gameObjects[PLAYER_NUMBER].setDirection(RIGHT);
    } else if (e.keyCode === 40) {
      // down
      gameObjects[PLAYER_NUMBER].setDirection(DOWN);
    } else if (e.keyCode === 32) {
      // down
      gameObjects[PLAYER_NUMBER].setBomb(true);
    }
  });
}
