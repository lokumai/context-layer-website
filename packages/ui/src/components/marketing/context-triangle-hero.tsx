"use client";

import { motion, useReducedMotion } from "motion/react";
import { Bot, User } from "lucide-react";

// Signature hero animation.
// Tells the full product story in one visual:
//   Pool of crowded sources (bottom)  ──►  Context Layer (middle)  ──►  Human + AI Agent (top)

const VIEW_W = 600;
const VIEW_H = 640;
const BASE_PATH = "/context-layer-website";

interface Source {
  id: string;
  kind: keyof typeof BRAND_ICONS | keyof typeof CUSTOM_ICONS;
  cx: number;
  cy: number;
  r: number;
}

// Brand SVG paths (24x24 viewBox each, sourced from inline SVG paths).
// Each entry: {path, color (brand mark), bg (subtle tint behind icon)}.
const BRAND_ICONS = {
  github: {
    path: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
    color: "#181717",
  },
  gdrive: {
    path: "",
    paths: [
      {
        d: "M12.01 1.485c-2.082 0-3.754.02-3.743.047.01.02 1.708 3.001 3.774 6.62l3.76 6.574h3.76c2.081 0 3.753-.02 3.742-.047-.005-.02-1.708-3.001-3.775-6.62l-3.76-6.574z",
        fill: "#fdce4a",
      },
      {
        d: "M7.25 3.214a789.828 789.861 0 0 0-3.63 6.319L0 15.868l1.89 3.298 1.885 3.297 3.62-6.335 3.618-6.33-1.88-3.287C8.1 4.704 7.255 3.22 7.25 3.214z",
        fill: "#21a363",
      },
      {
        d: "M9.509 15.867l-.203.348c-.114.198-.96 1.672-1.88 3.287a423.93 423.948 0 0 1-1.698 2.97c-.01.026 3.24.042 7.222.042h7.244l1.796-3.157c.992-1.734 1.85-3.23 1.906-3.323l.104-.167h-7.249z",
        fill: "#498af4",
      },
    ],
    color: "#0F9D58",
  },
  mermaid: {
    path: "M23.99 2.115A12.223 12.223 0 0 0 12 10.149 12.223 12.223 0 0 0 .01 2.115a12.23 12.23 0 0 0 5.32 10.604 6.562 6.562 0 0 1 2.845 5.423v3.754h7.65v-3.754a6.561 6.561 0 0 1 2.844-5.423 12.223 12.223 0 0 0 5.32-10.604Z",
    color: "#FF3670",
  },
  notion: {
    path: "M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936.585l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.681z",
    color: "#000000",
  },
  jira: {
    path: "M11.571 11.513H0a5.218 5.218 0 0 0 5.232 5.215h2.13v2.057A5.215 5.215 0 0 0 12.575 24V12.518a1.005 1.005 0 0 0-1.005-1.005zm5.723-5.756H5.736a5.215 5.215 0 0 0 5.215 5.214h2.129v2.058a5.218 5.218 0 0 0 5.215 5.214V6.762a1.005 1.005 0 0 0-1.001-1.005zM23.013 0H11.456a5.215 5.215 0 0 0 5.215 5.215h2.129v2.057A5.215 5.215 0 0 0 24 12.483V1.005A1.005 1.005 0 0 0 23.013 0z",
    color: "#2684FF",
  },
  gitlab: {
    path: "m23.6004 9.5927-.0337-.0862L20.3.9814a.851.851 0 0 0-.3362-.405.8748.8748 0 0 0-.9997.0539.8748.8748 0 0 0-.29.4399l-2.2055 6.748H7.5375l-2.2057-6.748a.8573.8573 0 0 0-.29-.4412.8748.8748 0 0 0-.9997-.0537.8585.8585 0 0 0-.3362.4049L.4332 9.5015l-.0325.0862a6.0657 6.0657 0 0 0 2.0119 7.0105l.0113.0087.03.0213 4.976 3.7264 2.462 1.8633 1.4995 1.1321a1.0085 1.0085 0 0 0 1.2197 0l1.4995-1.1321 2.4619-1.8633 5.006-3.7489.0125-.01a6.0682 6.0682 0 0 0 2.0094-7.003z",
    color: "#FC6D26",
  },
  git: {
    path: "M23.546 10.93L13.067.452c-.604-.603-1.582-.603-2.188 0L8.708 2.627l2.76 2.76c.645-.215 1.379-.07 1.889.441.516.515.658 1.258.438 1.9l2.658 2.66c.645-.223 1.387-.078 1.9.435.721.72.721 1.884 0 2.604-.719.719-1.881.719-2.6 0-.539-.541-.674-1.337-.404-1.996L12.86 8.955v6.525c.176.086.342.203.488.348.713.721.713 1.883 0 2.6-.719.721-1.889.721-2.609 0-.719-.719-.719-1.879 0-2.598.182-.18.387-.316.605-.406V8.835c-.217-.091-.424-.222-.6-.401-.545-.545-.676-1.342-.396-2.009L7.636 3.7.45 10.881c-.6.605-.6 1.584 0 2.189l10.48 10.477c.604.604 1.582.604 2.186 0l10.43-10.43c.605-.603.605-1.582 0-2.187",
    color: "#F05032",
  },
  figma: {
    path: "M15.852 8.981h-4.588V0h4.588a4.49 4.49 0 1 1 0 8.981zM12.735 7.51h3.117a3.019 3.019 0 1 0 0-6.039h-3.117zm0 1.471H8.148a4.49 4.49 0 0 1 0-8.981h4.587zm-4.587-7.51a3.019 3.019 0 1 0 0 6.04h3.117V1.47zm0 16.019a4.49 4.49 0 0 1 0-8.98h4.587v4.49a4.495 4.495 0 0 1-4.587 4.49zm0-7.509a3.019 3.019 0 1 0 0 6.038 3.022 3.022 0 0 0 3.117-3.019v-3.02zm7.704 0a4.49 4.49 0 1 1 0 8.98 4.49 4.49 0 0 1 0-8.98zm0 7.509a3.019 3.019 0 1 0 0-6.038 3.019 3.019 0 0 0 0 6.038z",
    color: "#F24E1E",
  },
  confluence: {
    path: "M.87 18.257c-.248.382-.531.83-.79 1.205a.79.79 0 0 0 .279 1.072l5.353 3.279a.764.764 0 0 0 1.072-.252c.213-.388.51-.96.823-1.526 2.207-3.66 4.475-3.21 8.541-1.193l5.305 2.59a.793.793 0 0 0 1.078-.388l2.55-5.776a.764.764 0 0 0-.387-1.018c-1.118-.524-3.345-1.572-5.387-2.553-7.395-3.564-13.587-3.331-18.437 4.56zm22.358-12.37c.247-.383.53-.831.79-1.207a.79.79 0 0 0-.28-1.072L18.387.328a.764.764 0 0 0-1.116.265c-.213.389-.51.961-.823 1.526-2.207 3.66-4.475 3.211-8.541 1.194L2.633.723A.793.793 0 0 0 1.555 1.11l-2.55 5.777a.764.764 0 0 0 .388 1.018c1.117.523 3.344 1.571 5.386 2.552 7.408 3.558 13.6 3.305 18.45-4.59z",
    color: "#172B4D",
  },
  linear: {
    path: "M.403 13.795 10.205 23.597a12.005 12.005 0 0 1-3.624-1.96L.403 13.795zM.012 11.751l12.237 12.237a12.207 12.207 0 0 1-2.499-.317L.329 14.25a12.207 12.207 0 0 1-.317-2.499zm.978-4.196 16.6 16.6q-1.198.357-2.487.55L.44 10.043q.193-1.29.55-2.487zM2.39 5.214 18.785 21.61a12.066 12.066 0 0 0 2.825-2.825L5.214 2.39A12.066 12.066 0 0 0 2.39 5.214zM5.213 2.39c4.626-3.187 11.024-2.722 15.121 1.376 4.098 4.097 4.563 10.495 1.376 15.121L5.213 2.39z",
    color: "#5E6AD2",
  },
  slack: {
    path: "M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z",
    color: "#611F69",
  },
  pdf: {
    path: "M5.523 0C4.337 0 3.375.961 3.375 2.148v19.704C3.375 23.038 4.337 24 5.523 24h12.954c1.186 0 2.148-.962 2.148-2.148V7.426L13.523 0zM5.523 1.5h7.227v6h6v14.352a.65.65 0 0 1-.273.648H5.523a.65.65 0 0 1-.648-.648V2.148a.65.65 0 0 1 .648-.648zm2.227 8.625v6h1.5v-2.25h.75c.825 0 1.5-.675 1.5-1.5v-.75c0-.825-.675-1.5-1.5-1.5H7.75zm1.5 1.5h.75v.75h-.75v-.75zm3.75-1.5v6h2.25c.825 0 1.5-.675 1.5-1.5v-3c0-.825-.675-1.5-1.5-1.5h-2.25zm1.5 1.5h.75v3h-.75v-3z",
    color: "#DC2626",
  },
  md: {
    path: "M22.27 19.385H1.73A1.73 1.73 0 0 1 0 17.655V6.345a1.73 1.73 0 0 1 1.73-1.73h20.54A1.73 1.73 0 0 1 24 6.345v11.308a1.73 1.73 0 0 1-1.73 1.731zM5.769 15.923v-4.5l2.308 2.885 2.307-2.885v4.5h2.308V8.078h-2.308l-2.307 2.885-2.308-2.885H3.46v7.847zM21.232 12h-2.309V8.077h-2.307V12h-2.308l3.461 4.039z",
    color: "#525252",
  },
  discord: {
    path: "M20.317 4.3698a19.7913 19.7913 0 0 0-4.8851-1.5152.0741.0741 0 0 0-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 0 0-.0785-.037 19.7363 19.7363 0 0 0-4.8852 1.515.0699.0699 0 0 0-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 0 0 .0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 0 0 .0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 0 0-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 0 1-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 0 1 .0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 0 1 .0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 0 1-.0066.1276 12.2986 12.2986 0 0 1-1.873.8914.0766.0766 0 0 0-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 0 0 .0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 0 0 .0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 0 0-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z",
    color: "#5865F2",
  },
  codebase: {
    path: "M12 2C6.48 2 2 3.68 2 5.5C2 7.32 6.48 9 12 9C17.52 9 22 7.32 22 5.5C22 3.68 17.52 2 12 2ZM2 8.5V12.5C2 14.32 6.48 16 12 16C17.52 16 22 14.32 22 12.5V8.5C22 10.32 17.52 12 12 12C6.48 12 2 10.32 2 8.5ZM2 15.5V19.5C2 21.32 6.48 23 12 23C17.52 23 22 21.32 22 19.5V15.5C22 17.32 17.52 19 12 19C6.48 19 2 17.32 2 15.5Z",
    color: "#334155",
  },
} as const;

