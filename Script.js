document.addEventListener("DOMContentLoaded", () => {
    // 1. Inisialisasi AOS (Animate On Scroll)
    AOS.init({
        once: true,
        mirror: false
    });

    // 2. Kontrol Navigasi Samping (Drawer Keranjang / Menu)
    const menuToggle = document.getElementById('menu-toggle');
    const cartToggle = document.getElementById('cart-toggle');
    const closeNav = document.getElementById('close-nav');
    const sideNav = document.getElementById('side-nav');

    const openDrawer = () => sideNav.classList.remove('translate-x-full');
    const closeDrawer = () => sideNav.classList.add('translate-x-full');

    if (menuToggle) menuToggle.addEventListener('click', openDrawer);
    if (cartToggle) cartToggle.addEventListener('click', openDrawer);
    if (closeNav) closeNav.addEventListener('click', closeDrawer);

    // 3. Efek Menggulung (Scroll) Transparansi Navbar
    const topNav = document.getElementById('top-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            topNav.classList.add('nav-scrolled', 'shadow-lg');
            topNav.classList.remove('bg-transparent');
        } else {
            topNav.classList.remove('nav-scrolled', 'shadow-lg');
            topNav.classList.add('bg-transparent');
        }
    });

    // 4. Inisialisasi Engine 3D Three.js pada Hero Section
    initThreeJS();
});

// Fungsi Pembangun Animasi 3D Gitar
function initThreeJS() {
    const container = document.getElementById('threejs-container');
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Tata Cahaya Studio 3D
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xd4af37, 1.5);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Konstruksi Objek Komponen Gitar Komposit
    const bodyGeometry = new THREE.BoxGeometry(1.5, 2, 0.3);
    const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0x8b5e3c, shininess: 60 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = -0.5;

    const neckGeometry = new THREE.CylinderGeometry(0.1, 0.1, 3, 32);
    const neckMaterial = new THREE.MeshPhongMaterial({ color: 0x1a1a1a });
    const neck = new THREE.Mesh(neckGeometry, neckMaterial);
    neck.position.y = 1.5;

    const headGeometry = new THREE.BoxGeometry(0.4, 0.6, 0.1);
    const head = new THREE.Mesh(headGeometry, neckMaterial);
    head.position.y = 3;

    // Penggabungan Komponen ke dalam Grup Tunggal
    const guitarGroup = new THREE.Group();
    guitarGroup.add(body);
    guitarGroup.add(neck);
    guitarGroup.add(head);
    scene.add(guitarGroup);

    camera.position.z = 6.5;

    // Loop Animasi Render Rotasi Otomatis
    function animate() {
        requestAnimationFrame(animate);
        guitarGroup.rotation.y += 0.006;
        guitarGroup.rotation.x = Math.sin(Date.now() * 0.001) * 0.15;
        renderer.render(scene, camera);
    }
    animate();

    // Handler Responsif Skala Window Layar
    window.addEventListener('resize', () => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    });
}