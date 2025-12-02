// ==================== DOM ELEMENTS ====================
const openBtn = document.getElementById('openBtn');
const additionalInfo = document.getElementById('additionalInfo');
const musicToggle = document.getElementById('musicToggle');
const weddingMusic = document.getElementById('weddingMusic');
const rsvpForm = document.getElementById('rsvpForm');
const volumeSlider = document.getElementById('volumeSlider');

// ==================== WEDDING DATE ====================
const weddingDate = new Date('December 28, 2025 09:00:00').getTime();

// ==================== COORDINATES ====================
const latitude = -7.461388888888889;  // 7°27'41"S
const longitude = 111.21416666666667; // 111°12'51"E

// ==================== MUSIC SYSTEM ====================
let isMusicPlaying = false;
let isFirstInteraction = true;

// Set initial volume
if (weddingMusic) {
    weddingMusic.volume = 0.5; // 50% volume
}

// ==================== MUSIC FUNCTIONS ====================

function playWeddingMusic() {
    if (!weddingMusic) return;
    
    const playPromise = weddingMusic.play();
    
    if (playPromise !== undefined) {
        playPromise.then(() => {
            isMusicPlaying = true;
            musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
            musicToggle.classList.add('playing');
            saveMusicState(true);
        }).catch(error => {
            console.log("Autoplay prevented:", error);
            showMusicInstruction();
        });
    }
}

function pauseWeddingMusic() {
    if (!weddingMusic) return;
    
    weddingMusic.pause();
    isMusicPlaying = false;
    musicToggle.innerHTML = '<i class="fas fa-music"></i>';
    musicToggle.classList.remove('playing');
    saveMusicState(false);
}

function toggleMusic() {
    if (isMusicPlaying) {
        pauseWeddingMusic();
    } else {
        playWeddingMusic();
    }
}

function saveMusicState(playing) {
    if (typeof(Storage) !== "undefined") {
        localStorage.setItem('weddingMusicState', playing ? 'playing' : 'paused');
        localStorage.setItem('weddingMusicAllowed', 'true');
    }
}

function loadMusicState() {
    if (typeof(Storage) !== "undefined") {
        const savedState = localStorage.getItem('weddingMusicState');
        const isAllowed = localStorage.getItem('weddingMusicAllowed');
        
        if (isAllowed === 'true' && savedState === 'playing') {
            isFirstInteraction = false;
            return true;
        }
    }
    return false;
}

function handleOpenInvitationMusic() {
    if (isFirstInteraction) {
        playWeddingMusic();
        isFirstInteraction = false;
    }
    saveMusicState(true);
}

function showMusicInstruction() {
    const instruction = document.createElement('div');
    instruction.className = 'music-instruction';
    instruction.innerHTML = `
        <p><i class="fas fa-volume-up"></i> Musik siap diputar</p>
        <p class="small">Klik tombol musik untuk memulai</p>
    `;
    instruction.style.cssText = `
        position: fixed;
        bottom: 80px;
        left: 20px;
        background: white;
        padding: 15px;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        z-index: 1001;
        border: 2px solid var(--pink-soft);
        max-width: 200px;
        animation: slideUp 0.5s ease;
    `;
    
    document.body.appendChild(instruction);
    
    setTimeout(() => {
        instruction.style.animation = 'slideDown 0.5s ease';
        setTimeout(() => instruction.remove(), 500);
    }, 5000);
}

function loadVolumePreference() {
    if (typeof(Storage) !== "undefined" && weddingMusic && volumeSlider) {
        const savedVolume = localStorage.getItem('weddingMusicVolume');
        if (savedVolume) {
            weddingMusic.volume = savedVolume / 100;
            volumeSlider.value = savedVolume;
        }
    }
}

// ==================== COUNTDOWN TIMER ====================

function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate - now;
    
    if (distance < 0) {
        document.getElementById('days').innerHTML = "00";
        document.getElementById('hours').innerHTML = "00";
        document.getElementById('minutes').innerHTML = "00";
        document.getElementById('seconds').innerHTML = "00";
        return;
    }
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    document.getElementById('days').innerHTML = days.toString().padStart(2, '0');
    document.getElementById('hours').innerHTML = hours.toString().padStart(2, '0');
    document.getElementById('minutes').innerHTML = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').innerHTML = seconds.toString().padStart(2, '0');
}

// ==================== MAP FUNCTIONS ====================

