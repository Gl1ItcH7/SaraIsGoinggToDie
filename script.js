/* ===== CONFIG ===== */
// تاریخ تولد سارا: ۴ آبان ۱۴۰۵ = ۲۶ اکتبر ۲۰۲۶
const BIRTHDAY = new Date(2026, 9, 26, 18, 0, 0); // 26 اکتبر 2026 ساعت ۱۸

/* ===== NAVIGATION ===== */
function goToSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  const btn = document.querySelector(`.nav-btn[data-section="${id}"]`);
  if (btn) btn.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => goToSection(btn.dataset.section));
});

/* ===== FLOATING HEARTS ===== */
function createFloatingHearts() {
  const container = document.getElementById('floatingHearts');
  const emojis = ['💕', '🌸', '✨', '🎀', '💖', '🫧', '🌷'];
  for (let i = 0; i < 15; i++) {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    heart.style.left = Math.random() * 100 + '%';
    heart.style.animationDuration = (8 + Math.random() * 12) + 's';
    heart.style.animationDelay = Math.random() * 10 + 's';
    heart.style.fontSize = (14 + Math.random() * 16) + 'px';
    container.appendChild(heart);
  }
}

/* ===== COUNTDOWN ===== */
function updateCountdown() {
  const now = new Date();
  const diff = BIRTHDAY - now;

  if (diff <= 0) {
    document.getElementById('countdown').style.display = 'none';
    document.querySelector('.hero-subtitle').style.display = 'none';
    document.getElementById('birthdayArrived').style.display = 'block';
    triggerConfetti();
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  document.getElementById('days').textContent = String(days).padStart(2, '0');
  document.getElementById('hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

/* ===== CONFETTI ===== */
const confettiCanvas = document.getElementById('confettiCanvas');
const confettiCtx = confettiCanvas.getContext('2d');
let confettiPieces = [];
let confettiActive = false;

function resizeConfetti() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeConfetti);
resizeConfetti();

function triggerConfetti() {
  confettiActive = true;
  const colors = ['#ffb6c1', '#e8d5f2', '#d4eaf7', '#fff0e0', '#ff9aa2', '#c9a9d9', '#fce4ec'];
  for (let i = 0; i < 120; i++) {
    confettiPieces.push({
      x: Math.random() * confettiCanvas.width,
      y: Math.random() * -confettiCanvas.height,
      w: 6 + Math.random() * 8,
      h: 4 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: 2 + Math.random() * 4,
      angle: Math.random() * 360,
      spin: (Math.random() - 0.5) * 8
    });
  }
  requestAnimationFrame(animateConfetti);
  setTimeout(() => { confettiActive = false; }, 4000);
}

function animateConfetti() {
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  confettiPieces = confettiPieces.filter(p => p.y < confettiCanvas.height + 20);
  confettiPieces.forEach(p => {
    p.y += p.speed;
    p.x += Math.sin(p.angle * Math.PI / 180) * 1.5;
    p.angle += p.spin;
    confettiCtx.save();
    confettiCtx.translate(p.x, p.y);
    confettiCtx.rotate(p.angle * Math.PI / 180);
    confettiCtx.fillStyle = p.color;
    confettiCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    confettiCtx.restore();
  });
  if (confettiPieces.length > 0 || confettiActive) {
    requestAnimationFrame(animateConfetti);
  }
}

/* ===== CARD MAKER ===== */
const canvas = document.getElementById('cardCanvas');
const ctx = canvas.getContext('2d');

let cardState = {
  template: 'classic',
  bgColor: '#ffe4ec',
  title: 'دعوت به جشن تولد سارا',
  name: 'سارا',
  message: 'با کلی عشق و شادی منتظرت هستیم! بیا تا با هم جشن بگیریم 💕',
  date: '۴ آبان - ساعت ۱۸',
  stickers: [],
  image: null
};

function setTemplate(t) {
  cardState.template = t;
  document.querySelectorAll('.template-btn').forEach(b => b.classList.remove('active'));
  document.querySelector(`.template-btn[data-template="${t}"]`).classList.add('active');
  updateCard();
}

function setBgColor(c) {
  cardState.bgColor = c;
  document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
  document.querySelector(`.color-btn[data-color="${c}"]`).classList.add('active');
  updateCard();
}

function updateCard() {
  cardState.title = document.getElementById('cardTitle').value;
  cardState.name = document.getElementById('cardName').value;
  cardState.message = document.getElementById('cardMessage').value;
  cardState.date = document.getElementById('cardDate').value;
  drawCard();
}

function addSticker(emoji) {
  cardState.stickers.push({
    emoji,
    x: 40 + Math.random() * 300,
    y: 80 + Math.random() * 400
  });
  drawCard();
}

function handleImageUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(ev) {
    const img = new Image();
    img.onload = function() {
      cardState.image = img;
      drawCard();
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
}

function removeCardImage() {
  cardState.image = null;
  document.getElementById('cardImage').value = '';
  drawCard();
}

function resetCard() {
  cardState.stickers = [];
  cardState.image = null;
  document.getElementById('cardTitle').value = 'دعوت به جشن تولد سارا';
  document.getElementById('cardName').value = 'سارا';
  document.getElementById('cardMessage').value = 'با کلی عشق و شادی منتظرت هستیم! بیا تا با هم جشن بگیریم 💕';
  document.getElementById('cardDate').value = '۴ آبان - ساعت ۱۸';
  document.getElementById('cardImage').value = '';
  setTemplate('classic');
  setBgColor('#ffe4ec');
}

function drawCard() {
  const w = canvas.width;
  const h = canvas.height;

  // Background
  ctx.fillStyle = cardState.bgColor;
  ctx.fillRect(0, 0, w, h);

  // Decorative border
  ctx.strokeStyle = 'rgba(232, 145, 163, 0.4)';
  ctx.lineWidth = 8;
  ctx.strokeRect(12, 12, w - 24, h - 24);

  ctx.strokeStyle = 'rgba(255,255,255,0.7)';
  ctx.lineWidth = 3;
  ctx.strokeRect(20, 20, w - 40, h - 40);

  // Template decorations
  drawTemplateDecor(cardState.template);

  // Title
  ctx.fillStyle = '#e891a3';
  ctx.font = 'bold 22px Vazirmatn, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(cardState.title, w / 2, 70);

  // Decorative line under title
  ctx.strokeStyle = 'rgba(232, 145, 163, 0.5)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(80, 85);
  ctx.lineTo(w - 80, 85);
  ctx.stroke();

  // Name
  ctx.fillStyle = '#5a4a5a';
  ctx.font = 'bold 28px Vazirmatn, sans-serif';
  ctx.fillText(cardState.name, w / 2, 130);

  // Image if exists
  let msgY = 180;
  if (cardState.image) {
    const maxW = 160;
    const maxH = 120;
    let iw = cardState.image.width;
    let ih = cardState.image.height;
    const scale = Math.min(maxW / iw, maxH / ih, 1);
    iw *= scale;
    ih *= scale;
    const ix = (w - iw) / 2;
    const iy = 150;
    // rounded rect clip
    ctx.save();
    roundRect(ctx, ix - 4, iy - 4, iw + 8, ih + 8, 12);
    ctx.clip();
    ctx.drawImage(cardState.image, ix, iy, iw, ih);
    ctx.restore();
    // border
    ctx.strokeStyle = 'rgba(255,255,255,0.9)';
    ctx.lineWidth = 4;
    roundRect(ctx, ix - 4, iy - 4, iw + 8, ih + 8, 12);
    ctx.stroke();
    msgY = iy + ih + 40;
  }

  // Message (word wrap)
  ctx.fillStyle = '#6a5a6a';
  ctx.font = '16px Vazirmatn, sans-serif';
  const lines = wrapText(ctx, cardState.message, w - 80);
  lines.forEach((line, i) => {
    ctx.fillText(line, w / 2, msgY + i * 26);
  });

  // Date
  const dateY = msgY + lines.length * 26 + 30;
  ctx.fillStyle = '#e891a3';
  ctx.font = '15px Vazirmatn, sans-serif';
  ctx.fillText(cardState.date, w / 2, dateY);

  // Bottom decoration
  ctx.font = '24px serif';
  ctx.fillText('💕 ✨ 🎀 ✨ 💕', w / 2, h - 40);

  // Stickers
  cardState.stickers.forEach(s => {
    ctx.font = '28px serif';
    ctx.textAlign = 'left';
    ctx.fillText(s.emoji, s.x, s.y);
  });
  ctx.textAlign = 'center';
}

function drawTemplateDecor(template) {
  ctx.font = '20px serif';
  if (template === 'classic') {
    ctx.fillText('🎂', 50, 50);
    ctx.fillText('🎁', canvas.width - 50, 50);
    ctx.fillText('🎈', 50, canvas.height - 30);
    ctx.fillText('🎀', canvas.width - 50, canvas.height - 30);
  } else if (template === 'floral') {
    const flowers = ['🌸', '🌷', '💮', '🌺'];
    flowers.forEach((f, i) => {
      ctx.fillText(f, 40 + i * 30, 45);
      ctx.fillText(f, canvas.width - 130 + i * 30, canvas.height - 25);
    });
  } else if (template === 'balloon') {
    ctx.font = '26px serif';
    ctx.fillText('🎈', 45, 55);
    ctx.fillText('🎈', canvas.width - 55, 55);
    ctx.fillText('🎈', 55, 90);
    ctx.fillText('🎈', canvas.width - 65, 90);
  } else if (template === 'stars') {
    ctx.font = '18px serif';
    for (let i = 0; i < 8; i++) {
      ctx.fillText('✨', 30 + Math.random() * (canvas.width - 60), 40 + Math.random() * 40);
    }
  }
}

function wrapText(context, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let current = '';
  words.forEach(word => {
    const test = current ? current + ' ' + word : word;
    if (context.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  });
  if (current) lines.push(current);
  return lines;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function downloadCard() {
  const link = document.createElement('a');
  link.download = 'kart-davat-tavalod.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
  triggerConfetti();
}

function copyCardLink() {
  // چون pure frontend هستیم، دیتای کارت رو به صورت data URL کپی می‌کنیم
  const dataUrl = canvas.toDataURL('image/png');
  // برای راحتی، فقط به کاربر می‌گیم که کارت رو دانلود کنه و به اشتراک بذاره
  // یا می‌تونیم data URL رو کپی کنیم (ولی خیلی بلنده)
  navigator.clipboard.writeText(dataUrl).then(() => {
    alert('لینک تصویر کارت کپی شد!\nمی‌تونی مستقیم تو پیام‌رسان‌ها پیست کنی یا کارت رو دانلود کنی.');
  }).catch(() => {
    alert('کارت رو دانلود کن و به دوستات بفرست 💕');
  });
}

/* ===== WISHES ===== */
const wishes = [
  { emoji: '💖', text: 'آرزو می‌کنم همیشه لبخندت مثل الان قشنگ باشه و دلت پر از آرامش باشه.' },
  { emoji: '🌸', text: 'دلت همیشه مثل بهار شکوفا باشه و هر روزت پر از اتفاقای خوب باشه.' },
  { emoji: '✨', text: 'آرزو می‌کنم تمام رویاهات یکی‌یکی به حقیقت بپیوندن و خوشبخت باشی.' },
  { emoji: '🎂', text: 'تولدت پر از کیک، خنده، دوستای خوب و خاطره‌های قشنگ باشه!' },
  { emoji: '🌈', text: 'آرزو می‌کنم زندگیت پر از رنگ باشه و هیچ‌وقت خاکستری نشه.' },
  { emoji: '🦋', text: 'مثل پروانه آزاد باشی و به هر جایی که دوست داری پرواز کنی.' },
  { emoji: '🎀', text: 'آرزو می‌کنم همیشه کسی باشه که دوستت داشته باشه و هواتو داشته باشه.' },
  { emoji: '🌟', text: 'تو ستاره‌ای و آرزو می‌کنم همیشه بدرخشی، حتی تو تاریک‌ترین شب‌ها.' },
  { emoji: '🌷', text: 'دلت مثل گل‌های بهاری نرم و قشنگ بمونه و هیچ‌وقت پژمرده نشه.' },
  { emoji: '🎁', text: 'آرزو می‌کنم بهترین هدیه‌های زندگی‌ت هنوز در راه باشن!' },
  { emoji: '💫', text: 'هر آرزویی که تو دلت داری، یکی‌یکی برآورده بشه قشنگم.' },
  { emoji: '🫧', text: 'آرزو می‌کنم نگرانی‌هات مثل حباب بترکن و فقط خوشی بمونه برات.' },
  { emoji: '👑', text: 'تو ملکهٔ قلبایی و آرزو می‌کنم همیشه با عزت و عشق زندگی کنی.' },
  { emoji: '💗', text: 'آرزو می‌کنم امسال برات پر از عشق، موفقیت و لحظه‌های فراموش‌نشدنی باشه.' },
  { emoji: '🎨', text: 'زندگیت مثل یه نقاشی قشنگ باشه؛ پر از رنگ و حس خوب.' }
];

let wishCount = 0;
let lastWishIndex = -1;

function drawWish() {
  let idx;
  do {
    idx = Math.floor(Math.random() * wishes.length);
  } while (idx === lastWishIndex && wishes.length > 1);
  lastWishIndex = idx;

  const wish = wishes[idx];
  const card = document.getElementById('wishCard');
  card.classList.remove('pop');
  void card.offsetWidth; // reflow
  card.classList.add('pop');

  document.getElementById('wishEmoji').textContent = wish.emoji;
  document.getElementById('wishText').textContent = wish.text;
  wishCount++;
  document.getElementById('wishCount').textContent = wishCount;
}

/* ===== GAME - Balloon Pop ===== */
const gameCanvas = document.getElementById('gameCanvas');
const gctx = gameCanvas.getContext('2d');
let balloons = [];
let score = 0;
let highScore = parseInt(localStorage.getItem('balloonHighScore') || '0');
let timeLeft = 30;
let gameRunning = false;
let gameInterval = null;
let spawnInterval = null;

document.getElementById('highScore').textContent = highScore;

const balloonColors = ['#ffb6c1', '#e8d5f2', '#d4eaf7', '#fff0e0', '#ff9aa2', '#c9a9d9', '#b5e8d5'];

function startGame() {
  document.getElementById('gameOverlay').classList.add('hidden');
  balloons = [];
  score = 0;
  timeLeft = 30;
  gameRunning = true;
  document.getElementById('score').textContent = score;
  document.getElementById('timer').textContent = timeLeft;

  gameInterval = setInterval(() => {
    timeLeft--;
    document.getElementById('timer').textContent = timeLeft;
    if (timeLeft <= 0) endGame();
  }, 1000);

  spawnInterval = setInterval(spawnBalloon, 600);
  requestAnimationFrame(gameLoop);
}

function spawnBalloon() {
  if (!gameRunning) return;
  balloons.push({
    x: 30 + Math.random() * (gameCanvas.width - 60),
    y: gameCanvas.height + 20,
    r: 22 + Math.random() * 16,
    speed: 1.5 + Math.random() * 2.5,
    color: balloonColors[Math.floor(Math.random() * balloonColors.length)],
    wobble: Math.random() * Math.PI * 2,
    popped: false
  });
}

function gameLoop() {
  if (!gameRunning) return;
  gctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

  // soft background dots
  gctx.fillStyle = 'rgba(255,182,193,0.08)';
  for (let i = 0; i < 20; i++) {
    gctx.beginPath();
    gctx.arc((i * 67) % gameCanvas.width, (i * 97) % gameCanvas.height, 3, 0, Math.PI * 2);
    gctx.fill();
  }

  balloons.forEach(b => {
    if (b.popped) return;
    b.y -= b.speed;
    b.wobble += 0.05;
    b.x += Math.sin(b.wobble) * 0.8;

    // balloon body
    gctx.beginPath();
    gctx.ellipse(b.x, b.y, b.r * 0.85, b.r, 0, 0, Math.PI * 2);
    gctx.fillStyle = b.color;
    gctx.fill();
    // highlight
    gctx.beginPath();
    gctx.ellipse(b.x - b.r * 0.25, b.y - b.r * 0.3, b.r * 0.25, b.r * 0.35, -0.3, 0, Math.PI * 2);
    gctx.fillStyle = 'rgba(255,255,255,0.4)';
    gctx.fill();
    // string
    gctx.beginPath();
    gctx.moveTo(b.x, b.y + b.r);
    gctx.lineTo(b.x, b.y + b.r + 18);
    gctx.strokeStyle = 'rgba(100,80,100,0.3)';
    gctx.lineWidth = 1.5;
    gctx.stroke();
  });

  balloons = balloons.filter(b => !b.popped && b.y > -50);
  requestAnimationFrame(gameLoop);
}

gameCanvas.addEventListener('click', (e) => {
  if (!gameRunning) return;
  const rect = gameCanvas.getBoundingClientRect();
  const scaleX = gameCanvas.width / rect.width;
  const scaleY = gameCanvas.height / rect.height;
  const mx = (e.clientX - rect.left) * scaleX;
  const my = (e.clientY - rect.top) * scaleY;

  balloons.forEach(b => {
    if (b.popped) return;
    const dx = mx - b.x;
    const dy = my - b.y;
    if (Math.sqrt(dx * dx + dy * dy) < b.r) {
      b.popped = true;
      score += 10;
      document.getElementById('score').textContent = score;
    }
  });
});

// touch support
gameCanvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  if (!gameRunning) return;
  const rect = gameCanvas.getBoundingClientRect();
  const scaleX = gameCanvas.width / rect.width;
  const scaleY = gameCanvas.height / rect.height;
  const touch = e.touches[0];
  const mx = (touch.clientX - rect.left) * scaleX;
  const my = (touch.clientY - rect.top) * scaleY;

  balloons.forEach(b => {
    if (b.popped) return;
    const dx = mx - b.x;
    const dy = my - b.y;
    if (Math.sqrt(dx * dx + dy * dy) < b.r) {
      b.popped = true;
      score += 10;
      document.getElementById('score').textContent = score;
    }
  });
}, { passive: false });

function endGame() {
  gameRunning = false;
  clearInterval(gameInterval);
  clearInterval(spawnInterval);
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('balloonHighScore', highScore);
    document.getElementById('highScore').textContent = highScore;
  }
  const overlay = document.getElementById('gameOverlay');
  overlay.classList.remove('hidden');
  overlay.innerHTML = `
    <h3>آفرین! 🎉</h3>
    <p style="color:#8a7a8a;margin:8px 0 16px">امتیازت: <strong style="color:#e891a3">${score}</strong></p>
    <button class="btn btn-primary" onclick="startGame()">دوباره بازی کن 🎮</button>
  `;
  if (score >= 100) triggerConfetti();
}

/* ===== CHECKLIST ===== */
const checklistData = [
  'کیک تولد سارا رو بخوریم 🎂',
  'عکس یادگاری با سارا بگیریم 📸',
  'آهنگ مورد علاقهٔ سارا رو پخش کنیم 🎵',
  'کادوهای سارا رو باز کنیم 🎁',
  'یه خاطرهٔ قدیمی با سارا تعریف کنیم 💬',
  'با هم بخندیم تا حد مرگ 😂',
  'آرزو کنیم و شمع فوت کنیم 🕯️',
  'به سارا بگیم چقدر دوستش داریم 💕'
];

function renderChecklist() {
  const ul = document.getElementById('checklistItems');
  const saved = JSON.parse(localStorage.getItem('birthdayChecklist') || '[]');
  ul.innerHTML = '';
  checklistData.forEach((item, i) => {
    const li = document.createElement('li');
    if (saved.includes(i)) li.classList.add('done');
    li.innerHTML = `<div class="check-box">${saved.includes(i) ? '✓' : ''}</div><span class="check-label">${item}</span>`;
    li.addEventListener('click', () => toggleCheck(i));
    ul.appendChild(li);
  });
  updateProgress();
}

function toggleCheck(i) {
  let saved = JSON.parse(localStorage.getItem('birthdayChecklist') || '[]');
  if (saved.includes(i)) {
    saved = saved.filter(x => x !== i);
  } else {
    saved.push(i);
  }
  localStorage.setItem('birthdayChecklist', JSON.stringify(saved));
  renderChecklist();
}

function updateProgress() {
  const saved = JSON.parse(localStorage.getItem('birthdayChecklist') || '[]');
  const total = checklistData.length;
  const done = saved.length;
  document.getElementById('progressFill').style.width = (done / total * 100) + '%';
  document.getElementById('progressText').textContent = `${done} از ${total} انجام شده`;
}

/* ===== INIT ===== */
createFloatingHearts();
updateCountdown();
setInterval(updateCountdown, 1000);
drawCard();
renderChecklist();
