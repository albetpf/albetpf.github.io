const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

if (!isTouchDevice) {
    // Efek cahaya (glow) pada kaca tetap dipertahankan, tapi pergerakan 3D telah dihapus.
    document.addEventListener('mousemove', (e) => {
        document.querySelectorAll('.glass').forEach(card => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
            card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        });
    });
}

const loaderEl = document.getElementById('loader');
const loaderContentEl = document.getElementById('loader-content');

const loaderTl = gsap.timeline();

gsap.set('.load-icon', { z: -400, scale: 0, opacity: 0, rotationX: -90, rotationY: 45 });
gsap.set('.load-text', { z: -150, y: 20, opacity: 0, filter: 'blur(10px)' });
gsap.set('.load-text-main', { z: 50, y: 30, opacity: 0, filter: 'blur(15px)', scale: 0.9 });
gsap.set('.load-badge', { z: -50, y: 20, opacity: 0 });

loaderTl.to('#loader-dot', { scale: 1, opacity: 1, duration: 0.8, ease: 'power4.out' })
  .to('#loader-dot', { scale: 0, opacity: 0, duration: 0.4, ease: 'power2.in' }, "+=0.2")
  .to('.load-icon', { z: 0, scale: 1, opacity: 1, rotationX: 0, rotationY: 0, duration: 1, stagger: 0.15, ease: 'back.out(1.5)' }, "-=0.2")
  .to('.load-text', { z: 0, y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out' }, "-=0.4")
  .to('.load-text-main', { z: 0, y: 0, opacity: 1, filter: 'blur(0px)', scale: 1, duration: 1, ease: 'power4.out' }, "-=0.6")
  .to('.load-badge', { z: 0, y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out' }, "-=0.6") 
  .to('#loader-content', { z: 150, scale: 1.05, duration: 2, ease: 'sine.inOut' }, "-=1")
  .to('#loader', { opacity: 0, duration: 0.8, ease: 'power2.inOut', pointerEvents: 'none', onComplete: () => {
      document.getElementById('loader').style.display = 'none';
      initCounters();
      updateNavIndicator();
  } });

gsap.to('.load-icon', {
    y: -8,
    rotationZ: 'random(-5, 5)',
    duration: 1.5,
    yoyo: true,
    repeat: -1,
    ease: "sine.inOut",
    stagger: 0.2
});

const canvas = document.querySelector('#webgl');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.0035);
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 50, 150);
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0x00E5FF, 2);
dirLight.position.set(100, 100, 50);
scene.add(dirLight);

const dirLight2 = new THREE.DirectionalLight(0x8B5CF6, 2);
dirLight2.position.set(-100, -100, 50);
scene.add(dirLight2);

const planetGroup = new THREE.Group();
scene.add(planetGroup);

const planetGeo = new THREE.SphereGeometry(22, 64, 64);
const planetMat = new THREE.MeshStandardMaterial({
    color: 0x0a0f1a,
    roughness: 0.4,
    metalness: 0.8,
});
const planetMesh = new THREE.Mesh(planetGeo, planetMat);
planetGroup.add(planetMesh);

const wireGeo = new THREE.SphereGeometry(22.5, 32, 32);
const wireMat = new THREE.MeshBasicMaterial({
    color: 0x00E5FF,
    wireframe: true,
    transparent: true,
    opacity: 0.15,
    blending: THREE.AdditiveBlending
});
const wireMesh = new THREE.Mesh(wireGeo, wireMat);
planetGroup.add(wireMesh);

const atmosGeo = new THREE.SphereGeometry(24, 32, 32);
const atmosMat = new THREE.MeshBasicMaterial({
    color: 0x8B5CF6,
    transparent: true,
    opacity: 0.1,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending
});
const atmosMesh = new THREE.Mesh(atmosGeo, atmosMat);
planetGroup.add(atmosMesh);

const ringGroup = new THREE.Group();
planetGroup.add(ringGroup);

const ringGeo1 = new THREE.TorusGeometry(32, 0.1, 16, 100);
const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x00E5FF, transparent: true, opacity: 0.4 });
const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
ring1.rotation.x = Math.PI / 2.2;
ring1.rotation.y = Math.PI / 8;
ringGroup.add(ring1);

