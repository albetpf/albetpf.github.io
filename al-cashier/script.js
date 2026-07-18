document.addEventListener("DOMContentLoaded", () => {
    const yearSpan = document.getElementById("year");
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
    const fadeElements = document.querySelectorAll('.fade-in');
    const scrollContainer = document.getElementById('scroller'); 
    
    const appearOptions = { root: scrollContainer, threshold: 0.15, rootMargin: "0px" };
    const appearOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); 
            }
        });
    }, appearOptions);
    fadeElements.forEach(element => appearOnScroll.observe(element));

    const slides = document.querySelectorAll('.slide');
    const navTriggers = document.querySelectorAll('.nav-trigger');
    const topNav = document.getElementById('desktop-nav');
    const indicator = document.getElementById('nav-indicator');

    function updateNavIndicator() {
        const activeItem = document.querySelector('.nav-item.active-menu');
        if (activeItem && indicator) {
            indicator.style.opacity = 1;
            indicator.style.transform = `translateX(${activeItem.offsetLeft}px)`;
            indicator.style.width = `${activeItem.offsetWidth}px`;
        }
    }

    const navObserverOptions = { root: scrollContainer, threshold: 0.5 };
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navTriggers.forEach(btn => {
                    btn.classList.remove('active-menu');
                    if(btn.getAttribute('data-target') === id) {
                        btn.classList.add('active-menu');
                    }
                });
                updateNavIndicator();
            }
        });
    }, navObserverOptions);

    slides.forEach(slide => navObserver.observe(slide));

    navTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = trigger.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);
            if(targetElement) scrollContainer.scrollTo({ top: targetElement.offsetTop, behavior: 'smooth' });
        });
    });

    if (scrollContainer && topNav) {
        scrollContainer.addEventListener('scroll', () => {
            if (scrollContainer.scrollTop > 50) {
                topNav.classList.add('nav-shrink');
            } else {
                topNav.classList.remove('nav-shrink');
            }
        });
    }
});

function openLightbox(imageSrc) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    lightboxImg.src = imageSrc;
    lightbox.classList.add('active');
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
}

document.addEventListener('keydown', function(event) {
    if (event.key === "Escape") closeLightbox();
});

// --- AUTO SLIDE GALERI ---
const galleryTrack = document.getElementById('gallery-track');
const indicators = document.querySelectorAll('.indicator-btn');
let currentSlide = 0;
const totalSlides = 2; // Karena kita membagi 8 gambar menjadi 2 slide
let slideInterval;

function updateGallerySlide() {
    if (!galleryTrack) return;
    
    // Geser track ke kiri (0% untuk slide 1, -100% untuk slide 2)
    galleryTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Update tampilan titik indikator
    indicators.forEach((ind, index) => {
        if (index === currentSlide) {
            // Indikator aktif (Panjang & Bewarna)
            ind.className = 'indicator-btn w-4 h-1.5 md:w-6 md:h-2 rounded-full bg-accent1 transition-all duration-300';
        } else {
            // Indikator tidak aktif (Kecil & Redup)
            ind.className = 'indicator-btn w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-white/20 hover:bg-white/50 transition-all duration-300 cursor-pointer';
        }
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateGallerySlide();
}

// Menjalankan auto-slide setiap 3.5 detik (3500ms)
if (galleryTrack) {
    slideInterval = setInterval(nextSlide, 3500);
    
    // Opsional: Jika indikator diklik, pindah ke slide tersebut
    indicators.forEach((ind, index) => {
        ind.addEventListener('click', () => {
            currentSlide = index;
            updateGallerySlide();
            // Reset timer otomatis agar tidak langsung ganti setelah diklik
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 3500);
        });
    });
}