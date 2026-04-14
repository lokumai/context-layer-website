now its time for dreaming !!! We should together brainstorm the playground !
Because landing pages are standard but the playground should be thought after.

for example in one part you said: Playground pipelines
this is ok but we have not yet decided on how it would be.

Lets start with what should UI look in Playground.

========== Overall Playground for Context Layer ===============

-------- Workspaces page or Entry Point Page of Playground ----------
When people enter the playground, I think they should be able to create or select cards which resemble Workspaces. Each workspace actually resembles a project that may be single repo or multi-repo. The cards should have name and be rectangle-shaped. if creating for the first time, there should always be a dot-lined rectangle that is empty and not-filled and has a "+" sign in it only. When the users clicks it, they only need to put name of it as mandatory. No need to enter github URLs yet. 

Please note that the workspaces page is the entry point of the playground. Without selecting or creating a workspace, no other pages should be accessible such as DocsGen or Chatbot or OmniBoard or MCPGen. Workspaces page is like a gateway to the playground.

-------- Upon entering the workspace ---------
After entering the workspace that they created or exists,  If we were to divide playground for that workspace to seperate pages, I think having a navbar on the top that spans the whole page horizontally would be good. On th every right side of the navbar there could be Account (human) icon so users can sign in or sign out, see their profile, settings and etc using a dropdown menu. 

on the very left side of the navbar there should be a logo of Context Layer. It should be clickable and when clicked it should redirect users to the workspaces page. 
Right after the logo, there should be a box or button that write Workspace Name, implying that this workspace is active right now. It should be clickable and when clicked or hovered over, a dropdown menu should appear with the options to edit the workspace name, change the workspace. When user clicks on the change workspace button, a modal should appear with search bar on top of of the list of all workspaces and they can select one of them to change the active workspace. When user clicks on the edit workspace name button, a modal should appear with a text input field for the workspace name and a save button. When user clicks on the save button, the workspace name should be updated and the dropdown menu should be closed.

This navbar can have thesee pages:

- Sources: Codes (that user enters github URLs or can upload their zip files of the code so code repositories either single or multi are added) and Files (which user can upload extar documents or files that may not be present in repos but are external organizational files. even within the files, all these files should be indexed and searchable through Chatbot page which not only accesses wiki and codebase itslef, but also these files. They even can be docx or pdf or anything else. We will convert them to markdown files and index them.)
- Wiki (which is our knowledge base or Context Wiki)
- Chatbot (a universal chatbot to ask about anything. users can ask about wiki, code, and files)
- DocsGen (that includes 6 bounded-context bundles with the same names as sub-pages)
- OmniBoard
- MCPGen

So these are 6 highest-level pages that should be in the active workspace as pages in the navbar at the very top, making it clear for users on what modules they can use.
Each of these pages should have a separate URL and should be accessible from the active workspace URL.
Each page might have multiple sub-pages or sections.

============== Sources page =================
This is the SINGLE SOURCE OF TRUTH for the workspace.

This is the place which people can add sources to the workspace. It can be github URLs or zip files of the code or external documents or files. They can also delete the sources if they want to.
People should be able to see all the sources either as grid cards or list views. They can also search for a specific source by name or URL, and even filter them by type (code, file, or both). People can also edit the source name or URL if they want to.

It can somehow look similar to google drive, where people can add files and folders and view them and edit them and delete them. When clicking on them, they should be able to see the content of the source in a modal, similar to what we see in google drive.

Anything that is added to the sources page should be indexed and searchable through Chatbot page which not only accesses wiki and codebase itslef, but also these files. They even can be docx or pdf or anything else. We will convert them to markdown files and index them.

Basically this is our pool of knowledge that should be accessible by agent, not only for the chatbot, but for any other tools, pages, and modules that is created or maintained by an agent. This is the universal, single source of truth for the workspace that should be accessible by any agent in any part of our project.

============== Wiki page =================
When people enter the wiki page, they should be able to see the wiki viewer and the wiki generation sub-pages (which is the same page but with different tabs) they can be selected at the top (not navbar but top of the page) using a Pill Tab or Segmented Control. The pill will have 3 options: Status, View, Configure, and Logs.

------ Wiki Status -------------
When people enter the wiki status page, they should be able to see the overview of the wiki with engaging and attractive UI with stats, cards, charts, graphs, etc. This is the welcome tab of the wiki page.
It can include the following information:

1. Wiki Health & Coverage
Coverage Score: % of repository code/files currently indexed in the Wiki.
Staleness Indicator: Time since last sync (e.g., "Last synced 2 hours ago").
Sync Status: Real-time badge (Ready, Syncing..., Outdated).
Missing Context: Number of "blind spots" (files/folders not yet documented).

2. Knowledge Stats
Total Tokens: Total size of the knowledge base (e.g., "1.2M Tokens").
Source Breakdown: Ratio of Code vs. External Files (PDF/Docx) indexed.

3. Repository Insights (this is a list view that can be expanded as a modal to show the details of the repositories or files or folders)
Active Repos: Repositories or files or folders currently contributing to this Wiki. (as a list view)
Inactive Repos: Repositories or files or folders that exist in the sources page but are not currently contributing to this Wiki.

