document.addEventListener('DOMContentLoaded', () => {
    initBoard();
    initDice();
    initTokens();
});

function initBoard() {
    const board = document.getElementById('board');
    
    // Create 15x15 grid cells
    for (let i = 0; i < 225; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        
        const row = Math.floor(i / 15);
        const col = i % 15;
        
        // Define Paths
        if (row === 7 && col >= 1 && col <= 6) cell.classList.add('path-red');
        if (col === 7 && row >= 1 && row <= 6) cell.classList.add('path-green');
        if (col === 7 && row >= 8 && row <= 13) cell.classList.add('path-blue');
        if (row === 7 && col >= 8 && col <= 13) cell.classList.add('path-yellow');
        
        // Safe Zones
        const safeZones = [
            {r: 6, c: 1}, {r: 1, c: 8}, {r: 8, c: 13}, {r: 13, c: 6},
            {r: 2, c: 6}, {r: 6, c: 12}, {r: 12, c: 8}, {r: 8, c: 2}
        ];
        
        for (let sz of safeZones) {
            if (row === sz.r && col === sz.c) {
                cell.innerHTML = '<i class="fa-solid fa-star safe-zone"></i>';
                cell.style.background = '#f8fafc';
            }
        }
        
        board.appendChild(cell);
    }
    
    // Create Bases
    createBase(board, 'red', ['t1','t2','t3','t4']);
    createBase(board, 'green', ['t5','t6','t7','t8']);
    createBase(board, 'yellow', ['t9','t10','t11','t12']);
    createBase(board, 'blue', ['t13','t14','t15','t16']);
    
    // Create Home Center
    const home = document.createElement('div');
    home.className = 'home-center';
    board.appendChild(home);
}

function createBase(board, color, tokens) {
    const base = document.createElement('div');
    base.className = `base ${color}`;
    
    const inner = document.createElement('div');
    inner.className = 'base-inner';
    
    tokens.forEach(tid => {
        const spot = document.createElement('div');
        spot.className = 'token-spot';
        
        const token = document.createElement('div');
        token.className = `token ${color}`;
        token.id = tid;
        
        spot.appendChild(token);
        inner.appendChild(spot);
    });
    
    base.appendChild(inner);
    board.appendChild(base);
}

const diceFaces = [
    'fa-dice-one',
    'fa-dice-two',
    'fa-dice-three',
    'fa-dice-four',
    'fa-dice-five',
    'fa-dice-six'
];

const players = ['red', 'green', 'yellow', 'blue'];
let currentPlayerIdx = 0;
let currentRoll = 0;
let waitingForMove = false;

const playerHasCaptured = {
    red: false,
    green: false,
    yellow: false,
    blue: false
};

function initDice() {
    const btn = document.getElementById('rollDiceBtn');
    const diceDisplay = document.getElementById('dice-display');
    
    btn.addEventListener('click', () => {
        if (diceDisplay.classList.contains('rolling') || waitingForMove) return;
        
        diceDisplay.classList.add('rolling');
        
        let rollInterval = setInterval(() => {
            const tempRoll = Math.floor(Math.random() * 6);
            diceDisplay.innerHTML = `<i class="fa-solid ${diceFaces[tempRoll]}"></i>`;
        }, 100);
        
        setTimeout(() => {
            clearInterval(rollInterval);
            diceDisplay.classList.remove('rolling');
            
            const finalRoll = Math.floor(Math.random() * 6);
            diceDisplay.innerHTML = `<i class="fa-solid ${diceFaces[finalRoll]}"></i>`;
            
            currentRoll = finalRoll + 1;
            waitingForMove = true;
            
            const currentPlayer = players[currentPlayerIdx];
            const tokensInBase = document.querySelectorAll(`.token.${currentPlayer}[data-state="base"]`);
            const tokensOut = document.querySelectorAll(`.token.${currentPlayer}[data-state="out"]`);
            
            // Check if there are any valid moves
            let hasValidMove = false;
            if (currentRoll === 6 && tokensInBase.length > 0) hasValidMove = true;
            
            tokensOut.forEach(t => {
                let inHome = t.dataset.inHomePath === 'true';
                let step = parseInt(t.dataset.step);
                let nextStep = step + currentRoll;
                
                if (inHome) {
                    if (nextStep <= 6) hasValidMove = true;
                } else {
                    let loopCount = Math.floor(step / 52);
                    let threshold = loopCount * 52 + 50;
                    if (step <= threshold && nextStep > threshold) {
                        if (playerHasCaptured[currentPlayer]) {
                            if (nextStep - threshold <= 6) hasValidMove = true;
                        } else {
                            hasValidMove = true;
                        }
                    } else {
                        hasValidMove = true;
                    }
                }
            });
            
            if (!hasValidMove) {
                waitingForMove = false;
                switchTurn();
            }
            
        }, 600);
    });
}

