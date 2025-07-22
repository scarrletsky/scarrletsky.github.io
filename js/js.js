document.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('loader');
  const startScreen = document.getElementById('start-screen');
  const startBtn = document.getElementById('start-btn');
  const mainContent = document.getElementById('main-content');
  const bgMusic = document.getElementById('bg-music');
  const panel = document.getElementById('info-panel');
  const canvas = document.getElementById("matrix-canvas");
  const ctx = canvas.getContext("2d");

  setTimeout(() => {
    loader.classList.remove('visible');
    startScreen.classList.add('visible');
  }, 1500);

  startBtn.addEventListener('click', () => {
    startScreen.classList.remove('visible');
    mainContent.classList.add('visible');
    bgMusic.currentTime = 2;
    bgMusic.play().catch(() => setTimeout(() => bgMusic.play(), 100));
  });

  document.addEventListener('mousemove', (e) => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const deltaX = (e.clientX - centerX) / centerX;
    const deltaY = (e.clientY - centerY) / centerY;
    panel.style.transform = `rotateY(${deltaX * 15}deg) rotateX(${deltaY * -15}deg)`;
    panel.style.boxShadow = `${-deltaX * 40}px ${-deltaY * 40}px 60px rgba(0,0,0,0.5)`;
  });

  // Matrix background
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const katakana = 'アカサタナハマヤラワンイキシチニヒミリウクスツヌフムユルエケセテネヘメレオコソトノホモヨロヲン';
  const fontSize = 16;
  const columns = Math.floor(canvas.width / fontSize);
  const drops = Array(columns).fill(1);

  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const analyser = audioCtx.createAnalyser();
  const source = audioCtx.createMediaElementSource(bgMusic);
  source.connect(analyser);
  analyser.connect(audioCtx.destination);
  const dataArray = new Uint8Array(analyser.frequencyBinCount);

  function drawMatrix() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    analyser.getByteFrequencyData(dataArray);
    const avgVolume = dataArray.reduce((a, b) => a + b) / dataArray.length;
    ctx.font = fontSize + "px monospace";

    for (let i = 0; i < drops.length; i++) {
      const text = katakana[Math.floor(Math.random() * katakana.length)];
      const x = i * fontSize;
      const y = drops[i] * fontSize;
      const hue = 25 + (avgVolume / 255) * 90;
      const saturation = 100;
      const lightness = 60;
      ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(0.1);
      ctx.fillText(text, 0, 0);
      ctx.restore();

      if (y > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  setInterval(drawMatrix, 50);

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
});
