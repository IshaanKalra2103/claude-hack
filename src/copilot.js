import { liveResources } from "./live-resources.js";

const clubResources = [
  {
    id: "club-competitive-programming",
    kind: "club",
    name: "Competitive Programming Club",
    office: "Student Organization",
    summary: "Good fit for students who want algorithms, coding interview practice, and programming contests.",
    tags: ["clubs", "community", "tech"],
    interests: ["coding", "algorithms", "interview prep", "leetcode", "competitive programming", "computer science"],
    keywords: ["coding", "algorithms", "leetcode", "competitive programming", "interview", "cs"],
    urgency: "low",
    nextStep: "Open the org page and use the TerpLink join flow or contact the listed officers.",
    reasonTemplate: "Specific tech club match.",
    url: "https://terplink.umd.edu/organization/competitive-programming-club",
  },
  {
    id: "club-app-dev",
    kind: "club",
    name: "App Dev Club",
    office: "Student Organization",
    summary: "Good fit for students who want to build apps, ship projects, and work with other developers.",
    tags: ["clubs", "community", "tech", "build"],
    interests: ["coding", "app development", "mobile", "software", "projects", "startup"],
    keywords: ["app", "mobile", "software", "projects", "build", "coding"],
    urgency: "low",
    nextStep: "Open the org page and join or message the club directly.",
    reasonTemplate: "Specific build-oriented tech club match.",
    url: "https://terplink.umd.edu/organization/app-dev-club",
  },
  {
    id: "club-cybersecurity",
    kind: "club",
    name: "Cybersecurity Club",
    office: "Student Organization",
    summary: "Good fit for students interested in security, CTFs, ethical hacking, and systems.",
    tags: ["clubs", "community", "tech", "security"],
    interests: ["cybersecurity", "security", "ctf", "hacking", "networking", "systems"],
    keywords: ["cyber", "security", "ctf", "hacking", "network", "systems"],
    urgency: "low",
    nextStep: "Open the org page and look for join information or officer contact details.",
    reasonTemplate: "Specific cybersecurity club match.",
    url: "https://terplink.umd.edu/organization/cybersecurity-club",
  },
  {
    id: "club-game-dev",
    kind: "club",
    name: "Game Developers Club",
    office: "Student Organization",
    summary: "Good fit for students interested in game design, development, art pipelines, and collaborative creative tech work.",
    tags: ["clubs", "community", "tech", "creative"],
    interests: ["games", "game development", "design", "creative coding", "art", "programming"],
    keywords: ["game", "games", "unity", "design", "creative", "art"],
    urgency: "low",
    nextStep: "Open the org page and use the club contact or join path there.",
    reasonTemplate: "Specific game development club match.",
    url: "https://terplink.umd.edu/organization/game-developers-club",
  },
  {
    id: "club-xr",
    kind: "club",
    name: "XR Club",
    office: "Student Organization",
    summary: "Good fit for students interested in AR, VR, immersive tech, and experimental interactive work.",
    tags: ["clubs", "community", "tech", "creative"],
    interests: ["xr", "vr", "ar", "immersive tech", "design", "creative tech"],
    keywords: ["xr", "vr", "ar", "immersive", "creative tech"],
    urgency: "low",
    nextStep: "Open the org page to see current club contacts and join details.",
    reasonTemplate: "Specific XR club match.",
    url: "https://terplink.umd.edu/organization/xr-club",
  },
  {
    id: "club-homelab",
    kind: "club",
    name: "Homelab Club",
    office: "Student Organization",
    summary: "Good fit for students interested in servers, systems, infrastructure, networking, and self-hosting.",
    tags: ["clubs", "community", "tech", "systems"],
    interests: ["systems", "infrastructure", "servers", "networking", "homelab", "self-hosting"],
    keywords: ["systems", "infrastructure", "servers", "networking", "homelab"],
    urgency: "low",
    nextStep: "Open the org page and follow the join instructions there.",
    reasonTemplate: "Specific systems club match.",
    url: "https://terplink.umd.edu/organization/homelab-club",
  },
  {
    id: "club-technica",
    kind: "club",
    name: "Technica",
    office: "Student Organization",
    summary: "Good fit for students looking for a large hackathon and an inclusive builder community around tech and product work.",
    tags: ["clubs", "community", "tech", "events"],
    interests: ["hackathon", "tech community", "building", "product", "design", "engineering"],
    keywords: ["hackathon", "build", "product", "design", "engineering"],
    urgency: "low",
    nextStep: "Open the org page and follow the club links for involvement and events.",
    reasonTemplate: "Specific hackathon/community match.",
    url: "https://terplink.umd.edu/organization/technica-hacks",
  },
  {
    id: "club-code-black",
    kind: "club",
    name: "Code Black",
    office: "Student Organization",
    summary: "Good fit for students looking for community in tech with a strong identity and belonging angle.",
    tags: ["clubs", "community", "tech", "belonging"],
    interests: ["tech community", "belonging", "coding", "support network", "identity-based community"],
    keywords: ["community", "belonging", "coding", "support"],
    urgency: "low",
    nextStep: "Open the org page and use the listed contact or join path.",
    reasonTemplate: "Specific belonging-oriented tech community match.",
    url: "https://terplink.umd.edu/organization/code-black",
  },
  {
    id: "club-ostem",
    kind: "club",
    name: "oSTEM at UMD",
    office: "Student Organization",
    summary: "Good fit for LGBTQ+ students in STEM looking for community, mentorship, and belonging.",
    tags: ["clubs", "community", "tech", "belonging"],
    interests: ["lgbtq", "stem", "belonging", "community", "support network"],
    keywords: ["lgbtq", "stem", "community", "belonging"],
    urgency: "low",
    nextStep: "Open the org page and use the join flow or officer contact details.",
    reasonTemplate: "Specific STEM belonging/community match.",
    url: "https://terplink.umd.edu/organization/umd-ostem",
  },
  {
    id: "club-student-art-league",
    kind: "club",
    name: "Student Art League",
    office: "Student Organization",
    summary: "Good fit for students interested in visual art, making, exhibitions, and creative community.",
    tags: ["clubs", "community", "creative", "art"],
    interests: ["art", "visual art", "drawing", "painting", "creative community"],
    keywords: ["art", "drawing", "painting", "visual", "creative"],
    urgency: "low",
    nextStep: "Open the org page and follow the join or contact path.",
    reasonTemplate: "Specific visual arts club match.",
    url: "https://terplink.umd.edu/organization/studentartleague",
  },
  {
    id: "club-terpoets",
    kind: "club",
    name: "Terpoets",
    office: "Student Organization",
    summary: "Good fit for students interested in poetry, writing, spoken word, and literary community.",
    tags: ["clubs", "community", "creative", "writing"],
    interests: ["poetry", "writing", "spoken word", "literary community", "creative writing"],
    keywords: ["poetry", "writing", "spoken word", "literary"],
    urgency: "low",
    nextStep: "Open the org page and use the listed contact or join flow.",
    reasonTemplate: "Specific writing/poetry club match.",
    url: "https://terplink.umd.edu/organization/terpoets",
  },
  {
    id: "club-music-experimentation",
    kind: "club",
    name: "The Music Experimentation Club",
    office: "Student Organization",
    summary: "Good fit for students interested in music creation, production, experimentation, and creative collaboration.",
    tags: ["clubs", "community", "creative", "music"],
    interests: ["music", "music production", "creative collaboration", "audio", "performance"],
    keywords: ["music", "audio", "production", "performance"],
    urgency: "low",
    nextStep: "Open the org page and follow the join instructions there.",
    reasonTemplate: "Specific music club match.",
    url: "https://terplink.umd.edu/organization/the-music-experimentation-club",
  },
  {
    id: "club-swing-dance",
    kind: "club",
    name: "Swing Dance Club at UMD",
    office: "Student Organization",
    summary: "Good fit for students who want a social, beginner-friendly movement community and regular events.",
    tags: ["clubs", "community", "creative", "dance"],
    interests: ["dance", "social", "community", "movement", "events"],
    keywords: ["dance", "social", "movement", "events"],
    urgency: "low",
    nextStep: "Open the org page and look for current meeting or contact information.",
    reasonTemplate: "Specific dance club match.",
    url: "https://terplink.umd.edu/organization/swing-dance-club-at-UMD",
  },
  {
    id: "club-student-dance-association",
    kind: "club",
    name: "Student Dance Association",
    office: "Student Organization",
    summary: "Good fit for students interested in dance performance, rehearsals, and a creative social group.",
    tags: ["clubs", "community", "creative", "dance"],
    interests: ["dance", "performance", "creative community", "movement"],
    keywords: ["dance", "performance", "movement"],
    urgency: "low",
    nextStep: "Open the org page to find join and event details.",
    reasonTemplate: "Specific performance dance club match.",
    url: "https://terplink.umd.edu/organization/student-dance-association",
  },
  {
    id: "club-terps-racing",
    kind: "club",
    name: "Terps Racing",
    office: "Student Organization",
    summary: "Good fit for students interested in hands-on engineering, vehicles, fabrication, and team-based building.",
    tags: ["clubs", "community", "engineering", "build"],
    interests: ["engineering", "cars", "mechanical", "fabrication", "design", "building"],
    keywords: ["engineering", "cars", "mechanical", "fabrication", "design"],
    urgency: "low",
    nextStep: "Open the org page and use the club contact or join information there.",
    reasonTemplate: "Specific engineering build-team match.",
    url: "https://terplink.umd.edu/organization/terps-racing",
  },
  {
    id: "club-juggling",
    kind: "club",
    name: "Juggling Club",
    office: "Student Organization",
    summary: "Good fit for students who want a quirky, low-pressure social club and a fun skill-based community.",
    tags: ["clubs", "community", "social"],
    interests: ["social", "fun", "casual", "community", "performance"],
    keywords: ["social", "fun", "casual", "performance"],
    urgency: "low",
    nextStep: "Open the org page and check the current meeting details.",
    reasonTemplate: "Specific casual/social club match.",
    url: "https://terplink.umd.edu/organization/juggling-club",
  },
  {
    id: "club-rubiks-cube",
    kind: "club",
    name: "Rubik's Cube Club",
    office: "Student Organization",
    summary: "Good fit for students who want a casual problem-solving community with a specific hobby focus.",
    tags: ["clubs", "community", "social"],
    interests: ["puzzles", "casual", "problem solving", "hobby", "community"],
    keywords: ["puzzles", "casual", "hobby", "problem solving"],
    urgency: "low",
    nextStep: "Open the org page and use the join or contact path there.",
    reasonTemplate: "Specific hobby club match.",
    url: "https://terplink.umd.edu/organization/rubiks-cube-club",
  },
];

