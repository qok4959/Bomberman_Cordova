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
const CHARACTER_SCALE = 20;
const BOT_BOMB = 11;

let board = [];
let tempArr = [];

let squareSizeX;
let squareSizeY;

let characterLifes = 3;
let botLifes = 1;
let isGameOver = false;
let plane = [];
let backupPlane = [];
let moved = false;
/******************* END OF Declare player specific data and functions *****************/

/* Always have a playGame() function                                     */
/* However, the content of this function will be different for each player */
function playGame() {
  if (squareSizeX == undefined) {
    squareSizeX = canvas.width / CHARACTER_SCALE;
  }
  if (squareSizeY == undefined) {
    squareSizeY = canvas.height / CHARACTER_SCALE;
  }
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

  //image, posX, posY, speed
  gameObjects[PLAYER_NUMBER] = new Character(CharacterImage, 3, 3, 1);
  gameObjects[BOT_NUMBER] = new Character(
    CharacterImage,
    CHARACTER_SCALE - 4,
    CHARACTER_SCALE - 4,
    1
  );

  /* END OF player specific code. */

  /* Always create a player that uses the gameObject array */
  let game = new Game();

  game.start();

  /* If they are needed, then include any player-specific mouse and keyboard listners */
  document.addEventListener("keydown", function (e) {
    if (isGameOver || moved) return;
    if (e.keyCode === 37) {
      // left
      moved = true;
      gameObjects[PLAYER_NUMBER].setDirection(LEFT);
    } else if (e.keyCode === 38) {
      // up
      moved = true;
      gameObjects[PLAYER_NUMBER].setDirection(UP);
    } else if (e.keyCode === 39) {
      // right
      moved = true;
      gameObjects[PLAYER_NUMBER].setDirection(RIGHT);
    } else if (e.keyCode === 40) {
      // down
      moved = true;
      gameObjects[PLAYER_NUMBER].setDirection(DOWN);
    }

    //moving timeout
    setTimeout(() => {
      moved = false;
    }, 100);
  });

  // bomb placement must be the separated event
  document.addEventListener("keydown", function (e) {
    if (isGameOver) return;

    if (e.keyCode === 32) {
      // space
      gameObjects[PLAYER_NUMBER].putABomb();
    }
  });
}
