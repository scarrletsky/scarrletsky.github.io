document.addEventListener('DOMContentLoaded', () => {
  const video = document.getElementById('background-video');
  const welcomeScreen = document.getElementById('welcome-screen');
  const mainContent = document.getElementById('main-content');
  const videoBackground = document.getElementById('video-background');
  const card = document.querySelector('.profile-card');
  const fullname = document.querySelector('.card-fullname');
  const viewCounter = document.getElementById('view-count');
  const inspectMessage = document.getElementById('inspect-message');
  const particlesCanvas = document.getElementById('particles');
  const cursorCanvas = document.getElementById('cursor-trail');
  const glitchTitle = document.querySelector('.card-glitch-title');
  const cardHeader = document.querySelector('.card-header');
  const linkButtons = document.querySelectorAll('.link-button');
  const cardViewCounter = document.querySelector('.card-view-counter');
  const mediaPlayer = document.getElementById('media-player');
  const playPauseButton = document.getElementById('play-pause-button');
  const playPauseIcon = document.getElementById('play-pause-icon');
  const progressSlider = document.getElementById('progress-slider');
  const currentTime = document.getElementById('current-time');
  const duration = document.getElementById('duration');
  const enterButton = document.getElementById('enter-button');
  const loader = document.getElementById('loader');
  const statusIndicator = document.querySelector('.status-indicator');
  const cardActivity = document.querySelector('.card-activity');

  // Initialize view count
  let views = localStorage.getItem('pageViews');
  if (!views) {
    views = 34148; // Initial value
    localStorage.setItem('pageViews', views);
  }
  views = parseInt(views) + 1;
  localStorage.setItem('pageViews', views);
  viewCounter.textContent = views;

  // Random view increment every 2 minutes
  setInterval(() => {
    views = parseInt(localStorage.getItem('pageViews'));
    const randomIncrement = Math.floor(Math.random() * 3) + 1; // 1 to 3
    views += randomIncrement;
    localStorage.setItem('pageViews', views);
    viewCounter.textContent = views;
  }, 120000); // 2 minutes

  // Discord Status via Lanyard
  const discordId = '958467831853355018';
  let ws;

  function connectLanyard() {
    if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) return;
    ws = new WebSocket('wss://api.lanyard.rest/socket');
    console.log('Connecting to Lanyard WebSocket...');

    ws.onopen = () => {
      console.log('Lanyard WebSocket connected');
      ws.send(JSON.stringify({ op: 2, d: { subscribe_to_ids: [discordId] } }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Lanyard data received:', data);

      if (data.op === 1) {
        // Initialize WebSocket with heartbeat interval
        console.log('Initializing Lanyard with heartbeat interval:', data.d.heartbeat_interval);
        setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ op: 3 }));
        }, data.d.heartbeat_interval);
      }

      if (data.t === 'PRESENCE_UPDATE' || data.t === 'INIT_STATE') {
        const userData = data.d;
        console.log('User data:', userData);

        // Update status
        const status = userData.discord_status || 'offline';
        statusIndicator.classList.remove('online', 'idle', 'dnd', 'offline');
        statusIndicator.classList.add(status);
        console.log('Status updated to:', status);

        // Update activity (without "Активность:" prefix)
        let activityText = 'AFK / Sleeping';
        if (userData.activities && userData.activities.length > 0) {
          const activity = userData.activities.find(a => a.type === 4) || // Custom status
                        userData.activities.find(a => a.type === 0) || // Game
                        userData.activities[0];
          if (activity.type === 4 && activity.state) {
            activityText = activity.state;
          } else if (activity.name) {
            activityText = activity.name;
          }
        }
        cardActivity.textContent = activityText;
        console.log('Activity updated to:', activityText);
      }
    };

    ws.onclose = () => {
      console.log('Lanyard WebSocket disconnected, reconnecting in 2 seconds...');
      statusIndicator.classList.remove('online', 'idle', 'dnd');
      statusIndicator.classList.add('offline');
      cardActivity.textContent = 'Ошибка соединения';
      setTimeout(connectLanyard, 2000); // Faster reconnect
    };

    ws.onerror = (error) => {
      console.error('Lanyard WebSocket error:', error);
      if (ws.readyState !== WebSocket.OPEN) {
        setTimeout(connectLanyard, 2000); // Retry on error
      }
    };
  }

  // Start Lanyard connection
  connectLanyard();

  function initParticles() {
    const ctx = particlesCanvas.getContext('2d', { alpha: true });
    particlesCanvas.width = window.innerWidth;
    particlesCanvas.height = window.innerHeight;
    const particles = Array(20).fill().map(() => ({
      x: Math.random() * particlesCanvas.width,
      y: Math.random() * particlesCanvas.height,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      radius: Math.random() * 1 + 0.5,
      opacity: Math.random() * 0.1 + 0.05
    }));

    function animate() {
      ctx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > particlesCanvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > particlesCanvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.fill();
      });
      requestAnimationFrame(animate);
    }
    animate();

    window.addEventListener('resize', () => {
      particlesCanvas.width = window.innerWidth;
      particlesCanvas.height = window.innerHeight;
    });
  }

  function initCursorTrail() {
    const ctx = cursorCanvas.getContext('2d', { alpha: true });
    cursorCanvas.width = window.innerWidth;
    cursorCanvas.height = window.innerHeight;
    const trails = [];
    let mouseX = -100, mouseY = -100;

    class Trail {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.life = 1;
        this.radius = 5;
      }
      update() { this.life -= 0.05; this.radius *= 0.95; }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.life})`;
        ctx.fill();
      }
    }

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (mainContent.classList.contains('visible')) trails.push(new Trail(mouseX, mouseY));
    });

    function animate() {
      ctx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);
      if (mainContent.classList.contains('visible')) {
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fill();
      }
      for (let i = trails.length - 1; i >= 0; i--) {
        trails[i].update();
        trails[i].draw();
        if (trails[i].life <= 0 || trails[i].radius <= 0.1) trails.splice(i, 1);
      }
      requestAnimationFrame(animate);
    }
    animate();

    window.addEventListener('resize', () => {
      cursorCanvas.width = window.innerWidth;
      cursorCanvas.height = window.innerHeight;
    });
  }

  function initGlitchText() {
    const text = 'Most valuable person';
    setInterval(() => {
      const chars = text.split('');
      glitchTitle.innerHTML = chars.map(c => Math.random() > 0.7 ? `<span style="display:inline-block;transform:translate(${Math.random() * 2 - 1}px, ${Math.random() * 2 - 1}px)">${String.fromCharCode(33 + Math.floor(Math.random() * 94))}</span>` : c).join('');
    }, 200);
  }

  // Throttle function to limit mousemove event frequency
  function throttle(fn, wait) {
    let lastTime = 0;
    return function (...args) {
      const now = Date.now();
      if (now - lastTime >= wait) {
        lastTime = now;
        fn(...args);
      }
    };
  }

  // Parallax effect for the entire card
  let mouseX = 0, mouseY = 0;
  const handleMouseMove = throttle(e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (mouseX - cx) / window.innerWidth;
    const dy = (mouseY - cy) / window.innerHeight;
    const maxAngle = 60;
    const angleX = dy * maxAngle;
    const angleY = dx * maxAngle;

    gsap.to(card, {
      rotationY: angleY,
      rotationX: -angleX,
      transformPerspective: 1000,
      duration: 0.2,
      ease: 'power2.out'
    });
  }, 16);

  document.addEventListener('mousemove', handleMouseMove);

  card.addEventListener('mouseleave', () => {
    gsap.to(card, {
      rotationY: 0,
      rotationX: 0,
      duration: 0.5,
      ease: 'power2.out'
    });
  });

  function animateMainContent() {
    gsap.to(card, { opacity: 1, duration: 0.5, delay: 0.5, ease: 'power2.inOut' });
    gsap.to(cardHeader, { opacity: 1, duration: 0.5, delay: 0.7, ease: 'power2.inOut' });
    gsap.to(fullname, { opacity: 1, y: 0, duration: 0.5, delay: 0.9, ease: 'power2.out' });
    fullname.classList.add('visible');
    gsap.to('.card-tagline', { opacity: 1, y: 0, duration: 0.5, delay: 1.1, ease: 'power2.out' });
    document.querySelector('.card-tagline').classList.add('visible');
    gsap.to('.card-activity', { opacity: 1, y: 0, duration: 0.5, delay: 1.2, ease: 'power2.out' });
    document.querySelector('.card-activity').classList.add('visible');
    gsap.to('.card-glitch-title', { opacity: 1, y: 0, duration: 0.5, delay: 1.3, ease: 'power2.out' });
    document.querySelector('.card-glitch-title').classList.add('visible');
    gsap.to(linkButtons, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, delay: 1.5, ease: 'power2.out' });
    linkButtons.forEach(b => b.classList.add('visible'));
    gsap.to(cardViewCounter, { opacity: 1, scale: 1, duration: 0.5, delay: 1.7, ease: 'power2.out' });
    cardViewCounter.classList.add('visible');
    gsap.to(mediaPlayer, { opacity: 1, y: 0, duration: 0.5, delay: 1.9, ease: 'power2.out' });
    mediaPlayer.classList.add('visible');
  }

  function formatTime(s) {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  }

  let lastTimestampUpdate = 0;
  function updateTimestamp(timestamp) {
    if (timestamp - lastTimestampUpdate < 1000) {
      requestAnimationFrame(updateTimestamp);
      return;
    }
    lastTimestampUpdate = timestamp;
    const ct = video.currentTime;
    const dur = video.duration || 0;
    currentTime.textContent = formatTime(ct);
    duration.textContent = formatTime(dur);
    if (dur > 0) {
      progressSlider.value = (ct / dur) * 100;
    }
    requestAnimationFrame(updateTimestamp);
  }

  playPauseButton.addEventListener('click', () => {
    if (video.paused) {
      video.play();
      playPauseIcon.textContent = '⏸';
      video.muted = false;
      playPauseButton.classList.remove('paused');
      playPauseButton.classList.add('playing');
    } else {
      video.pause();
      playPauseIcon.textContent = '▶';
      playPauseButton.classList.remove('playing');
      playPauseButton.classList.add('paused');
    }
  });

  progressSlider.addEventListener('input', () => {
    const seekTo = (progressSlider.value / 100) * video.duration;
    video.currentTime = seekTo;
  });

  video.addEventListener('loadedmetadata', () => {
    video.muted = false;
    duration.textContent = formatTime(video.duration);
    requestAnimationFrame(updateTimestamp);
  });

  video.addEventListener('play', () => {
    video.muted = false;
    playPauseButton.classList.remove('paused');
    playPauseButton.classList.add('playing');
  });

  video.addEventListener('pause', () => {
    playPauseButton.classList.remove('playing');
    playPauseButton.classList.add('paused');
  });

  setInterval(() => {
    fullname.classList.add('glitch');
  }, 5000);

  let alertVisible = false;
  function showAlert() {
    if (alertVisible) return;
    alertVisible = true;
    inspectMessage.classList.add('show');
    setTimeout(() => {
      inspectMessage.classList.remove('show');
      alertVisible = false;
    }, 2000);
  }

  document.addEventListener('contextmenu', e => { e.preventDefault(); showAlert(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.keyCode === 73))) {
      e.preventDefault();
      showAlert();
    }
  });

  enterButton.addEventListener('click', () => {
    welcomeScreen.style.display = 'none';
    mainContent.classList.add('visible');
    videoBackground.classList.add('visible');
    card.classList.add('visible');
    cardHeader.classList.add('visible');
    linkButtons.forEach(b => b.classList.add('visible'));
    cardViewCounter.classList.add('visible');
    mediaPlayer.classList.add('visible');
    video.volume = 0.5;
    video.muted = false;
    video.play().then(() => {
      playPauseIcon.textContent = '⏸';
      playPauseButton.classList.add('playing');
      initParticles();
      initGlitchText();
      initCursorTrail();
      animateMainContent();
    }).catch(e => {
      console.error('Video play error:', e);
    });
  });

  // Preloader logic
  setTimeout(() => {
    loader.style.opacity = '0';
    setTimeout(() => {
      loader.style.display = 'none';
      welcomeScreen.classList.add('visible');
    }, 500); // Match CSS transition duration
  }, 3000); // 3 seconds preload
});
