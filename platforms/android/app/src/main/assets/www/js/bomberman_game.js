/* Author: Derek O Reilly, Dundalk Institute of Technology, Ireland.             */
/* There should always be a javaScript file with the same name as the html file. */
/* This file always holds the playGame function().                               */
/* It also holds player specific code, which will be different for each player       */

/******************** Declare player specific global data and functions *****************/
/* images must be declared as global, so that they will load before the player starts  */

const CharacterImage = new Image();
CharacterImage.src = "images/characters_sheet.png";

const background = new Image();
// background.src = "images/blue_background.jpg";
background.src = "images/backgroundTest.jpg";

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
const UNDETONATED_BOMB = 20;
const OBSTACLE = 21;
const EXPLOSION = 22;
const MOVABLE_TERRAIN = 23;
const EXPLOSION_ENEMY = 24;
let board = [];
let tempArr = [];

let squareSizeX;
let squareSizeY;

let isGameOver = false;
let plane = [];
let backupPlane = [];
let moved = false;
let accelerometer = new Accelerometer({ frequency: 60 });

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

  // TODO check device

  accelerometer.start();
  accelerometer.orientation = "portrait";
  setInterval(movingDevice, 10);

  // console.log(navigator.vibrate);

  /* Always create a player that uses the gameObject array */
  let game = new Game();

  game.start();

  /* If they are needed, then include any player-specific mouse and keyboard listners */
  let movedAccelerometer = false;

  // if (device.platform === "android") {
  //   console.log("android");
  // } else {
  //   console.log(device.platform);
  // }
  function movingDevice() {
    if (movedAccelerometer) return;

    if (Math.abs(accelerometer.x) > Math.abs(accelerometer.y)) {
      movedAccelerometer = true;
      if (accelerometer.x < 0) {
        gameObjects[PLAYER_NUMBER].setDirection(RIGHT);
      } else {
        gameObjects[PLAYER_NUMBER].setDirection(LEFT);
      }
    } else {
      movedAccelerometer = true;
      if (accelerometer.y > 0) {
        gameObjects[PLAYER_NUMBER].setDirection(DOWN);
      } else {
        gameObjects[PLAYER_NUMBER].setDirection(UP);
      }
    }

    if (movedAccelerometer)
      setTimeout(() => {
        movedAccelerometer = false;
      }, 200);
  }

  addEventListener("touchend", (event) => {
    gameObjects[PLAYER_NUMBER].putABomb();
  });

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
