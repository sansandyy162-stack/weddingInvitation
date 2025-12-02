// DOM Elements
const openBtn = document.getElementById('openBtn');
const additionalInfo = document.getElementById('additionalInfo');
const musicToggle = document.getElementById('musicToggle');
const weddingMusic = document.getElementById('weddingMusic');
const rsvpForm = document.getElementById('rsvpForm');

// Wedding Date (Past date for example)
const weddingDate = new Date('December 28, 2025 09:00:00').getTime();

// Open Invitation Button
openBtn.addEventListener('click', function() {
    // Show additional info
    additionalInfo.classList.add('show');
    
    // Change button text and disable it
    this.innerHTML = 'UNDANGAN DIBUKA <i class="fas fa-heart"></i>';
    this.style.backgroundColor = '#FF8FAB';
    this.disabled = true;
    
    // Trigger confetti animation
    createConfetti();
    
    // Play music (optional)
    weddingMusic.play().catch(e => {
        console.log("Autoplay prevented. Click music button to play.");
    });
    
    // Scroll to additional info
    additionalInfo.scrollIntoView({ behavior: 'smooth' });
});

// Music Toggle
let isPlaying = false;
musicToggle.addEventListener('click', function() {
    if (isPlaying) {
        weddingMusic.pause();
        this.innerHTML = '<i class="fas fa-music"></i>';
    } else {
        weddingMusic.play();
        this.innerHTML = '<i class="fas fa-pause"></i>';
    }
    isPlaying = !isPlaying;
});

// Countdown Timer
function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate - now;
    
    // If wedding date has passed
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

// Update countdown every second
setInterval(updateCountdown, 1000);
updateCountdown(); // Initial call

// RSVP Form Submission
rsvpForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const name = formData.get('name') || this.querySelector('input[type="text"]').value;
    
    // Simple validation
    if (!name) {
        alert('Mohon masukkan nama lengkap');
        return;
    }
    
    // Show success message
    alert(`Terima kasih ${name}!\nKonfirmasi kehadiran Anda telah berhasil dikirim.`);
    
    // Reset form
    this.reset();
    
    // You can add code here to send data to a server
    // For GitHub Pages, you might want to use Formspree or similar service
});

// Confetti Animation
function createConfetti() {
    const confettiContainer = document.querySelector('.confetti-container');
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
        
        // Animation
        const animation = confetti.animate([
            { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
            { transform: `translateY(${window.innerHeight}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
        ], {
            duration: Math.random() * 3000 + 2000,
            easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
        });
        
        // Remove element after animation
        animation.onfinish = () => confetti.remove();
    }
}

// Add floating hearts animation on load
window.addEventListener('load', function() {
    const container = document.querySelector('.invitation-container');
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
});

// Add floating animation
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0%, 100% { transform: translate(0, 0) rotate(0deg); }
        25% { transform: translate(20px, -20px) rotate(90deg); }
        50% { transform: translate(0, -40px) rotate(180deg); }
        75% { transform: translate(-20px, -20px) rotate(270deg); }
    }
`;
document.head.appendChild(style);

// Tambahkan fungsi ini di script.js

// Konversi koordinat dari DMS ke Decimal Degrees
function dmsToDecimal(degrees, minutes, seconds, direction) {
    let decimal = degrees + minutes / 60 + seconds / 3600;
    if (direction === 'S' || direction === 'W') {
        decimal = -decimal;
    }
    return decimal;
}

// Koordinat dari data yang diberikan: 7°27'41"S 111°12'51"E
const latitude = dmsToDecimal(7, 27, 41, 'S');  // -7.461388888888889
const longitude = dmsToDecimal(111, 12, 51, 'E'); // 111.21416666666667

// Update iframe src dengan koordinat yang tepat
function updateMapCoordinates(lat, lng) {
    const mapIframe = document.querySelector('.map-container iframe');
    const newSrc = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.429089232559!2d${lng - 0.001}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwMjcnNDEuMCJTIDExMcKwMTInNTEuMCJF!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid`;
    
    mapIframe.src = newSrc;
    
    // Update link untuk Google Maps app
    const directionLink = document.querySelector('.direction-btn');
    directionLink.href = `https://www.google.com/maps?q=${lat},${lng}&z=15`;
}

// Panggil fungsi saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    updateMapCoordinates(latitude, longitude);
    
    // Tambahkan fitur "Copy Coordinates"
    const coordsText = `7°27'41"S 111°12'51"E`;
    const coordsElement = document.createElement('p');
    coordsElement.innerHTML = `
        <i class="fas fa-copy"></i> 
        <span id="coordsText">${coordsText}</span>
        <button id="copyCoordsBtn" class="copy-btn">
            Salin Koordinat
        </button>
    `;
    
    document.querySelector('.map-info').appendChild(coordsElement);
    
    // Fungsi copy coordinates
    document.getElementById('copyCoordsBtn').addEventListener('click', function() {
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
    
    // Tambahkan fitur "Get Directions" yang lebih lengkap
    addAdvancedDirections();
});

// Fungsi untuk fitur petunjuk arah yang lebih lengkap
function addAdvancedDirections() {
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
    
    document.querySelector('.map-info').appendChild(directionSection);
    
    // Event listeners untuk tombol transportasi
    document.querySelectorAll('.transport-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            getDirections(type);
        });
    });
    
    // Event listener untuk lokasi saat ini
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

// Fungsi untuk mendapatkan petunjuk arah
function getDirections(mode = 'driving') {
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=${mode}`;
    window.open(mapsUrl, '_blank');
}

// Tambahkan style CSS untuk fitur baru
const additionalStyles = `
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
`;

// Tambahkan styles ke document
const styleElement = document.createElement('style');
styleElement.textContent = additionalStyles;
document.head.appendChild(styleElement);