4. Recent Activity
Recent Tasks: A mini-log of the last 3 WikiGen/Sync jobs. (with a button at bottom of the section to view all activities in a list)

5. Knowledge Graph
Knowledge Graph: A graph of the knowledge base with nodes and edges. It can be expanded as a modal with a search bar on top of it to search for nodes and edges, so users without leaving the page can have a beautifully designede graph viewer or visualization screen that can be opened and viewed on the same window as a new modal.

Note that the status page should be updated in real-time and should be aware of the latest changes in the wiki, the sources, and the codebase. This means that the status page should be a live page that is always updating and showing the latest information. It is good to have a button to refresh the page manually by user to see the latest information.

----------- Wiki (View) Viewer -------------
Wiki should be in 3 levels: one is workspace level, describing the whole workspace even if its single repo which should be high-level and a single markdown file not exceeding for example 10K tokens. Another one is repo-level which describes a single repo. The repo-level is similar to Deep Wiki or Code Wiki content viewer in which there is a markdown files with nested levels and header describing the project. Also while I AM NOT SURE YET, but maybe a file-level wiki or something like llms.txt which is more detailed and granular. I think re-naming it to llms.txt would be better. Why ? Because Humans and Agents can already understand the high-levels through workspace and repo level wikis, but for more granular, I think we do not need file-level wiki becasue they can use QnA Chatbot UI and MCP to get those info live using Agentic RAG or Live Agent Analysis and Discovery. So maybe we should replace it and re-brand it as llms.txt which is the most granular type of wiki that has multiple markdown files and an index page, similar to what we see in mintlify or other libraries that in order to vibe-code using them, we give the whole project guide or context using llms.txt.
When in this page, the user should have a viewer for workspace and repo-level and file-level wikis and be able to export them as markdown or pdf and view them (while they have for example mermaid diagrams in it) This part would be very similar to DeepWiki ui that you can find in @context-layer-info/brainstorm/deepwiki_example.png  and as you can see, the viewer should be similar to deeepwiki, a scrollable file-system like viewer on the left spanning vertically that can be hided or closed or opened. 

NOTE: The wiki viewer similar to DeepWiki should have a chatbot UI on the bottom (a floating bar with a text input field and a send button) that allows users to ask questions about the wiki, the code and files and get answers. But when user use it, it should redirect them to the chatbot page which is our main interface for chatbot.


--------- Wiki Configure (Wiki Generation/Sync/Delete) ------------
when people enter the wiki, they should be able to generate a knowledge base with a few clicks. This means creating the wiki should not be automatic but user explicitly can start a job or task for creating the wiki in the background. While we have WikiSync, the user must also be able to invoke WikiSync manually or even re-generate the wiki or delete the wiki and re-generate it. 
When generating the wiki, user should be able to explicitly select that out of which repos and which files (external files uploaded by user) should this wiki be generated from. This selection should be done from the sources available in the sources page. For example if user wants to generate the wiki from a single repo, they can select the repo from the sources page and then click on the generate button. If user wants to generate the wiki from multiple repos, they can select the repos from the sources page and then click on the generate button. If user wants to generate the wiki from multiple repos and external files, they can select the repos and files from the sources page and then click on the generate button.
When clicking on generation, user can have a message box of for example 5K tokens to give OPTIONAL instructions to the WikiGen agent to customize the wiki to be generated.

When user clicks on the generate button, we should not lock the user in the UI. It should be a background job that is running in the background and user should be able to see the progress of the job in the UI. The progress should be shown as a progress with steps, that shows for example 3/5 steps completed, with beaitiful UI and animations. These steps are shown below of the progress bar (connected to it) as a list of steps. Each list of step should be accordion and when user clicks on it, it should expand and show the details of the step. The details of the step should be similar to agent logs. 

For agent logs we have to show a Signature or just a high-level summary of what the agent is doing. The difficult part for it is that each LLM or even agentic framework has different way of showing the logs. for example Claude Code uses "Spinner verbs", a list of pre-defined verbs that are shown randomly and in a loop, while the agent is working. On the other hand, Gemini LLMs emit their thoughts using a "Thought Signature" which is a few words-long summary of the thinking block that is generated by the LLM itself by default when thinknig. So showing agent logs is challenging as each LLM and even agentic framework has different way of showing its planning or thinking or execution process. This is a difficult part and we have to find a way to show it in a beautiful way that is compatible with all the LLMs and agentic frameworks IN THE FUTURE. For now since this UI is just a green-field project, we can show a simple signature or summary of what the agent is doing.

User should be able to stop the generation at any time, and continue it later, or cancel the job completely.

