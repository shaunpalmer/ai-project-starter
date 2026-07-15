import fs from 'fs';
import path from 'path';
import { OpenAI } from 'openai';

// 1. Initialize Nvidia API Client (using their OpenAI-compatible endpoint)
const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY, 
  baseURL: 'https://integrate.api.nvidia.com/v1',
});
const response = await openai.chat.completions.create({
  model: NVIDIA_MODEL,
  messages: [{ role: 'user', content: prompt }],
  temperature: 0.2,
});
const SKILLS_DIR = path.join(process.cwd(), '.github', 'skills');
const LOGS_FILE = path.join(process.cwd(), 'logs', 'daily-execution.json');

class SkillOptimizer {
  constructor() {
    if (SkillOptimizer.instance) return SkillOptimizer.instance;
    SkillOptimizer.instance = this;
  }

  async runNightlyOptimization() {
    console.log('--- Starting Nightly Skill Optimization Loop ---');
    
    // Check for execution logs
    if (!fs.existsSync(LOGS_FILE)) {
      console.log('No logs found for tonight. Exiting optimization.');
      return;
    }

    const logData = JSON.parse(fs.readFileSync(LOGS_FILE, 'utf8'));
    
    for (const log of logData) {
      if (!log.wasSuccessful) {
        console.log(`Optimizing skill for failed task in target: ${log.skillName}`);
        await this.optimizeSkillFile(log.skillName, log.executionLogs);
      }
    }
  }

  async optimizeSkillFile(skillName, executionLogs) {
    const filePath = path.join(SKILLS_DIR, `${skillName}.md`);
    if (!fs.existsSync(filePath)) {
      console.log(`Skill file not found: ${filePath}`);
      return;
    }

    const currentSkillContent = fs.readFileSync(filePath, 'utf8');

    const prompt = `
      You are an expert AI software engineer analyzing system execution logs.
      
      Target Skill File to Update:
      """
      ${currentSkillContent}
      """

      Execution Failure Logs:
      """
      ${executionLogs}
      """

      Task: Propose precise Markdown edits (additions, deletions, or behavior rules) to the Target Skill File to prevent this specific failure from happening again. 
      Return the ENTIRE updated markdown file. Do not include conversational text, only the raw markdown output.
    `;

    try {
      const response = await openai.chat.completions.create({
        model: 'nvidia/llama-3.1-nemotron-70b-instruct', // Swap with whichever active Nvidia NIM model you prefer
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
      });

      const proposedChanges = response.choices[0].message.content;

      // The Validation Gate: Ensure the AI didn't completely wipe out the file or break format
      if (proposedChanges && proposedChanges.includes('#')) {
        // Safe validation write to a proposed file for your review, or change to filePath to overwrite directly
        const reviewPath = path.join(SKILLS_DIR, `${skillName}-proposed.md`);
        fs.writeFileSync(reviewPath, proposedChanges, 'utf8');
        console.log(`✅ Success: Proposed updates saved to ${skillName}-proposed.md`);
      } else {
        console.log(`❌ Validation failed for ${skillName}. Proposal rejected.`);
      }

    } catch (error) {
      console.error(`Error processing optimization with Nvidia API:`, error.message);
    }
  }
}

// Execute the process
const optimizer = new SkillOptimizer();
optimizer.runNightlyOptimization();
