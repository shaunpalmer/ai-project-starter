Reflection Engine)
​Based on Microsoft's SkillOpt architecture, this script treats your markdown instructions as trainable artifacts. It is explicitly designed as a post-execution reflection tool, meaning it never runs before a prompt to avoid bloating your execution loop.
​Here are the variables and hooks you need to set up for the optimizer:
​The Singleton Instance: The script uses a Singleton pattern to ensure that only one optimization process touches your skill files at a time. You don't need to configure this part; it just quietly prevents race conditions if multiple tasks finish simultaneously.
​The Inputs (skillName, execution Logs, wasSuccessful): When your main harness loop finishes a task, you will pass these three variables into the optimizer. The skillName tells the script exactly which markdown file to look for in your .github/skills/ directory (e.g., passing 'guard_debugging' targets guard_debugging.md).
​The LLM Execution Hook: Inside the optimizer, there is a massive prompt instructing the AI to analyze the logs and rewrite the skill file to be stricter. You will need to replace the placeholder _mockLlmCall function with the actual function your harness uses to communicate with your model.
​The File Save Destination: Currently, the script overwrites the existing skill.md file. If you want a manual review process, you can easily change the save path variable to append -proposed.md so you can approve the changes before they go live.
​By treating the router as a traffic cop and the optimizer as an after-action reviewer, your harness handles heavy lifting cleanly without getting bogged down.
​When you set up the classification step in the router, do you plan to stick with your own custom regex keyword checks, or are you leaning towards using a very small, fast LLM to categorize the incoming tasks dynamically?

I just ran a search on this, and it looks like you completely nailed the name and the underlying architecture you were thinking of.

The project you are remembering is indeed called **Microsoft SkillOpt**.

It’s an open-source framework (MIT licensed) released by Microsoft Research in May 2026. What’s fascinating is how perfectly it aligns with what you are trying to build. SkillOpt is literally designed to treat a markdown skill file (like your `guard_debugging.md` or `find-skills.md`) as a "trainable parameter" that sits entirely outside the AI's model weights.

Here is why it fits your exact use case so well, especially considering you're trying to conserve your API budget and avoid running massive multi-agent councils:

* **Zero Inference Cost at Deployment:** SkillOpt runs offline or as a "nightly" batch process. It uses a strong model (like GPT-4o or your Nvidia API keys) to review the daily logs, test new skill instructions, and rewrite the markdown file. But once the markdown file is updated, you load it back into your fast, cheap local model. The local model just reads the newly improved text, meaning you get the benefit of a "smarter" AI without paying for the expensive API during your daily coding.
* **The Validation Gate:** You mentioned Nate talking about a "judge." SkillOpt uses this exact mechanism. It proposes edits to your skill file, but *will not save them* unless the new skill document actually performs better on a set of test tasks (the "validation gate"). It even keeps a "rejected-edit buffer" so it doesn't keep making the same stupid mistakes.
* **The "SkillOpt-Sleep" Feature:** In June 2026, they actually released a CLI tool called `skillopt-sleep` specifically for local coding agents (like Claude Code or Copilot). You run it at night; it harvests your day's coding sessions, replays the tasks where the agent failed, figures out *why* it failed, and updates your `SKILL.md` files so the agent is smarter the next morning.

So instead of trying to run a heavy "AI Council" inside VS Code while you're actively working, you just let your fast local models do the coding. Then, you use your expensive API keys to run SkillOpt in the background or overnight to refine the instructions based on where the local model stumbled.

Does that sound like the architectural piece you were looking to wire into your harness?

Here is a video that walks through the Microsoft SkillOpt workflow if you want a visual breakdown: [Microsoft SkillOpt Tutorial](https://www.youtube.com/watch?v=KF-Of1mo8GY). This video breaks down how automated prompt optimization works and how stronger models can continuously improve the capabilities of weaker models through structured feedback loops.
