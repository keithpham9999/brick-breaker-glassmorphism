/**
 * Brick Breaker (Glassmorphism)
 * Clean Code Refactored Version
 */

// --- Constants & Configuration ---
const GAME_CONFIG = {
    PADDLE: {
        WIDTH: 120,
        HEIGHT: 15,
        SPEED: 8,
        MARGIN_BOTTOM: 10
    },
    BALL: {
        RADIUS: 8,
        START_SPEED_X: 5,
        START_SPEED_Y: -5,
        PADDLE_HIT_MULTIPLIER: 0.15
    },
    BRICK: {
        ROWS: 5,
        COLS: 9,
        WIDTH: 75,
        HEIGHT: 25,
        PADDING: 10,
        OFFSET_TOP: 50,
        OFFSET_LEFT: 20,
        POINTS: 10,
        COLORS: ['#ff007f', '#00f0ff', '#7000ff', '#00ff66', '#ffaa00']
    },
    GAME: {
        INITIAL_LIVES: 3
    }
};

// --- DOM Elements ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const UI = {
    score: document.getElementById('score'),
    lives: document.getElementById('lives'),
    finalScore: document.getElementById('finalScore'),
    screens: {
        start: document.getElementById('startScreen'),
        gameOver: document.getElementById('gameOverScreen'),
        victory: document.getElementById('victoryScreen')
    },
    buttons: {
        start: document.getElementById('startBtn'),
        restart: document.getElementById('restartBtn'),
        nextLevel: document.getElementById('nextLevelBtn')
    }
};

// --- Game State ---
const gameState = {
    isPlaying: false,
    score: 0,
    lives: GAME_CONFIG.GAME.INITIAL_LIVES,
    requestID: null,
    bricks: []
};

const paddle = {
    x: (canvas.width - GAME_CONFIG.PADDLE.WIDTH) / 2,
    y: canvas.height - GAME_CONFIG.PADDLE.HEIGHT - GAME_CONFIG.PADDLE.MARGIN_BOTTOM,
    isMovingRight: false,
    isMovingLeft: false
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height - 30,
    dx: GAME_CONFIG.BALL.START_SPEED_X,
    dy: GAME_CONFIG.BALL.START_SPEED_Y
};

// --- Initialization ---
function initBricks() {
    gameState.bricks = [];
    for (let col = 0; col < GAME_CONFIG.BRICK.COLS; col++) {
        gameState.bricks[col] = [];
        for (let row = 0; row < GAME_CONFIG.BRICK.ROWS; row++) {
            gameState.bricks[col][row] = { 
                x: 0, 
                y: 0, 
                isDestroyed: false, 
                color: GAME_CONFIG.BRICK.COLORS[row] 
            };
        }
    }
}

function resetBallAndPaddle() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height - 30;
    
    // Randomize initial direction slightly
    const direction = Math.random() > 0.5 ? 1 : -1;
    ball.dx = GAME_CONFIG.BALL.START_SPEED_X * direction;
    ball.dy = GAME_CONFIG.BALL.START_SPEED_Y;
    
    paddle.x = (canvas.width - GAME_CONFIG.PADDLE.WIDTH) / 2;
}

// --- Event Listeners ---
function setupEventListeners() {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    document.addEventListener("mousemove", handleMouseMove);
    
    UI.buttons.start.addEventListener('click', startNewGame);
    UI.buttons.restart.addEventListener('click', startNewGame);
    UI.buttons.nextLevel.addEventListener('click', startNewGame);
}

function handleKeyDown(event) {
    if (event.key === "Right" || event.key === "ArrowRight") {
        paddle.isMovingRight = true;
    } else if (event.key === "Left" || event.key === "ArrowLeft") {
        paddle.isMovingLeft = true;
    }
}

function handleKeyUp(event) {
    if (event.key === "Right" || event.key === "ArrowRight") {
        paddle.isMovingRight = false;
    } else if (event.key === "Left" || event.key === "ArrowLeft") {
        paddle.isMovingLeft = false;
    }
}

function handleMouseMove(event) {
    const relativeX = event.clientX - canvas.getBoundingClientRect().left;
    if (relativeX > 0 && relativeX < canvas.width) {
        let newPaddleX = relativeX - GAME_CONFIG.PADDLE.WIDTH / 2;
        paddle.x = Math.max(0, Math.min(newPaddleX, canvas.width - GAME_CONFIG.PADDLE.WIDTH));
    }
}

// --- Game Logic (Physics & Collisions) ---
function updatePhysics() {
    updatePaddlePosition();
    updateBallPosition();
    handleWallCollisions();
    handlePaddleCollision();
    handleBrickCollisions();
    checkGameOverConditions();
}

function updatePaddlePosition() {
    if (paddle.isMovingRight && paddle.x < canvas.width - GAME_CONFIG.PADDLE.WIDTH) {
        paddle.x += GAME_CONFIG.PADDLE.SPEED;
    } else if (paddle.isMovingLeft && paddle.x > 0) {
        paddle.x -= GAME_CONFIG.PADDLE.SPEED;
    }
}

function updateBallPosition() {
    ball.x += ball.dx;
    ball.y += ball.dy;
}

function handleWallCollisions() {
    // Left and Right walls
    if (ball.x + ball.dx > canvas.width - GAME_CONFIG.BALL.RADIUS || ball.x + ball.dx < GAME_CONFIG.BALL.RADIUS) {
        ball.dx = -ball.dx;
    }
    // Top wall
    if (ball.y + ball.dy < GAME_CONFIG.BALL.RADIUS) {
        ball.dy = -ball.dy;
    }
}

