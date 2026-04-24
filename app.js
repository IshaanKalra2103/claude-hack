import { findBestResources, resources } from "./src/copilot.js";

const starterPrompts = [
  "I'm behind on rent and I might drop a class.",
  "I can't afford groceries this week and I need food fast.",
  "My anxiety is getting bad and I do not know who to contact.",
  "I missed First Look Fair and TerpLink feels disorganized. How do I find clubs now?",
  "I want to find creative or tech clubs and meet people, but I don't know where to start.",
];

const studentInput = document.querySelector("#studentInput");
const chatForm = document.querySelector("#chatForm");
const chatLog = document.querySelector("#chatLog");
const resourceList = document.querySelector("#resourceList");
const suggestions = document.querySelector("#suggestions");
const resourceCount = document.querySelector("#resourceCount");
const clearChatButton = document.querySelector("#clearChatButton");

renderStarterPrompts();
renderResourceList(resources);
resourceCount.textContent = `${resources.length} resources`;

appendAgentMessage(
  "Describe a UMD student situation. I can route hardship questions and club-discovery questions to the strongest official UMD resources."
);

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = studentInput.value.trim();

  if (!query) {
    return;
  }

  appendUserMessage(query);
  const result = findBestResources(query);
  appendAgentRecommendations(query, result);
  studentInput.value = "";
});

clearChatButton.addEventListener("click", () => {
  chatLog.innerHTML = "";
  appendAgentMessage(
    "Chat cleared. Enter a new student situation and I’ll return the best UMD resources for it."
  );
});

function renderStarterPrompts() {
  starterPrompts.forEach((prompt) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "prompt-chip";
    button.textContent = prompt;
    button.addEventListener("click", () => {
      studentInput.value = prompt;
      studentInput.focus();
    });
    suggestions.appendChild(button);
  });
}

function renderResourceList(items) {
  resourceList.innerHTML = "";

  items.forEach((resource) => {
    const article = document.createElement("article");
    article.className = "resource-card";
    article.innerHTML = `
      <h3>${resource.name}</h3>
      <p class="meta-line">${resource.office}</p>
      <p>${resource.summary}</p>
      <div class="tag-row">${resource.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>
      <p class="next-step"><strong>Next step:</strong> ${resource.nextStep}</p>
      <p class="next-step"><a class="source-link" href="${resource.url}" target="_blank" rel="noreferrer">Official UMD page</a></p>
    `;
    resourceList.appendChild(article);
  });
}

function appendUserMessage(text) {
  const message = document.createElement("article");
  message.className = "message message-user";
  message.innerHTML = `
    <div class="message-role">Student input</div>
    <p>${escapeHtml(text)}</p>
  `;
  chatLog.appendChild(message);
  scrollChatToBottom();
}

function appendAgentMessage(text) {
  const message = document.createElement("article");
  message.className = "message message-agent";
  message.innerHTML = `
    <div class="message-role">Copilot</div>
    <p>${escapeHtml(text)}</p>
  `;
  chatLog.appendChild(message);
  scrollChatToBottom();
}

function appendAgentRecommendations(query, result) {
  const message = document.createElement("article");
  message.className = "message message-agent";

  const intro = buildIntro(query, result);
  const answerCards = result.matches
    .map(
      ({ resource, reasons }) => `
        <article class="answer-card">
          <h3>${resource.name}</h3>
          <p class="meta-line">${resource.office}</p>
          <p>${resource.summary}</p>
          <div class="reason-row">${reasons.map((reason) => `<span class="reason">${reason}</span>`).join("")}</div>
          <p><strong>Next step:</strong> ${resource.nextStep}</p>
          <p class="next-step"><a class="source-link" href="${resource.url}" target="_blank" rel="noreferrer">Open official UMD page</a></p>
        </article>
      `
    )
    .join("");

  message.innerHTML = `
    <div class="message-role">Copilot</div>
    <p>${intro}</p>
    <div class="answer-list">${answerCards}</div>
    <p class="next-step"><strong>Need profile:</strong> ${result.detectedNeeds.join(", ") || "general support"}.</p>
  `;

  chatLog.appendChild(message);
  scrollChatToBottom();
}

function buildIntro(query, result) {
  if (result.priority === "critical") {
    return "This reads like an urgent situation. I’m prioritizing immediate-support resources first, then the best follow-up office.";
  }

  if (result.detectedNeeds.includes("clubs")) {
    return "This looks more like a discovery problem than a missing-interest problem, so I’m prioritizing category-based club browsing and human navigation support before the raw directory.";
  }

  if (result.detectedNeeds.length >= 3) {
    return "This looks like a multi-issue case, so I’m prioritizing offices that can coordinate across needs before listing narrower resources.";
  }

  if (query.toLowerCase().includes("drop a class")) {
    return "Because this includes a possible course withdrawal, I’m prioritizing support that bridges academic decisions and personal hardship.";
  }

  return "Here are the strongest UMD matches based on the needs signaled in the message.";
}

function escapeHtml(text) {
  const element = document.createElement("div");
  element.textContent = text;
  return element.innerHTML;
}

function scrollChatToBottom() {
  chatLog.scrollTop = chatLog.scrollHeight;
}
