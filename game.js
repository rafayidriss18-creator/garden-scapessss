// --- GAME STATE ---
let state = JSON.parse(localStorage.getItem('tanishaGame')) || {
    stars: 0,
    level: 1,
    unlockedIndices: []
};

const SYMBOLS = ['🌸', '🍦', '🎬', '🧸', '💖', '🍿'];
const MILESTONES = [
    { title: "First DM", note: "Where it all began on Insta..." },
    { title: "First Meet", note: "Movie theatre butterflies." },
    { title: "Aug 16", note: "The first kiss. 2024." },
    // Add all 50 milestones here!
];

// --- INITIALIZATION ---
function init() {
    updateHUD();
    generateMap();
    if(state.unlockedIndices.length === 0) triggerStarfish("Welcome to our garden, Tanisha!");
}

function updateHUD() {
    document.getElementById('star-count').innerText = state.stars;
    document.getElementById('level-num').innerText = state.level;
    localStorage.setItem('tanishaGame', JSON.stringify(state));
}

// --- GARDEN LOGIC ---
function generateMap() {
    const map = document.getElementById('garden-map');
    map.innerHTML = '';
    MILESTONES.forEach((m, i) => {
        const node = document.createElement('div');
        node.className = `milestone-node ${state.unlockedIndices.includes(i) ? 'unlocked' : ''}`;
        node.innerHTML = `
            <strong>#${i + 1}</strong>
            <small>${state.unlockedIndices.includes(i) ? m.title : '???'}</small>
            ${!state.unlockedIndices.includes(i) ? `<button onclick="unlockNode(${i})">1 ⭐</button>` : ''}
        `;
        map.appendChild(node);
    });
}

function unlockNode(index) {
    if (state.stars >= 1) {
        state.stars--;
        state.unlockedIndices.push(index);
        updateHUD();
        generateMap();
        triggerStarfish(`We just restored: ${MILESTONES[index].title}!`);
    } else {
        triggerStarfish("Play a level to earn more stars!");
    }
}

// --- MATCH-3 LOGIC ---
let selectedTile = null;

function createGrid() {
    const grid = document.getElementById('grid');
    grid.innerHTML = '';
    for (let i = 0; i < 49; i++) {
        const tile = document.createElement('div');
        tile.className = 'tile';
        tile.innerText = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
        tile.onclick = () => handleTileClick(tile);
        grid.appendChild(tile);
    }
}

function handleTileClick(tile) {
    if (!selectedTile) {
        selectedTile = tile;
        tile.classList.add('selected');
    } else {
        // Simple Swap
        let temp = selectedTile.innerText;
        selectedTile.innerText = tile.innerText;
        tile.innerText = temp;
        
        selectedTile.classList.remove('selected');
        selectedTile = null;

        // In a real copy, we'd check for matches here.
        // For now, swap = win level for testing!
        winLevel();
    }
}

function winLevel() {
    state.stars++;
    state.level++;
    updateHUD();
    alert("Level Complete! You earned 1 Star.");
    goToGarden();
}

// --- NAVIGATION ---
function goToLevel() {
    document.getElementById('garden-screen').classList.remove('active');
    document.getElementById('game-screen').classList.add('active');
    createGrid();
}

function goToGarden() {
    document.getElementById('game-screen').classList.remove('active');
    document.getElementById('garden-screen').classList.add('active');
}

// --- STARFISHY DIALOGUE ---
function triggerStarfish(text) {
    const box = document.getElementById('starfish-dialogue');
    document.getElementById('starfish-text').innerText = text;
    box.classList.add('active');
    setTimeout(() => box.classList.remove('active'), 4000);
}

// --- VENT LOGIC ---
function openVent() { document.getElementById('vent-overlay').style.display = 'flex'; }
function closeVent() { 
    document.getElementById('vent-overlay').style.display = 'none'; 
    document.getElementById('vent-reply').classList.add('hidden');
}
function sendVent() {
    const reply = document.getElementById('vent-reply');
    reply.innerText = "The ocean took your worries. I love you, Tanisha.";
    reply.classList.remove('hidden');
}

init();
