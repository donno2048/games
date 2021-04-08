const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
const maxPaddleY = canvas.height - 65;
const leftPaddle = {x: 30, y: canvas.height / 2 - 25, width: 15, height: 50, dy: 0};
const rightPaddle = {x: canvas.width - 45, y: canvas.height / 2 - 25, width: 15, height: 50, dy: 0};
const ball = {x: canvas.width / 2, y: canvas.height / 2, width: 15, height: 15, resetting: false, dx: 5, dy: -5};
function loop() {
    requestAnimationFrame(loop);
    context.clearRect(0, 0, canvas.width, canvas.height);
    leftPaddle.y += leftPaddle.dy;
    rightPaddle.y += rightPaddle.dy;
    if (leftPaddle.y < 15) leftPaddle.y = 15;
    else if (leftPaddle.y > maxPaddleY) leftPaddle.y = maxPaddleY;
    if (rightPaddle.y < 15) rightPaddle.y = 15;
    else if (rightPaddle.y > maxPaddleY) rightPaddle.y = maxPaddleY;
    context.fillStyle = 'white';
    context.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
    context.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);
    ball.x += ball.dx;
    ball.y += ball.dy;
    if (ball.y < 15) {
        ball.y = 15;
        ball.dy *= -1;
    }
    else if (ball.y + 15 > canvas.height - 15) {
        ball.y = canvas.height - 30;
        ball.dy *= -1;
    }
    if ( (ball.x < 0 || ball.x > canvas.width) && !ball.resetting) {
        ball.resetting = true;
        setTimeout(() => {
            ball.resetting = false;
            ball.x = canvas.width / 2;
            ball.y = canvas.height / 2;
        }, 400);
    }
    if (ball.x < leftPaddle.x + leftPaddle.width && ball.x + ball.width > leftPaddle.x && ball.y < leftPaddle.y + leftPaddle.height && ball.y + ball.height > leftPaddle.y) {
        ball.dx *= -1;
        ball.x = leftPaddle.x + leftPaddle.width;
    }
    else if (ball.x < rightPaddle.x + rightPaddle.width && ball.x + ball.width > rightPaddle.x && ball.y < rightPaddle.y + rightPaddle.height && ball.y + ball.height > rightPaddle.y) {
        ball.dx *= -1;
        ball.x = rightPaddle.x - ball.width;
    }
    context.fillRect(ball.x, ball.y, ball.width, ball.height);
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, 15);
    context.fillRect(0, canvas.height - 15, canvas.width, canvas.height);
}
document.addEventListener('keydown', function(e) {if (e.which === 38) {rightPaddle.dy = -10;}else if (e.which === 40) {rightPaddle.dy = 10;}if (e.which === 87) {leftPaddle.dy = -10;}else if (e.which === 83) {leftPaddle.dy = 10;}});
document.addEventListener('keyup', function(e) {if (e.which === 38 || e.which === 40) {rightPaddle.dy = 0;}if (e.which === 83 || e.which === 87) {leftPaddle.dy = 0;}});
requestAnimationFrame(loop);