const baseResources = [
  {
    id: "thrive-center",
    name: "Thrive Center for Essential Needs",
    office: "Dean of Students Office",
    summary:
      "Central entry point for food, housing, finance, well-being, and first-gen support. Best first stop when a student is juggling multiple basic-needs problems at once.",
    tags: ["basic-needs", "food", "housing", "finances", "wellbeing", "first-gen", "triage"],
    keywords: [
      "rent",
      "housing",
      "food",
      "groceries",
      "money",
      "struggling",
      "behind",
      "first gen",
      "first-generation",
      "don't know where to start",
      "support",
    ],
    urgency: "high",
    nextStep: "Submit the Thrive support request or contact the Dean of Students office for a consultation.",
    reasonTemplate: "Best umbrella support when the student has overlapping basic-needs concerns.",
    url: "https://studentaffairs.umd.edu/support-resources/thrive-center-for-essential-needs",
  },
  {
    id: "campus-pantry",
    name: "Campus Pantry",
    office: "Division of Student Affairs",
    summary:
      "Emergency food resource for UMD students, faculty, and staff experiencing food insecurity.",
    tags: ["food", "basic-needs", "emergency", "groceries"],
    keywords: ["food", "hungry", "groceries", "meal", "pantry", "can't afford food"],
    urgency: "high",
    nextStep: "Visit the pantry page for current hours and go to South Campus Dining Hall during open hours.",
    reasonTemplate: "Strong fit for immediate food insecurity.",
    url: "https://studentaffairs.umd.edu/support-resources/dean-students/campus-pantry",
  },
  {
    id: "emergency-meal-swipes",
    name: "Emergency Meal Swipes",
    office: "Thrive Center for Essential Needs",
    summary:
      "Short-term dining hall meal support for undergraduate students facing food insecurity or an economic emergency.",
    tags: ["food", "basic-needs", "emergency", "undergraduate"],
    keywords: ["meal", "swipes", "food", "dining hall", "can't eat", "undergrad"],
    urgency: "high",
    nextStep: "Use the Thrive Center food page to check eligibility and request emergency meal support.",
    reasonTemplate: "Useful when the student needs fast access to meals rather than general food assistance.",
    url: "https://studentaffairs.umd.edu/thrive-center-essential-needs/food",
  },
  {
    id: "housing-support",
    name: "Housing Support and Emergency Housing Pathway",
    office: "Thrive Center for Essential Needs",
    summary:
      "Support for housing insecurity, homelessness, emergency housing questions, and navigation of on-campus and off-campus options.",
    tags: ["housing", "basic-needs", "emergency", "homelessness"],
    keywords: ["rent", "eviction", "housing", "couch surfing", "homeless", "roommate", "shelter"],
    urgency: "high",
    nextStep: "Submit the Thrive Center Assistance Form to be assessed for emergency housing and case management.",
    reasonTemplate: "Best fit when the student may lose housing or does not have a stable place to stay.",
    url: "https://studentaffairs.umd.edu/thrive-center-essential-needs/housing",
  },
  {
    id: "financial-wellness",
    name: "Financial Wellness and Emergency Grants",
    office: "Thrive Center for Essential Needs",
    summary:
      "Connects students to financial wellness coaching, emergency grant information, aid appeals, and employment guidance.",
    tags: ["finances", "basic-needs", "budgeting", "emergency"],
    keywords: ["money", "bills", "budget", "tuition", "can't pay", "financial", "debt"],
    urgency: "medium",
    nextStep: "Start on the finances page to find emergency funding, coaching, and aid navigation options.",
    reasonTemplate: "Useful for money stress that is broader than one bill or one office.",
    url: "https://studentaffairs.umd.edu/thrive-center-essential-needs/finances",
  },
  {
    id: "student-financial-aid",
    name: "Office of Student Financial Aid",
    office: "Office of Student Financial Aid",
    summary:
      "Primary office for FAFSA, grants, loans, work-study, changes in financial circumstances, and aid package questions.",
    tags: ["finances", "tuition", "scholarships", "aid"],
    keywords: ["fafsa", "financial aid", "grant", "loan", "tuition", "work study", "scholarship"],
    urgency: "medium",
    nextStep: "Contact the office or review your aid options if your finances changed or you need help funding school.",
    reasonTemplate: "Best match for aid eligibility, tuition coverage, and FAFSA-linked funding.",
    url: "https://financialaid.umd.edu/types-aid",
  },
  {
    id: "dean-of-students",
    name: "Dean of Students Get Help",
    office: "Dean of Students Office",
    summary:
      "General support and triage for food, housing, financial instability, well-being, academic barriers, and first-gen support.",
    tags: ["triage", "basic-needs", "academics", "wellbeing", "crisis"],
    keywords: ["drop a class", "withdraw", "leave of absence", "crisis", "help", "don't know where to go"],
    urgency: "high",
    nextStep: "Use the Get Help page or contact the office directly if you need cross-campus coordination.",
    reasonTemplate: "Best fit when the issue crosses academics and personal hardship.",
    url: "https://deanofstudents.umd.edu/get-help",
  },
  {
    id: "counseling-center",
    name: "Counseling Center",
    office: "Division of Student Affairs",
    summary:
      "Mental health support including urgent visits, brief assessments, counseling, and crisis guidance.",
    tags: ["wellbeing", "mental-health", "crisis"],
    keywords: ["mental health", "depressed", "anxiety", "stress", "panic", "overwhelmed", "burnout"],
    urgency: "high",
    nextStep: "Call the Counseling Center to schedule a brief assessment or request urgent support if the situation is acute.",
    reasonTemplate: "Strong fit for emotional distress, burnout, anxiety, depression, or mental health crises.",
    url: "https://counseling.umd.edu/",
  },
  {
    id: "after-hours-crisis",
    name: "After-Hours Crisis Support",
    office: "Dean of Students Office",
    summary:
      "After-hours contacts for urgent mental health and safety situations, including UMPD, 988, CARE, and Counseling Center crisis support.",
    tags: ["crisis", "wellbeing", "safety", "after-hours"],
    keywords: ["tonight", "now", "emergency", "suicidal", "unsafe", "after hours", "immediate"],
    urgency: "critical",
    nextStep: "If there is immediate danger, call 911 or UMPD. Otherwise use the crisis support numbers on the UMD page right away.",
    reasonTemplate: "Use this first if the student needs immediate support outside normal office hours.",
    url: "https://deanofstudents.umd.edu/after-hours-crisis-support",
  },
  {
    id: "legal-aid",
    name: "Undergraduate Student Legal Aid Office",
    office: "Undergraduate Student Legal Aid Office",
    summary:
      "Free legal advice for currently enrolled full-time UMD undergraduates on housing, contracts, employment, traffic issues, small claims, and immigration consultations.",
    tags: ["legal", "housing", "employment", "undergraduate"],
    keywords: ["lease", "landlord", "legal", "ticket", "contract", "immigration", "scam"],
    urgency: "medium",
    nextStep: "Schedule an appointment or email the office if available times do not work.",
    reasonTemplate: "Best match for landlord-tenant disputes, contracts, immigration questions, and other legal issues.",
    url: "https://undergradlegalaid.umd.edu/legal-advice",
  },
  {
    id: "accessibility-disability-service",
    name: "Accessibility & Disability Service",
    office: "Division of Student Affairs",
    summary:
      "Coordinates academic, housing, and experience-based accommodations for students with documented disabilities.",
    tags: ["disability", "academics", "housing", "accommodations"],
    keywords: ["accommodation", "disability", "adhd", "testing", "note taking", "accessible"],
    urgency: "medium",
    nextStep: "Register with ADS and begin the accommodations process even if you still need help collecting documentation.",
    reasonTemplate: "Best fit when the student needs disability-related academic or housing accommodations.",
    url: "https://ads.umd.edu/",
  },
  {
    id: "fostering-terp-success",
    name: "Fostering Terp Success",
    office: "Thrive Center for Essential Needs",
    summary:
      "Focused support for undergraduates age 24 and under with foster care history, homelessness, or housing insecurity.",
    tags: ["housing", "first-gen", "basic-needs", "foster-care", "homelessness"],
    keywords: ["foster care", "homeless", "housing insecurity", "no family support", "break housing"],
    urgency: "high",
    nextStep: "Complete the Thrive Center Assistance Form or contact the program for tailored support and coaching.",
    reasonTemplate: "Best match for students dealing with homelessness or foster-care-related barriers.",
    url: "https://studentaffairs.umd.edu/thrive-center-essential-needs/fostering-terp-success",
  },
  {
    id: "first-gen",
    name: "First-Gen Student Support",
    office: "Thrive Center for Essential Needs",
    summary:
      "Resource hub and support ecosystem for first-generation UMD students navigating college systems, finances, and belonging.",
    tags: ["first-gen", "community", "belonging", "academics"],
    keywords: ["first gen", "first-generation", "my parents didn't go to college", "belonging"],
    urgency: "medium",
    nextStep: "Use the Thrive first-gen page to connect with first-gen programming and campus support.",
    reasonTemplate: "Useful when the student needs belonging, navigation help, and targeted first-gen support.",
    url: "https://studentaffairs.umd.edu/thrive-center-essential-needs/first-gen",
  },
  {
    id: "resident-life",
    name: "Resident Life and Resident Resources",
    office: "Department of Resident Life",
    summary:
      "Resource hub for students living on campus, including housing operations, maintenance, well-being, and academic success links.",
    tags: ["housing", "on-campus", "resident-life"],
    keywords: ["dorm", "resident life", "housing assignment", "maintenance", "on campus"],
    urgency: "low",
    nextStep: "Use Resident Life if the student issue is tied to living in a residence hall or on-campus housing logistics.",
    reasonTemplate: "Best fit for residence-hall logistics rather than broader homelessness or emergency needs.",
    url: "https://reslife.umd.edu/resident-resources",
  },
  {
    id: "academic-support",
    name: "Academic Support and Tutoring",
    office: "UMD Academic Support",
    summary:
      "Gateway to tutoring, learning support, and academic skill-building services across campus.",
    tags: ["academics", "tutoring", "study-support"],
    keywords: ["failing", "tutoring", "study", "class help", "grades", "academic support"],
    urgency: "medium",
    nextStep: "Use the academic support pages to find tutoring, coaching, or course-specific study support.",
    reasonTemplate: "Best fit when the student needs help staying enrolled and succeeding academically.",
    url: "https://umd.edu/academics/academic-support",
  },
  {
    id: "terplink",
    name: "TerpLink Organization Directory",
    office: "Student Org Resource Center",
    summary:
      "Official UMD directory for registered student organizations, org pages, events, and join requests.",
    tags: ["clubs", "community", "belonging", "events"],
    keywords: ["club", "clubs", "organization", "org", "student group", "community", "friends", "involved"],
    urgency: "low",
    nextStep:
      "Search by 2 to 3 interest keywords, then open org pages and use the Join button or message listed officers directly.",
    reasonTemplate: "Best first stop for finding official registered student organizations.",
    url: "https://terplink.umd.edu/organizations",
  },
  {
    id: "joining-a-club",
    name: "Joining a Club Guide",
    office: "Student Org Resource Center",
    summary:
      "Official UMD guidance on how to use TerpLink, join organizations, contact officers, and find the answer to how a student gets involved.",
    tags: ["clubs", "community", "belonging", "triage"],
    keywords: ["how do i join", "join a club", "contact clubs", "terplink confusing", "how to get involved"],
    urgency: "low",
    nextStep:
      "Use this guide when TerpLink feels messy. It gives the exact UMD process: search, open the org page, hit Join, and contact the organization directly.",
    reasonTemplate: "Best match when the student is stuck on process rather than interest discovery.",
    url: "https://stamp.umd.edu/activities/student_org_resource_center_sorc/get_involved/joining_club",
  },
  {
    id: "sorc",
    name: "Student Org Resource Center (SORC)",
    office: "STAMP Student Union",
    summary:
      "UMD office that helps students with TerpLink, campus involvement, and organization discovery.",
    tags: ["clubs", "community", "belonging", "triage"],
    keywords: ["sorc", "student org resource center", "find clubs", "terplink help", "involvement"],
    urgency: "low",
    nextStep:
      "Contact SORC if a student wants a human to help narrow options or navigate TerpLink and involvement opportunities.",
    reasonTemplate: "Best fit when the student needs human guidance finding a club or making sense of the ecosystem.",
    url: "https://stamp.umd.edu/get_involved/student_org_resource_center_sorc",
  },
  {
    id: "second-look-fair",
    name: "Second Look Fair",
    office: "Student Org Resource Center",
    summary:
      "Spring involvement fair that gives students another chance to meet hundreds of organizations after the fall First Look Fair.",
    tags: ["clubs", "community", "events", "belonging"],
    keywords: ["second look fair", "missed first look fair", "after first look fair", "spring clubs"],
    urgency: "low",
    nextStep:
      "Use the fair page and org list if the student missed First Look Fair and wants a curated re-entry point into campus organizations.",
    reasonTemplate: "Best match for students who missed First Look Fair or need another organized discovery moment.",
    url: "https://stamp.umd.edu/get_involved/student_org_resource_center_sorc/get_involved/second_look_fair",
  },
  {
    id: "organization-list",
    name: "Second Look Fair Organization List",
    office: "Student Org Resource Center",
    summary:
      "Category-based organization list that is easier to browse than a flat directory and is useful when students know a general vibe but not a club name.",
    tags: ["clubs", "community", "belonging", "categories"],
    keywords: ["club categories", "browse clubs", "find orgs by interest", "easier than terplink", "organization list"],
    urgency: "low",
    nextStep:
      "Start here when TerpLink feels too flat. Browse categories first, then click through to TerpLink for specific organizations.",
    reasonTemplate: "Best fit when the student needs a more guided, category-based way to browse organizations.",
    url: "https://stamp.umd.edu/get_involved/student_org_resource_center_sorc/get_involved/second_look_fair/organization_list",
  },
];

