let balls = [];
let score = 0;
let gameOver = false;
let startTime;
let timeLimit = 20000; // 20秒
let level = ""; // 選択された難易度
let wordsEasy = ["[apple]", "[banana]", "[grapes]"];
let wordsMedium = ["[apple]", "[banana]", "[grapes]", "[melon]", "[carrot]", "[peach]", "[tomato]"];
let displayedWord = "";
let wordChangeInterval = 3000;
let lastWordChangeTime = 0;
let countdownStartTime;
let gameStarted = false;
let showHomeScreen = true; // ホーム画面を表示するか
let homeButton; // ホームに戻るボタン
let easyButton, mediumButton; // 初級・中級ボタン

let redBallImage, yellowBallImage, blueBallImage, melonImage, carrotImage, peachImage, tomatoImage;

function preload() {
  redBallImage = loadImage('https://raw.githubusercontent.com/Terapittan1241/lv-one/main/%E3%81%82.png');
  yellowBallImage = loadImage('https://raw.githubusercontent.com/Terapittan1241/lv-one/main/%E3%81%82%E3%81%84.png');
  blueBallImage = loadImage('https://raw.githubusercontent.com/Terapittan1241/lv-one/main/%E3%81%82%E3%81%84%E3%81%86.png');
  melonImage = loadImage('https://raw.githubusercontent.com/Terapittan1241/lv-one/main/g.png');
  carrotImage = loadImage('https://raw.githubusercontent.com/Terapittan1241/lv-one/main/b.png');
  peachImage = loadImage('https://raw.githubusercontent.com/Terapittan1241/lv-one/main/f.png');
  tomatoImage = loadImage('https://raw.githubusercontent.com/Terapittan1241/lv-one/main/d.png');
}

function setup() {
  createCanvas(400, 400);
  createButtons();
}

function draw() {
  if (showHomeScreen) {
    drawHomeScreen();
  } else {
    drawGame();
  }
}

function drawHomeScreen() {
  background(135, 206, 235);
  textAlign(CENTER, CENTER);
  textSize(36);
  fill(0);
  text("Welcome to the Game!", width / 2, height / 2 - 80);
  textSize(24);
  text("Select Difficulty to Start", width / 2, height / 2 - 40);

  // ボタンをホーム画面でのみ表示
  easyButton.show();
  mediumButton.show();

  // ホームボタンを非表示にする
  if (homeButton) homeButton.hide();
}

function drawGame() {
  drawSkyBackground();

  if (!gameStarted) {
    let elapsedCountdownTime = millis() - countdownStartTime;
    if (elapsedCountdownTime < 3000) {
      let count = 3 - Math.floor(elapsedCountdownTime / 1000);
      textSize(72);
      fill(0);
      textAlign(CENTER, CENTER);
      text(count, width / 2, height / 2);
    } else {
      gameStarted = true;
      startTime = millis();
    }
    return;
  }

  displayRandomWord();

  if (gameOver) {
    textSize(32);
    fill(0);
    textAlign(CENTER, CENTER);
    if (score >= 10) {
      text("You Win!", width / 2, height / 2 - 20);
    } else {
      fill(255, 0, 0);
      text("GAME OVER", width / 2, height / 2 - 20);
    }
    textSize(24);
    fill(0);
    text("Your Score: " + score, width / 2, height / 2 + 20);
    showHomeButton();
    noLoop();
    return;
  }

  for (let i = 0; i < balls.length; i++) {
    balls[i].fall();
    balls[i].display();
    if (balls[i].y > height) {
      balls[i].reset();
    }
  }

  let elapsedTime = millis() - startTime;
  if (elapsedTime > timeLimit) {
    gameOver = true;
  }

  fill(0);
  textSize(24);
  textAlign(LEFT, TOP);
  text("Score: " + score, 10, 10);
  text("Time: " + (20 - Math.floor(elapsedTime / 1000)), 10, 40);

  if (score >= 10) {
    gameOver = true;
  }
}

function mousePressed() {
  if (!showHomeScreen) {
    for (let i = 0; i < balls.length; i++) {
      if (balls[i].isClicked(mouseX, mouseY)) {
        score++;
        balls[i].reset();
      }
    }
  }
}

function displayRandomWord() {
  let wordSet = level === "easy" ? wordsEasy : wordsMedium;

  if (millis() - lastWordChangeTime > wordChangeInterval) {
    displayedWord = random(wordSet);
    lastWordChangeTime = millis();
  }

  textSize(36);
  textAlign(CENTER, TOP);
  fill(0);
  strokeWeight(4);
  text(displayedWord, width / 2, 20);
}

function createButtons() {
  easyButton = createButton("初級");
  mediumButton = createButton("中級");

  easyButton.position(width / 2 - 100, height / 2 + 20);
  mediumButton.position(width / 2 + 10, height / 2 + 20);

  easyButton.style('font-size', '24px');
  mediumButton.style('font-size', '24px');

  easyButton.mousePressed(() => setLevel("easy"));
  mediumButton.mousePressed(() => setLevel("medium"));

  // ボタンがゲーム画面に表示されないように
  easyButton.hide();
  mediumButton.hide();
}

function showHomeButton() {
  if (!homeButton) {
    homeButton = createButton("ホームに戻る");
    homeButton.position(width / 2 - 50, height / 2 + 60);
    homeButton.style('font-size', '20px');
    homeButton.mousePressed(() => {
      showHomeScreen = true;
      resetGame();
      loop();
    });
  }
  homeButton.show();
}

function setLevel(selectedLevel) {
  level = selectedLevel;
  showHomeScreen = false;
  resetGame();
}

function resetGame() {
  score = 0;
  gameOver = false;
  gameStarted = false;
  countdownStartTime = millis();
  balls = [];

  // ゲームが始まったらボタンを非表示にする
  easyButton.hide();
  mediumButton.hide();

  if (level === "easy") {
    balls.push(new Ball("red"));
    balls.push(new Ball("yellow"));
    balls.push(new Ball("blue"));
  } else if (level === "medium") {
    balls.push(new Ball("red"));
    balls.push(new Ball("yellow"));
    balls.push(new Ball("blue"));
    balls.push(new Ball("melon"));
    balls.push(new Ball("carrot"));
    balls.push(new Ball("peach"));
    balls.push(new Ball("tomato"));
  }
}

class Ball {
  constructor(color) {
    this.color = color;
    this.reset();
  }

  display() {
    let img;
    if (this.color === "red") img = redBallImage;
    else if (this.color === "yellow") img = yellowBallImage;
    else if (this.color === "blue") img = blueBallImage;
    else if (this.color === "melon") img = melonImage;
    else if (this.color === "carrot") img = carrotImage;
    else if (this.color === "peach") img = peachImage;
    else if (this.color === "tomato") img = tomatoImage;

    image(img, this.x, this.y, this.size, this.size);
  }

  fall() {
    this.y += this.speed;
  }

  isClicked(px, py) {
    let d = dist(px, py, this.x + this.size / 2, this.y + this.size / 2);
    return d < this.size / 2;
  }

  reset() {
    this.x = random(20, width - 20);
    this.y = random(-100, -20);
    this.size = 40;
    this.speed = random(1, 2);
  }
}

function drawSkyBackground() {
  background(135, 206, 235);
  noStroke();
  fill(255);
  ellipse(100, 100, 100, 60);
  ellipse(150, 120, 120, 80);
  ellipse(200, 100, 100, 60);
  ellipse(300, 50, 120, 80);
  ellipse(350, 80, 140, 90);
}
