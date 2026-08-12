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
  const colors = [
    "#ff5e92",
    "#7768d9",
    "#ffc55e",
    "#65cbdc",
    "#91d57f"
  ];

  confetti.replaceChildren();

  // =========================================
  // 🎊 CONFETTI
  // =========================================

  for (let index = 0; index < 110; index += 1) {
    const piece = document.createElement("span");

    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.backgroundColor = colors[index % colors.length];
    piece.style.setProperty(
      "--drift",
      `${Math.random() * 220 - 110}px`
    );
    piece.style.setProperty(
      "--duration",
      `${1.7 + Math.random() * 1.4}s`
    );
    piece.style.animationDelay = `${Math.random() * 0.45}s`;

    confetti.append(piece);
  }

  // =========================================
  // 🎂 EFEK KUE
  // =========================================

  const cake = document.querySelector(".cake");

  if (cake) {
    cake.classList.remove("celebrating");

    // Memastikan animasi dapat dimainkan ulang
    void cake.offsetWidth;

    cake.classList.add("celebrating");

    window.setTimeout(() => {
      cake.classList.remove("celebrating");
    }, 1300);
  }

  // =========================================
  // 🌸 TAMBAH SAKURA SEMENTARA
  // =========================================

  if (typeof createSakura === "function") {
    for (let index = 0; index < 12; index += 1) {
      window.setTimeout(() => {
        createSakura();
      }, index * 100);
    }
  }

  // =========================================
  // ✨ PESAN JEPANG
  // =========================================

  const oldMessage =
    document.querySelector(".celebration-message");

  if (oldMessage) {
    oldMessage.remove();
  }

  const celebrationMessage =
    document.createElement("div");

  celebrationMessage.className =
    "celebration-message";

  const japaneseText =
    document.createElement("span");

  japaneseText.textContent =
    "お誕生日おめでとう！";

  const englishText =
    document.createElement("small");

  englishText.textContent =
    "Happy Birthday, Jiddan ✨";

  celebrationMessage.append(
    japaneseText,
    englishText
  );

  document.body.appendChild(
    celebrationMessage
  );

  window.setTimeout(() => {
    celebrationMessage.remove();
  }, 3000);

  // =========================================
  // ✨ EFEK FLASH
  // =========================================

  document.body.classList.remove("celebrating");

  void document.body.offsetWidth;

  document.body.classList.add("celebrating");

  window.setTimeout(() => {
    document.body.classList.remove("celebrating");
  }, 900);

  // =========================================
  // 🔘 TOMBOL
  // =========================================

  celebrateButton.textContent =
    "Selamat bertambah usia! ✨";

  celebrateButton.disabled = true;

  window.setTimeout(() => {
    confetti.replaceChildren();

    celebrateButton.textContent =
      "Rayakan! ✨";

    celebrateButton.disabled = false;
  }, 3600);
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

const DONATION_LEADERBOARD_API =
  "https://script.google.com/macros/s/AKfycbyxsiFQeBx7chKa3fOm0q7dfK9uP5reLzaU_X-CZlTN7RRkR4BJxFxAt7Lnzjl3xc08/exec";

function renderDonationLeaderboard(payload) {
  const list = document.getElementById("donationLeaderboard");
  const donors = Array.isArray(payload?.items) ? payload.items : [];

  list.replaceChildren();

  if (!donors.length) {
    const empty = document.createElement("li");
    empty.className = "leaderboard-empty";
    empty.textContent = "Belum ada hadiah. Jadilah support pertama! ✨";
    list.append(empty);
    return;
  }

  donors.forEach((donor, index) => {
    const item = document.createElement("li");
    item.className = "leaderboard-item";

    const rank = document.createElement("span");
    rank.className = "leaderboard-rank";
    rank.textContent = `#${index + 1}`;

    const info = document.createElement("div");
    info.className = "leaderboard-info";

    const name = document.createElement("strong");
    name.textContent = donor.name;

    const message = document.createElement("span");
    message.textContent = donor.message || "Terima kasih atas dukungannya!";

    const amount = document.createElement("b");
    amount.className = "leaderboard-amount";
    amount.textContent = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(donor.total);

    info.append(name, message);
    item.append(rank, info, amount);
    list.append(item);
  });
}

function loadDonationLeaderboard() {
  const oldScript = document.getElementById("donationLeaderboardLoader");
  if (oldScript) oldScript.remove();

  const script = document.createElement("script");
  script.id = "donationLeaderboardLoader";
  script.src =
    `${DONATION_LEADERBOARD_API}?mode=leaderboard` +
    `&callback=renderDonationLeaderboard&t=${Date.now()}`;

  script.onerror = () => {
    const list = document.getElementById("donationLeaderboard");
    list.textContent = "Leaderboard belum dapat dimuat.";
  };

  document.head.append(script);
}

loadDonationLeaderboard();
setInterval(loadDonationLeaderboard, 30000);

window.addEventListener("load", () => {
  setTimeout(() => {
    const leaderboard = document.getElementById("leaderboard-title");

    if (leaderboard) {
      leaderboard.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }
  }, 1500);
});
// =========================================
// 🌸 SAKURA FALLING
// =========================================

function createSakura() {
  let container = document.querySelector(".sakura-container");

  if (!container) {
    container = document.createElement("div");
    container.className = "sakura-container";
    container.setAttribute("aria-hidden", "true");
    document.body.appendChild(container);
  }

  const petal = document.createElement("span");
  petal.className = "sakura-petal";

  const size = Math.random() * 8 + 8;
  const duration = Math.random() * 7 + 8;
  const swayDuration = Math.random() * 2 + 2;
  const left = Math.random() * 100;
  const delay = Math.random() * -10;

  petal.style.left = `${left}%`;
  petal.style.width = `${size}px`;
  petal.style.height = `${size * 1.45}px`;
  petal.style.animationDuration = `${duration}s, ${swayDuration}s`;
  petal.style.animationDelay = `${delay}s, 0s`;
  petal.style.opacity = `${Math.random() * 0.35 + 0.45}`;

  container.appendChild(petal);

  setTimeout(() => {
    petal.remove();
  }, (duration + 2) * 1000);
}

function startSakura() {
  // Membuat 15 kelopak awal
  for (let i = 0; i < 15; i++) {
    createSakura();
  }

  // Menambahkan kelopak secara berkala
  setInterval(() => {
    createSakura();
  }, 700);
}

startSakura();