const urgencyWords = {
  critical: ["suicidal", "unsafe", "abuse", "assault", "right now", "immediately"],
  high: ["urgent", "emergency", "tonight", "eviction", "homeless", "can't eat", "shut off"],
};

const tagMatchers = {
  housing: ["rent", "housing", "landlord", "eviction", "lease", "couch surfing", "homeless", "roommate"],
  food: ["food", "groceries", "meal", "hungry", "pantry", "eat"],
  finances: ["money", "tuition", "bill", "loan", "financial", "debt", "work study", "fafsa"],
  wellbeing: ["mental health", "stress", "anxiety", "depression", "overwhelmed", "burnout", "panic"],
  academics: ["drop a class", "withdraw", "failing", "advisor", "class", "grades", "study"],
  disability: ["disability", "accommodation", "adhd", "accessible", "testing"],
  legal: ["legal", "landlord", "ticket", "contract", "immigration", "court", "scam"],
  "first-gen": ["first gen", "first-generation", "parents didn't go to college"],
  clubs: ["club", "clubs", "org", "organization", "student group", "community", "friends", "meet people"],
  events: ["fair", "event", "events", "first look fair", "second look fair"],
  categories: ["categories", "browse", "interest", "interests", "vibe"],
};

const clubInterestMatchers = {
  tech: ["coding", "computer science", "cs", "software", "app", "developer", "tech", "programming"],
  security: ["cyber", "security", "ctf", "hacking"],
  creative: ["creative", "design", "art", "music", "writing", "poetry", "dance", "game"],
  engineering: ["engineering", "mechanical", "robotics", "cars", "fabrication", "build"],
  social: ["friends", "meet people", "social", "community", "casual", "fun"],
  belonging: ["belonging", "identity", "support network", "lgbtq", "first-gen", "black"],
};