const CUSTOM_ICONS = {
  code: {
    text: "</>",
    color: "#111827",
    bg: "#f5f5f5",
  },
} as const;

const SOURCES: Source[] = [
  // Row 1 (Closest to Context Layer)
  { id: "github", kind: "github", cx: 236, cy: 376, r: 30 },
  { id: "code", kind: "code", cx: 300, cy: 368, r: 28 },
  { id: "codebase", kind: "codebase", cx: 364, cy: 376, r: 26 },

  // Row 1.5 (git & gitlab)
  { id: "git", kind: "git", cx: 192, cy: 412, r: 24 },
  { id: "gitlab", kind: "gitlab", cx: 408, cy: 412, r: 24 },

  // Row 2 (Middle)
  { id: "pdf", kind: "pdf", cx: 168, cy: 460, r: 27 },
  { id: "mermaid", kind: "mermaid", cx: 252, cy: 444, r: 28 },
  { id: "notion", kind: "notion", cx: 348, cy: 444, r: 24 },
  { id: "jira", kind: "jira", cx: 432, cy: 460, r: 24 },

  // Row 3 (Bottom)
  { id: "slack", kind: "slack", cx: 232, cy: 504, r: 28 },
  { id: "gdrive", kind: "gdrive", cx: 300, cy: 512, r: 26 },
  { id: "md", kind: "md", cx: 368, cy: 504, r: 24 },
];

