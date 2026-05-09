const config = {
    clientId: "1461675860598718477",
    symbols: ["🐦‍🔥", "🔥", "💎", "7️⃣", "🗿", "🍀", "🪙", "💸"],
    winningMultipliers: {
        "7️⃣": 50, "💎": 30, "🐦‍🔥": 20, "🔥": 15, "💸": 10, "🪙": 5, "🍀": 3, "🗿": 2
    },
    initialTokens: 10
};

let userTokens = parseInt(localStorage.getItem('tokens')) || config.initialTokens;

const reelElements = [
    document.getElementById('reel1'),
    document.getElementById('reel2'),
    document.getElementById('reel3')
];
const tokenDisplay = document.getElementById('token-count');
const messageDisplay = document.getElementById('message');
const spinButton = document.getElementById('spin-button');

function updateUI() {
    tokenDisplay.textContent = userTokens;
    localStorage.setItem('tokens', userTokens);
}

window.spin = function() {
    if (userTokens < 1) {
        messageDisplay.textContent = "Keine Token mehr!";
        messageDisplay.style.color = "#ff4444";
        return;
    }

    userTokens -= 1;
    updateUI();
    spinButton.disabled = true;
    messageDisplay.textContent = "Rollen...";

    let count = 0;
    const interval = setInterval(() => {
        reelElements.forEach(reel => {
            reel.textContent = config.symbols[Math.floor(Math.random() * config.symbols.length)];
        });
        count++;
        if (count > 12) {
            clearInterval(interval);
            finalizeSpin();
        }
    }, 80);
};

function finalizeSpin() {
    const res = [
        config.symbols[Math.floor(Math.random() * config.symbols.length)],
        config.symbols[Math.floor(Math.random() * config.symbols.length)],
        config.symbols[Math.floor(Math.random() * config.symbols.length)]
    ];

    reelElements.forEach((reel, i) => reel.textContent = res[i]);

    if (res[0] === res[1] && res[1] === res[2]) {
        const win = config.winningMultipliers[res[0]];
        userTokens += win;
        messageDisplay.textContent = `JACKPOT! +${win} Token!`;
        messageDisplay.style.color = "#00ffff";
    } else if (res[0] === res[1] || res[0] === res[2] || res[1] === res[2]) {
        userTokens += 1;
        messageDisplay.textContent = "Einsatz zurück!";
        messageDisplay.style.color = "#ffffff";
    } else {
        messageDisplay.textContent = "Niete.";
        messageDisplay.style.color = "#888888";
    }

    updateUI();
    spinButton.disabled = false;
}

updateUI();
