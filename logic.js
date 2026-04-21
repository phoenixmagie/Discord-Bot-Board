// Daten laden, wenn Elemente vorhanden sind
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById('clientKeyDisplay')) {
        document.getElementById('clientKeyDisplay').innerText = BOT_CONFIG.clientKey;
    }
    if (document.getElementById('oauthLink')) {
        document.getElementById('oauthLink').href = BOT_CONFIG.oauthUrl;
    }
    
    // Login mit Enter-Taste
    const passInput = document.getElementById('passInput');
    if (passInput) {
        passInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') checkPass();
        });
    }
});

// Passwort prüfen & im LocalStorage merken
function checkPass() {
    const enteredPass = document.getElementById('passInput').value;
    if (enteredPass === BOT_CONFIG.password) {
        localStorage.setItem('bot_auth', 'true');
        window.location.href = 'dashboard.html';
    } else {
        document.getElementById('error').style.display = 'block';
    }
}

// Schutz-Funktion für Unterseiten
function protectPage() {
    if (localStorage.getItem('bot_auth') !== 'true') {
        window.location.href = 'index.html';
    }
}

// Logout
function logout() {
    localStorage.removeItem('bot_auth');
    window.location.href = 'index.html';
}