const CONTEXT_POS = { x: VIEW_W / 2, y: 220 };
const HUMAN_POS = { x: 94, y: 80 };
const AGENT_POS = { x: 506, y: 80 };

// Color tokens
const HUMAN_COLOR = "#b45309"; // amber / orange-brown
const AGENT_COLOR = "#1d4ed8"; // blue
const CONTEXT_COLOR = "#10b981"; // green

export function ContextTriangleHero() {
  const reduce = useReducedMotion();
  return (
    <div className="relative w-full max-w-[620px] mx-auto">
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="w-full h-auto"
        role="img"
        aria-label="Context Layer turns a pool of sources into shared knowledge for Human Dev and AI Agent — the AI-SDLC Triangle"
      >
        <title>AI-SDLC Triangle</title>

        <defs>
          <linearGradient id="gdrive-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#21a363" />
            <stop offset="38%" stopColor="#fdce4a" />
            <stop offset="68%" stopColor="#498af4" />
            <stop offset="100%" stopColor="#3e6fc9" />
          </linearGradient>
          {/* Source → context tendril gradient (neutral → green) */}
          <linearGradient id="tendril-src" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#a8a29e" stopOpacity="0.35" />
            <stop offset="100%" stopColor={CONTEXT_COLOR} stopOpacity="0.9" />
          </linearGradient>
          <radialGradient id="glow-green" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={CONTEXT_COLOR} stopOpacity="0.28" />
            <stop offset="70%" stopColor={CONTEXT_COLOR} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="glow-blue" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={AGENT_COLOR} stopOpacity="0.18" />
            <stop offset="70%" stopColor={AGENT_COLOR} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="glow-amber" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={HUMAN_COLOR} stopOpacity="0.18" />
            <stop offset="70%" stopColor={HUMAN_COLOR} stopOpacity="0" />
          </radialGradient>
          <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="1" />
          </pattern>
        </defs>

        {/* Blueprint background */}
        <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill="url(#grid)" />

        {/* Ambient corner glows — Human=amber, Agent=blue, Context=green */}
        <circle cx={HUMAN_POS.x} cy={HUMAN_POS.y} r="150" fill="url(#glow-amber)" />
        <circle cx={AGENT_POS.x} cy={AGENT_POS.y} r="150" fill="url(#glow-blue)" />
        <circle cx={CONTEXT_POS.x} cy={CONTEXT_POS.y} r="170" fill="url(#glow-green)" />

        {/* Top-center label */}
        <text
          x={VIEW_W / 2}
          y={32}
          textAnchor="middle"
          fontSize="18"
          fontFamily="var(--font-sans)"
          fontWeight="600"
          letterSpacing="2.2"
          fill="#777169"
        >
          AI-SDLC TRIANGLE
        </text>

        {/* Triangle EDGES (drawn first, behind the vertex cards) */}
        <TriangleEdges reduce={reduce} />

        {/* Context → Human tendril (amber, pulsing) */}
        <AnimatedLine
          from={CONTEXT_POS}
          to={{ x: HUMAN_POS.x + 40, y: HUMAN_POS.y + 14 }}
          color={HUMAN_COLOR}
          reduce={reduce}
          delay={0.4}
        />
        {/* Context → Agent tendril (blue, pulsing) */}
        <AnimatedLine
          from={CONTEXT_POS}
          to={{ x: AGENT_POS.x - 40, y: AGENT_POS.y + 14 }}
          color={AGENT_COLOR}
          reduce={reduce}
          delay={1.0}
        />

        {/* Source pool → Context tendrils */}
        {SOURCES.map((s, i) => (
          <SourceTendril key={s.id} source={s} index={i} reduce={reduce} />
        ))}

        {/* Source circles (crowded pool) */}
        {SOURCES.map((s, i) => (
          <SourceCircle key={s.id} source={s} index={i} reduce={reduce} />
        ))}

        {/* Scan line + particles */}
        {!reduce ? <ScanLine /> : null}

        {/* Context Layer card */}
        <ContextNode reduce={reduce} />

        {/* Triangle vertices */}
        <VertexCard pos={HUMAN_POS} tone="human" icon="user" />
        <VertexCard pos={AGENT_POS} tone="agent" icon="bot" />
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function SourceCircle({
  source,
  index,
  reduce,
}: {
  source: Source;
  index: number;
  reduce: boolean | null;
}) {
  const brand =
    source.kind in BRAND_ICONS ? BRAND_ICONS[source.kind as keyof typeof BRAND_ICONS] : null;
  const iconSize = source.r * 1.15;
  const scale = iconSize / 24;
  const iconOffset = iconSize / 2;
  const custom =
    source.kind in CUSTOM_ICONS ? CUSTOM_ICONS[source.kind as keyof typeof CUSTOM_ICONS] : null;

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.7 }}
      animate={reduce ? { opacity: 1, scale: 1 } : { opacity: 1, scale: [1, 1.04, 1] }}
      transition={
        reduce
          ? { duration: 0.5, delay: 0.05 + index * 0.04 }
          : {
              opacity: { duration: 0.5, delay: 0.05 + index * 0.04 },
              scale: {
                duration: 4 + (index % 4) * 0.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: index * 0.2,
              },
            }
      }
      style={{ transformOrigin: `${source.cx}px ${source.cy}px`, transformBox: "fill-box" }}
    >
      {/* outer soft halo */}
      <circle
        cx={source.cx}
        cy={source.cy}
        r={source.r + 4}
        fill={brand?.color ?? "#000000"}
        opacity="0.06"
      />
      {/* circle bg */}
      <circle
        cx={source.cx}
        cy={source.cy}
        r={source.r}
        fill="#ffffff"
        stroke="rgba(0,0,0,0.07)"
        strokeWidth="1"
        filter="drop-shadow(0px 2px 5px rgba(0,0,0,0.07))"
      />
      {/* brand icon centered */}
      {custom ? (
        <>
          <circle cx={source.cx} cy={source.cy} r={source.r - 8} fill={custom.bg} opacity="0.95" />
          <text
            x={source.cx}
            y={source.cy + (custom.text === "</>" ? 4 : 5)}
            textAnchor="middle"
            fontSize={custom.text === "</>" ? source.r * 0.56 : source.r * 0.58}
            fontFamily="var(--font-mono)"
            fontWeight="700"
            fill={custom.color}
          >
            {custom.text}
          </text>
        </>
      ) : (
        <g
          transform={`translate(${source.cx - iconOffset} ${source.cy - iconOffset}) scale(${scale})`}
        >
          {(brand as any)?.paths ? (
            ((brand as any).paths as { d: string; fill: string }[]).map((p, i) => (
              <path key={i} d={p.d} fill={p.fill} />
            ))
          ) : (
            <path d={brand?.path ?? ""} fill={brand?.color ?? "#000000"} />
          )}
        </g>
      )}
    </motion.g>
  );
}

