
/* =========================================
   1. MOTOR DE ANIMACIÓN SCROLL (REVEAL)
   ========================================= */
function revealAnimations() {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    reveals.forEach(reveal => observer.observe(reveal));
}
document.addEventListener('DOMContentLoaded', revealAnimations);


/* =========================================
   2. SISTEMA MULTI-SLIDER (HERO Y SECUNDARIO)
   ========================================= */
const sliders = document.querySelectorAll('.hero-slider');

sliders.forEach(slider => {
    let currentSlideIndex = 0;
    let slideTimer;
    const slides = slider.querySelectorAll('.slide');
    const dots = slider.querySelectorAll('.dot');
    const sliderWrapper = slider.querySelector('.slider-wrapper');
    const prevBtn = slider.querySelector('.prev');
    const nextBtn = slider.querySelector('.next');

    if(slides.length === 0) return; 

    function updateSlider(index) {
        if (index >= slides.length) currentSlideIndex = 0;
        else if (index < 0) currentSlideIndex = slides.length - 1;
        else currentSlideIndex = index;

        sliderWrapper.style.transform = `translate3d(-${currentSlideIndex * 100}%, 0, 0)`; // Usando translate3d para fluidez extra

        dots.forEach(dot => dot.classList.remove('active'));
        if(dots[currentSlideIndex]) dots[currentSlideIndex].classList.add('active');
    }

    function startTimer() {
        slideTimer = setInterval(() => { updateSlider(currentSlideIndex + 1); }, 4000); 
    }

    function resetTimer() {
        clearInterval(slideTimer);
        startTimer();
    }

    if(prevBtn) prevBtn.addEventListener('click', () => { updateSlider(currentSlideIndex - 1); resetTimer(); });
    if(nextBtn) nextBtn.addEventListener('click', () => { updateSlider(currentSlideIndex + 1); resetTimer(); });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => { updateSlider(index); resetTimer(); });
    });

    // Lógica para Swipes en dispositivos móviles
    let startX = 0;
    let endX = 0;

    slider.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        clearInterval(slideTimer); 
    }, { passive: true });

    slider.addEventListener('touchmove', (e) => {
        endX = e.touches[0].clientX;
    }, { passive: true });

    slider.addEventListener('touchend', () => {
        let diff = startX - endX;
        
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                updateSlider(currentSlideIndex + 1);
            } else {
                updateSlider(currentSlideIndex - 1);
            }
        }
        resetTimer(); 
    });

    // Iniciar Slider
    updateSlider(0);
    startTimer();
});

