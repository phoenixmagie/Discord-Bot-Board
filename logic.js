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
    if (document.getElementById('oauthLink')) {
        document.getElementById('oauthLink').href = BOT_CONFIG.oauthUrl;
    }

    // Features rendern
    const featureContainer = document.getElementById('featureGrid');
    if (featureContainer) {
        featureContainer.innerHTML = '';
        BOT_CONFIG.features.forEach(f => {
            featureContainer.innerHTML += `
                <div class="feature-card">
                    <div class="icon">${f.icon}</div>
                    <h3>${f.title}</h3>
                    <p>${f.desc}</p>
                </div>
            `;
        });
    }
}

function checkPass() {
    const enteredPass = document.getElementById('passInput').value;
    if (enteredPass === BOT_CONFIG.password) {
        localStorage.setItem('bot_auth', 'true');
        window.location.href = 'dashboard.html';
    } else {
        const err = document.getElementById('error');
        if(err) err.style.display = 'block';
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