function switchTurn() {
    const turnIndicator = document.getElementById('turn-indicator');
    currentPlayerIdx = (currentPlayerIdx + 1) % 4;
    const nextPlayer = players[currentPlayerIdx];
    turnIndicator.innerHTML = `<span class="player-badge ${nextPlayer}-bg">${nextPlayer.charAt(0).toUpperCase() + nextPlayer.slice(1)} Player</span>`;
}

const mainPath = [
    {r: 6, c: 1}, {r: 6, c: 2}, {r: 6, c: 3}, {r: 6, c: 4}, {r: 6, c: 5},
    {r: 5, c: 6}, {r: 4, c: 6}, {r: 3, c: 6}, {r: 2, c: 6}, {r: 1, c: 6}, {r: 0, c: 6},
    {r: 0, c: 7}, {r: 0, c: 8},
    {r: 1, c: 8}, {r: 2, c: 8}, {r: 3, c: 8}, {r: 4, c: 8}, {r: 5, c: 8},
    {r: 6, c: 9}, {r: 6, c: 10}, {r: 6, c: 11}, {r: 6, c: 12}, {r: 6, c: 13}, {r: 6, c: 14},
    {r: 7, c: 14}, {r: 8, c: 14},
    {r: 8, c: 13}, {r: 8, c: 12}, {r: 8, c: 11}, {r: 8, c: 10}, {r: 8, c: 9},
    {r: 9, c: 8}, {r: 10, c: 8}, {r: 11, c: 8}, {r: 12, c: 8}, {r: 13, c: 8}, {r: 14, c: 8},
    {r: 14, c: 7}, {r: 14, c: 6},
    {r: 13, c: 6}, {r: 12, c: 6}, {r: 11, c: 6}, {r: 10, c: 6}, {r: 9, c: 6},
    {r: 8, c: 5}, {r: 8, c: 4}, {r: 8, c: 3}, {r: 8, c: 2}, {r: 8, c: 1}, {r: 8, c: 0},
    {r: 7, c: 0}
];

const homePaths = {
    red: [{r: 7, c: 1}, {r: 7, c: 2}, {r: 7, c: 3}, {r: 7, c: 4}, {r: 7, c: 5}, {r: 'home', c: 'home'}],
    green: [{r: 1, c: 7}, {r: 2, c: 7}, {r: 3, c: 7}, {r: 4, c: 7}, {r: 5, c: 7}, {r: 'home', c: 'home'}],
    yellow: [{r: 7, c: 13}, {r: 7, c: 12}, {r: 7, c: 11}, {r: 7, c: 10}, {r: 7, c: 9}, {r: 'home', c: 'home'}],
    blue: [{r: 13, c: 7}, {r: 12, c: 7}, {r: 11, c: 7}, {r: 10, c: 7}, {r: 9, c: 7}, {r: 'home', c: 'home'}]
};

const startIndices = {
    red: 0,
    green: 13,
    yellow: 26,
    blue: 39
};

const safeZonePositions = [
    {r: 6, c: 1}, {r: 1, c: 8}, {r: 8, c: 13}, {r: 13, c: 6},
    {r: 2, c: 6}, {r: 6, c: 12}, {r: 12, c: 8}, {r: 8, c: 2}
];

function isSafeZone(r, c) {
    return safeZonePositions.some(sz => sz.r === r && sz.c === c);
}