function updateMapCoordinates(lat, lng) {
    const mapIframe = document.querySelector('.map-container iframe');
    if (!mapIframe) return;
    
    const newSrc = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.429089232559!2d${lng - 0.001}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwMjcnNDEuMCJTIDExMcKwMTInNTEuMCJF!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid`;
    mapIframe.src = newSrc;
    
    const directionLink = document.querySelector('.direction-btn');
    if (directionLink) {
        directionLink.href = `https://www.google.com/maps?q=${lat},${lng}&z=15`;
    }
}

function addAdvancedDirections() {
    const mapInfo = document.querySelector('.map-info');
    if (!mapInfo) return;
    
    const directionSection = document.createElement('div');
    directionSection.className = 'advanced-directions';
    directionSection.innerHTML = `
        <h4><i class="fas fa-car"></i> Petunjuk Arah</h4>
        <div class="transport-options">
            <button class="transport-btn" data-type="driving">
                <i class="fas fa-car"></i> Mobil
            </button>
            <button class="transport-btn" data-type="walking">
                <i class="fas fa-walking"></i> Jalan Kaki
            </button>
            <button class="transport-btn" data-type="transit">
                <i class="fas fa-bus"></i> Transportasi Umum
            </button>
        </div>
        <div class="current-location">
            <button id="useCurrentLocation">
                <i class="fas fa-location-arrow"></i> Gunakan Lokasi Saya
            </button>
        </div>
    `;
    
    mapInfo.appendChild(directionSection);
    
    document.querySelectorAll('.transport-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            getDirections(type);
        });
    });
    
    document.getElementById('useCurrentLocation').addEventListener('click', function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLat = position.coords.latitude;
                    const userLng = position.coords.longitude;
                    const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${latitude},${longitude}&travelmode=driving`;
                    window.open(mapsUrl, '_blank');
                },
                (error) => {
                    alert('Tidak dapat mengakses lokasi Anda. Mohon izinkan akses lokasi.');
                }
            );
        } else {
            alert('Browser Anda tidak mendukung geolocation.');
        }
    });
}

function getDirections(mode = 'driving') {
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=${mode}`;
    window.open(mapsUrl, '_blank');
}

// ==================== CONFETTI ANIMATION ====================

