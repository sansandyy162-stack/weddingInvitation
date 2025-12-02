// DOM Elements
const openBtn = document.getElementById('openBtn');
const additionalInfo = document.getElementById('additionalInfo');
const musicToggle = document.getElementById('musicToggle');
const weddingMusic = document.getElementById('weddingMusic');
const rsvpForm = document.getElementById('rsvpForm');

// Wedding Date (Past date for example)
const weddingDate = new Date('April 17, 2022 10:00:00').getTime();

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
