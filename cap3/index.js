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

canvas.width = W;
canvas.height = H;

function Particle(ctx, x, y) {
    this.ctx = ctx;
    this.initialize(x, y);
}

Particle.prototype.initialize = function (x, y) {
    this.x = x || 0;
    this.y = y || 0;
    this.radius = 10;
    // 速度用のオブジェクトv
    this.v = {
        x: Math.random() * 10 - 5, // x方向の速度
        y: Math.random() * 10 - 5 // y方向の速度
    };
    this.color = {
        r: Math.floor(Math.random() * 255),
        g: Math.floor(Math.random() * 255),
        b: Math.floor(Math.random() * 255),
        a: 1
    };
}

Particle.prototype.render = function () {
    this.updatePosition();
    this.wrapPosition();
    this.draw();
}

Particle.prototype.draw = function () {
    //4. 再度、図形を描画
    ctx = this.ctx;
    ctx.beginPath();
    ctx.fillStyle = this.gradient();
    ctx.arc(this.x, this.y, this.radius, Math.PI * 2, false);
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

Particle.prototype.gradient = function () {
    var col = this.color.r + "," + this.color.g + "," + this.color.b;
    var g = this.ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
    g.addColorStop(0, "rgba(" + col + " ,1)");
    g.addColorStop(0.5, "rgba(" + col + ", 0.2)");
    g.addColorStop(1, "rgba(" + col + ", 0)");
    return g;
}

for (var i = 0; i < NUM; i++) {
    positionX = Math.random() * W; // X座標を0-120の間でランダムに
    positionY = Math.random() * H; // Y座標を0-20の間でランダムに
    particle = new Particle(ctx, positionX, positionY);
    particles.push(particle);
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



