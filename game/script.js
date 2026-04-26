const SUPABASE_URL = "PHOENIX_URL"; 
const SUPABASE_KEY = "sb_publishable_DRpMjYtXAxRn4lJanzYSHA_t0jT5Hh4";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// --- State ---
let myId = 'player_' + Math.floor(Math.random() * 1000);
let gameState = 'day';
let isHost = false; 
let myPlayer = { x: 1000, y: 1000, role: 'villager', isAlive: true };
let players = {}; // Alle Spieler (inkl. Bots)
let joystickActive = true;

const world = document.getElementById('world');
const entities = document.getElementById('entities');

// --- Initialization ---
async function init() {
    // Hier würde normalerweise der Supabase-Auth oder Session-Join stehen
    renderPlayer(myId, myPlayer.x, myPlayer.y, "Ich", true);
    setupRealtime();
    gameLoop();
}

// --- Joystick ---
const manager = nipplejs.create({
    zone: document.getElementById('joystick-zone'),
    mode: 'static', position: { left: '60px', bottom: '60px' }
});

manager.on('move', (evt, data) => {
    if (!joystickActive || !myPlayer.isAlive) return;
    const speed = 4;
    const force = data.distance / 50;
    myPlayer.x += Math.cos(data.angle.radian) * speed * force;
    myPlayer.y -= Math.sin(data.angle.radian) * speed * force;
    
    // Boundary Check
    myPlayer.x = Math.max(0, Math.min(2000, myPlayer.x));
    myPlayer.y = Math.max(0, Math.min(2000, myPlayer.y));
    
    syncPosition();
});

// --- Realtime ---
const channel = supabaseClient.channel('village_room', { config: { broadcast: { self: false } } });

function setupRealtime() {
    channel.on('broadcast', { event: 'move' }, ({ payload }) => {
        players[payload.id] = payload;
        renderPlayer(payload.id, payload.x, payload.y, payload.role);
    }).subscribe();
}

function syncPosition() {
    channel.send({
        type: 'broadcast', event: 'move',
        payload: { id: myId, x: myPlayer.x, y: myPlayer.y, role: myPlayer.role }
    });
}

// --- Rendering & Camera ---
function renderPlayer(id, x, y, role, isMe = false) {
    let el = document.getElementById(`player-${id}`);
    if (!el) {
        el = document.createElement('div');
        el.id = `player-${id}`;
        el.className = `player ${isMe ? 'me' : ''}`;
        entities.appendChild(el);
    }
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.innerText = isMe ? "Ich" : "";
}

function gameLoop() {
    // Camera Follow
    const camX = window.innerWidth / 2 - myPlayer.x;
    const camY = window.innerHeight / 2 - myPlayer.y;
    world.style.transform = `translate(${camX}px, ${camY}px)`;

    // Host berechnet Bots
    if (isHost) {
        updateBotAI();
    }

    requestAnimationFrame(gameLoop);
}

// --- Phasen & Mechaniken ---
async function handlePhaseChange(newPhase) {
    gameState = newPhase;
    document.body.className = `phase-${newPhase}`;

    if (newPhase === 'night') {
        // Nur Werwölfe und Blinzelmädchen behalten die Kontrolle
        if (myPlayer.role !== 'werewolf' && myPlayer.role !== 'girl') {
            joystickActive = false;
            teleportToBed();
        }
    } else {
        joystickActive = true;
        document.getElementById(`player-${myId}`).classList.remove('sleeping');
    }
}

function teleportToBed() {
    // Simulierter Bett-Platz (z.B. basierend auf ID)
    myPlayer.x = 200 + (Math.random() * 50); 
    myPlayer.y = 200 + (Math.random() * 50);
    const mySprite = document.getElementById(`player-${myId}`);
    mySprite.classList.add('sleeping');
    syncPosition();
}

// --- Bot KI (Simpel) ---
function updateBotAI() {
    // Beispielhafte Bot-Bewegung
    // Hier würde man durch ein Array von Bots loopen und diese via Broadcast senden
}

init();