function ContextNode({ reduce }: { reduce: boolean | null }) {
  const w = 300;
  const h = 112;
  const x = CONTEXT_POS.x - w / 2;
  const y = CONTEXT_POS.y - h / 2;

  return (
    <g>
      {/* pulsing halo */}
      {!reduce ? (
        <motion.circle
          cx={CONTEXT_POS.x}
          cy={CONTEXT_POS.y}
          r="92"
          fill="url(#glow-green)"
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 3.6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          style={{ transformOrigin: `${CONTEXT_POS.x}px ${CONTEXT_POS.y}px` }}
        />
      ) : null}

      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="14"
        fill="#ffffff"
        stroke="#a7f3d0"
        strokeWidth="1.5"
        filter="drop-shadow(0px 6px 18px rgba(16,185,129,0.16))"
      />

      <image
        href={`${BASE_PATH}/logo_square.svg`}
        x={CONTEXT_POS.x - 110}
        y={CONTEXT_POS.y - 110}
        width="220"
        height="220"
        preserveAspectRatio="xMidYMid meet"
      />
    </g>
  );
}

function VertexCard({
  pos,
  tone,
  icon,
}: {
  pos: { x: number; y: number };
  tone: "human" | "agent";
  icon: "user" | "bot";
}) {
  const w = 186;
  const h = 82;
  const x = pos.x - w / 2;
  const y = pos.y - h / 2;
  const color = tone === "human" ? HUMAN_COLOR : AGENT_COLOR;
  const bg = tone === "human" ? "#fff7ed" : "#eff6ff";
  return (
    <motion.g
      initial={{ opacity: 0.35 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, delay: 3 }}
    >
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="13"
        fill="#ffffff"
        stroke="rgba(0,0,0,0.08)"
        strokeWidth="1"
        filter="drop-shadow(0px 2px 6px rgba(0,0,0,0.05))"
      />
      <rect x={x + 16} y={y + 24} width="34" height="34" rx="9" fill={bg} />
      <foreignObject x={x + 20} y={y + 28} width="28" height="28">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color,
            width: "100%",
            height: "100%",
          }}
        >
          {icon === "user" ? (
            <User size={21} strokeWidth={1.5} />
          ) : (
            <Bot size={21} strokeWidth={1.5} />
          )}
        </div>
      </foreignObject>
      <text
        x={x + 64}
        y={y + 46}
        fontSize="16"
        fontFamily="var(--font-sans)"
        fontWeight="700"
        fill="#0a0a0a"
      >
        {icon === "user" ? "Human Dev" : "AI Agent"}
      </text>
    </motion.g>
  );
}

