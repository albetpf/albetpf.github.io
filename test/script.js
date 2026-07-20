/**
 * UI/UX Portfolio Script
 * Minimalist interaction logic, stripped of heavy WebGL.
 */

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Typed.js Initialization
    const typedElement = document.getElementById('typed');
    if (typedElement) {
        new Typed('#typed', {
            strings: ['AI & Machine Learning Engineer.', 'Data Scientist.', 'Full-Stack Developer.'],
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 2000,
            loop: true,
            contentType: 'text'
        });
    }

    // 2. Smooth Scrolling & Navigation Highlighting
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    // Smooth scroll for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('data-target');
            if (targetId) {
                e.preventDefault();
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop - 80, // offset for navbar
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Update active nav based on scroll position using Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0.1
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute('id');
                
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-target') === currentId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });
});

// 3. Modal Logic
function openModal(title, desc, techArray) {
    const modal = document.getElementById('project-modal');
    const titleEl = document.getElementById('modal-title');
    const descEl = document.getElementById('modal-desc');
    const techEl = document.getElementById('modal-tech');

    titleEl.innerText = title;
    descEl.innerText = desc;
    
    // Clear and populate tech tags
    techEl.innerHTML = '';
    techArray.forEach(tech => {
        const li = document.createElement('li');
        li.className = 'caption tag';
        li.innerText = tech;
        techEl.appendChild(li);
    });

    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeModal() {
    const modal = document.getElementById('project-modal');
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
}

// Close modal on overlay click
document.getElementById('project-modal').addEventListener('click', (e) => {
    if (e.target.id === 'project-modal') {
        closeModal();
    }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.getElementById('project-modal');
        if (modal.classList.contains('active')) {
            closeModal();
        }
    }
});
