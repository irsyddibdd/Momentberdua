window.addEventListener('load', () => {

    // --- 1. PENGATURAN AWAL & LOGIKA MODAL ---
    const music = document.getElementById('background-music');
    const modalOverlay = document.getElementById('modal-overlay');
    const playButton = document.getElementById('play-music-btn');

    // Pastikan musik ada sebelum melanjutkan
    if (music) {
        music.volume = 0.3;
    }

    // Saat tombol di dalam modal diklik
    if (modalOverlay && playButton) {
        playButton.addEventListener('click', () => {
            if (music) {
                music.play().catch(error => {
                    console.error("Gagal memutar musik:", error);
                });
            }
            modalOverlay.classList.add('hidden');
            
            // Memulai efek hati setelah modal ditutup
            startHeartEffect();
        });
    }
    
    // --- 2. EFEK HATI BERJATUHAN ---
    function startHeartEffect() {
        setInterval(createHeart, 400);
    }

    function createHeart() {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDuration = Math.random() * 2 + 3 + 's';
        heart.innerText = '❤️';
        document.body.appendChild(heart);
        setTimeout(() => {
            heart.remove();
        }, 5000);
    }

    // --- 3. EFEK ANIMASI SAAT SCROLL ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
    elementsToAnimate.forEach(el => observer.observe(el));

    // --- 4. EFEK 3D TILT PADA GALERI FOTO ---
    const photoItems = document.querySelectorAll('.photo-grid img');
    photoItems.forEach(item => {
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            const rotateX = -y / 20;
            const rotateY = x / 20;
            item.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });

    // --- 5. INISIALISASI VIDEO SLIDER ---
    const swiper = new Swiper('.my-video-slider', {
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        coverflowEffect: {
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
        },
        loop: true,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
    });

    // --- 6. LOGIKA CERDAS UNTUK MUSIK DAN VIDEO (VERSI PERBAIKAN) ---
    const allVideos = document.querySelectorAll('.swiper-slide video');

    const isAnyVideoPlaying = () => {
        let aVideoIsPlaying = false;
        allVideos.forEach(video => {
            if (!video.paused) {
                aVideoIsPlaying = true;
            }
        });
        return aVideoIsPlaying;
    };

    allVideos.forEach(video => {
        video.addEventListener('play', () => {
            if (music) music.pause();
        });
        
        video.addEventListener('pause', () => {
            if (!isAnyVideoPlaying() && music) {
                music.play().catch(e => console.error("Gagal melanjutkan musik", e));
            }
        });
        
        video.addEventListener('ended', () => {
            if (!isAnyVideoPlaying() && music) {
                music.play().catch(e => console.error("Gagal melanjutkan musik", e));
            }
        });
    });

});