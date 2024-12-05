let balls = [];
let score = 0;
let gameOver = false;
let startTime;
let timeLimit = 20000; // 20秒
let words = ["[apple]", "[banana]", "[grapes]"];
let displayedWord = "";
let wordChangeInterval = 2000; 
let lastWordChangeTime = 0;
let countdownStartTime;
let gameStarted = false;

let redBallImage, yellowBallImage, blueBallImage; // 画像用変数

function preload() {
  // ボール画像を読み込む
  redBallImage = loadImage('https://raw.githubusercontent.com/Terapittan1241/lv-one/main/%E3%81%82.png'); // 赤ボール用画像
  yellowBallImage = loadImage('https://raw.githubusercontent.com/Terapittan1241/lv-one/main/%E3%81%82%E3%81%84.png'); // 黄色ボール用画像
  blueBallImage = loadImage('https://raw.githubusercontent.com/Terapittan1241/lv-one/main/%E3%81%82%E3%81%84%E3%81%86.png'); // 青ボール用画像
  
}

function setup() {
  createCanvas(400, 400);
  countdownStartTime = millis();
  displayedWord = random(words);

  balls.push(new Ball("red"));
  balls.push(new Ball("yellow"));
  balls.push(new Ball("blue"));

  textFont('sans-serif');
  textStyle(BOLD);
}

function draw() {
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
      text("You Win!", width / 2, height / 2);
    } else {
      fill(255, 0, 0);
      text("GAME OVER", width / 2, height / 2 - 50);
      textSize(24);
      fill(0);
      text("Your Score: " + score, width / 2, height / 2);
    }
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

function displayRandomWord() {
  if (millis() - lastWordChangeTime > wordChangeInterval) {
    displayedWord = random(words);
    lastWordChangeTime = millis();
  }
  
  textSize(36);
  textAlign(CENTER, TOP);
  if (displayedWord === "[apple]") {
    fill(0);
    stroke(255, 0, 0);
  } else if (displayedWord === "[banana]") {
    fill(255, 255, 0);
    stroke(0);
  } else if (displayedWord === "[grape]") {
    fill(0);
    stroke(0, 0, 255);
  }
  
  strokeWeight(4);
  text(displayedWord, width / 2, 20);
}

function mousePressed() {
  for (let i = 0; i < balls.length; i++) {
    if (balls[i].isClicked(mouseX, mouseY)) {
      if (
        (displayedWord === "[apple]" && balls[i].color === "red") ||
        (displayedWord === "[banana]" && balls[i].color === "yellow") ||
        (displayedWord === "[grape]" && balls[i].color === "blue")
      ) {
        score += 1;
      } else {
        score -= 1;
      }
      balls[i].reset();
    }
  }
}

class Ball {
  constructor(color) {
    this.color = color;
    this.reset();
  }

  display() {
    let img;
    if (this.color === "red") {
      img = redBallImage;
    } else if (this.color === "yellow") {
      img = yellowBallImage;
    } else if (this.color === "blue") {
      img = blueBallImage;
    }
    image(img, this.x, this.y, this.size, this.size); // 画像を描画
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
    this.size = 40; // 画像の大きさに合わせて調整
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
