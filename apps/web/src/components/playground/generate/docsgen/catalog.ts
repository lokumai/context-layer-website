import type { ArtifactBundle } from "@context-layer/mocks";

// Single source of truth for DocsGen's tabs + cards.
//
// cardSlug values MUST stay in lock-step with the Phase 3 mocks
// (`packages/mocks/data/artifacts/index.json`) — the slug is the join key the
// UI uses to detect whether an artifact exists in state.artifacts[] and render
// the card in its "Done" state. A Vitest integrity test verifies the match.

export type DocsGenOutputFormat = "markdown" | "pdf";

export interface DocsGenCard {
  cardSlug: string;
  title: string;
  description: string;
  outputFormats: DocsGenOutputFormat[];
}

export interface DocsGenBundleDef {
  slug: ArtifactBundle;
  title: string;
  tagline: string;
  /** Background accent hex — colour-codes the tab + the "Done" chip. */
  accent: string;
  cards: DocsGenCard[];
}

export const DOCSGEN_CATALOG: Record<ArtifactBundle, DocsGenBundleDef> = {
  "structure-architecture": {
    slug: "structure-architecture",
    title: "Structure & Architecture",
    tagline: "See the bones of your system — how repos, services, and data flows connect.",
    accent: "#eef6ff",
    cards: [
      {
        cardSlug: "repo-map",
        title: "Repo Map",
        description: "Semantic map of every repository, their ownership, and inter-repo coupling.",
        outputFormats: ["markdown", "pdf"],
      },
      {
        cardSlug: "dependency-map",
        title: "Dependency Map",
        description: "Cross-repo call graph, event topology, shared-library usage.",
        outputFormats: ["markdown", "pdf"],
      },
      {
        cardSlug: "data-flow-diagram",
        title: "End-to-End Data Flow",
        description:
          "From user action through gateway, saga, outbox, broker, to the downstream projection.",
        outputFormats: ["markdown", "pdf"],
      },
      {
        cardSlug: "db-schema",
        title: "Database Schemas",
        description: "Per-service PostgreSQL schema, document shapes, and search mappings.",
        outputFormats: ["markdown", "pdf"],
      },
    ],
  },

  "specification-knowledge": {
    slug: "specification-knowledge",
    title: "Specification & Knowledge",
    tagline: "Reverse-engineer the specs nobody ever wrote.",
    accent: "#f5f2ef",
    cards: [
      {
        cardSlug: "readme",
        title: "README (reverse-engineered)",
        description: "Workspace-level README aligned with the actual state of the code.",
        outputFormats: ["markdown"],
      },
      {
        cardSlug: "srs",
        title: "Software Requirements Specification",
        description:
          "Functional + non-functional requirements mined from tests, routes, and domain models.",
        outputFormats: ["markdown", "pdf"],
      },
      {
        cardSlug: "api-docs",
        title: "API Reference",
        description: "Every public HTTP endpoint across all services, grouped and cross-linked.",
        outputFormats: ["markdown", "pdf"],
      },
      {
        cardSlug: "api-catalog",
        title: "Unified API Catalog",
        description:
          "OpenAPI-style inventory across the services, for API gateway / portal publication.",
        outputFormats: ["markdown", "pdf"],
      },
    ],
  },

  "health-risk": {
    slug: "health-risk",
    title: "Health & Risk",
    tagline: "Know where your codebase is fragile, exposed, or untested.",
    accent: "#fef3c7",
    cards: [
      {
        cardSlug: "tech-debt-audit",
        title: "Tech Debt Audit",
        description:
          "Where the codebase is fragile or likely to rot — a frozen snapshot for review.",
        outputFormats: ["markdown", "pdf"],
      },
      {
        cardSlug: "security-report",
        title: "Security Posture Report",
        description:
          "Findings by severity; a snapshot suitable for attaching to a compliance package.",
        outputFormats: ["markdown", "pdf"],
      },
      {
        cardSlug: "test-coverage-landscape",
        title: "Test Coverage Landscape",
        description:
          "Workspace-wide coverage map, critical-path gaps, and recommended investments.",
        outputFormats: ["markdown"],
      },
      {
        cardSlug: "test-plans",
        title: "Critical-Path Test Plans",
        description: "End-to-end test plans for the most business-critical saga flows.",
        outputFormats: ["markdown", "pdf"],
      },
    ],
  },

  agentify: {
    slug: "agentify",
    title: "Agentify",
    tagline: "Make this codebase agent-ready — structured context for Claude, Cursor, and friends.",
    accent: "#f0fdf4",
    cards: [
      {
        cardSlug: "agents-md",
        title: "AGENTS.md",
        description: "Agent-facing workspace overview — how to navigate, which services own what.",
        outputFormats: ["markdown"],
      },
      {
        cardSlug: "claude-md",
        title: "CLAUDE.md",
        description:
          "Claude-specific guidelines: preferred commands, where to find tests, boundaries to respect.",
        outputFormats: ["markdown"],
      },
      {
        cardSlug: "skill-catalog",
        title: "Skill Catalog",
        description: "Machine-readable inventory of agent skills available in this workspace.",
        outputFormats: ["markdown", "pdf"],
      },
      {
        cardSlug: "architecture-boundaries",
        title: "Architecture Boundaries",
        description: "Machine-readable service boundaries + allowed cross-service imports.",
        outputFormats: ["markdown"],
      },
      {
        cardSlug: "semantic-conventions",
        title: "Semantic Conventions",
        description: "Event naming, correlation-ID format, log field schema — a shared vocabulary.",
        outputFormats: ["markdown"],
      },
    ],
  },

  "institutional-memory": {
    slug: "institutional-memory",
    title: "Institutional Memory",
    tagline: "Turn your git history and PR discussions into organizational knowledge.",
    accent: "#fdf2f8",
    cards: [
      {
        cardSlug: "release-notes",
        title: "Multi-Repo Release Notes",
        description: "Aggregated changes across every repo, by quarter.",
        outputFormats: ["markdown", "pdf"],
      },
      {
        cardSlug: "changelog",
        title: "Consolidated Changelog",
        description: "Every notable change since v1.0.0, mined from PR titles and commits.",
        outputFormats: ["markdown"],
      },
      {
        cardSlug: "chronological-memory",
        title: "Chronological Memory",
        description: "Rationale and decisions mined from PR discussions and review threads.",
        outputFormats: ["markdown", "pdf"],
      },
    ],
  },

  "research-docs": {
    slug: "research-docs",
    title: "Research Docs",
    tagline: "Bridge the gap between papers and production.",
    accent: "#ede9fe",
    cards: [
      {
        cardSlug: "research-report",
        title: "Research Report",
        description:
          "Short arXiv / Semantic-Scholar-grounded literature review tied to the codebase.",
        outputFormats: ["markdown", "pdf"],
      },
    ],
  },
};

export const DOCSGEN_BUNDLES: ArtifactBundle[] = [
  "structure-architecture",
  "specification-knowledge",
  "health-risk",
  "agentify",
  "institutional-memory",
  "research-docs",
];

export function isValidBundleSlug(slug: string): slug is ArtifactBundle {
  return (DOCSGEN_BUNDLES as string[]).includes(slug);
}

export function getCardDef(bundle: ArtifactBundle, cardSlug: string): DocsGenCard | undefined {
  return DOCSGEN_CATALOG[bundle].cards.find((c) => c.cardSlug === cardSlug);
}
