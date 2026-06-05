const screens = {
  intro: document.getElementById("screenIntro"),
  letter: document.getElementById("screenLetter"),
  gift: document.getElementById("screenGift"),
};

const heartsLayer = document.getElementById("heartsLayer");
const photosLayer = document.getElementById("photosLayer");
const sparklesLayer = document.getElementById("sparklesLayer");
const musicButton = document.getElementById("musicButton");
const bgMusic = document.getElementById("bgMusic");

const memoryPhotos = ['memory1.jpg', 'memory2.jpg', 'memory3.jpg', 'memory4.jpg', 'memory5.jpg', 'memory6.png', 'memory7.png', 'memory8.png'];
const captions = ["love", "us", "forever", "my fav", "тепло", "милота", "♡"];

let memoryInterval = null;
let giftOpened = false;

function showScreen(screen) {
  Object.values(screens).forEach((s) => s.classList.remove("active"));
  screen.classList.add("active");
}

function burst(x = window.innerWidth / 2, y = window.innerHeight / 2, count = 34) {
  const signs = ["💗", "✨", "💕", "🌸", "⭐"];
  for (let i = 0; i < count; i++) {
    const item = document.createElement("div");
    item.className = "sparkle";
    item.textContent = signs[Math.floor(Math.random() * signs.length)];
    item.style.left = `${x + (Math.random() - 0.5) * 190}px`;
    item.style.top = `${y + (Math.random() - 0.5) * 90}px`;
    item.style.animationDelay = `${Math.random() * 0.25}s`;
    item.style.fontSize = `${16 + Math.random() * 22}px`;
    sparklesLayer.appendChild(item);
    setTimeout(() => item.remove(), 1400);
  }
}

function fallingHeart() {
  const heart = document.createElement("div");
  heart.className = "heart";
  heart.textContent = Math.random() > 0.35 ? "♡" : "♥";
  heart.style.left = `${Math.random() * 100}vw`;
  heart.style.fontSize = `${14 + Math.random() * 28}px`;
  heart.style.animationDuration = `${6 + Math.random() * 8}s`;
  heartsLayer.appendChild(heart);
  setTimeout(() => heart.remove(), 15000);
}

function spawnMemoryPhoto() {
  if (!screens.gift.classList.contains("active") || giftOpened || memoryPhotos.length === 0) return;

  const card = document.createElement("div");
  card.className = "photo-memory sway";

  const img = document.createElement("img");
  img.src = memoryPhotos[Math.floor(Math.random() * memoryPhotos.length)];
  img.alt = "Наше милое воспоминание";

  const caption = document.createElement("div");
  caption.className = "caption";
  caption.textContent = captions[Math.floor(Math.random() * captions.length)];

  const isMobile = window.innerWidth < 560;
  const width = isMobile ? 92 + Math.random() * 26 : 118 + Math.random() * 58;
  const left = Math.random() * Math.max(40, (window.innerWidth - width - 8));
  const rotation = -12 + Math.random() * 24;
  const drift = -110 + Math.random() * 220;
  const duration = 7600 + Math.random() * 5200;
  const swayDelay = Math.random() * 1.2;

  card.style.width = `${width}px`;
  card.style.left = `${Math.max(4, left)}px`;
  card.style.setProperty("--rot", `${rotation}deg`);
  card.style.setProperty("--drift", `${drift}px`);
  card.style.animationDuration = `${duration}ms`;
  img.style.animationDelay = `${swayDelay}s`;
  caption.style.animationDelay = `${swayDelay}s`;

  card.appendChild(img);
  card.appendChild(caption);
  photosLayer.appendChild(card);

  setTimeout(() => card.remove(), duration + 300);
}

function startMemories() {
  if (memoryInterval) return;
  for (let i = 0; i < 5; i++) setTimeout(spawnMemoryPhoto, i * 320);
  memoryInterval = setInterval(spawnMemoryPhoto, 900);
}

function stopMemories() {
  if (memoryInterval) {
    clearInterval(memoryInterval);
    memoryInterval = null;
  }
}

setInterval(fallingHeart, 430);
for (let i = 0; i < 18; i++) setTimeout(fallingHeart, i * 120);

document.getElementById("openEnvelope").addEventListener("click", (event) => {
  const rect = event.currentTarget.getBoundingClientRect();
  burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 26);
  setTimeout(() => showScreen(screens.letter), 650);
});

document.getElementById("goToGift").addEventListener("click", (event) => {
  const rect = event.currentTarget.getBoundingClientRect();
  burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 24);
  setTimeout(() => {
    showScreen(screens.gift);
    startMemories();
  }, 560);
});

document.getElementById("openGift").addEventListener("click", (event) => {
  const gift = event.currentTarget;
  const stage = document.getElementById("giftStage");
  const certificate = document.getElementById("certificateWrap");
  const finalMessage = document.getElementById("finalMessage");

  if (gift.classList.contains("opened")) return;

  giftOpened = true;
  stopMemories();
  gift.classList.add("opened");
  stage.classList.add("revealed");

  const rect = gift.getBoundingClientRect();
  burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 55);

  setTimeout(() => {
    certificate.classList.add("visible");
    finalMessage.classList.add("visible");
    burst(window.innerWidth / 2, window.innerHeight * 0.36, 65);
  }, 650);
});

musicButton.addEventListener("click", async () => {
  if (!bgMusic.getAttribute("src")) {
    alert('Чтобы добавить музыку: положи файл music.mp3 рядом с index.html и в index.html укажи src="music.mp3" у тега audio.');
    return;
  }

  try {
    if (bgMusic.paused) {
      await bgMusic.play();
      musicButton.classList.add("playing");
    } else {
      bgMusic.pause();
      musicButton.classList.remove("playing");
    }
  } catch (e) {
    alert("Браузер не разрешил включить музыку автоматически. Попробуй нажать ещё раз.");
  }
});
