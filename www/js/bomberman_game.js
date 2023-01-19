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

const UP = 3;
const LEFT = 1;
const DOWN = 0;
const RIGHT = 2;
const STOPPED = 4;

const BACKGROUND = 0;
const PLAYER_NUMBER = 1;
const INFO_BOMBS = 2;
const INFO_LIFES = 3;
const WIN_MESSAGE = 4;
const BOT_FIRST = 5;
const BOT_SECOND = 6;
const BOT_THIRD = 7;
const CHARACTER_SCALE = 15;
const BOT_BOMB = 11;
const UNDETONATED_BOMB = 20;
const OBSTACLE = 21;
const EXPLOSION = 22;
const MOVABLE_TERRAIN = 23;
const EXPLOSION_ENEMY = 24;
let difficultyString = "EASY";
const Difficulty = {
  EASY: 1,
  MEDIUM: 2,
  HARD: 3,
};
let Difficulty_status = Difficulty.EASY;
let board = [];
let tempArr = [];

let squareSizeX;
let squareSizeY;

let isGameOver = true;
let plane = [];
let backupPlane = [];
let moved = false;
let accelerometer = new Accelerometer({ frequency: 60 });

let isFirebaseSet = false;

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
  gameObjects[PLAYER_NUMBER] = new Character(
    CharacterImage,
    3,
    3,
    1,
    PLAYER_NUMBER
  );
  gameObjects[BOT_FIRST] = new Character(
    CharacterImage,
    CHARACTER_SCALE - 4,
    CHARACTER_SCALE - 4,
    1,
    BOT_FIRST
  );

  gameObjects[BOT_SECOND] = new Character(
    CharacterImage,
    3,
    CHARACTER_SCALE - 4,
    1,
    BOT_SECOND
  );

  gameObjects[BOT_THIRD] = new Character(
    CharacterImage,
    CHARACTER_SCALE - 4,
    3,
    1,
    BOT_THIRD
  );

  accelerometer.start();
  accelerometer.orientation = "portrait";

  navigator.appVersion.indexOf("Android") != -1 &&
    setInterval(movingDevice, 10);

  let game = new Game();

  game.start();

  let movedAccelerometer = false;

  function movingDevice() {
    if (movedAccelerometer || isGameOver) return;

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
    if (isGameOver) return;
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
