// --- 100 MILESTONES DATA ---
const MILESTONES = [
    { id: 1, title: "First DM", cost: 1, type: "bench", top: 4800, left: 20, icon: "🪑" },
    { id: 2, title: "First Meet", cost: 1, type: "fountain", top: 4600, left: 50, icon: "⛲" },
    { id: 3, title: "Aug 16th", cost: 2, type: "flowerbed", top: 4400, left: 10, icon: "🌺" },
    // FUTURE MILESTONES
    { id: 95, title: "Our First Car", cost: 15, type: "car", top: 500, left: 30, icon: "🏎️" },
    { id: 98, title: "The Wedding", cost: 50, type: "altar", top: 200, left: 50, icon: "💒" },
    { id: 100, title: "Our Dream House", cost: 100, type: "mansion", top: 50, left: 20, icon: "🏰" }
];

// Generate middle milestones dynamically for this example
for(let i=4; i<95; i++) {
    MILESTONES.push({ id: i, title: `Memory #${i}`, cost: Math.floor(i/10)+1, type: "item", top: 4400 - (i*40), left: (i%2==0?20:60), icon: "🌸" });
}

let state = JSON.parse(localStorage.getItem('gardenProject')) || { stars: 0, unlocked: [] };

// --- MATCH-3 ENGINE (Candy Crush Style) ---
let gridData = [];
const SYMBOLS = ['🍭', '🍬', '🍇', '🍓', '🍩'];

function createGrid() {
    const grid = document.getElementById('grid');
    grid.innerHTML = '';
    for (let i = 0; i < 49; i++) {
        const tile = document.createElement('div');
        tile.className = 'tile';
        tile.innerText = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
        tile.dataset.id = i;
        tile.onclick = () => handleTileClick(i, tile);
        grid.appendChild(tile);
    }
}

let firstTile = null;

function handleTileClick(id, el) {
    if (!firstTile) {
        firstTile = { id, el };
        el.style.background = "rgba(255,255,255,0.4)";
    } else {
        // SWIPE / SWAP ANIMATION
        const secondTile = { id, el };
        swapTiles(firstTile, secondTile);
        firstTile.el.style.background = "none";
        firstTile = null;
    }
}

function swapTiles(t1, t2) {
    const temp = t1.el.innerText;
    t1.el.innerText = t2.el.innerText;
    t2.el.innerText = temp;

    // CHECK FOR MATCHES (Simulated logic for the pop feel)
    const matchCount = Math.floor(Math.random() * 3) + 3; // Randomly simulating 3, 4, or 5 for the demo feel
    
    if (matchCount === 3) {
        popEffect(t2.el, "Sweet!", 1);
    } else if (matchCount === 4) {
        popEffect(t2.el, "DELICIOUS!!", 3);
        document.getElementById('grid').classList.add('big-explosion');
        setTimeout(() => document.getElementById('grid').classList.remove('big-explosion'), 500);
    } else if (matchCount >= 5) {
        popEffect(t2.el, "DIVINE!!!", 10);
        triggerStarfish("WOW! Tanisha, that was a massive explosion! 💖");
    }
}

function popEffect(el, txt, starsEarned) {
    el.classList.add('popping');
    const msg = document.createElement('div');
    msg.className = 'pop-text';
    msg.innerText = txt;
    el.appendChild(msg);
    
    state.stars += starsEarned;
    save();
    
    setTimeout(() => {
        el.innerText = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
        el.classList.remove('popping');
    }, 400);
}

// --- GARDEN DECORATION LOGIC ---
function openShop() {
    document.getElementById('shop-overlay').style.display = 'flex';
    const list = document.getElementById('milestone-list');
    list.innerHTML = '';
    
    MILESTONES.forEach(m => {
        if (!state.unlocked.includes(m.id)) {
            const btn = document.createElement('button');
            btn.className = 'shop-item';
            btn.innerHTML = `${m.icon} ${m.title} <span>(Cost: ${m.cost}⭐)</span>`;
            btn.onclick = () => build(m);
            list.appendChild(btn);
        }
    });
}

function build(m) {
    if (state.stars >= m.cost) {
        state.stars -= m.cost;
        state.unlocked.push(m.id);
        save();
        renderGarden();
        closeShop();
        triggerStarfish(`Beautiful! We just added ${m.title} to our world.`);
    } else {
        alert("Not enough stars! Play more levels.");
    }
}

function renderGarden() {
    const bg = document.getElementById('garden-background');
    bg.innerHTML = '';
    state.unlocked.forEach(id => {
        const m = MILESTONES.find(x => x.id === id);
        const div = document.createElement('div');
        div.className = 'decoration placed';
        div.style.top = m.top + "px";
        div.style.left = m.left + "%";
        div.innerHTML = `<div style="font-size: 50px;">${m.icon}</div><div class='label'>${m.title}</div>`;
        bg.appendChild(div);
    });
    document.getElementById('star-count').innerText = state.stars;
}

function save() {
    localStorage.setItem('gardenProject', JSON.stringify(state));
    document.getElementById('star-count').innerText = state.stars;
}

function triggerStarfish(t) { /* Same as previous starfish logic */ }
function goToLevel() { /* Switch screens */ }
function goToGarden() { renderGarden(); /* Switch screens */ }

// Start
renderGarden();
