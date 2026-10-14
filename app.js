// CyberSafe Toolkit — local-only educational security helpers.
"use strict";

const passwordInput = document.querySelector("#passwordInput");
const togglePassword = document.querySelector("#togglePassword");
const strengthBar = document.querySelector("#strengthBar");
const strengthLabel = document.querySelector("#strengthLabel");
const lengthLabel = document.querySelector("#lengthLabel");
const passwordFeedback = document.querySelector("#passwordFeedback");

togglePassword.addEventListener("click", () => {
  const showing = passwordInput.type === "text";
  passwordInput.type = showing ? "password" : "text";
  togglePassword.textContent = showing ? "Show" : "Hide";
});

passwordInput.addEventListener("input", () => {
  // The password is evaluated in memory only. It is never stored or transmitted.
  const password = passwordInput.value;
  const checks = [
    { ok: password.length >= 12, text: "Use at least 12 characters; longer is generally better." },
    { ok: /[a-z]/.test(password) && /[A-Z]/.test(password), text: "Mix uppercase and lowercase letters if practical." },
    { ok: /\d/.test(password), text: "Consider including a number." },
    { ok: /[^A-Za-z0-9]/.test(password), text: "Consider a symbol or use a longer passphrase." },
    { ok: !/(password|qwerty|123456|letmein|admin)/i.test(password), text: "Avoid common words and predictable patterns." }
  ];
  const score = checks.filter(item => item.ok).length;
  const labels = ["Very weak", "Weak", "Fair", "Good", "Strong", "Strong"];
  const colors = ["#ff858e", "#ff858e", "#ffd782", "#ffd782", "#71f0c1", "#71f0c1"];

  strengthBar.style.width = password.length ? `${Math.max(8, score * 20)}%` : "0";
  strengthBar.style.background = colors[score];
  strengthLabel.textContent = password.length ? labels[score] : "Not checked";
  lengthLabel.textContent = `${password.length} character${password.length === 1 ? "" : "s"}`;

  passwordFeedback.replaceChildren();
  const suggestions = checks.filter(item => !item.ok).map(item => item.text);
  if (!password) {
    addListItem(passwordFeedback, "Enter a made-up password to see suggestions.");
  } else if (suggestions.length === 0) {
    addListItem(passwordFeedback, "Good basics. A password-strength estimate cannot guarantee safety.");
    addListItem(passwordFeedback, "Make it unique for every account and consider a password manager.");
  } else {
    suggestions.forEach(text => addListItem(passwordFeedback, text));
  }
});

function addListItem(list, text) {
  const li = document.createElement("li");
  li.textContent = text;
  list.appendChild(li);
}

// This function parses URL text only. It does not make a network request.
const urlInput = document.querySelector("#urlInput");
const checkUrl = document.querySelector("#checkUrl");
const urlResult = document.querySelector("#urlResult");

checkUrl.addEventListener("click", analyzeUrl);
urlInput.addEventListener("keydown", event => {
  if (event.key === "Enter") analyzeUrl();
});

function analyzeUrl() {
  const raw = urlInput.value.trim();
  urlResult.className = "result-box";
  urlResult.replaceChildren();

  if (!raw) {
    showUrlResult("Enter a URL first", "Please type a URL such as https://example.com.", "warning");
    return;
  }

  let parsed;
  try {
    // Accept a hostname without a scheme for educational convenience.
    parsed = new URL(/^[a-zA-Z][a-zA-Z\d+.-]*:/.test(raw) ? raw : `https://${raw}`);
  } catch {
    showUrlResult("Could not parse this URL", "Check for spaces or invalid URL characters. Do not open an unknown link just to test it.", "warning");
    return;
  }

  const flags = [];
  const host = parsed.hostname.toLowerCase();
  const full = `${parsed.hostname}${parsed.pathname}${parsed.search}`.toLowerCase();

  if (parsed.protocol !== "https:") flags.push("It does not use HTTPS. This alone does not prove a site is malicious.");
  if (parsed.username || parsed.password) flags.push("The URL contains user-info before the host, which can be used to disguise the destination.");
  if (host.startsWith("xn--") || host.includes(".xn--")) flags.push("The hostname contains an internationalized/punycode label. Check for look-alike characters.");
  if (host.split(".").length >= 5) flags.push("The hostname has many subdomain levels. Check the actual registered domain carefully.");
  if (/(\d{1,3}\.){3}\d{1,3}/.test(host)) flags.push("The hostname appears to be an IP address rather than a familiar domain.");
  if (host.includes("-") && /(login|verify|secure|account|update|support)/.test(host)) flags.push("A hyphenated hostname with account-related words can be a clue to inspect carefully.");
  if (/(login|verify|password|wallet|payment|urgent|account|reset)/.test(full)) flags.push("The URL contains words often used on sign-in or urgent-action pages. Context matters.");
  if (raw.length > 120) flags.push("The URL is unusually long. Long URLs can hide the destination or add confusing parameters.");
  if (parsed.port && !["80", "443"].includes(parsed.port)) flags.push("The URL uses a non-standard web port. This can be legitimate, but check why.");

  const title = flags.length ? `${flags.length} warning clue${flags.length === 1 ? "" : "s"} found` : "No obvious clue found";
  showUrlResult(title, flags.length ? "These are clues, not proof. Review them carefully:" : "This simple checker found no configured warning clues. That does NOT mean the site is safe.", flags.length ? "warning" : "safe", flags);
}