function normalizeResource(resource) {
  return {
    ...resource,
    tags: resource.tags || [],
    keywords: resource.keywords || [],
    urgency: resource.urgency || "medium",
    nextStep: resource.nextStep || "Open the official UMD page and follow the contact or join instructions there.",
    reasonTemplate: resource.reasonTemplate || "Relevant UMD resource.",
  };
}

function mergeResources(staticResources, generatedResources) {
  const byKey = new Map();

  [...staticResources, ...generatedResources].forEach((resource) => {
    const normalized = normalizeResource(resource);
    const key = normalized.id || normalized.url;
    if (!key) return;

    if (!byKey.has(key)) {
      byKey.set(key, normalized);
      return;
    }

    byKey.set(key, {
      ...byKey.get(key),
      ...normalized,
      tags: [...new Set([...(byKey.get(key).tags || []), ...(normalized.tags || [])])],
      keywords: [...new Set([...(byKey.get(key).keywords || []), ...(normalized.keywords || [])])],
    });
  });

  return [...byKey.values()];
}

export const resources = mergeResources(baseResources, liveResources || []);
export const clubCatalog = clubResources;

export function detectNeeds(normalized) {
  const needs = new Set();

  Object.entries(tagMatchers).forEach(([tag, words]) => {
    if (words.some((word) => normalized.includes(word))) {
      needs.add(tag);
    }
  });

  if (!needs.size && /(help|support|issue|problem)/.test(normalized)) {
    needs.add("triage");
  }

  return [...needs];
}

