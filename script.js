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
    POWER_UP: {
        SPEED: 2,
        SIZE: 20,
        DROP_CHANCE: 0.15,
        DURATION: 10000,
        TYPES: {
            EXPAND: { type: 'EXPAND', color: '#00f0ff', text: 'E' },
            SPEED: { type: 'SPEED', color: '#ffaa00', text: 'S' },
            LIFE: { type: 'LIFE', color: '#00ff66', text: 'L' }
        }
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
    bricks: [],
    powerUps: [],
    activeEffects: [],
    floatingTexts: []
};

const paddle = {
    width: GAME_CONFIG.PADDLE.WIDTH,
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
    
    paddle.x = (canvas.width - paddle.width) / 2;
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
        let newPaddleX = relativeX - paddle.width / 2;
        paddle.x = Math.max(0, Math.min(newPaddleX, canvas.width - paddle.width));
    }
}

// --- Game Logic (Physics & Collisions) ---
function updatePhysics() {
    updatePaddlePosition();
    updateBallPosition();
    handleWallCollisions();
    handlePaddleCollision();
    handleBrickCollisions();
    updatePowerUps();
    updateEffects();
    updateFloatingTexts();
    checkGameOverConditions();
}

function updatePowerUps() {
    for (let i = gameState.powerUps.length - 1; i >= 0; i--) {
        let pu = gameState.powerUps[i];
        pu.y += GAME_CONFIG.POWER_UP.SPEED;

        // Check paddle collision
        if (pu.y + pu.height >= paddle.y && pu.y <= paddle.y + GAME_CONFIG.PADDLE.HEIGHT &&
            pu.x + pu.width >= paddle.x && pu.x <= paddle.x + paddle.width) {
            applyPowerUpEffect(pu);
            gameState.powerUps.splice(i, 1);
            continue;
        }

        // Out of bounds
        if (pu.y > canvas.height) {
            gameState.powerUps.splice(i, 1);
        }
    }
}

function applyPowerUpEffect(pu) {
    let text = "";
    if (pu.type === 'LIFE') {
        gameState.lives++;
        UI.lives.innerText = gameState.lives;
        text = "+1 LIFE";
    } else {
        const endTime = Date.now() + GAME_CONFIG.POWER_UP.DURATION;
        let existing = gameState.activeEffects.find(e => e.type === pu.type);
        if (existing) {
            existing.endTime = endTime;
        } else {
            gameState.activeEffects.push({ type: pu.type, endTime: endTime });
            if (pu.type === 'EXPAND') {
                paddle.x -= paddle.width * 0.25; 
                paddle.width *= 1.5;
            } else if (pu.type === 'SPEED') {
                ball.dx *= 1.3;
                ball.dy *= 1.3;
            }
        }
        text = pu.type === 'EXPAND' ? "EXPAND!" : "SPEED UP!";
    }
    
    gameState.floatingTexts.push({
        x: paddle.x + paddle.width / 2,
        y: paddle.y - 10,
        text: text,
        color: pu.color,
        alpha: 1.0
    });
}

function updateEffects() {
    const now = Date.now();
    for (let i = gameState.activeEffects.length - 1; i >= 0; i--) {
        let effect = gameState.activeEffects[i];
        if (now > effect.endTime) {
            if (effect.type === 'EXPAND') {
                paddle.width /= 1.5;
                paddle.x += paddle.width * 0.25; 
            } else if (effect.type === 'SPEED') {
                ball.dx /= 1.3;
                ball.dy /= 1.3;
            }
            gameState.activeEffects.splice(i, 1);
        }
    }
}

function updateFloatingTexts() {
    for (let i = gameState.floatingTexts.length - 1; i >= 0; i--) {
        let ft = gameState.floatingTexts[i];
        ft.y -= 1;
        ft.alpha -= 0.015;
        if (ft.alpha <= 0) {
            gameState.floatingTexts.splice(i, 1);
        }
    }
}

function updatePaddlePosition() {
    if (paddle.isMovingRight && paddle.x < canvas.width - paddle.width) {
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
    const isBallWithinPaddleWidth = ball.x > paddle.x && ball.x < paddle.x + paddle.width;

    if (isBallAtPaddleLevel && isBallWithinPaddleWidth) {
        // Calculate hit point for angle adjustment
        const hitPoint = ball.x - (paddle.x + paddle.width / 2);
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
        spawnPowerUp(brick.x + GAME_CONFIG.BRICK.WIDTH / 2, brick.y + GAME_CONFIG.BRICK.HEIGHT / 2);
    }
}

function spawnPowerUp(x, y) {
    if (Math.random() < GAME_CONFIG.POWER_UP.DROP_CHANCE) {
        const types = Object.values(GAME_CONFIG.POWER_UP.TYPES);
        const randomType = types[Math.floor(Math.random() * types.length)];
        gameState.powerUps.push({
            x: x - GAME_CONFIG.POWER_UP.SIZE / 2,
            y: y,
            width: GAME_CONFIG.POWER_UP.SIZE,
            height: GAME_CONFIG.POWER_UP.SIZE,
            ...randomType
        });
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
    renderPowerUps();
    renderBall();
    renderPaddle();
    renderFloatingTexts();
}

function renderPowerUps() {
    for (let pu of gameState.powerUps) {
        ctx.beginPath();
        ctx.roundRect(pu.x, pu.y, pu.width, pu.height, 4);
        ctx.fillStyle = pu.color;
        ctx.globalAlpha = 0.8;
        ctx.shadowColor = pu.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        
        ctx.fillStyle = "#fff";
        ctx.font = "bold 12px Orbitron";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(pu.text, pu.x + pu.width / 2, pu.y + pu.height / 2);
        
        ctx.globalAlpha = 1.0;
        ctx.shadowBlur = 0;
        ctx.closePath();
    }
}

function renderFloatingTexts() {
    for (let ft of gameState.floatingTexts) {
        ctx.globalAlpha = Math.max(0, ft.alpha);
        ctx.fillStyle = ft.color;
        ctx.shadowColor = ft.color;
        ctx.shadowBlur = 10;
        ctx.font = "bold 16px Orbitron";
        ctx.textAlign = "center";
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.globalAlpha = 1.0;
        ctx.shadowBlur = 0;
    }
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
    ctx.roundRect(paddle.x, paddle.y, paddle.width, GAME_CONFIG.PADDLE.HEIGHT, 8);
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
    gameState.powerUps = [];
    gameState.activeEffects = [];
    gameState.floatingTexts = [];
    paddle.width = GAME_CONFIG.PADDLE.WIDTH;
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
