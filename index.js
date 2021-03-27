'use strict'

const key_code_left = 37; 
const key_code_right = 39; 
const key_code_space = 32; 

const gameWidth = 800;
const gameHeight = 600;

const playerWidth = 20;
const playerMaxSpeed = 600; //invaderの動く速度を調整→レベルや難易度に応じて変化させるのもあり！

const gameState = {
  lastTime: Date.now(),
  leftPressed: false,
  rightPressed: false,
  spacePressed: false,
  playerX: 0,
  playerY: 0
};

function setPosition(element, x, y) {
  element.style.transform = `translate(${x}px, ${y}px)`;
}

function clamp(v, min, max) {  //playerの左右の可動域の制限
  if (v < min) {
    return min;
  } else if (v > max) {
    return max;
  } else {
    return v;
  }
}

function createPlayer(container) {
  gameState.playerX = gameWidth / 2;
  gameState.playerY = gameHeight - 40;

  const player = document.createElement('img');
  player.src = "img/spaceShips_001.png";
  player.className = "player";
  container.appendChild(player);
  setPosition(player, gameState.playerX, gameState.playerY);
}

function init() {
  const container = document.querySelector('.game');
  createPlayer(container);
}

function updatePlayer(deltaTime) {
  if (gameState.leftPressed) {
    // gameState.playerX -= 5;
    gameState.playerX -= deltaTime * playerMaxSpeed;
  }
  if (gameState.rightPressed) {
    // gameState.playerX += 5;
    gameState.playerX += deltaTime * playerMaxSpeed;
  }

  gameState.playerX = clamp(gameState.playerX, playerWidth, gameWidth - playerWidth); //playerの左右の可動域を制限→clamp()の返り値から判定 && gameWidth - playerWidth/2 だと右翼がはみ出るため/2しない

  const player = document.querySelector('.player');
  setPosition(player, gameState.playerX, gameState.playerY); 
}


function update() {
  const currentTime = Date.now();
  const deltaTime = (currentTime - gameState.lastTime) / 1000;  //updatePlayer()でplayerMaxSpeedと掛け合わせて動きの速度を設定 && 1s = 1000msより/1000

  updatePlayer(deltaTime);
  gameState.lastTime = currentTime;  
  window.requestAnimationFrame(update);  //動きをなめらかにする肝
}


//keydownだけでtransformさせようとすると動きがカクカクするため、down upに分ける
//キーを押した時にupdatePlayerにtrueを送る(gameState経由)
function onKeyDown(e) {
  if (e.keyCode === key_code_left) {
    gameState.leftPressed = true;
  } else if (e.keyCode === key_code_right) {
    gameState.rightPressed = true;
  } else if (e.keyCode === key_code_space) {
    gameState.spacePressed = true;
  }
}
function onKeyUp(e) {
  if (e.keyCode === key_code_left) {
    gameState.leftPressed = false;
  } else if (e.keyCode === key_code_right) {
    gameState.rightPressed = false;
  } else if (e.keyCode === key_code_space) {
    gameState.spacePressed = false;
  }
}

init();

window.addEventListener('keydown', onKeyDown);
window.addEventListener('keyup', onKeyUp);
window.requestAnimationFrame(update);  //frameごと(毎秒60回＝約16ミリ秒/回)にupdate()→deltaTimeはframe間のタイム/1000になる