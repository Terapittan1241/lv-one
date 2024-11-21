let balls = [];
let score = 0;
let gameOver = false;
let startTime;
let timeLimit = 20000; // 20秒
let words = ["[apple]", "[banana]", "[grape]"]; // 表示する単語リスト
let displayedWord = ""; // 現在表示されている単語
let wordChangeInterval = 2000; // 単語の表示変更間隔（2秒に設定）
let lastWordChangeTime = 0; // 最後に単語が変更された時刻
let countdownStartTime; // カウントダウン開始時間
let gameStarted = false; // ゲームが始まったかどうか

function setup() {
  createCanvas(400, 400);
  countdownStartTime = millis(); // カウントダウン開始時間を設定
  displayedWord = random(words); // 初期単語の表示
  
  // 赤、黄、青のボールをそれぞれ1個ずつ生成
  balls.push(new Ball("red"));
  balls.push(new Ball("yellow"));
  balls.push(new Ball("blue"));

  // フォントをデフォルトのsans-serifに設定
  textFont('sans-serif');
  textStyle(BOLD); // 太字に設定
}

function draw() {
  // 背景を空のイラスト風に描画
  drawSkyBackground();

  // ゲーム開始前のカウントダウン
  if (!gameStarted) {
    let elapsedCountdownTime = millis() - countdownStartTime;
    
    // カウントダウンが終わるまで表示
    if (elapsedCountdownTime < 3000) { // 3秒間のカウントダウン
      let count = 3 - Math.floor(elapsedCountdownTime / 1000);
      textSize(72);
      fill(0);
      textAlign(CENTER, CENTER);
      text(count, width / 2, height / 2); // 画面中央にカウント表示
    } else {
      gameStarted = true; // カウントダウンが終わったらゲーム開始
      startTime = millis(); // ゲーム開始時刻を設定
    }
    return;
  }

  // 上部にランダムな単語を表示
  displayRandomWord();

  // ゲームオーバーまたは勝利したら描画を停止
  if (gameOver) {
    textSize(32);
    fill(0);
    textAlign(CENTER, CENTER);
    if (score >= 10) {
      text("You Win!", width / 2, height / 2);
    } else {
      // ゲームオーバーの表示
      fill(255, 0, 0);
      text("GAME OVER", width / 2, height / 2 - 50);
      
      // 獲得したスコアを表示
      textSize(24);
      fill(0);
      text("Your Score: " + score, width / 2, height / 2);
    }
    noLoop();
    return;
  }

  // ボールを描画し、落下させる
  for (let i = 0; i < balls.length; i++) {
    balls[i].fall();
    balls[i].display();

    // ボールが画面外に出たら再生成する
    if (balls[i].y > height) {
      balls[i].reset();
    }
  }

  // 経過時間のチェック
  let elapsedTime = millis() - startTime;
  if (elapsedTime > timeLimit) {
    gameOver = true;
  }

  // スコア表示
  fill(0);
  textSize(24);
  textAlign(LEFT, TOP);
  text("Score: " + score, 10, 10); // 左上に余白を持たせて表示
  text("Time: " + (20 - Math.floor(elapsedTime / 1000)), 10, 40);

  // 10ポイントに達したら勝利
  if (score >= 10) {
    gameOver = true;
  }
}

function displayRandomWord() {
  // 現在の時刻と前回の更新時刻を確認し、インターバル経過で単語を変更
  if (millis() - lastWordChangeTime > wordChangeInterval) {
    displayedWord = random(words); // 新しい単語をランダムに選択
    lastWordChangeTime = millis(); // 最終更新時刻をリセット
  }
  
  // 単語ごとに色とアウトラインを変更
  textSize(36);
  textAlign(CENTER, TOP);
  if (displayedWord === "[apple]") {
    fill(0);
    stroke(255, 0, 0); // 赤色のアウトライン
  } else if (displayedWord === "[banana]") {
    fill(255, 255, 0); // 黄色の文字色
    stroke(0); // 黒色のアウトライン
  } else if (displayedWord === "[grape]") {
    fill(0);
    stroke(0, 0, 255); // 青色のアウトライン
  }
  
  strokeWeight(4); // アウトラインを太くする
  text(displayedWord, width / 2, 20); // 上部中央に表示
}

function mousePressed() {
  for (let i = 0; i < balls.length; i++) {
    if (balls[i].isClicked(mouseX, mouseY)) {
      // 表示中の単語とボールの色に応じてスコアを追加
      if (
        (displayedWord === "[apple]" && balls[i].color === "red") ||
        (displayedWord === "[banana]" && balls[i].color === "yellow") ||
        (displayedWord === "[grape]" && balls[i].color === "blue")
      ) {
        score += 1; // 正しい色のボールならポイント追加
      } else {
        score -= 1; // それ以外のボールならポイント減少
      }
      balls[i].reset(); // ボールをリセットして新しいボールを生成
    }
  }
}

// ボールのクラス
class Ball {
  constructor(color) {
    this.color = color; // 色を引数として設定
    this.reset();
  }

  // ボールを描画
  display() {
    fill(this.getColor());
    noStroke();
    ellipse(this.x, this.y, this.size);
  }

  // ボールを落下させる
  fall() {
    this.y += this.speed;
  }

  // ボールがクリックされたかどうかを確認
  isClicked(px, py) {
    // クリックの座標とボールの中心との距離を計算してクリック判定
    let d = dist(px, py, this.x, this.y);
    return d < this.size / 2; // 半径以内ならクリック成功
  }

  // ボールをリセットして、ランダムな位置・速度を設定
  reset() {
    this.x = random(20, width - 20);
    this.y = random(-100, -20); // 画面外からスタート
    this.size = 30;
    this.speed = random(1, 2); // スピードを少し遅く調整
  }

  // ボールの色を取得
  getColor() {
    if (this.color === 'red') {
      return color(255, 0, 0);
    } else if (this.color === 'yellow') {
      return color(255, 255, 0);
    } else if (this.color === 'blue') {
      return color(0, 0, 255);
    }
  }
}

// 空のイラスト風背景を描画する関数
function drawSkyBackground() {
  // 空の青色
  background(135, 206, 235);
  
  // 雲を描画
  noStroke();
  fill(255);
  
  // 雲の形
  ellipse(100, 100, 100, 60);
  ellipse(150, 120, 120, 80);
  ellipse(200, 100, 100, 60);
  
  ellipse(300, 50, 120, 80);
  ellipse(350, 80, 140, 90);
}
