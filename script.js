const defaultName = "Sahabatku";
const defaultMessage = "Semoga hari-harimu selalu dipenuhi tawa, kesehatan, dan semua hal baik yang kamu impikan.";

const nameInput = document.querySelector("#nameInput");
const messageInput = document.querySelector("#messageInput");
const displayName = document.querySelector("#displayName");
const greetingText = document.querySelector("#greetingText");
const celebrateButton = document.querySelector("#celebrateButton");
const resetButton = document.querySelector("#resetButton");
const confetti = document.querySelector("#confetti");

function refreshGreeting() {
  displayName.textContent = nameInput.value.trim() || defaultName;
  greetingText.textContent = messageInput.value.trim() || defaultMessage;
}

function celebrate() {
  const colors = ["#ff5e92", "#7768d9", "#ffc55e", "#65cbdc", "#91d57f"];
  confetti.replaceChildren();

  for (let index = 0; index < 110; index += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.backgroundColor = colors[index % colors.length];
    piece.style.setProperty("--drift", `${Math.random() * 220 - 110}px`);
    piece.style.setProperty("--duration", `${1.7 + Math.random() * 1.4}s`);
    piece.style.animationDelay = `${Math.random() * .45}s`;
    confetti.append(piece);
  }

  celebrateButton.textContent = "Selamat bertambah usia! 🎉";
  window.setTimeout(() => {
    confetti.replaceChildren();
    celebrateButton.textContent = "Rayakan! ✨";
  }, 3600);
}

nameInput.addEventListener("input", refreshGreeting);
messageInput.addEventListener("input", refreshGreeting);
celebrateButton.addEventListener("click", celebrate);
resetButton.addEventListener("click", () => {
  nameInput.value = "";
  messageInput.value = "";
  refreshGreeting();
});
