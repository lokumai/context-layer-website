import {
  getLlmsTxt,
  getSagaFlows,
  getWikiPage,
  getWikiTree,
  getWorkspaceNarrative,
} from "@context-layer/mocks";

export type WikiScope = "workspace" | "repo" | "page" | "llms";

export interface WikiToolInput {
  scope: WikiScope;
  repoId?: string;
  slug?: string;
  llms?: string;
}

// MCP SDK's CallToolResult has an index signature; adding [k: string]: unknown
// lets our narrower helpers assign without a structural-width error.
export interface ToolTextResponse {
  content: Array<{ type: "text"; text: string }>;
  isError?: boolean;
  [k: string]: unknown;
}

// Dispatches the `get_wiki_content` tool to the right loader based on scope.
// Each branch returns a single markdown text block so the calling agent gets
// something immediately useful; no nested JSON unless the tree itself is the
// payload (scope: "repo").

export async function getWikiContent(input: WikiToolInput): Promise<ToolTextResponse> {
  switch (input.scope) {
    case "workspace": {
      const [narrative, saga] = await Promise.all([getWorkspaceNarrative(), getSagaFlows()]);
      const body = [
        "# Workspace narrative",
        narrative.markdown,
        "",
        "# Saga flows",
        saga.markdown,
      ].join("\n\n");
      return textBlock(body);
    }

    case "repo": {
      if (!input.repoId) {
        return errorBlock('`scope: "repo"` requires `repoId`.');
      }
      const [tree, llms] = await Promise.all([getWikiTree(input.repoId), getLlmsTxt(input.repoId)]);
      const body = [
        `# ${input.repoId} — wiki tree`,
        "```json",
        JSON.stringify(tree, null, 2),
        "```",
        "",
        `# ${input.repoId} — llms.txt`,
        llms.markdown,
      ].join("\n\n");
      return textBlock(body);
    }

    case "page": {
      if (!input.repoId || !input.slug) {
        return errorBlock('`scope: "page"` requires `repoId` and `slug`.');
      }
      try {
        const page = await getWikiPage(input.repoId, input.slug);
        return textBlock(page.markdown);
      } catch (err) {
        return errorBlock(
          `Could not load page ${input.repoId}/${input.slug}: ${(err as Error).message}`,
        );
      }
    }

    case "llms": {
      if (!input.llms) {
        return errorBlock('`scope: "llms"` requires `llms` (repo id or "_workspace").');
      }
      const target = input.llms === "_workspace" ? null : input.llms;
      const llms = await getLlmsTxt(target);
      return textBlock(llms.markdown);
    }
  }
}

function textBlock(text: string): ToolTextResponse {
  return { content: [{ type: "text", text }] };
}

function errorBlock(text: string): ToolTextResponse {
  return { content: [{ type: "text", text }], isError: true };
}