function TriangleEdges({ reduce }: { reduce: boolean | null }) {
  // Three edges of the AI-SDLC triangle.
  // Human ↔ Context (amber), Context ↔ Agent (blue), Human ↔ Agent (neutral).
  const edges = [
    { from: HUMAN_POS, to: CONTEXT_POS, color: HUMAN_COLOR, delay: 0 },
    { from: CONTEXT_POS, to: AGENT_POS, color: AGENT_COLOR, delay: 1.8 },
    { from: HUMAN_POS, to: AGENT_POS, color: "#777169", delay: 3.6 },
  ];

  return (
    <g>
      {edges.map((e) => (
        <g key={`${e.from.x}-${e.to.x}`}>
          <line
            x1={e.from.x}
            y1={e.from.y + 28}
            x2={e.to.x}
            y2={e.to.y + 28}
            stroke="rgba(0,0,0,0.15)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
          {!reduce ? (
            <motion.circle
              r="3.5"
              fill={e.color}
              initial={{ cx: e.from.x, cy: e.from.y + 28, opacity: 0 }}
              animate={{
                cx: [e.from.x, e.to.x],
                cy: [e.from.y + 28, e.to.y + 28],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 1.6,
                delay: e.delay,
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: 4,
                ease: "easeInOut",
              }}
            />
          ) : null}
        </g>
      ))}
    </g>
  );
}

