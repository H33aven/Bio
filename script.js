document.addEventListener('DOMContentLoaded', function() {
    // ========== STARFIELD ==========
    const canvas = document.getElementById('starfield');
    const ctx = canvas.getContext('2d');
    
    let stars = [];
    let starCount = 400;
    let mouseX = null;
    let mouseY = null;
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initStars();
    }
    
    function initStars() {
        stars = [];
        for (let i = 0; i < starCount; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 1.5 + 0.5,
                alpha: Math.random() * 0.6 + 0.2,
                speed: Math.random() * 0.3 + 0.1,
                twinkle: Math.random() * Math.PI * 2,
                twinkleSpeed: Math.random() * 0.02 + 0.005
            });
        }
    }
    
    resizeCanvas();
    window.addEventListener('resize', () => {
        resizeCanvas();
    });
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateStars() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        stars.forEach(star => {
            // Мерцание звезд
            star.twinkle += star.twinkleSpeed;
            const twinkleAlpha = Math.sin(star.twinkle) * 0.3 + 0.5;
            const finalAlpha = Math.min(star.alpha * twinkleAlpha, 0.8);
            
            // Параллакс эффект от мыши
            let xOffset = 0;
            let yOffset = 0;
            if (mouseX !== null && mouseY !== null) {
                const centerX = canvas.width / 2;
                const centerY = canvas.height / 2;
                const dx = (mouseX - centerX) / canvas.width;
                const dy = (mouseY - centerY) / canvas.height;
                xOffset = dx * star.radius * 15;
                yOffset = dy * star.radius * 15;
            }
            
            ctx.beginPath();
            ctx.arc(star.x + xOffset, star.y + yOffset, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${finalAlpha * 0.8})`;
            ctx.fill();
            
            // Легкое свечение для крупных звезд
            if (star.radius > 1.2) {
                ctx.beginPath();
                ctx.arc(star.x + xOffset, star.y + yOffset, star.radius * 1.8, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${finalAlpha * 0.15})`;
                ctx.fill();
            }
        });
        
        requestAnimationFrame(animateStars);
    }
    
    animateStars();
});