// Touching Grass Simulator
class GrassSimulator {
    constructor() {
        this.touchCount = 0;
        this.startTime = null;
        this.grassBlades = [];
        this.isStarted = false;
        this.handCursor = document.getElementById('hand-cursor');
        this.particlesContainer = document.getElementById('particles-container');
        this.messageElement = document.getElementById('message');
        
        this.motivationalMessages = [
            "You're doing great! 🌱",
            "Such good grass touching! ✨",
            "Nature appreciates you! 🦋",
            "You're basically outdoorsy now! 🏕️",
            "Grass status: TOUCHED 💪",
            "10/10 would touch again! ⭐",
            "You're one with nature! 🌿",
            "Grass touching level: Expert! 🏆",
            "Achievement unlocked! 🎮",
            "So zen, much grass! 🧘‍♂️"
        ];
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.generateGrass();
    }
    
    bindEvents() {
        // Start button
        document.getElementById('start-btn').addEventListener('click', () => {
            this.startSimulator();
        });
        
        // Mouse events
        document.addEventListener('mousemove', (e) => {
            if (!this.isStarted) return;
            this.updateHandPosition(e.clientX, e.clientY);
            this.checkGrassTouch(e.clientX, e.clientY);
        });
        
        // Touch events for mobile
        document.addEventListener('touchmove', (e) => {
            if (!this.isStarted) return;
            e.preventDefault();
            const touch = e.touches[0];
            this.updateHandPosition(touch.clientX, touch.clientY);
            this.checkGrassTouch(touch.clientX, touch.clientY);
        }, { passive: false });
        
        document.addEventListener('touchstart', (e) => {
            if (!this.isStarted) return;
            e.preventDefault();
            const touch = e.touches[0];
            this.updateHandPosition(touch.clientX, touch.clientY);
            this.checkGrassTouch(touch.clientX, touch.clientY);
        }, { passive: false });
    }
    
    startSimulator() {
        this.isStarted = true;
        this.startTime = Date.now();
        
        // Hide instructions
        document.getElementById('instructions').style.display = 'none';
        
        // Start timer
        this.startTimer();
        
        // Show initial message
        this.showMessage("Welcome to the great outdoors! 🌱");
    }
    
    generateGrass() {
        const container = document.getElementById('grass-container');
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        
        // Generate grass blades
        const grassCount = Math.floor(screenWidth / 15); // Responsive grass density
        
        for (let i = 0; i < grassCount; i++) {
            const blade = document.createElement('div');
            blade.className = 'grass-blade';
            
            // Random positioning
            const x = (i * 15) + Math.random() * 10;
            const height = 30 + Math.random() * 20;
            
            blade.style.left = x + 'px';
            blade.style.height = height + 'px';
            blade.style.bottom = Math.random() * 5 + 'px';
            
            // Slight random rotation for natural look
            blade.style.transform = `rotate(${-5 + Math.random() * 10}deg)`;
            
            container.appendChild(blade);
            this.grassBlades.push({
                element: blade,
                x: x,
                y: screenHeight - height,
                width: 8,
                height: height,
                touched: false,
                touchCooldown: 0
            });
        }
    }
    
    updateHandPosition(x, y) {
        this.handCursor.style.left = x + 'px';
        this.handCursor.style.top = y + 'px';
        
        // Add slight animation based on movement speed
        this.handCursor.style.transform = 'translate(-50%, -50%) scale(1.1)';
        setTimeout(() => {
            this.handCursor.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 100);
    }
    
    checkGrassTouch(mouseX, mouseY) {
        const currentTime = Date.now();
        
        this.grassBlades.forEach(blade => {
            // Check if mouse is over this grass blade
            if (mouseX >= blade.x - 5 && 
                mouseX <= blade.x + blade.width + 5 && 
                mouseY >= blade.y - 10 && 
                mouseY <= blade.y + blade.height + 10) {
                
                // Cooldown to prevent spam touching
                if (currentTime - blade.touchCooldown > 500) {
                    this.touchGrass(blade, mouseX, mouseY);
                    blade.touchCooldown = currentTime;
                }
            }
        });
    }
    
    touchGrass(blade, x, y) {
        // Visual feedback
        blade.element.classList.add('touched');
        
        // Remove touched class after animation
        setTimeout(() => {
            blade.element.classList.remove('touched');
        }, 300);
        
        // Increment counter
        this.touchCount++;
        document.getElementById('touch-counter').textContent = this.touchCount;
        
        // Create particles
        this.createParticles(x, y);
        
        // Show motivational message occasionally
        if (this.touchCount % 10 === 0) {
            const randomMessage = this.motivationalMessages[
                Math.floor(Math.random() * this.motivationalMessages.length)
            ];
            this.showMessage(randomMessage);
        }
        
        // Haptic feedback for mobile
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    }
    
    createParticles(x, y) {
        const particleCount = 3 + Math.random() * 3;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random offset from touch point
            const offsetX = -20 + Math.random() * 40;
            const offsetY = -10 + Math.random() * 20;
            
            particle.style.left = (x + offsetX) + 'px';
            particle.style.top = (y + offsetY) + 'px';
            
            // Random color variations
            const colors = ['#90EE90', '#98FB98', '#32CD32', '#7CFC00'];
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            
            this.particlesContainer.appendChild(particle);
            
            // Remove particle after animation
            setTimeout(() => {
                particle.remove();
            }, 1000);
        }
    }
    
    showMessage(text) {
        this.messageElement.textContent = text;
        this.messageElement.classList.remove('hidden');
        
        // Hide message after 2 seconds
        setTimeout(() => {
            this.messageElement.classList.add('hidden');
        }, 2000);
    }
    
    startTimer() {
        setInterval(() => {
            if (!this.isStarted || !this.startTime) return;
            
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            document.getElementById('time-spent').textContent = elapsed + 's';
            
            // Achievement messages based on time
            if (elapsed === 30 && this.touchCount === 0) {
                this.showMessage("Try moving your cursor around! 👋");
            } else if (elapsed === 60) {
                this.showMessage("One minute of quality outdoor time! 🎉");
            } else if (elapsed === 300) {
                this.showMessage("5 minutes! You're practically a nature expert! 🏕️");
            }
        }, 1000);
    }
    
    // Resize handler for responsive grass
    handleResize() {
        // Regenerate grass on window resize
        document.getElementById('grass-container').innerHTML = '';
        this.grassBlades = [];
        this.generateGrass();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const simulator = new GrassSimulator();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        simulator.handleResize();
    });
    
    // Prevent default touch behaviors
    document.addEventListener('touchmove', (e) => {
        e.preventDefault();
    }, { passive: false });
    
    document.addEventListener('touchstart', (e) => {
        e.preventDefault();
    }, { passive: false });
});

// Easter eggs and fun interactions
document.addEventListener('keydown', (e) => {
    if (e.key === ' ') { // Spacebar for instant grass touch
        const simulator = window.simulator;
        if (simulator && simulator.isStarted) {
            const randomX = Math.random() * window.innerWidth;
            const randomY = window.innerHeight * 0.7 + Math.random() * (window.innerHeight * 0.3);
            simulator.checkGrassTouch(randomX, randomY);
        }
    }
});

// Fun console message
console.log(`
🌱 Welcome to Touching Grass Simulator! 🌱

Thanks for touching grass responsibly.
Remember: This is a substitute for, not a replacement of, actual outdoor activities.

Pro tip: Press spacebar for random grass touches!
`);