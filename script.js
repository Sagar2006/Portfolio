// Custom Cursor Logic
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

// Mouse move tracking
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Immediate cursor update
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
});

// Follower easing interpolation
function animateFollower() {
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;
    
    follower.style.left = `${followerX}px`;
    follower.style.top = `${followerY}px`;
    
    requestAnimationFrame(animateFollower);
}
animateFollower();

// Cursor Hover Effects for Links/Interactive elements
const interactables = document.querySelectorAll('a, button, .magnetic, .bento-card');
interactables.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.classList.add('active');
        follower.classList.add('active');
    });
    el.addEventListener('mouseleave', () => {
        cursor.classList.remove('active');
        follower.classList.remove('active');
    });
});


// Magnetic Element Interaction
const magnetics = document.querySelectorAll('.magnetic, .magnetic-btn, .magnetic-card');
magnetics.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const h = rect.width / 2;
        
        // Calculate distance from center
        const x = e.clientX - rect.left - h;
        const y = e.clientY - rect.top - (rect.height / 2);
        
        // Apply transform based on distance (strength parameter: 0.3)
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.3}px)`;
    });

    btn.addEventListener('mouseleave', () => {
        // Reset transform
        btn.style.transform = `translate(0px, 0px)`;
        btn.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
    });
    
    btn.addEventListener('mouseenter', () => {
        btn.style.transition = 'none'; // remove transition during hover for instant sticking
    });
});

// Scroll Reveal Animations
const fadeElements = document.querySelectorAll('.fade-up, .reveal-text');
const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1
};

const fadeObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

fadeElements.forEach(el => fadeObserver.observe(el));

// Parallax slight effect for images
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxImgs = document.querySelectorAll('.parallax-img img');
    parallaxImgs.forEach(img => {
        // simple parity calculation
        const offset = (scrolled * 0.1) - (img.parentElement.offsetTop * 0.1);
        img.style.transform = `translateY(${Math.min(offset, 50)}px) scale(1.1)`;
    });
});

// Accordion Logic
const accordions = document.querySelectorAll('.accordion-header');
accordions.forEach(acc => {
    acc.addEventListener('click', () => {
        const parent = acc.parentElement;
        const content = parent.querySelector('.accordion-content');
        
        if (parent.classList.contains('active')) {
            parent.classList.remove('active');
            content.style.maxHeight = null;
        } else {
            // Close others
            document.querySelectorAll('.accordion').forEach(a => {
                a.classList.remove('active');
                a.querySelector('.accordion-content').style.maxHeight = null;
            });
            parent.classList.add('active');
            content.style.maxHeight = content.scrollHeight + "px";
        }
    });

    // Custom cursor integration
    acc.addEventListener('mouseenter', () => { cursor.classList.add('active'); follower.classList.add('active'); });
    acc.addEventListener('mouseleave', () => { cursor.classList.remove('active'); follower.classList.remove('active'); });
});

// ASCII Donut Animation (donut.c JS port)
const donutCanvas = document.getElementById('donutCanvas');
if (donutCanvas) {
    const ctx = donutCanvas.getContext('2d');
    donutCanvas.width = 640;
    donutCanvas.height = 600;

    let A = 0, B = 0;
    const chars = '.,-~:;=!*#$@';

    function renderDonut() {
        ctx.clearRect(0, 0, donutCanvas.width, donutCanvas.height);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.font = '14px monospace';

        const b = [], z = [];
        const width = 80, height = 40;

        for (let k = 0; k < width * height; k++) {
            b[k] = ' ';
            z[k] = 0;
        }

        for (let j = 0; j < 6.28; j += 0.07) {
            for (let i = 0; i < 6.28; i += 0.02) {
                let c = Math.sin(i), d = Math.cos(j), e = Math.sin(A);
                let f = Math.sin(j), g = Math.cos(A), h = d + 2;
                let D = 1 / (c * h * e + f * g + 5);
                let l = Math.cos(i), m = Math.cos(B), n = Math.sin(B);
                let t = c * h * g - f * e;

                let x = Math.floor(40 + 30 * D * (l * h * m - t * n));
                let y = Math.floor(20 + 15 * D * (l * h * n + t * m));
                let o = Math.floor(x + width * y);

                let N = Math.floor(8 * ((f * e - c * d * g) * m - c * d * e - f * g - l * d * n));
                if (y > 0 && y < height && x > 0 && x < width && D > z[o]) {
                    z[o] = D;
                    b[o] = chars[N > 0 ? N : 0];
                }
            }
        }

        for (let k = 0; k < width * height; k++) {
            if (b[k] !== ' ') {
                const x = (k % width) * 8;
                const y = Math.floor(k / width) * 15;
                ctx.fillText(b[k], x, y);
            }
        }

        // Slower rotation speed
        A += 0.02;
        B += 0.01;
        requestAnimationFrame(renderDonut);
    }
    renderDonut();
}
