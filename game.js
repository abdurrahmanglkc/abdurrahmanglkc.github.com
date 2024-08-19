const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Canvas boyutlarını ayarla
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let ballRadius = 20;
let x = canvas.width / 2;
let y = canvas.height - ballRadius;
let dx = 2;
let dy = -2;
let gravity = 0.5;
let bounce = 0.7;

// Topu çizen fonksiyon
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

// Oyun döngüsü
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBall();

    // Yer çekimi etkisi
    dy += gravity;

    // Topun hareketini güncelle
    x += dx;
    y += dy;

    // Yere çarpınca zıplat
    if (y + ballRadius > canvas.height) {
        y = canvas.height - ballRadius;
        dy *= -bounce;
    }

    // Sağ ve sol duvarlardan sekme
    if (x + ballRadius > canvas.width || x - ballRadius < 0) {
        dx *= -1;
    }

    requestAnimationFrame(draw);
}

// Ekrana dokunulduğunda topa zıplatma gücü ekle
canvas.addEventListener("touchstart", function() {
    dy = -10; // Zıplama kuvveti
});

// Oyunu başlat
draw();