function SourceTendril({
  source,
  index,
  reduce,
}: {
  source: Source;
  index: number;
  reduce: boolean | null;
}) {
  // Origin: top of the source circle.
  const fromX = source.cx;
  const fromY = source.cy - source.r;
  // Destination: bottom of the context card, with slight lateral scatter so paths don't overlap.
  const scatter = ((index % 7) - 3) * 14;
  const toX = CONTEXT_POS.x + scatter;
  const toY = CONTEXT_POS.y + 60;
  // Bezier control points for a soft S-curve toward the center.
  const midY = (fromY + toY) / 2;
  const c1x = fromX;
  const c1y = midY;
  const c2x = toX;
  const c2y = midY;
  const d = `M ${fromX} ${fromY} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${toX} ${toY}`;

  return (
    <g>
      <path d={d} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="1" />
      {!reduce ? (
        <motion.path
          d={d}
          fill="none"
          stroke="url(#tendril-src)"
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 0.85, 0.85, 0] }}
          transition={{
            duration: 2.6,
            delay: (index % 6) * 0.45,
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: 2.8,
            ease: "easeInOut",
          }}
        />
      ) : null}
    </g>
  );
}

function AnimatedLine({
  from,
  to,
  color,
  reduce,
  delay,
}: {
  from: { x: number; y: number };
  to: { x: number; y: number };
  color: string;
  reduce: boolean | null;
  delay: number;
}) {
  if (reduce) {
    return (
      <line
        x1={from.x}
        y1={from.y}
        x2={to.x}
        y2={to.y}
        stroke={color}
        strokeOpacity="0.35"
        strokeWidth="1"
      />
    );
  }
  return (
    <motion.circle
      r="3"
      fill={color}
      initial={{ cx: from.x, cy: from.y, opacity: 0 }}
      animate={{
        cx: [from.x, to.x],
        cy: [from.y, to.y],
        opacity: [0, 0.9, 0.9, 0],
      }}
      transition={{
        duration: 1.8,
        delay,
        repeat: Number.POSITIVE_INFINITY,
        repeatDelay: 2.6,
        ease: "easeInOut",
      }}
    />
  );
}

function ScanLine() {
  return (
    <g>
      <motion.line
        x1={VIEW_W / 2 - 200}
        x2={VIEW_W / 2 + 200}
        stroke={CONTEXT_COLOR}
        strokeWidth="1.5"
        strokeOpacity="0.55"
        initial={{ y1: 540, y2: 540 }}
        animate={{ y1: [540, 290], y2: [540, 290], opacity: [0, 0.7, 0.7, 0] }}
        transition={{ duration: 4.2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      {/* green particles drifting up from the source pool */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <motion.circle
          key={i}
          r="1.6"
          fill={CONTEXT_COLOR}
          initial={{ cx: VIEW_W / 2 + (i - 2.5) * 28, cy: 480 + i * 8, opacity: 0 }}
          animate={{
            cy: [480 + i * 8, 260 + i * 6],
            opacity: [0, 0.9, 0],
          }}
          transition={{
            duration: 3.2,
            delay: i * 0.4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeOut",
          }}
        />
      ))}
    </g>
  );
}
