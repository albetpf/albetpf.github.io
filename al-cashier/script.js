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