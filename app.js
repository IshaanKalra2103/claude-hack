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
const resourceFilters = document.querySelector("#resourceFilters");
const journeyCards = document.querySelector("#journeyCards");
const spotlightTitle = document.querySelector("#spotlightTitle");
const spotlightOffice = document.querySelector("#spotlightOffice");
const spotlightSummary = document.querySelector("#spotlightSummary");
const spotlightTags = document.querySelector("#spotlightTags");
const spotlightLink = document.querySelector("#spotlightLink");

const journeyScenarios = [
  {
    title: "Basic-needs crisis",
    description: "Rent, food, stress, and academic risk all at once.",
    prompt: "I'm behind on rent, stressed out, and thinking about dropping a class.",
  },
  {
    title: "Find your people",
    description: "Actual clubs, not just a generic directory.",
    prompt: "I want creative or tech clubs where I can actually meet people and build things.",
  },
  {
    title: "Need legal help",
    description: "Landlord issues, contracts, or other student legal questions.",
    prompt: "My landlord is threatening fees and I need legal help.",
  },
  {
    title: "Missed the fair",
    description: "A second path into org discovery after First Look Fair.",
    prompt: "I missed First Look Fair and TerpLink feels disorganized. Help me find clubs now.",
  },
];

let activeFilter = "all";

renderStarterPrompts();
renderJourneyCards();
renderResourceList(resources);
updateResourceCount(resources);
setSpotlight(resources[0]);

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

resourceFilters.addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;

  activeFilter = button.dataset.filter;
  [...resourceFilters.querySelectorAll(".filter-chip")].forEach((chip) => {
    chip.classList.toggle("is-active", chip === button);
  });

  const filtered = getFilteredResources(activeFilter);
  renderResourceList(filtered);
  updateResourceCount(filtered);
  setSpotlight(filtered[0] || resources[0]);
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

function renderJourneyCards() {
  journeyScenarios.forEach((scenario) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "journey-card";
    card.innerHTML = `
      <strong>${scenario.title}</strong>
      <p>${scenario.description}</p>
      <span>Load scenario</span>
    `;
    card.addEventListener("click", () => {
      studentInput.value = scenario.prompt;
      studentInput.focus();
      studentInput.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    journeyCards.appendChild(card);
  });
}

function renderResourceList(items) {
  resourceList.innerHTML = "";

  items.forEach((resource) => {
    const article = document.createElement("article");
    article.className = "resource-card";
    article.tabIndex = 0;
    article.innerHTML = `
      <h3>${resource.name}</h3>
      <p class="meta-line">${resource.office}</p>
      <p>${resource.summary}</p>
      <div class="tag-row">${resource.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>
      <p class="next-step"><strong>Next step:</strong> ${resource.nextStep}</p>
      <p class="next-step"><a class="source-link" href="${resource.url}" target="_blank" rel="noreferrer">Official UMD page</a></p>
    `;
    article.addEventListener("mouseenter", () => setSpotlight(resource));
    article.addEventListener("focus", () => setSpotlight(resource));
    resourceList.appendChild(article);
  });
}

function getFilteredResources(filter) {
  if (filter === "all") return resources;
  if (filter === "clubs") return resources.filter((resource) => resource.tags.includes("clubs"));
  if (filter === "live") return resources.filter((resource) => resource.id.startsWith("live-"));
  if (filter === "support") return resources.filter((resource) => !resource.tags.includes("clubs"));
  return resources;
}

function updateResourceCount(items) {
  resourceCount.textContent = `${items.length} resources`;
}

function setSpotlight(resource) {
  if (!resource) return;
  spotlightTitle.textContent = resource.name;
  spotlightOffice.textContent = resource.office;
  spotlightSummary.textContent = resource.summary;
  spotlightLink.href = resource.url;
  spotlightLink.textContent = "Open official page";
  spotlightTags.innerHTML = (resource.tags || []).slice(0, 5).map((tag) => `<span class="tag">${tag}</span>`).join("");
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
