document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById('dashboard')) {
        renderDashboard();
    }
    
    const passInput = document.getElementById('passInput');
    if (passInput) {
        passInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') checkPass();
        });
    }
});

function renderDashboard() {
    // Links & Keys
    if (document.getElementById('oauthLink')) {
        document.getElementById('oauthLink').href = BOT_CONFIG.oauthUrl;
    }

    // Features rendern
    const featureContainer = document.getElementById('featureGrid');
    if (featureContainer) {
        featureContainer.innerHTML = BOT_CONFIG.features.map(f => `
            <div class="feature-card">
                <div class="icon">${f.icon}</div>
                <h3>${f.title}</h3>
                <p>${f.desc}</p>
            </div>
        `).join('');
    }

    // Commands rendern
    const commandContainer = document.getElementById('commandList');
    if (commandContainer) {
        commandContainer.innerHTML = BOT_CONFIG.commands.map(c => `
            <div class="command-item">
                <span class="command-name">${c.name}</span>
                <span class="command-desc">${c.desc}</span>
            </div>
        `).join('');
    }
}

// ... (checkPass, protectPage, logout bleiben gleich wie vorher)
function checkPass() {
    const enteredPass = document.getElementById('passInput').value;
    if (enteredPass === BOT_CONFIG.password) {
        localStorage.setItem('bot_auth', 'true');
        window.location.href = 'dashboard.html';
    } else {
        document.getElementById('error').style.display = 'block';
    }
}

function protectPage() {
    if (localStorage.getItem('bot_auth') !== 'true') {
        window.location.href = 'index.html';
    }
}

function logout() {
    localStorage.removeItem('bot_auth');
    window.location.href = 'index.html';
}