function createConfetti() {
    const confettiContainer = document.querySelector('.confetti-container');
    if (!confettiContainer) return;
    
    const colors = ['#FF8FAB', '#FB6F92', '#FF5D8F', '#FFC2D1', '#FFE6E6'];
    
    for (let i = 0; i < 150; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'absolute';
        confetti.style.width = Math.random() * 10 + 5 + 'px';
        confetti.style.height = Math.random() * 10 + 5 + 'px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-20px';
        confetti.style.opacity = Math.random() + 0.5;
        
        confettiContainer.appendChild(confetti);
        
        const animation = confetti.animate([
            { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
            { transform: `translateY(${window.innerHeight}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
        ], {
            duration: Math.random() * 3000 + 2000,
            easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
        });
        
        animation.onfinish = () => confetti.remove();
    }
}

// ==================== FLOATING HEARTS ====================

function createFloatingHearts() {
    const container = document.querySelector('.invitation-container');
    if (!container) return;
    
    for (let i = 0; i < 5; i++) {
        const heart = document.createElement('div');
        heart.innerHTML = '❤️';
        heart.style.position = 'absolute';
        heart.style.fontSize = Math.random() * 20 + 15 + 'px';
        heart.style.opacity = Math.random() * 0.5 + 0.3;
        heart.style.left = Math.random() * 100 + '%';
        heart.style.top = Math.random() * 100 + '%';
        heart.style.zIndex = -1;
        heart.style.pointerEvents = 'none';
        heart.style.animation = `float ${Math.random() * 10 + 10}s linear infinite`;
        
        container.appendChild(heart);
    }
}

// ==================== EVENT LISTENERS ====================

// Open Invitation Button
if (openBtn) {
    openBtn.addEventListener('click', function() {
        // Handle music
        handleOpenInvitationMusic();
        
        // Show additional info
        additionalInfo.classList.add('show');
        
        // Change button text and disable it
        this.innerHTML = 'UNDANGAN DIBUKA <i class="fas fa-heart"></i>';
        this.style.backgroundColor = '#FF8FAB';
        this.disabled = true;
        
        // Trigger confetti animation
        createConfetti();
        
        // Scroll to additional info
        additionalInfo.scrollIntoView({ behavior: 'smooth' });
    });
}

// Music Toggle Button
if (musicToggle) {
    musicToggle.addEventListener('click', toggleMusic);
}

// Volume Slider
if (volumeSlider) {
    volumeSlider.addEventListener('input', function() {
        if (weddingMusic) {
            weddingMusic.volume = this.value / 100;
            if (typeof(Storage) !== "undefined") {
                localStorage.setItem('weddingMusicVolume', this.value);
            }
        }
    });
}

// RSVP Form
if (rsvpForm) {
    rsvpForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nameInput = this.querySelector('input[type="text"]');
        if (!nameInput || !nameInput.value.trim()) {
            alert('Mohon masukkan nama lengkap');
            return;
        }
        
        alert(`Terima kasih ${nameInput.value}!\nKonfirmasi kehadiran Anda telah berhasil dikirim.`);
        this.reset();
    });
}

// ==================== INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize countdown
    updateCountdown();
    setInterval(updateCountdown, 1000);
    
    // Initialize music system
    loadVolumePreference();
    const wasPlaying = loadMusicState();
    if (wasPlaying && weddingMusic) {
        setTimeout(() => {
            playWeddingMusic();
        }, 1000);
    }
    
    // Initialize map
    updateMapCoordinates(latitude, longitude);
    
    // Add coordinates copy feature
    const mapInfo = document.querySelector('.map-info');
    if (mapInfo) {
        const coordsText = `7°27'41"S 111°12'51"E`;
        const coordsElement = document.createElement('p');
        coordsElement.innerHTML = `
            <i class="fas fa-copy"></i> 
            <span id="coordsText">${coordsText}</span>
            <button id="copyCoordsBtn" class="copy-btn">
                Salin Koordinat
            </button>
        `;
        
        mapInfo.appendChild(coordsElement);
        
        const copyBtn = document.getElementById('copyCoordsBtn');
        if (copyBtn) {
            copyBtn.addEventListener('click', function() {
                navigator.clipboard.writeText(coordsText).then(() => {
                    const originalText = this.textContent;
                    this.innerHTML = '<i class="fas fa-check"></i> Disalin!';
                    this.style.background = 'var(--pink-dark)';
                    
                    setTimeout(() => {
                        this.innerHTML = originalText;
                        this.style.background = '';
                    }, 2000);
                });
            });
        }
        
        // Add advanced directions
        addAdvancedDirections();
    }
    
    // Create floating hearts
    createFloatingHearts();
    
    // Preload audio
    if (weddingMusic) {
        weddingMusic.load();
    }
});

// ==================== STYLES ====================

const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0%, 100% { transform: translate(0, 0) rotate(0deg); }
        25% { transform: translate(20px, -20px) rotate(90deg); }
        50% { transform: translate(0, -40px) rotate(180deg); }
        75% { transform: translate(-20px, -20px) rotate(270deg); }
    }
    
    @keyframes slideUp {
        from {
            transform: translateY(20px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes slideDown {
        from {
            transform: translateY(0);
            opacity: 1;
        }
        to {
            transform: translateY(20px);
            opacity: 0;
        }
    }
    
    .copy-btn {
        background: var(--pink-medium);
        color: white;
        border: none;
        padding: 8px 15px;
        border-radius: 20px;
        font-size: 0.9rem;
        cursor: pointer;
        margin-left: 10px;
        transition: all 0.3s ease;
    }
    
    .copy-btn:hover {
        background: var(--pink-dark);
    }
    
    .advanced-directions {
        margin-top: 20px;
        padding-top: 20px;
        border-top: 1px solid var(--pink-soft);
    }
    
    .advanced-directions h4 {
        color: var(--text-dark);
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .transport-options {
        display: flex;
        gap: 10px;
        justify-content: center;
        flex-wrap: wrap;
        margin-bottom: 15px;
    }
    
    .transport-btn {
        background: white;
        color: var(--pink-dark);
        border: 2px solid var(--pink-medium);
        padding: 8px 15px;
        border-radius: 20px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 5px;
        transition: all 0.3s ease;
    }
    
    .transport-btn:hover {
        background: var(--pink-light);
        transform: translateY(-2px);
    }
    
    .current-location button {
        background: var(--gold);
        color: var(--text-dark);
        border: none;
        padding: 10px 20px;
        border-radius: 20px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 10px;
        margin: 0 auto;
        font-weight: 600;
        transition: all 0.3s ease;
    }
    
    .current-location button:hover {
        background: #FFC166;
        transform: translateY(-2px);
    }
    
    #coordsText {
        font-family: monospace;
        background: white;
        padding: 5px 10px;
        border-radius: 5px;
        border: 1px solid var(--pink-soft);
    }
    
    .music-instruction p {
        margin: 0 0 5px 0;
        color: var(--text-dark);
    }
    
    .music-instruction .small {
        font-size: 0.8rem;
        opacity: 0.8;
    }
    
    .music-instruction i {
        color: var(--pink-deep);
        margin-right: 8px;
    }
`;

document.head.appendChild(style);