In addition to the functionality above, the UI of the Wiki Configure page should be like this:
When people first enter the configure page and there is no wiki generated yet, a card should be shown to the user to inform them that there is no wiki generated yet and they can generate one by clicking on the generate button. The card should have a button to generate the wiki. It should show a modal with a form to enter the name of the wiki and the sources to generate the wiki from. It should also have a part to add instructions to the wiki generation agent to customize the wiki to be generated (optional but to allow humans-in-the-loop to customize the wiki to be generated).
After clicking on generate button, the modal should be closed and the Configure tab's content should include only the progress bar and the steps list with the accordions to show the details of the steps.
After the generation is complete, the progress bar should be replaced with a success message and after a few seconds, the page content should be reaplaced with information used to generate the wiki scuh as the sources used, the instructions used, the time taken to generate the wiki, and etc. And at this time the user will be able to re-sync the wiki using the same sources and instructions or even select new sources and instructions to re-sync the wiki or even delete the wiki and re-generate it from scratch using the same form and modal.
To wrap up, the configure page should be a page with content changing dynamically based on the state of the wiki generation/sync job.


A card is sitting there always to show which generation/sync job is running or has been run, like a list of logs or history. The user should be able to also see which sources contributed to the wiki and which are not. The user then can re-sync the wiki using the already-selected or previously-selected sources, or even select new sources to re-sync the wiki. The user can also delete the wiki and re-generate it from scratch.


============== Chatbot page =================
When people enter the chatbot page, they should be able to see the chatbot UI. This chatbot UI should be a chat interface with a text input field and a send button and stopping button. The chatbot should be able to answer questions about the wiki, code, and files. 
The chatbot page should show Agent Actions and Tool Calls and etc. (almost every event published by the agentic framework we use such as deep agents by langchain). It should also if exists, show the thinking tokens of the agent and the tool calls and etc.

It should have the option for user to select what the answer should be grounded in: an specific Source (either file or repo), Wiki, or a combination of them. By deaful an answer should be grounded in everything (sources, wiki, and codebase) but user can select specific sources to ground the answer in like a filtering mechanism.This should be done through a button available in the prompt bar interface that when user select on, expands and allows users to select or deselect specific sources to ground the answer in.

Also it worths noting that the info shown to the user in Wiki Status page should be also accessible by the agents such as the Chatbot agent so that it can use it to answer questions and provide more accurate answers.

All the chatbot answers should be grounded in the selected sources andn chatbot must provide the citations/references to the sources when answering a question. These citations to the code, file and wiki should be clickable. When use clicks on them, from the right hand side, a new tab should open/appear with the content of the citation (whether it is a pdf file or a code file or a wiki file) that is automatically scrolled to the exact range of lines that the citation is referring to (our deep agent should define the range of lines that the citation is referring to). This feature probably requires a format beautifier so that when agent in the chatbot interface cites something using that format (maybe using @ or using # or any other format that is the best convention), in the UI it should appear as a beautifulclickable link. two examples of it are: @context-layer-info/brainstorm/sources.png and @context-layer-info/brainstorm/citations.png

Also somewhere in the page, there should be a button for getting the MCP config for connecting AI Agents to this chatbot MCP server.

[OPTIONAL] Maybe later we can include a basic buble to everywhere in the UI (the bottom right corner of the pages) to open a very basic, simple and small chatbot interface for the user to guide user about how to use the system UI. It is like an integrated copilot or assistant that is always there to guide user about how to use the system UI, pages, and etc. This should be AWARE of the 

=============== DocsGen page ================
When people enter the docsgen page, they should be able to see the docsgen viewer. This docsgen viewer should be a tabbed viewer with 6 tabs:

- Structure & Architecture
- Specification & Knowledge
- Health & Risk
- Agent Infrastructure
- Institutional Memory
- [Optional] Research Docs

| **Structure & Architecture** | Semantic repo-map, cross-repo dependency maps, end-to-end data flow diagrams, DB schema docs | *"See the bones of your system — how repos, services, and data flows connect."* | Static structure analysis |
| **Specification & Knowledge** | README, SRS (reverse-engineered), API docs, unified API catalog (Swagger/GraphQL) | *"Reverse-engineer the specs nobody ever wrote."* | Spec extraction & synthesis |
| **Health & Risk** | Tech debt audit (SonarQube equivalent), security vulnerability report (CodeQL equivalent), test coverage landscape, test plans | *"Know where your codebase is fragile, exposed, or untested."* | Security scanning & quality analysis |
| **Agent Infrastructure** | Agent-specific docs (AGENTS.md, CLAUDE.md), style guides, machine-readable architecture boundaries, guardrails, semantic conventions | *"The config layer that makes your codebase agent-native."* | Agent config generation |
| **Institutional Memory** | Multi-repo release notes, changelogs, analyst/compliance docs, chronological memory snapshots (mined from PR discussions, commits, merges). Integrates with [Entire Checkpoints CLI](https://github.com/entireio/cli) for agent provenance capture. | *"Turn your git history and PR discussions into organizational knowledge."* | Git history mining |
| **[Optional] Research Docs** | Scientific library documentation with arXiv/Semantic Scholar integration — for repos developed by researchers who left without proper docs | *"Bridge the gap between papers and production."* | Paper-to-code linking |


=============== OmniBoard page ====================
When people enter OmniBoard page, they should be provided with 