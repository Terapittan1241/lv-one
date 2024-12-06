let canvasSize = 600;
let balls = [];
let score = 0;
let gameOver = false;
let startTime;
let timeLimit = 20000;
let level = "";
let wordsEasy = ["apple", "banana", "melon", "carrot", "peach", "tomato","corn","onion","orange","potato"];
let wordsMedium = ["cherry", "sausage", "pineapple", "grapes", "strawberry", "mushroom", "cabbage"];
let displayedWord = "";
let wordChangeInterval = 3000;
let lastWordChangeTime = 0;
let countdownStartTime;
let gameStarted = false;
let showHomeScreen = true;
let homeButton;
let easyButton, mediumButton;
let images = {};

function preload() {
  images = {
    apple: loadImage('https://raw.githubusercontent.com/Terapittan1241/lv-one/main/%E3%81%82.png'),
    banana: loadImage('https://raw.githubusercontent.com/Terapittan1241/lv-one/main/%E3%81%82%E3%81%84.png'),
    grapes: loadImage('https://raw.githubusercontent.com/Terapittan1241/lv-one/main/%E3%81%82%E3%81%84%E3%81%86.png'),
    melon: loadImage('https://raw.githubusercontent.com/Terapittan1241/lv-one/main/g.png'),
    carrot: loadImage('https://raw.githubusercontent.com/Terapittan1241/lv-one/main/b.png'),
    peach: loadImage('https://raw.githubusercontent.com/Terapittan1241/lv-one/main/f.png'),
    potato: loadImage('https://raw.githubusercontent.com/Terapittan1241/lv-one/main/a.png'),
    orange: loadImage('https://raw.githubusercontent.com/Terapittan1241/lv-one/main/e.jpg'),
    corn: loadImage('https://raw.githubusercontent.com/Terapittan1241/lv-one/main/h.jpg'),
    onion: loadImage('https://raw.githubusercontent.com/Terapittan1241/lv-one/main/i.jpg'),
    tomato: loadImage('https://raw.githubusercontent.com/Terapittan1241/lv-one/main/d.png'),
    cherry: loadImage('https://raw.githubusercontent.com/Terapittan1241/lv-one/main/k.jpg'),
    sausage: loadImage('https://raw.githubusercontent.com/Terapittan1241/lv-one/main/l.jpg'),
    pineapple: loadImage('https://raw.githubusercontent.com/Terapittan1241/lv-one/main/m1.png'),
    strawberry: loadImage('https://raw.githubusercontent.com/Terapittan1241/lv-one/main/n.jpg'),
    mushroom: loadImage('https://raw.githubusercontent.com/Terapittan1241/lv-one/main/o.jpg'),
    cabbage: loadImage('https://raw.githubusercontent.com/Terapittan1241/lv-one/main/p.jpg')
  };
}

function setup() {
  let canvas = createCanvas(canvasSize, canvasSize);
  canvas.position((windowWidth - canvasSize) / 2, (windowHeight - canvasSize) / 2);
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
  textSize(35);
  fill(0);
  text("えいごシューティングゲーム", width / 2, height / 2 - 100);
  textSize(30);
  text("むずかしさをえらんでね", width / 2, height / 2 - 50);
  easyButton.show();
  mediumButton.show();
  if (homeButton) homeButton.hide();
}

function drawGame() {
  drawSkyBackground();

  if (!gameStarted) {
    let elapsedCountdownTime = millis() - countdownStartTime;
    if (elapsedCountdownTime < 3000) {
      let count = 3 - Math.floor(elapsedCountdownTime / 1000);
      textSize(96);
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
    textSize(48);
    fill(0);
    textAlign(CENTER, CENTER);
    text(score >= 10 ? "You Win!" : "GAME OVER", width / 2, height / 2 - 40);
    textSize(32);
    text("Your Score: " + score, width / 2, height / 2 + 40);
    showHomeButton();
    noLoop();
    return;
  }

  balls.forEach(ball => {
    ball.fall();
    ball.display();
    if (ball.y > height) ball.reset();
  });

  let elapsedTime = millis() - startTime;
  if (elapsedTime > timeLimit) gameOver = true;

  fill(0);
  textSize(32);
  textAlign(LEFT, TOP);
  text("Score: " + score, 20, 20);
  text("Time: " + (20 - Math.floor(elapsedTime / 1000)), 20, 60);
  if (score >= 10) gameOver = true;
}

function mousePressed() {
  if (!showHomeScreen) {
    let clickedAnyBall = false;

    balls.forEach(ball => {
      if (ball.isClicked(mouseX, mouseY)) {
        clickedAnyBall = true;
        if (ball.label === displayedWord) {
          score++; // 正解時にスコア+1
        } else {
          score--; // 不正解時にスコア-1
        }
        ball.reset(); // ボールをリセット
      }
    });

    score = max(score, 0); // スコアが0未満にならないよう制御
  }
}

function displayRandomWord() {
  let wordSet = level === "easy" ? wordsEasy : wordsMedium;
  if (millis() - lastWordChangeTime > wordChangeInterval) {
    displayedWord = random(wordSet);
    lastWordChangeTime = millis();
  }
  textSize(48);
  textAlign(CENTER, TOP);
  fill(0);
  text(displayedWord, width / 2, 30);
}

function createButtons() {
  easyButton = createButton("初級");
  mediumButton = createButton("中級");
  easyButton.style('font-size', '32px');
  mediumButton.style('font-size', '32px');
  easyButton.size(200,100)
  mediumButton.size(200,100)
  easyButton.position(390,400)
  mediumButton.position(750,400)
  easyButton.mousePressed(() => setLevel("easy"));
  mediumButton.mousePressed(() => setLevel("medium"));
}

function showHomeButton() {
  if (!homeButton) {
    homeButton = createButton("ホームに戻る");
    homeButton.style('font-size', '28px');
    homeButton.position(560,400)
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
  easyButton.hide();
  mediumButton.hide();
  let colors = level === "easy" ? ["apple", "banana", "melon", "carrot", "peach", "tomato","corn","onion","orange","potato"] : ["cherry", "sausage", "pineapple", "grapes", "strawberry", "mushroom", "cabbage"];
  colors.forEach(color => balls.push(new Ball(color)));
}

class Ball {
  constructor(label) {
    this.label = label;
    this.reset();
  }

  display() {
    image(images[this.label], this.x, this.y, this.size, this.size);
  }

  fall() {
    this.y += this.speed;
  }

  isClicked(px, py) {
    let centerX = this.x + this.size / 2;
    let centerY = this.y + this.size / 2;
    let d = dist(px, py, centerX, centerY);
    return d < this.size / 2;
  }

  reset() {
    this.x = random(20, width - 60);
    this.y = random(-100, -20);
    this.size = 60;
    this.speed = random(1, 2);
  }
}

function drawSkyBackground() {
  background(135, 206, 235);
  noStroke();
  fill(255);
  ellipse(150, 150, 150, 90);
  ellipse(225, 180, 180, 120);
  ellipse(300, 150, 150, 90);
  ellipse(450, 75, 180, 120);
  ellipse(525, 120, 210, 135);
}
