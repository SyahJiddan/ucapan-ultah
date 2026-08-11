const defaultMessage = "Semoga hari-harimu selalu dipenuhi tawa, kesehatan, dan semua hal baik yang kamu impikan.";
const commentsApiUrl = "https://script.google.com/macros/s/AKfycbz77qobUZUcLfdsAL-YFTerNdnN5ewl284RPB58wujHABfbq82zg3WLmdcvfDLSSLt9/exec";

const nameInput = document.querySelector("#nameInput");
const messageInput = document.querySelector("#messageInput");
const greetingText = document.querySelector("#greetingText");
const celebrateButton = document.querySelector("#celebrateButton");
const resetButton = document.querySelector("#resetButton");
const confetti = document.querySelector("#confetti");
const commentForm = document.querySelector("#commentForm");
const commentButton = document.querySelector("#commentButton");
const commentList = document.querySelector("#commentList");
const commentStatus = document.querySelector("#commentStatus");
let comments = [];

function refreshGreeting() {
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

  celebrateButton.textContent = "Selamat bertambah usia!";
  window.setTimeout(() => {
    confetti.replaceChildren();
    celebrateButton.textContent = "Rayakan!";
  }, 3600);
}

function makeCommentCard(comment) {
  const card = document.createElement("article");
  card.className = "comment-card";

  const header = document.createElement("div");
  header.className = "comment-card-header";
  const author = document.createElement("p");
  author.className = "comment-author";
  author.textContent = comment.name || "Teman";
  const time = document.createElement("time");
  time.className = "comment-time";
  time.textContent = comment.time || "Baru saja";
  header.append(author, time);

  const message = document.createElement("p");
  message.className = "comment-message";
  message.textContent = comment.message || "";
  card.append(header, message);
  return card;
}

function renderComments() {
  commentList.replaceChildren();
  if (!comments.length) {
    const empty = document.createElement("p");
    empty.className = "empty-comments";
    empty.textContent = "Jadilah yang pertama menulis ucapan!";
    commentList.append(empty);
    return;
  }
  comments.forEach((comment) => commentList.append(makeCommentCard(comment)));
}

function loadComments() {
  const callbackName = `birthdayComments${Date.now()}`;
  const jsonpScript = document.createElement("script");
  const timeoutId = window.setTimeout(failedToLoad, 7000);

  function cleanup() {
    window.clearTimeout(timeoutId);
    jsonpScript.remove();
    delete window[callbackName];
  }

  function failedToLoad() {
    cleanup();
    commentStatus.textContent = "Ucapan belum dapat dimuat.";
    renderComments();
  }

  window[callbackName] = (data) => {
    cleanup();
    comments = Array.isArray(data.comments) ? data.comments : [];
    commentStatus.textContent = comments.length ? `${comments.length} ucapan tersimpan` : "Belum ada ucapan";
    renderComments();
  };

  jsonpScript.onerror = failedToLoad;
  jsonpScript.src = `${commentsApiUrl}?callback=${callbackName}&v=${Date.now()}`;
  document.body.append(jsonpScript);
}

messageInput.addEventListener("input", refreshGreeting);
celebrateButton.addEventListener("click", celebrate);
resetButton.addEventListener("click", () => {
  commentForm.reset();
  refreshGreeting();
});

commentForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = nameInput.value.trim();
  const message = messageInput.value.trim();
  if (!name || !message) return;

  commentButton.disabled = true;
  commentButton.textContent = "Mengirim...";
  commentForm.submit();

  comments.unshift({ name, message, time: "Baru saja" });
  renderComments();
  commentStatus.textContent = "Komentar berhasil dikirim.";
  messageInput.value = "";
  refreshGreeting();

  window.setTimeout(() => {
    commentButton.disabled = false;
    commentButton.textContent = "Kirim komentar";
  }, 900);
});

loadComments();
