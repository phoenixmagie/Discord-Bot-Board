document.addEventListener("DOMContentLoaded", () => {
    // Daten aus der config.js laden
    document.getElementById('clientKeyDisplay').innerText = BOT_CONFIG.clientKey;
    document.getElementById('oauthLink').href = BOT_CONFIG.oauthUrl;
    document.getElementById('configFileDisplay').innerText = "File: " + BOT_CONFIG.fileName;

    // Enter-Taste für Login
    document.getElementById('passInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkPass();
    });
});

function checkPass() {
    const enteredPass = document.getElementById('passInput').value;
    const errorMsg = document.getElementById('error');

    if (enteredPass === BOT_CONFIG.password) {
        document.getElementById('login').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
    } else {
        errorMsg.style.display = 'block';
        document.getElementById('passInput').value = '';
    }
}
