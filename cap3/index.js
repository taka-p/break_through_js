/**
 * Canvasの描画フロー
 * 1. 図形を描画
 * 2. 図形を消去
 * 3. 位置をずらす
 * 4. 再度、図形を描画
 * 5. 一定時間時間を置く
 *
 **/

// canvas要素の取得、canvas要素の2dコンテキストを取得
var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    interval = Math.floor(1000 / 60), // 60FPSで描画
    x = 5,
    y = 5;

Window.requestAnimationFrame =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (cd) {
        setTimeout(cd, 17);
    };


draw(); // 1. 図形を描画

function draw() {
    ctx.clearRect(0, 0, 500, 500); // 2. 図形を消去

    x += 5; //3. 位置をずらす
    y += 5;

    ctx.beginPath(); //4. 再度、図形を描画
    ctx.fillStyle = "#99ff66";
    ctx.rect(x, y, 100, 200);
    // ctx.arc( 100, 100, 40, 0, Math.PI * 2 ); 円形
    ctx.fill();
    ctx.closePath();

    requestAnimationFrame(draw);
}