function initTokens() {
    const allTokens = document.querySelectorAll('.token');
    allTokens.forEach(token => {
        token.dataset.state = 'base';
        token.dataset.step = 0; 
        token.dataset.inHomePath = 'false';
        
        token.addEventListener('click', () => {
            if (!waitingForMove) return;
            
            const tokenColor = Array.from(token.classList).find(c => players.includes(c));
            if (tokenColor !== players[currentPlayerIdx]) return;
            
            if (token.dataset.state === 'base') {
                if (currentRoll === 6) {
                    moveTokenToMainPath(token, tokenColor, 0);
                    waitingForMove = false;
                    currentRoll = 0;
                }
            } else if (token.dataset.state === 'out') {
                let inHome = token.dataset.inHomePath === 'true';
                
                if (inHome) {
                    let currentHomeStep = parseInt(token.dataset.step);
                    let nextHomeStep = currentHomeStep + currentRoll;
                    if (nextHomeStep <= 6) {
                        const reachedHome = moveTokenToHomePath(token, tokenColor, nextHomeStep);
                        waitingForMove = false;
                        if (!reachedHome) switchTurn(); // No extra turn in victory path unless it reaches home
                        currentRoll = 0;
                    }
                } else {
                    let currentStep = parseInt(token.dataset.step);
                    let nextStep = currentStep + currentRoll;
                    
                    let loopCount = Math.floor(currentStep / 52);
                    let threshold = loopCount * 52 + 50;
                    
                    if (currentStep <= threshold && nextStep > threshold) {
                        if (playerHasCaptured[tokenColor]) {
                            let stepsInHome = nextStep - threshold;
                            if (stepsInHome <= 6) {
                                const reachedHome = moveTokenToHomePath(token, tokenColor, stepsInHome);
                                waitingForMove = false;
                                if (!reachedHome) switchTurn(); // No extra turn when entering victory path
                                currentRoll = 0;
                            }
                        } else {
                            const captured = moveTokenToMainPath(token, tokenColor, nextStep);
                            waitingForMove = false;
                            if (currentRoll !== 6 && !captured) switchTurn();
                            currentRoll = 0;
                        }
                    } else {
                        const captured = moveTokenToMainPath(token, tokenColor, nextStep);
                        waitingForMove = false;
                        if (currentRoll !== 6 && !captured) switchTurn();
                        currentRoll = 0;
                    }
                }
            }
        });
    });
}

function rearrangeTokens(cell) {
    if (!cell || (!cell.classList.contains('cell') && !cell.classList.contains('home-center'))) return;
    
    const tokens = cell.querySelectorAll('.token');
    
    tokens.forEach(t => {
        t.classList.remove('token-pos-0', 'token-pos-1', 'token-pos-2', 'token-pos-3', 'token-pos-4');
        t.style.position = 'relative'; 
    });
    
    if (tokens.length > 1) {
        cell.classList.add('has-multiple');
        tokens.forEach((t, i) => {
            t.classList.add(`token-pos-${Math.min(i, 4)}`);
            t.style.position = 'absolute';
        });
    } else {
        cell.classList.remove('has-multiple');
    }
}

function captureTokens(targetCell, color) {
    let captured = false;
    const existingTokens = targetCell.querySelectorAll('.token');
    existingTokens.forEach(t => {
        const tColor = Array.from(t.classList).find(c => players.includes(c));
        if (tColor && tColor !== color) {
            captured = true;
            t.dataset.state = 'base';
            t.dataset.step = 0;
            t.dataset.inHomePath = 'false';
            t.style.position = 'absolute';
            t.classList.remove('token-pos-0', 'token-pos-1', 'token-pos-2', 'token-pos-3', 'token-pos-4');
            
            const baseInner = document.querySelector(`.base.${tColor} .base-inner`);
            const emptySpot = Array.from(baseInner.children).find(spot => spot.children.length === 0);
            if (emptySpot) emptySpot.appendChild(t);
        }
    });
    if (captured) playerHasCaptured[color] = true;
    return captured;
}

function visuallyMoveToken(token, targetCell) {
    const oldCell = token.parentElement;
    
    const star = targetCell.querySelector('.fa-star');
    if (star) {
        star.style.position = 'absolute';
        star.style.zIndex = '0';
    }
    
    targetCell.appendChild(token);
    token.style.zIndex = '10';
    
    rearrangeTokens(oldCell);
    rearrangeTokens(targetCell);
}

function moveTokenToMainPath(token, color, step) {
    const globalIndex = (startIndices[color] + step) % 52;
    const pos = mainPath[globalIndex];
    
    token.dataset.step = step;
    token.dataset.state = 'out';
    token.dataset.inHomePath = 'false';
    
    const board = document.getElementById('board');
    const cellIndex = pos.r * 15 + pos.c;
    const targetCell = board.children[cellIndex];
    
    let captured = false;
    if (!isSafeZone(pos.r, pos.c)) {
        captured = captureTokens(targetCell, color);
    }
    visuallyMoveToken(token, targetCell);
    return captured;
}

function moveTokenToHomePath(token, color, homeStep) {
    const homeIndex = homeStep - 1;
    const pos = homePaths[color][homeIndex];
    
    token.dataset.step = homeStep; 
    token.dataset.state = 'out';
    token.dataset.inHomePath = 'true';
    
    const board = document.getElementById('board');
    let targetCell;
    if (pos.r === 'home') {
        targetCell = document.querySelector('.home-center');
    } else {
        const cellIndex = pos.r * 15 + pos.c;
        targetCell = board.children[cellIndex];
    }
    
    visuallyMoveToken(token, targetCell);
    return homeStep === 6; // Returns true if token reached the home center (victory), granting an extra turn
}
