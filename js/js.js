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
  const welcomeParticlesCanvas = document.getElementById('welcome-particles');
  const cardHeader = document.querySelector('.card-header');
  const linkButtons = document.querySelectorAll('.link-button');
  const cardViewCounter = document.querySelector('.card-view-counter');
  const mediaPlayer = document.getElementById('media-player');
  const playPauseButton = document.getElementById('play-pause-button');
  const playPauseIcon = document.getElementById('play-pause-icon');
  const volumeSlider = document.getElementById('volume-slider');
  const timestamp = document.getElementById('timestamp');
  const buttonTrailCanvas = document.getElementById('button-trail');
  const buttonTrailCtx = buttonTrailCanvas.getContext('2d', { alpha: true });
  const enterButton = document.getElementById('enter-button');
  const consoleBackground = document.getElementById('console-background');

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

  // Hacker-style console background
  function initConsoleBackground() {
    const commands = [
      '$> sys_init --boot',
      '$> net_scan --port 443',
      '$> trace_route 192.168.1.1',
      '$> decrypt --key 0xFF',
      '$> auth_user --id 1337',
      '$> compile --target main.bin',
      '$> firewall_status',
      '$> ping --host sae.net',
      '$> log_access --date 2025-05-09',
      '$> exec --cmd stealth_mode'
    ];

    const logs = [
      '[INFO] System boot completed.',
      '[ERROR] Port 443 unresponsive.',
      '[SUCCESS] Route traced: 192.168.1.1 -> 10.0.0.1',
      '[WARNING] Decryption key mismatch.',
      '[INFO] User 1337 authenticated.',
      '[SUCCESS] Compilation finished: main.bin',
      '[INFO] Firewall active, 5 threats blocked.',
      '[ERROR] Ping timeout: sae.net',
      '[INFO] Access log updated: 2025-05-09',
      '[SUCCESS] Stealth mode enabled.'
    ];

    const colors = ['white', 'dark-red', 'dark-green'];

    function getRandomLine() {
      const type = Math.random() > 0.5 ? 'command' : 'log';
      const color = colors[Math.floor(Math.random() * colors.length)];
      let text;
      if (type === 'command') {
        text = commands[Math.floor(Math.random() * commands.length)];
      } else {
        text = logs[Math.floor(Math.random() * logs.length)];
      }
      return `<span class="${color}">${text}</span>`;
    }

    function updateConsole() {
      // Add a new line
      consoleBackground.innerHTML += getRandomLine();
      
      // Keep only the last 20 lines to prevent overflow
      const lines = consoleBackground.getElementsByTagName('span');
      while (lines.length > 20) {
        consoleBackground.removeChild(lines[0]);
      }

      // Auto-scroll to the bottom
      consoleBackground.scrollTop = consoleBackground.scrollHeight;

      // Schedule the next update with a random delay between 0.5s and 2s
      const delay = Math.random() * 1500 + 500;
      setTimeout(updateConsole, delay);
    }

    // Start the console updates
    updateConsole();
  }

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

  function initWelcomeParticles() {
    const ctx = welcomeParticlesCanvas.getContext('2d', { alpha: true });
    welcomeParticlesCanvas.width = window.innerWidth;
    welcomeParticlesCanvas.height = window.innerHeight;
    const particles = Array(30).fill().map(() => ({
      x: Math.random() * welcomeParticlesCanvas.width,
      y: Math.random() * welcomeParticlesCanvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.2 + 0.1
    }));

    function animate() {
      ctx.clearRect(0, 0, welcomeParticlesCanvas.width, welcomeParticlesCanvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > welcomeParticlesCanvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > welcomeParticlesCanvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.fill();
      });
      requestAnimationFrame(animate);
    }
    animate();

    window.addEventListener('resize', () => {
      welcomeParticlesCanvas.width = window.innerWidth;
      welcomeParticlesCanvas.height = window.innerHeight;
    });
  }

  function initButtonTrail() {
    buttonTrailCanvas.width = window.innerWidth;
    buttonTrailCanvas.height = window.innerHeight;
    const trails = [];
    let mouseX = 0, mouseY = 0;

    class Trail {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.life = 1;
        this.radius = 3;
      }
      update() { this.life -= 0.02; this.radius *= 0.98; }
      draw() {
        buttonTrailCtx.beginPath();
        buttonTrailCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        buttonTrailCtx.fillStyle = `rgba(255, 255, 255, ${this.life * 0.5})`;
        buttonTrailCtx.fill();
      }
    }

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      const rect = enterButton.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      if (Math.sqrt((mouseX - cx) ** 2 + (mouseY - cy) ** 2) < 100) {
        trails.push(new Trail(mouseX, mouseY));
      }
    });

    function animate() {
      buttonTrailCtx.clearRect(0, 0, buttonTrailCanvas.width, buttonTrailCanvas.height);
      for (let i = trails.length - 1; i >= 0; i--) {
        trails[i].update();
        trails[i].draw();
        if (trails[i].life <= 0 || trails[i].radius <= 0.1) trails.splice(i, 1);
      }
      requestAnimationFrame(animate);
    }
    animate();

    window.addEventListener('resize', () => {
      buttonTrailCanvas.width = window.innerWidth;
      buttonTrailCanvas.height = window.innerHeight;
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
    const maxAngle = 20; // Increased for more noticeable effect
    const angleX = dy * maxAngle;
    const angleY = dx * maxAngle;

    gsap.to(card, {
      rotationY: angleY,
      rotationX: -angleX,
      transformPerspective: 1000,
      duration: 0.2,
      ease: 'power2.out'
    });
  }, 16); // Throttle to ~60fps

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
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
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
    timestamp.textContent = `${formatTime(ct)} / ${formatTime(dur)}`;
    requestAnimationFrame(updateTimestamp);
  }

  playPauseButton.addEventListener('click', () => {
    if (video.paused) {
      video.play();
      playPauseIcon.textContent = '⏸';
    } else {
      video.pause();
      playPauseIcon.textContent = '▶';
    }
  });

  volumeSlider.addEventListener('input', e => video.volume = e.target.value);

  video.addEventListener('loadedmetadata', () => requestAnimationFrame(updateTimestamp));

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

  enterButton.addEventListener('click', async () => {
    welcomeScreen.classList.add('hidden');
    mainContent.classList.add('visible');
    videoBackground.classList.add('visible');
    card.classList.add('visible');
    cardHeader.classList.add('visible');
    linkButtons.forEach(b => b.classList.add('visible'));
    cardViewCounter.classList.add('visible');
    mediaPlayer.classList.add('visible');
    try {
      video.volume = 0.5;
      await video.play();
      playPauseIcon.textContent = '⏸';
      initParticles();
      initGlitchText();
      initCursorTrail();
      initWelcomeParticles();
      initButtonTrail();
      animateMainContent();
    } catch (e) {
      console.error('Video play error:', e);
    }
  });

  initWelcomeParticles();
  initButtonTrail();
  initConsoleBackground();
});