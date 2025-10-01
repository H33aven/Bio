document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('starfield');
    const ctx = canvas.getContext('2d');
    const starCount = 150;
    const stars = [];
    const speed = 0.1;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    for (let i = 0; i < starCount; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            z: Math.random() * canvas.width,
            speed: Math.random() * 0.05 + 0.02,
            size: Math.random() * 2 + 1,
            trail: [],
            maxTrail: Math.floor(Math.random() * 8) + 5
        });
    }

    function animate() {
        ctx.fillStyle = 'rgba(10, 10, 15, 0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        stars.forEach(star => {
            star.trail.push({x: star.x, y: star.y, z: star.z});
            
            if (star.trail.length > star.maxTrail) {
                star.trail.shift();
            }

            star.z -= star.speed * 50;
            
            if (star.z <= 0) {
                star.x = Math.random() * canvas.width;
                star.y = Math.random() * canvas.height;
                star.z = canvas.width;
                star.trail = [];
            }

            const scale = canvas.width / star.z;
            const x = (star.x - canvas.width / 2) * scale + canvas.width / 2;
            const y = (star.y - canvas.height / 2) * scale + canvas.height / 2;

            for (let i = 0; i < star.trail.length; i++) {
                const point = star.trail[i];
                const pointScale = canvas.width / point.z;
                const trailX = (point.x - canvas.width / 2) * pointScale + canvas.width / 2;
                const trailY = (point.y - canvas.height / 2) * pointScale + canvas.height / 2;
                
                const alpha = i / star.trail.length * 0.6;
                const trailSize = star.size * (i / star.trail.length) * 0.7;
                
                ctx.beginPath();
                ctx.arc(trailX, trailY, trailSize, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                ctx.fill();
            }

            if (x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height) {
                ctx.beginPath();
                ctx.arc(x, y, star.size, 0, Math.PI * 2);
                ctx.fillStyle = '#ffffff';
                ctx.fill();
                
                if (star.size > 1.5) {
                    ctx.beginPath();
                    ctx.arc(x, y, star.size * 1.5, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(255, 255, 255, 0.2)`;
                    ctx.fill();
                }
            }
        });

        requestAnimationFrame(animate);
    }

    animate();

    const audioElement = document.getElementById('audio-element');
    const playPauseBtn = document.getElementById('play-pause');
    const progressBar = document.getElementById('progress');
    const volumeControl = document.getElementById('volume');
    const currentTimeEl = document.getElementById('current-time');
    const totalTimeEl = document.getElementById('total-time');
    const trackTitle = document.getElementById('track-title');
    const trackArtist = document.getElementById('track-artist');
    const trackArtwork = document.getElementById('track-artwork');
    const playlistItems = document.querySelectorAll('.playlist-item');

    const playlist = [
        {
            title: "Nuke Powder",
            artist: "Maeloux",
            cover: "files/cover1.jpg",
            src: "files/track1.mp3"
        },
        {
            title: "I'm so tired of this", 
            artist: "Rebzyyx",
            cover: "files/cover2.jpg",
            src: "files/track2.mp3"
        },
        {
            title: "Empowering Yourself",
            artist: "Olivier Deriviere", 
            cover: "files/cover3.jpg",
            src: "files/track3.mp3"
        },
        {
            title: "Unslept",
            artist: "Miraidempa",
            cover: "files/cover4.jpg", 
            src: "files/track4.mp3"
        },
        {
            title: "I Just Threw Out The Love Of My Dreams",
            artist: "Weezer",
            cover: "files/cover5.jpg",
            src: "files/track5.mp3"
        }
    ];

    let currentTrackIndex = 0;
    let isPlaying = false;

    function loadVolume() {
        const savedVolume = localStorage.getItem('audioVolume');
        if (savedVolume !== null) {
            const volumeValue = parseFloat(savedVolume);
            audioElement.volume = volumeValue;
            volumeControl.value = volumeValue * 100;
        }
    }

    function saveVolume(volume) {
        localStorage.setItem('audioVolume', volume.toString());
    }

    loadVolume();

    function loadTrack(index) {
        const track = playlist[index];
        trackTitle.textContent = track.title;
        trackArtist.textContent = track.artist;
        trackArtwork.src = track.cover;
        audioElement.src = track.src;
        
        playlistItems.forEach(item => item.classList.remove('active'));
        playlistItems[index].classList.add('active');
        
        progressBar.value = 0;
        currentTimeEl.textContent = '0:00';
        
        audioElement.addEventListener('loadedmetadata', function() {
            totalTimeEl.textContent = formatTime(audioElement.duration);
        });
        
        currentTrackIndex = index;
        
        if (isPlaying) {
            audioElement.play();
        }
    }

    playlistItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            loadTrack(index);
        });
    });

    playPauseBtn.addEventListener('click', togglePlayPause);

    function togglePlayPause() {
        if (isPlaying) {
            audioElement.pause();
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        } else {
            audioElement.play();
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        }
        isPlaying = !isPlaying;
    }

    audioElement.addEventListener('timeupdate', updateProgress);

    function updateProgress() {
        const currentTime = audioElement.currentTime;
        const duration = audioElement.duration;
        
        if (duration) {
            const progressPercent = (currentTime / duration) * 100;
            progressBar.value = progressPercent;
            
            currentTimeEl.textContent = formatTime(currentTime);
            totalTimeEl.textContent = formatTime(duration);
        }
    }

    progressBar.addEventListener('input', function() {
        const duration = audioElement.duration;
        if (duration) {
            audioElement.currentTime = (this.value / 100) * duration;
        }
    });

    volumeControl.addEventListener('input', function() {
        const newVolume = this.value / 100;
        audioElement.volume = newVolume;
        saveVolume(newVolume);
    });

    audioElement.addEventListener('ended', function() {
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
        loadTrack(currentTrackIndex);
        if (isPlaying) {
            audioElement.play();
        }
    });

    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    loadTrack(0);
});м