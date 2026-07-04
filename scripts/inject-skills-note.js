// scripts/inject-skills-note.js
const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.join(__dirname, '..');

/**
 * Read a file safely and return its content
 */
function readFileSafe(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (e) {
    return '';
  }
}

/**
 * Extract relevant skills based on project files
 */
function detectRelevantSkills() {
  const intake = readFileSafe(path.join(PROJECT_ROOT, 'PROJECT-INTAKE.md'));
  const projectTypes = readFileSafe(path.join(PROJECT_ROOT, 'PROJECT-TYPES.md'));
  const agents = readFileSafe(path.join(PROJECT_ROOT, 'AGENTS.md'));
  const tasks = readFileSafe(path.join(PROJECT_ROOT, 'TASKS.md'));

  const content = [intake, projectTypes, agents, tasks].join('\n').toLowerCase();
  const skills = new Set();

  // Core skills you always want in certain contexts
  if (content.includes('frontend') || content.includes('ui') || content.includes('css') || content.includes('javascript')) {
    skills.add('chrome-devtools-mcp');
    skills.add('interface-design');
  }

  if (content.includes('wordpress')) {
    skills.add('wordpress-plugin');
    skills.add('wordpress-way');
  }

  if (content.includes('scrape') || content.includes('scraping')) {
    skills.add('scraping-pipeline');
  }

  if (content.includes('database') || content.includes('schema')) {
    skills.add('database-selection');
    skills.add('database-design');
  }

  if (content.includes('api')) {
    skills.add('api-design');
  }

  // Always include control skills for coding/review phases
  skills.add('complexity-brake');
  skills.add('loop-controller');
  skills.add('trace-eval-logging');
  skills.add('memory-consolidation');

  return Array.from(skills);
}

/**
 * Generate contextual skills note
 */
function generateSkillsNote(phase = 'coding') {
  const relevantSkills = detectRelevantSkills();

  let note = `
You are now entering the **${phase} phase** of this project.

**Skills Activation Rules (Strictly Follow):**
- Only load skills from .github/skills/ that are relevant to the current task.
- When in doubt, ask: "Should I activate the [skill] for this step?"
- Skills are mandatory when the project type or current task clearly benefits from them.
- Prioritize verification and control skills during implementation.
`;

  if (relevantSkills.length > 0) {
    note += `
**Recommended Skills for This Project/Task:**
${relevantSkills.map(s => `- ${s}`).join('\n')}
`;
  }

  if (phase === 'coding') {
    note += `
**Coding Phase Directives:**
- Run complexity-brake before adding new code, files, or abstractions.
- Use loop-controller + self-review on every major change.
- Verify front-end work with Chrome DevTools MCP.
- Log key decisions and outcomes with trace-eval-logging.
- Consolidate learnings periodically with memory-consolidation.
`;
  }

  return note.trim();
}

// Main execution
const phase = process.argv[2] || 'coding';
const note = generateSkillsNote(phase);

console.log(note);
console.log('\n' + '='.repeat(60));

// Save for easy copy-paste
const outputPath = path.join(PROJECT_ROOT, 'CURRENT-SKILLS-NOTE.md');
fs.writeFileSync(outputPath, note);
console.log(`✅ Smart skills note saved to: CURRENT-SKILLS-NOTE.md`);
console.log(`   Ready to paste into your AI session for the ${phase} phase.`);
