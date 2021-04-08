function rColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
const initialBricks = [[],[],[],[],[],[],[0,0,0,0,0,0,0,0,0,0,0,0,0,0],[1,1,1,1,1,1,1,1,1,1,1,1,1,1],[2,2,2,2,2,2,2,2,2,2,2,2,2,2],[3,3,3,3,3,3,3,3,3,3,3,3,3,3],[4,4,4,4,4,4,4,4,4,4,4,4,4,4],[5,5,5,5,5,5,5,5,5,5,5,5,5,5],[6,6,6,6,6,6,6,6,6,6,6,6,6,6],[7,7,7,7,7,7,7,7,7,7,7,7,7,7],[8,8,8,8,8,8,8,8,8,8,8,8,8,8],[9,9,9,9,9,9,9,9,9,9,9,9,9,9]];
const colorMap = [rColor(), rColor(), rColor(), rColor(), rColor(), rColor(), rColor(), rColor(), rColor(), rColor()];
const bricks = [];
for (let row = 0; row < initialBricks.length; row++) for (let col = 0; col < initialBricks[row].length; col++) bricks.push({x: 12.5 + 27 * col, y: 12.5 + 14.5 * row, color: colorMap[initialBricks[row][col]], width: 25, height: 12.5});
const paddle = {x: canvas.width / 2 - 12.5,y: 440,width: 50,height: 12.5,dx: 0};
const ball = {x: 130,y: 260,width: 5,height: 5,speed: 2,dx: 0,dy: 0};
function collides(obj1, obj2) {return obj1.x < obj2.x + obj2.width && obj1.x + obj1.width > obj2.x && obj1.y < obj2.y + obj2.height && obj1.y + obj1.height > obj2.y;}
function loop() {
    requestAnimationFrame(loop);
    context.clearRect(0, 0, canvas.width, canvas.height);
    paddle.x += paddle.dx;
    if (paddle.x < 12.5) {paddle.x = 12.5;}
    else if (paddle.x + 25 > canvas.width - 12.5) {paddle.x = canvas.width - 37.5;}
    ball.x += ball.dx;
    ball.y += ball.dy;
    if (ball.x < 12.5) {
        ball.x = 12.5;
        ball.dx *= -1;
    }
    else if (ball.x + ball.width > canvas.width - 12.5) {
        ball.x = canvas.width - ball.width - 12.5;
        ball.dx *= -1;
    }
    if (ball.y < 12.5) {
        ball.y = 12.5;
        ball.dy *= -1;
    }
    if (ball.y > canvas.height) {
        ball.x = 130;
        ball.y = 260;
        ball.dx = 0;
        ball.dy = 0;
    }
    if (collides(ball, paddle)) {
        ball.dy *= -1;
        ball.y = paddle.y - ball.height;
    }
    for (let i = 0; i < bricks.length; i++) {
        const brick = bricks[i];
        if (collides(ball, brick)) {
            bricks.splice(i, 1);
            if (ball.y + ball.height - ball.speed <= brick.y ||ball.y >= brick.y + brick.height - ball.speed) {ball.dy *= -1;}
            else {ball.dx *= -1;}
            break;
        }
    }
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, 12.5);
    context.fillRect(0, 0, 12.5, canvas.height);
    context.fillRect(canvas.width - 12.5, 0, 12.5, canvas.height);
    if (ball.dx || ball.dy) {context.fillRect(ball.x, ball.y, ball.width, ball.height);}
    bricks.forEach(function(brick) {
        context.fillStyle = brick.color;
        context.fillRect(brick.x, brick.y, brick.width, brick.height);
    });
    context.fillStyle = 'white';
    context.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}
document.addEventListener('keydown', function(e) {
    if (e.which === 37) {paddle.dx = -3;}
    else if (e.which === 39) {paddle.dx = 3;}
    if (!ball.dx && !ball.dy && e.which === 38) {
        ball.dx = ball.speed;
        ball.dy = ball.speed;
    }
});
document.addEventListener('keyup', function(e) {if (e.which === 37 || e.which === 39) {paddle.dx = 0;}});
requestAnimationFrame(loop);