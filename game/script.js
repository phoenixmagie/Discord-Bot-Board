const SUPABASE_URL = "DEINE_SUPABASE_URL"; 
const SUPABASE_KEY = "sb_publishable_DRpMjYtXAxRn4lJanzYSHA_t0jT5Hh4";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let myId = null;
let gameState = 'lobby';
let isHost = false;
let myPlayer = { x: 1000, y: 1000, role: 'villager', isAlive: true };
let joystickActive = true;

// Initialize Joystick
const manager = nipplejs.create({
    zone: document.getElementById('joystick-zone'),
    mode: 'static',
    position: { left: '75px', bottom: '75px' },
    color: 'white'
});

manager.on('move', (evt, data) => {
    if (!joystickActive) return;
    
    const speed = 5;
    const dist = data.distance / 50;
    myPlayer.x += Math.cos(data.angle.radian) * speed * dist;
    myPlayer.y -= Math.sin(data.angle.radian) * speed * dist;
    
    updateMyPosition();
});

// Realtime Sync
const channel = supabase.channel('village_room', {
    config: { broadcast: { self: true } }
});

channel.on('broadcast', { event: 'move' }, ({ payload }) => {
    renderPlayer(payload);
}).subscribe();

async function updateMyPosition() {
    // Broadcast für flüssige Bewegung
    channel.send({
        type: 'broadcast',
        event: 'move',
        payload: { id: myId, x: myPlayer.x, y: myPlayer.y }
    });
}

// Phasen-Management
async function handlePhaseChange(newPhase) {
    gameState = newPhase;
    const world = document.getElementById('game-container');
    
    if (newPhase === 'night') {
        world.style.backgroundColor = 'var(--night-overlay)';
        
        // Bewegungssperre Logik
        if (myPlayer.role !== 'werewolf' && myPlayer.role !== 'girl') {
            joystickActive = false;
            teleportToBed();
        } else {
            joystickActive = true; // Werwölfe bleiben nachts mobil
        }
        
        showActionMenu(myPlayer.role);
    } else {
        world.style.backgroundColor = 'var(--day-overlay)';
        joystickActive = true;
    }
}

function teleportToBed() {
    // Einfache Logik: Spieler wird nachts auf Haus-Position gesetzt
    const mySprite = document.getElementById(`player-${myId}`);
    mySprite.classList.add('sleeping');
    // Implementierung der Haus-Koordinaten hier...
}

function showActionMenu(role) {
    const btn = document.getElementById('action-btn');
    if (['seer', 'witch', 'werewolf'].includes(role)) {
        btn.classList.remove('hidden');
        btn.onclick = () => { /* Rollenspezifisches UI Pop-up */ };
    }
}

// Bot AI (Nur für den Host)
function updateBots() {
    if (!isHost) return;
    // Loop über alle Bots in der DB und sende Positions-Updates
}

// Start-Logik
async function init() {
    // Check if Host, Assign Role, etc.
}
init();
