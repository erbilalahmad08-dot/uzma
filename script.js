const letterElement = document.getElementById("letter");
const revealButton = document.getElementById("reveal-btn");
const bottomMessage = document.getElementById("bottom-message");
const heartsContainer = document.querySelector(".floating-hearts");
const yesButton = document.getElementById("yes-btn");
const noButton = document.getElementById("no-btn");
const canvas = document.getElementById("love-canvas");
const ctx = canvas.getContext("2d");

// Customize this with her actual name if you want:
// document.getElementById("her-name").textContent = "Uzma";

const letterText = `
It’s been more than a month since we met, but honestly, it feels like we’ve been together for so much longer.

You are too good, so understanding, so caring, and so special to me. With you, everything feels easier, warmer, and happier.

I love you so much, more than I can explain in words.

You are mine, and you are perfect just the way you are.

This little page is just a small way of saying how much you mean to me…
I love you, always. ❤️
`.trim();

let index = 0;
let isTyping = false;

function typeLetter() {
  if (isTyping) return;
  isTyping = true;

  const caret = letterElement.querySelector(".caret");
  if (caret) caret.remove();

  const typingSpeed = 32; // ms per character

  const interval = setInterval(() => {
    if (index >= letterText.length) {
      clearInterval(interval);
      isTyping = false;
      const endCaret = document.createElement("span");
      endCaret.className = "caret";
      letterElement.appendChild(endCaret);
      return;
    }

    const char = letterText[index];
    letterElement.textContent += char;
    index += 1;
  }, typingSpeed);
}

function createFloatingHearts() {
  const totalHearts = 20;
  for (let i = 0; i < totalHearts; i++) {
    const heart = document.createElement("div");
    heart.className = "floating-heart";
    heart.textContent = Math.random() > 0.6 ? "💖" : "❤";

    const startLeft = Math.random() * 100;
    const delay = Math.random() * -10;
    const duration = 10 + Math.random() * 6;
    const size = 14 + Math.random() * 18;

    heart.style.left = `${startLeft}vw`;
    heart.style.animationDelay = `${delay}s`;
    heart.style.animationDuration = `${duration}s`;
    heart.style.fontSize = `${size}px`;

    heartsContainer.appendChild(heart);
  }
}

// Canvas heart burst
let particles = [];
let canvasWidth = 0;
let canvasHeight = 0;

function resizeCanvas() {
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function createBurst(x, y, count = 80) {
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
    const speed = 1 + Math.random() * 4;
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 1,
      life: 1,
      size: 6 + Math.random() * 6,
      color:
        Math.random() > 0.5
          ? "rgba(255, 159, 194, 1)"
          : "rgba(255, 210, 127, 1)",
    });
  }
}

function drawHeart(x, y, size, color, alpha) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size / 16, size / 16);
  ctx.beginPath();
  ctx.moveTo(0, -4);
  ctx.bezierCurveTo(-8, -12, -16, 0, 0, 12);
  ctx.bezierCurveTo(16, 0, 8, -12, 0, -4);
  ctx.closePath();
  ctx.fillStyle = color.replace("1)", `${alpha})`);
  ctx.fill();
  ctx.restore();
}

function animate() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  particles = particles.filter((p) => p.life > 0.02);

  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.02;
    p.life *= 0.97;

    drawHeart(p.x, p.y, p.size, p.color, p.life);
  }

  requestAnimationFrame(animate);
}

animate();

revealButton.addEventListener("click", () => {
  typeLetter();
  bottomMessage.classList.add("visible");

  const rect = revealButton.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + window.scrollY;
  createBurst(x, y, 80);
});

function handleYesClick() {
  bottomMessage.classList.add("visible");
  const rect = yesButton.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + window.scrollY;
  // Big main burst at the Yes button
  createBurst(x, y, 220);

  // Extra bursts spread all over the screen
  for (let i = 0; i < 10; i++) {
    const randX = Math.random() * canvasWidth;
    const randY = Math.random() * canvasHeight * 0.8;
    createBurst(randX, randY, 120);
  }
}

if (yesButton && noButton) {
  yesButton.addEventListener("click", handleYesClick);

  noButton.addEventListener("mouseover", () => {
    const offsetX = (Math.random() - 0.5) * 140;
    const offsetY = (Math.random() - 0.5) * 60;
    noButton.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
  });

  noButton.addEventListener("click", (event) => {
    event.preventDefault();
    noButton.textContent = "Yes 😘";
    noButton.classList.remove("no");
    noButton.classList.add("yes");
    noButton.style.transform = "none";
    handleYesClick();
  });
}

window.addEventListener("load", () => {
  createFloatingHearts();
  setTimeout(() => {
    typeLetter();
  }, 1000);
});

