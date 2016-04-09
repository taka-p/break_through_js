/**
 * Canvasの描画フロー
 * 1. 図形を描画
 * 2. 図形を消去
 * 3. 位置をずらす
 * 4. 再度、図形を描画
 * 5. 一定時間時間を置く
 *
 **/

Window.requestAnimationFrame =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (cd) {
        setTimeout(cd, 17);
    };

// canvas要素の取得、canvas要素の2dコンテキストを取得
var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d");

var NUM = 20,
    particles = [];

var W = 500,
    H = 500;

canvas.width = canvas.height = 500;

for (var i = 0; i < NUM; i++) {
    positionX = Math.random() * 120; // X座標を0-120の間でランダムに
    positionY = Math.random() * 20; // Y座標を0-20の間でランダムに
    particle = new Particle(ctx, positionX, positionY);
    particles.push(particle);
}

function Particle(ctx, x, y) {
    this.ctx = ctx;
    this.x = x || 0;
    this.y = y || 0;
    // 速度用のオブジェクトv
    this.v = {
        x: Math.random() * 10 - 5, // x方向の速度
        y: Math.random() * 10 - 5 // y方向の速度
    }
}

Particle.prototype.render = function () {
    this.updatePosition();
    this.draw();
}

Particle.prototype.draw = function () {
    //4. 再度、図形を描画
    ctx = this.ctx;
    ctx.beginPath();
    ctx.fillStyle = "#99ff66";
    ctx.rect(this.x, this.y, 4, 4);
    ctx.fill();
    ctx.closePath();
}

Particle.prototype.updatePosition = function () {
    //3. 位置をずらす
    this.x += this.v.x;
    this.y += this.v.y;
}

Particle.prototype.wrapPosition = function () {
    if (this.x < 0) this.x = W;
    if (this.x > W) this.x = 0;
    if (this.y < 0) this.y = H;
    if (this.y > H) this.y = 0;
}

// 1. 図形を描画(描画サイクルの開始)
render();

function render() {
    // 2. 図形を消去
    ctx.clearRect(0, 0, W, H);

    // 配列の各要素の関数renderを実行して図形を描画
    particles.forEach(function (e) {
        e.render();
    });

    // 5. 一定時間時間を置く
    requestAnimationFrame(render);
}



