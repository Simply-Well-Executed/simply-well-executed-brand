// Shared public standards-library content, used by the site pages and the MCP tools.

export const brandAssets = [
  "Simply-Well-Executed-brand-guide.pdf", "logo-primary.svg", "logo-compact.svg", "social-avatar.png",
  "social-landscape.png", "social-square.png", "brand-art-poster.png", "design-philosophy.md",
];

export const topics = [
  { id: "foundations", n: "01", title: "Foundations", note: "Purpose, principles, voice", accent: "bg-paper" },
  { id: "intelligence", n: "02", title: "Intelligence", note: "AI behavior, review, trust", accent: "bg-coral text-primary-foreground" },
  { id: "patterns", n: "03", title: "Patterns", note: "States, flows, decisions", accent: "bg-paper" },
  { id: "content", n: "04", title: "Content", note: "Writing, tone, structure", accent: "bg-paper" },
  { id: "accessibility", n: "05", title: "Accessibility", note: "Contrast, motion, access", accent: "bg-paper" },
  { id: "identity", n: "06", title: "Identity", note: "Logo, color, type, art", accent: "bg-paper" },
  { id: "resources", n: "07", title: "Resources", note: "Guides, kits, templates", accent: "bg-paper" },
];

export const library = [
  { cat: "foundations", title: "Outcome before mechanism", note: "Lead with the work a team can complete; explain the AI only when it changes the decision." },
  { cat: "foundations", title: "Chosen, not assumed", note: "Make consequential choices explicit. Never present an inference as an instruction." },
  { cat: "foundations", title: "Change keeps its history", note: "A revision adds provenance; it does not silently replace what came before." },
  { cat: "foundations", title: "People retain agency", note: "Review, pass, correct, and exit remain available wherever automation acts." },
  { cat: "intelligence", title: "Review over awe", note: "Design AI output to be checked, not admired. Confidence is useful; false finality is not." },
  { cat: "intelligence", title: "Trust through provenance", note: "Every recommendation carries its source, its reasoning, and its limits." },
  { cat: "patterns", title: "Recommendation", note: "Show the recommendation and why. Never hide alternatives behind certainty." },
  { cat: "patterns", title: "Approval", note: "Name exactly what approval changes. Never treat silence as consent." },
  { cat: "patterns", title: "Correction", note: "Preserve the original and the correction. Never erase the path that led here." },
  { cat: "content", title: "Direct", note: "Put the outcome in the first sentence." },
  { cat: "content", title: "Grounded", note: "Say only what the evidence supports." },
  { cat: "content", title: "Human", note: "Use plain words without hiding complexity." },
  { cat: "accessibility", title: "Keyboard paths", note: "Keyboard navigation is complete, with visible focus everywhere." },
  { cat: "accessibility", title: "Meaning beyond color", note: "Color never carries meaning alone; pair it with labels or icons." },
  { cat: "accessibility", title: "Motion and recovery", note: "Motion respects user preferences; errors explain the next action." },
  { cat: "identity", title: "Logo and clear space", note: "Clear space equals one node. Never stretch or rotate the mark." },
  { cat: "identity", title: "State color", note: "Coral for action, amber for attention, teal for resolved, violet for inquiry." },
  { cat: "identity", title: "Type system", note: "FreeSerif for display, FreeSans for text, FreeMono for data." },
  { cat: "resources", title: "Brand guide", note: "The three-page PDF covering logo, color, type, and usage rules." },
  { cat: "resources", title: "Logo and social assets", note: "SVG logos, social artwork, avatar, and poster — ready to download." },
];

export const principles = [
  ["Outcome before mechanism", "Lead with the work a team can complete. Explain the AI only when it changes the decision."],
  ["Chosen, not assumed", "Make consequential choices explicit. Never present an inference as an instruction."],
  ["Change keeps its history", "A revision adds provenance. It does not silently replace the state that came before."],
  ["People retain agency", "Review, pass, correct, and exit remain available wherever automation acts."],
] as const;
