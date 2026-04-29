// CONFIGURATION & COLORS
const COLORS = {
    pink: '#ffc0cb',
    yellow: '#ffffe0',
    red: '#8b0000',
    white: '#ffffff'
};

const SYMBOLS = ['🌸', '⭐', '🍭', '💖', '🎬', '🍦']; // Us-themed icons

class Game {
    constructor() {
        this.stars = parseInt(localStorage.getItem('stars')) || 0;
        this.level = parseInt(localStorage.getItem('level')) || 1;
        this.milestonesUnlocked = JSON.parse(localStorage.getItem('milestones')) || [];
        this.board = [];
        this.rows = 8;
        this.cols = 8;
        this.selectedTile = null;

        this.init();
    }

    init() {
        this.createBoard();
        this.renderBoard();
        this.updateUI();
    }

    createBoard() {
        for (let r = 0; r < this.rows; r++) {
            this.board[r] = [];
            for (let c = 0; c < this.cols; c++) {
                this.board[r][c] = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
            }
        }
    }

    // Logic to check for matches
    checkMatches() {
        let hasMatch = false;
        // Horizontal Check
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols - 2; c++) {
                if (this.board[r][c] === this.board[r][c+1] && this.board[r][c] === this.board[r][c+2]) {
                    hasMatch = true;
                    // Logic to remove/replace matches goes here
                }
            }
        }
        return hasMatch;
    }

    swap(r1, c1, r2, c2) {
        // Distance check (only adjacent)
        const dR = Math.abs(r1 - r2);
        const dC = Math.abs(c1 - c2);
        if ((dR === 1 && dC === 0) || (dR === 0 && dC === 1)) {
            let temp = this.board[r1][c1];
            this.board[r1][c1] = this.board[r2][c2];
            this.board[r2][c2] = temp;
            
            if (!this.checkMatches()) {
                // If no match, swap back (just like Gardenscapes)
                this.board[r2][c2] = this.board[r1][c1];
                this.board[r1][c1] = temp;
            } else {
                this.winLevel();
            }
            this.renderBoard();
        }
    }

    winLevel() {
        this.stars++;
        this.level++;
        this.save();
        alert("Level Complete! You earned a star.");
        window.location.reload(); // Simple way to reset level
    }

    save() {
        localStorage.setItem('stars', this.stars);
        localStorage.setItem('level', this.level);
        localStorage.setItem('milestones', JSON.stringify(this.milestonesUnlocked));
    }

    updateUI() {
        document.getElementById('star-count').innerText = this.stars;
    }

    renderBoard() {
        const container = document.getElementById('grid');
        container.innerHTML = '';
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                const tile = document.createElement('div');
                tile.className = 'tile';
                tile.innerText = this.board[r][c];
                tile.onclick = () => this.handleTileClick(r, c, tile);
                container.appendChild(tile);
            }
        }
    }

    handleTileClick(r, c, el) {
        if (!this.selectedTile) {
            this.selectedTile = { r, c, el };
            el.classList.add('selected');
        } else {
            this.swap(this.selectedTile.r, this.selectedTile.c, r, c);
            this.selectedTile.el.classList.remove('selected');
            this.selectedTile = null;
        }
    }
}

const myGame = new Game();