function detectClubInterests(normalized) {
  const interests = new Set();

  Object.entries(clubInterestMatchers).forEach(([interest, words]) => {
    if (words.some((word) => normalized.includes(word))) {
      interests.add(interest);
    }
  });

  return [...interests];
}

export function detectPriority(normalized) {
  if (urgencyWords.critical.some((word) => normalized.includes(word))) {
    return "critical";
  }

  if (urgencyWords.high.some((word) => normalized.includes(word))) {
    return "high";
  }

  return "normal";
}

export function findBestResources(query) {
  const normalized = query.toLowerCase();
  const detectedNeeds = detectNeeds(normalized);
  const priority = detectPriority(normalized);

  if (detectedNeeds.includes("clubs")) {
    const clubInterests = detectClubInterests(normalized);
    const clubMatches = clubCatalog
      .map((club) => {
        let score = 0;
        const reasons = [];

        clubInterests.forEach((interest) => {
          if (club.tags.includes(interest) || club.interests.includes(interest)) {
            score += 5;
            reasons.push(`${interest} fit`);
          }
        });

        club.interests.forEach((interest) => {
          if (normalized.includes(interest.toLowerCase())) {
            score += interest.includes(" ") ? 5 : 3;
          }
        });

        club.keywords.forEach((keyword) => {
          if (normalized.includes(keyword.toLowerCase())) {
            score += keyword.includes(" ") ? 4 : 2;
          }
        });

        if (normalized.includes("meet people") || normalized.includes("make friends")) {
          if (club.tags.includes("community") || club.tags.includes("social")) {
            score += 3;
            reasons.push("community angle");
          }
        }

        if (!reasons.length && score > 0) {
          reasons.push(club.reasonTemplate);
        }

        return { resource: club, score, reasons: [...new Set(reasons)] };
      })
      .filter((item) => item.score > 0)
      .sort((left, right) => right.score - left.score)
      .slice(0, 3);

    if (clubMatches.length) {
      return { matches: clubMatches, detectedNeeds, priority };
    }
  }

  const matches = resources
    .map((resource) => {
      let score = 0;
      const reasons = [];

      detectedNeeds.forEach((need) => {
        if (resource.tags.includes(need)) {
          score += 4;
          reasons.push(`${need} support`);
        }
      });

      resource.keywords.forEach((keyword) => {
        if (normalized.includes(keyword.toLowerCase())) {
          score += keyword.includes(" ") ? 4 : 2;
        }
      });

      if (priority === "critical" && resource.tags.includes("crisis")) {
        score += 8;
        reasons.push("urgent support");
      } else if (priority === "high" && resource.urgency === "high") {
        score += 3;
      }

      if (resource.id === "thrive-center" && detectedNeeds.length >= 2) {
        score += 5;
        reasons.push("cross-campus coordination");
      }

      if (resource.id === "dean-of-students" && normalized.includes("drop a class")) {
        score += 5;
        reasons.push("academic + personal triage");
      }

      if (resource.id === "organization-list" && detectedNeeds.includes("clubs")) {
        score += 4;
        reasons.push("easier club browsing");
      }

      if (resource.id === "sorc" && (normalized.includes("terplink") || normalized.includes("confusing"))) {
        score += 5;
        reasons.push("human help available");
      }

      if (!reasons.length && score > 0) {
        reasons.push(resource.reasonTemplate);
      }

      return { resource, score, reasons: [...new Set(reasons)] };
    })
    .filter((item) => item.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, 3);

  if (!matches.length) {
    const fallback = resources
      .filter((resource) => ["thrive-center", "dean-of-students", "terplink"].includes(resource.id))
      .map((resource) => ({
        resource,
        reasons: [resource.reasonTemplate],
      }));

    return { matches: fallback, detectedNeeds, priority };
  }

  return { matches, detectedNeeds, priority };
}

export function formatCopilotResponse(query) {
  const result = findBestResources(query);

  const intro =
    result.priority === "critical"
      ? "This sounds urgent. Start with immediate-support options first."
      : result.detectedNeeds.includes("clubs")
        ? "This sounds like a club-discovery problem, so I prioritized category-based browsing and human involvement support before the flat directory."
        : result.detectedNeeds.length >= 3
          ? "This looks like a multi-issue case, so I prioritized coordinating offices first."
          : "Here are the strongest UMD matches for this situation.";

  return {
    query,
    priority: result.priority,
    detectedNeeds: result.detectedNeeds,
    recommendations: result.matches.map(({ resource, reasons }, index) => ({
      rank: index + 1,
      id: resource.id,
      name: resource.name,
      office: resource.office,
      summary: resource.summary,
      reasons,
      nextStep: resource.nextStep,
      url: resource.url,
    })),
    text: [
      intro,
      ...result.matches.map(
        ({ resource, reasons }, index) =>
          `${index + 1}. ${resource.name} (${resource.office}) - ${resource.summary} Why: ${reasons.join(
            ", "
          )}. Next step: ${resource.nextStep} Source: ${resource.url}`
      ),
    ].join("\n"),
  };
}