function showUrlResult(title, description, kind, flags = []) {
  urlResult.className = `result-box ${kind}`;
  const heading = document.createElement("strong");
  heading.textContent = title;
  const paragraph = document.createElement("p");
  paragraph.textContent = description;
  urlResult.append(heading, paragraph);
  if (flags.length) {
    const ul = document.createElement("ul");
    flags.forEach(flag => addListItem(ul, flag));
    urlResult.appendChild(ul);
  }
}

// Quiz answers are educational examples, not a formal security certification.
const questions = [
  {
    q: "You receive an unexpected email asking you to sign in through a link. What is the safest first move?",
    options: ["Click quickly before the link expires", "Open the service using its official app or a saved bookmark", "Reply with your password to confirm your account"],
    answer: 1,
    why: "Avoid unexpected sign-in links. Open the service independently and check the message through a trusted channel."
  },
  {
    q: "Which password habit is safest?",
    options: ["Reuse one strong password everywhere", "Use your birthday with a symbol", "Use a unique, long password for each account"],
    answer: 2,
    why: "Unique passwords limit damage if one service suffers a breach. A password manager can help."
  },
  {
    q: "What does the padlock/HTTPS indicator guarantee?",
    options: ["The website is honest", "The connection is encrypted, but the site could still be a scam", "The website has no malware"],
    answer: 1,
    why: "HTTPS protects the connection; it does not prove the site owner is trustworthy."
  },
  {
    q: "A stranger asks for a one-time verification code. What should you do?",
    options: ["Share it if they know your name", "Post it in the chat so support can see it", "Never share it; verify the request using an official channel"],
    answer: 2,
    why: "One-time codes can let someone access your account. Do not share them with other people."
  }
];

let questionIndex = 0;
let score = 0;
let answered = false;
const quizArea = document.querySelector("#quizArea");
const quizFeedback = document.querySelector("#quizFeedback");
const scorePill = document.querySelector("#scorePill");
const nextQuestion = document.querySelector("#nextQuestion");

function renderQuestion() {
  answered = false;
  const item = questions[questionIndex];
  quizArea.replaceChildren();

  const title = document.createElement("p");
  title.className = "quiz-question";
  title.textContent = `${questionIndex + 1}. ${item.q}`;
  quizArea.appendChild(title);

  item.options.forEach((option, index) => {
    const label = document.createElement("label");
    label.className = "answer-option";
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "quiz-answer";
    radio.value = String(index);
    radio.addEventListener("change", () => {
      document.querySelectorAll(".answer-option").forEach(el => el.classList.remove("selected"));
      label.classList.add("selected");
    });
    const span = document.createElement("span");
    span.textContent = option;
    label.append(radio, span);
    quizArea.appendChild(label);
  });

  quizFeedback.textContent = `Question ${questionIndex + 1} of ${questions.length}`;
  nextQuestion.textContent = "Check answer";
  scorePill.textContent = `Score: ${score}/${questions.length}`;
}

nextQuestion.addEventListener("click", () => {
  if (answered) {
    if (questionIndex < questions.length - 1) {
      questionIndex += 1;
      renderQuestion();
    } else {
      questionIndex = 0;
      score = 0;
      renderQuestion();
      quizFeedback.textContent = "Quiz restarted. Give it another try!";
    }
    return;
  }

  const selected = document.querySelector('input[name="quiz-answer"]:checked');
  if (!selected) {
    quizFeedback.textContent = "Choose an answer first.";
    return;
  }

  answered = true;
  const item = questions[questionIndex];
  const correct = Number(selected.value) === item.answer;
  if (correct) score += 1;
  quizFeedback.textContent = `${correct ? "Correct!" : "Not quite."} ${item.why}`;
  scorePill.textContent = `Score: ${score}/${questions.length}`;
  nextQuestion.textContent = questionIndex < questions.length - 1 ? "Next question" : "Try again";
  document.querySelectorAll('input[name="quiz-answer"]').forEach(radio => { radio.disabled = true; });
});

renderQuestion();