const ringGeo2 = new THREE.TorusGeometry(38, 0.05, 16, 100);
const ringMat2 = new THREE.MeshBasicMaterial({ color: 0x8B5CF6, transparent: true, opacity: 0.3 });
const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
ring2.rotation.x = Math.PI / 1.8;
ring2.rotation.y = -Math.PI / 8;
ringGroup.add(ring2);

const satGeo = new THREE.SphereGeometry(0.5, 8, 8);
const satMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
const satellite1 = new THREE.Mesh(satGeo, satMat);
satellite1.position.set(32, 0, 0);
ring1.add(satellite1); 

function createCircleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 32; canvas.height = 32;
    const context = canvas.getContext('2d');
    const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.2, 'rgba(255,255,255,0.8)');
    gradient.addColorStop(0.5, 'rgba(255,255,255,0.2)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    context.fillStyle = gradient;
    context.fillRect(0,0,32,32);
    return new THREE.CanvasTexture(canvas);
}
const starTexture = createCircleTexture();

const galaxyGeo = new THREE.BufferGeometry();
const galaxyCount = window.innerWidth < 768 ? 2000 : 7000;
const posArray = new Float32Array(galaxyCount * 3);
const colArray = new Float32Array(galaxyCount * 3);
const sizeArray = new Float32Array(galaxyCount);

const colorInside = new THREE.Color('#00E5FF');
const colorOutside = new THREE.Color('#8B5CF6');

