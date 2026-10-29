// ===== 精靈圖設定 =====
// 站立精靈圖:整張寬 1955、高 212
const STOP_W = 1955;          // 站立圖整張寬度
const STOP_H = 212;           // 站立圖整張高度
const STOP_FRAMES = 14;       // 站立圖共有 14 張影格

// 走路精靈圖:整張寬 1246、高 198
const WALK_W = 1246;          // 走路圖整張寬度
const WALK_H = 198;           // 走路圖整張高度
const WALK_FRAMES = 9;        // 走路圖共有 9 張影格

// ===== 動畫與移動設定 =====
const ANIM_SPEED = 6;         // 每幾個畫面更新一次影格(數字越大動畫越慢)
const MOVE_SPEED = 5;         // 角色每個畫面移動的像素

// ===== 全域變數 =====
let stopImg;                  // 站立精靈圖物件
let walkImg;                  // 走路精靈圖物件
let x;                        // 角色的 x 座標(水平中心)
let y;                        // 角色的 y 座標(垂直中心)
let frameIdx = 0;             // 目前播放到第幾個影格
let facingLeft = false;       // 角色是否面向左邊

// 在程式開始前載入圖片
function preload() {
  stopImg = loadImage('1/stop/stop.png');   // 載入站立精靈圖
  walkImg = loadImage('1/walk/walk.png');   // 載入走路精靈圖
}

// 初始化設定,只執行一次
function setup() {
  createCanvas(windowWidth, windowHeight);  // 建立全螢幕畫布
  x = width / 2;                            // 角色一開始位於畫面水平中央
  y = height / 2;                           // 角色一開始位於畫面垂直中央
}

// 每個畫面重複執行
function draw() {
  background('#cbeef3');                    // 設定背景顏色為 cbeef3

  // 判斷目前按下的方向鍵
  let movingRight = keyIsDown(RIGHT_ARROW); // 是否按著右鍵
  let movingLeft = keyIsDown(LEFT_ARROW);   // 是否按著左鍵
  let walking = movingRight || movingLeft;  // 是否處於走路狀態

  // 依按鍵更新位置與面向
  if (movingRight) {
    x += MOVE_SPEED;                        // 往右移動
    facingLeft = false;                     // 面向右邊
  } else if (movingLeft) {
    x -= MOVE_SPEED;                        // 往左移動
    facingLeft = true;                      // 面向左邊
  }

  // 選擇目前要使用的圖片與參數
  let img = walking ? walkImg : stopImg;               // 走路用走路圖,否則用站立圖
  let frames = walking ? WALK_FRAMES : STOP_FRAMES;    // 目前圖片的影格數
  let totalW = walking ? WALK_W : STOP_W;              // 目前圖片的整張寬度
  let h = walking ? WALK_H : STOP_H;                   // 目前圖片的高度
  let frameW = totalW / frames;                        // 單一影格的寬度

  // 每隔 ANIM_SPEED 個畫面切換到下一個影格,並循環播放
  if (frameCount % ANIM_SPEED === 0) {
    frameIdx = (frameIdx + 1) % frames;
  }
  frameIdx = frameIdx % frames;             // 切換圖片時避免影格編號超出範圍

  // 讓角色超出畫面一側時,從另一側出現
  if (x > width + frameW / 2) x = -frameW / 2;
  if (x < -frameW / 2) x = width + frameW / 2;

  // 開始繪製角色
  push();                                   // 儲存目前的繪圖狀態
  translate(x, y);                          // 將原點移到角色位置
  if (facingLeft) {
    scale(-1, 1);                           // 面向左邊時水平翻轉
  }
  imageMode(CENTER);                        // 以圖片中心點作為繪製基準
  image(
    img,                                    // 要繪製的圖片
    0, 0,                                   // 繪製位置(已移到角色位置)
    frameW, h,                              // 繪製的寬高
    frameIdx * frameW, 0,                   // 從精靈圖裁切的起點 (sx, sy)
    frameW, h                               // 從精靈圖裁切的寬高 (sw, sh)
  );
  pop();                                    // 還原繪圖狀態
}

// 視窗大小改變時,同步調整畫布大小
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);  // 重新設定畫布為全螢幕
  y = height / 2;                           // 角色垂直位置重新置中
}