function handlePaddleCollision() {
    const isBallAtPaddleLevel = ball.y + ball.dy > paddle.y - GAME_CONFIG.BALL.RADIUS;
    const isBallWithinPaddleWidth = ball.x > paddle.x && ball.x < paddle.x + GAME_CONFIG.PADDLE.WIDTH;

    if (isBallAtPaddleLevel && isBallWithinPaddleWidth) {
        // Calculate hit point for angle adjustment
        const hitPoint = ball.x - (paddle.x + GAME_CONFIG.PADDLE.WIDTH / 2);
        ball.dx = hitPoint * GAME_CONFIG.BALL.PADDLE_HIT_MULTIPLIER;
        ball.dy = -ball.dy;
    }
}

function handleBrickCollisions() {
    for (let col = 0; col < GAME_CONFIG.BRICK.COLS; col++) {
        for (let row = 0; row < GAME_CONFIG.BRICK.ROWS; row++) {
            const brick = gameState.bricks[col][row];
            if (!brick.isDestroyed) {
                checkSingleBrickCollision(brick);
            }
        }
    }
}

function checkSingleBrickCollision(brick) {
    const isWithinX = ball.x > brick.x && ball.x < brick.x + GAME_CONFIG.BRICK.WIDTH;
    const isWithinY = ball.y > brick.y && ball.y < brick.y + GAME_CONFIG.BRICK.HEIGHT;

    if (isWithinX && isWithinY) {
        ball.dy = -ball.dy;
        brick.isDestroyed = true;
        increaseScore();
    }
}

function increaseScore() {
    gameState.score += GAME_CONFIG.BRICK.POINTS;
    UI.score.innerText = gameState.score;
    
    const maxScore = GAME_CONFIG.BRICK.ROWS * GAME_CONFIG.BRICK.COLS * GAME_CONFIG.BRICK.POINTS;
    if (gameState.score === maxScore) {
        triggerVictory();
    }
}

function checkGameOverConditions() {
    // Ball touched the bottom
    if (ball.y + ball.dy > canvas.height - GAME_CONFIG.BALL.RADIUS) {
        gameState.lives--;
        UI.lives.innerText = gameState.lives;
        
        if (gameState.lives <= 0) {
            triggerGameOver();
        } else {
            resetBallAndPaddle();
        }
    }
}

// --- Rendering ---
function renderGraphics() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    renderBricks();
    renderBall();
    renderPaddle();
}

function renderBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, GAME_CONFIG.BALL.RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "#ffffff";
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.closePath();
    ctx.shadowBlur = 0; // Reset
}

function renderPaddle() {
    ctx.beginPath();
    ctx.roundRect(paddle.x, paddle.y, GAME_CONFIG.PADDLE.WIDTH, GAME_CONFIG.PADDLE.HEIGHT, 8);
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.shadowColor = "rgba(255, 255, 255, 0.5)";
    ctx.shadowBlur = 15;
    ctx.fill();
    ctx.closePath();
    ctx.shadowBlur = 0;
}

function renderBricks() {
    for (let col = 0; col < GAME_CONFIG.BRICK.COLS; col++) {
        for (let row = 0; row < GAME_CONFIG.BRICK.ROWS; row++) {
            const brick = gameState.bricks[col][row];
            if (!brick.isDestroyed) {
                renderSingleBrick(brick, col, row);
            }
        }
    }
}

function renderSingleBrick(brick, col, row) {
    const brickX = (col * (GAME_CONFIG.BRICK.WIDTH + GAME_CONFIG.BRICK.PADDING)) + GAME_CONFIG.BRICK.OFFSET_LEFT;
    const brickY = (row * (GAME_CONFIG.BRICK.HEIGHT + GAME_CONFIG.BRICK.PADDING)) + GAME_CONFIG.BRICK.OFFSET_TOP;
    
    brick.x = brickX;
    brick.y = brickY;
    
    ctx.beginPath();
    ctx.roundRect(brickX, brickY, GAME_CONFIG.BRICK.WIDTH, GAME_CONFIG.BRICK.HEIGHT, 4);
    
    // Glassmorphism effect for bricks
    ctx.fillStyle = brick.color;
    ctx.globalAlpha = 0.8;
    ctx.fill();
    
    // Top highlight for 3D glass effect
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.fillRect(brickX, brickY, GAME_CONFIG.BRICK.WIDTH, 3);
    
    ctx.globalAlpha = 1.0;
    ctx.closePath();
}

// --- Main Game Loop & State Managers ---
function gameLoop() {
    if (!gameState.isPlaying) return;

    updatePhysics();
    renderGraphics();

    gameState.requestID = requestAnimationFrame(gameLoop);
}

function hideAllScreens() {
    UI.screens.start.classList.remove('active');
    UI.screens.gameOver.classList.remove('active');
    UI.screens.victory.classList.remove('active');
}

function startNewGame() {
    initBricks();
    resetBallAndPaddle();
    hideAllScreens();
    
    gameState.score = 0;
    gameState.lives = GAME_CONFIG.GAME.INITIAL_LIVES;
    UI.score.innerText = gameState.score;
    UI.lives.innerText = gameState.lives;
    
    gameState.isPlaying = true;
    
    if (gameState.requestID) {
        cancelAnimationFrame(gameState.requestID);
    }
    
    gameLoop();
}

function triggerGameOver() {
    gameState.isPlaying = false;
    cancelAnimationFrame(gameState.requestID);
    UI.finalScore.innerText = gameState.score;
    UI.screens.gameOver.classList.add('active');
}

function triggerVictory() {
    gameState.isPlaying = false;
    cancelAnimationFrame(gameState.requestID);
    UI.screens.victory.classList.add('active');
}

// --- Bootstrap ---
setupEventListeners();
initBricks();
renderGraphics(); // Initial render for the background before playing