for(let i=0; i<galaxyCount; i++) {
    const i3 = i * 3;
    const radius = (Math.pow(Math.random(), 2) * 180) + 25; 
    const spinAngle = radius * 0.03;
    const branchAngle = (i % 4) * ((Math.PI * 2) / 4);

    const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 20 * (30/(radius+1) + 1);
    const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 15 * (30/(radius+1) + 1);
    const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 20 * (30/(radius+1) + 1);

    posArray[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
    posArray[i3+1] = randomY * 0.5; 
    posArray[i3+2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

    const mixedColor = colorInside.clone();
    mixedColor.lerp(colorOutside, radius / 200);
    colArray[i3] = mixedColor.r; colArray[i3+1] = mixedColor.g; colArray[i3+2] = mixedColor.b;
    sizeArray[i] = Math.random() * 1.5 + 0.5;
}

galaxyGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
galaxyGeo.setAttribute('color', new THREE.BufferAttribute(colArray, 3));
galaxyGeo.setAttribute('size', new THREE.BufferAttribute(sizeArray, 1));

const galaxyMat = new THREE.PointsMaterial({ size: window.innerWidth < 768 ? 1.0 : 1.5, map: starTexture, transparent: true, opacity: 0.9, vertexColors: true, blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true });
const galaxyMesh = new THREE.Points(galaxyGeo, galaxyMat);
galaxyMesh.rotation.x = Math.PI * 0.1;
galaxyMesh.rotation.z = Math.PI * 0.05;
scene.add(galaxyMesh);

const dustGeo = new THREE.BufferGeometry();
const dustCount = window.innerWidth < 768 ? 1500 : 4000;
const dustPos = new Float32Array(dustCount * 3);
const dustCol = new Float32Array(dustCount * 3);
for(let i=0; i<dustCount; i++) {
    dustPos[i*3] = (Math.random() - 0.5) * 600;
    dustPos[i*3+1] = (Math.random() - 0.5) * 600;
    dustPos[i*3+2] = (Math.random() - 0.5) * 600;
    dustCol[i*3] = 0.4 + Math.random() * 0.2;
    dustCol[i*3+1] = 0.6 + Math.random() * 0.4;
    dustCol[i*3+2] = 1.0;
}
dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
dustGeo.setAttribute('color', new THREE.BufferAttribute(dustCol, 3));
const dustMat = new THREE.PointsMaterial({ size: 0.8, map: starTexture, transparent: true, opacity: 0.5, vertexColors: true, blending: THREE.AdditiveBlending, depthWrite: false });
const dustMesh = new THREE.Points(dustGeo, dustMat);
scene.add(dustMesh);

const shootingStars = [];
for(let i=0; i<2; i++) {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array([0,0,0, 0,0,0]);
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.LineBasicMaterial({ color: 0x00E5FF, transparent: true, opacity: 0 });
    const line = new THREE.Line(geo, mat);
    scene.add(line);
    shootingStars.push({ mesh: line, active: false, x:0, y:0, z:0, len: 0, speed: 0 });
}

function spawnShootingStar(star) {
    star.active = true;
    star.x = (Math.random() - 0.5) * 200;
    star.y = Math.random() * 100 + 50;
    star.z = -50 + Math.random() * 50;
    star.len = Math.random() * 10 + 10;
    star.speed = Math.random() * 1.5 + 1.5;
    star.mesh.material.opacity = 1;
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2(999, 999);

let threeMouseX = 0; let threeMouseY = 0;
if (!isTouchDevice) {
    document.addEventListener('mousemove', (event) => {
        threeMouseX = (event.clientX / window.innerWidth) * 2 - 1;
        threeMouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        mouse.x = threeMouseX;
        mouse.y = threeMouseY;
    });
}

let targetPlanetScale = 1;
let targetWireOpacity = 0.15;

const clock = new THREE.Clock();
function animateThree() {
    const elapsedTime = clock.getElapsedTime();
    
    galaxyMesh.rotation.y = elapsedTime * 0.05;
    dustMesh.rotation.y = elapsedTime * 0.01;
    
    planetMesh.rotation.y += 0.002;
    wireMesh.rotation.y -= 0.001;
    wireMesh.rotation.x += 0.0005;
    ring1.rotation.z += 0.005;
    ring2.rotation.z -= 0.003;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(planetMesh);
    
    if (intersects.length > 0) {
        targetPlanetScale = 1.08;
        targetWireOpacity = 0.4;
    } else {
        targetPlanetScale = 1;
        targetWireOpacity = 0.15;
    }

    planetGroup.scale.lerp(new THREE.Vector3(targetPlanetScale, targetPlanetScale, targetPlanetScale), 0.1);
    wireMat.opacity += (targetWireOpacity - wireMat.opacity) * 0.1;
    
    planetGroup.rotation.x += (threeMouseY * 0.2 - planetGroup.rotation.x) * 0.05;
    planetGroup.rotation.z += (-threeMouseX * 0.2 - planetGroup.rotation.z) * 0.05;
    
    camera.position.x += (threeMouseX * 30 - camera.position.x) * 0.02;
    camera.position.y += (-threeMouseY * 30 + 50 - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);

    shootingStars.forEach(star => {
        if(!star.active) {
            if(Math.random() < 0.002) spawnShootingStar(star);
        } else {
            star.x -= star.speed;
            star.y -= star.speed;
            const positions = star.mesh.geometry.attributes.position.array;
            positions[0] = star.x; positions[1] = star.y; positions[2] = star.z;
            positions[3] = star.x + star.len; positions[4] = star.y + star.len; positions[5] = star.z;
            star.mesh.geometry.attributes.position.needsUpdate = true;
            star.mesh.material.opacity -= 0.015;
            if(star.mesh.material.opacity <= 0) star.active = false;
        }
    });
    
    renderer.render(scene, camera);
    requestAnimationFrame(animateThree);
}
animateThree();

const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

themeToggle.addEventListener('click', () => {
    themeToggle.style.pointerEvents = 'none';
    
    gsap.to(themeIcon, {
        rotation: 180, scale: 0, opacity: 0, duration: 0.25, ease: "power2.in",
        onComplete: () => {
            document.documentElement.classList.toggle('light-mode');
            
            if(document.documentElement.classList.contains('light-mode')){
                themeIcon.className = "ph-fill ph-moon text-xl md:text-2xl text-accent2";
                galaxyMat.blending = THREE.NormalBlending;
                galaxyMat.color.setHex(0x0f172a); 
                dustMat.blending = THREE.NormalBlending;
                dustMat.color.setHex(0x0f172a);
                scene.fog.color.setHex(0xf4f7f9);
                
                planetMat.color.setHex(0xe2e8f0);
                wireMat.color.setHex(0x8B5CF6);
                atmosMat.color.setHex(0x3B82F6);
                dirLight.color.setHex(0x8B5CF6);
                dirLight2.color.setHex(0x00E5FF);
                ringMat1.color.setHex(0x8B5CF6);
                ringMat2.color.setHex(0x3B82F6);
            } else {
                themeIcon.className = "ph-fill ph-sun text-xl md:text-2xl text-accent1";
                galaxyMat.blending = THREE.AdditiveBlending;
                galaxyMat.color.setHex(0xffffff);
                dustMat.blending = THREE.AdditiveBlending;
                dustMat.color.setHex(0xffffff);
                scene.fog.color.setHex(0x000000);
                
                planetMat.color.setHex(0x0a0f1a);
                wireMat.color.setHex(0x00E5FF);
                atmosMat.color.setHex(0x8B5CF6);
                dirLight.color.setHex(0x00E5FF);
                dirLight2.color.setHex(0x8B5CF6);
                ringMat1.color.setHex(0x00E5FF);
                ringMat2.color.setHex(0x8B5CF6);
            }
            
            gsap.set(themeIcon, { rotation: -180, scale: 0, opacity: 0 });
            gsap.to(themeIcon, {
                rotation: 0, scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.5)",
                clearProps: "all",
                onComplete: () => {
                    themeIcon.classList.add('group-hover:rotate-180', 'transition-transform', 'duration-500');
                    themeToggle.style.pointerEvents = 'auto';
                }
            });
        }
    });
});

new Typed('#typed', {
    strings: ['AI & Machine Learning Engineer.', 'Data Scientist.', 'Full-Stack Developer.'],
    typeSpeed: 50, backSpeed: 30, backDelay: 2000, loop: true, contentType: 'text'
});

function initCounters() {
    document.querySelectorAll('.counter').forEach(counter => {
        const target = parseFloat(counter.getAttribute('data-target'));
        const isFloat = counter.getAttribute('data-target').includes('.');
        gsap.to(counter, { innerHTML: target, duration: 2.5, ease: 'power2.out', snap: { innerHTML: isFloat ? 0.01 : 1 }, onUpdate: function() { counter.innerHTML = isFloat ? Number(this.targets()[0].innerHTML).toFixed(2) : Math.floor(Number(this.targets()[0].innerHTML)); }});
    });
}

const scroller = document.getElementById('scroller');
const slides = document.querySelectorAll('.slide');
const navTriggers = document.querySelectorAll('.nav-trigger');
const topNav = document.getElementById('desktop-nav');
const indicator = document.getElementById('nav-indicator');

function updateNavIndicator() {
    const activeItem = document.querySelector('.nav-item.active-menu');
    if (activeItem && indicator) {
        gsap.to(indicator, {
            x: activeItem.offsetLeft,
            width: activeItem.offsetWidth,
            opacity: 1,
            duration: 0.5,
            ease: "power3.out"
        });
    }
}

const observerOptions = { root: scroller, threshold: 0.5 };
const slideObserver = new IntersectionObserver((entries) => {
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
}, observerOptions);

slides.forEach(slide => slideObserver.observe(slide));

navTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = trigger.getAttribute('data-target');
        const targetElement = document.getElementById(targetId);
        if(targetElement) scroller.scrollTo({ top: targetElement.offsetTop, behavior: 'smooth' });
    });
});

scroller.addEventListener('scroll', () => {
    const st = scroller.scrollTop;
    if (st > 50) {
        topNav.classList.add('nav-shrink');
    } else {
        topNav.classList.remove('nav-shrink');
    }
});

function openModal(title, desc, techArray, iconClass, accentColor) {
    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-desc').innerText = desc;
    document.getElementById('modal-icon').innerHTML = `<i class="${iconClass} text-[${accentColor}]"></i>`;
    document.getElementById('modal-bg-icon').innerHTML = `<i class="${iconClass}"></i>`;
    const techContainer = document.getElementById('modal-tech');
    techContainer.innerHTML = '';
    techArray.forEach(tech => {
        techContainer.innerHTML += `<span class="px-3 py-1 md:px-4 md:py-1.5 text-[9px] md:text-[10px] lg:text-xs font-mono border rounded-full font-bold shadow-lg text-[var(--text-main)]" style="border-color: ${accentColor}40; background: ${accentColor}15">${tech}</span>`;
    });
    document.getElementById('project-modal').classList.add('active');
}

function closeModal() { document.getElementById('project-modal').classList.remove('active'); }
document.getElementById('project-modal').addEventListener('click', (e) => { if(e.target.id === 'project-modal') closeModal(); });