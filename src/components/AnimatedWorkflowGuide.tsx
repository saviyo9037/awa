"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Handle,
  Position,
  MarkerType,
  type Edge,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Lightbulb,
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Sparkles,
  Zap,
  Layers,
  Sliders,
  Check,
  Compass,
  ArrowRight,
  Activity,
  Terminal,
} from "lucide-react";

// ============================================================================
// 1. DATA MODELS & CONFIGURATION
// ============================================================================

export type GuideStep = {
  id: string;
  step: number;
  phase?: string;
  title: string;
  description: string;
  tip?: string;
  params?: string[];
};

// Category-specific high-impact AI production workflows
const categoryGuideConfig: Record<string, GuideStep[]> = {
  "image-generation": [
    {
      id: "step-1",
      step: 1,
      phase: "ENVIRONMENT SETUP",
      title: "Launch Image Studio",
      description: "Open your target generation platform (Midjourney, FLUX WebUI, or Stable Diffusion canvas).",
      params: ["Interface: Prompt Console", "Engine: Stable Diffusion / FLUX / MJ"],
    },
    {
      id: "step-2",
      step: 2,
      phase: "CANVAS CONFIGURATION",
      title: "Set Dimensions & Aspect Ratio",
      description: "Configure your canvas aspect ratio (e.g. 16:9 for landscape cinema, 9:16 for vertical reels, or 1:1 for portraits).",
      tip: "Ensure your target model supports the chosen aspect ratio natively to avoid distorted framing.",
      params: ["--ar 16:9", "Resolution: 3840×2160 (Upscaled)"],
    },
    {
      id: "step-3",
      step: 3,
      phase: "PROMPT INGESTION",
      title: "Paste Master Directive",
      description: "Copy the blueprint prompt into the prompt box. Retain technical modifiers, lighting cues, and camera angles.",
      tip: "Place the subject at the beginning of the prompt and stylistic/lighting directives at the end.",
      params: ["Subject", "Lighting: Volumetric", "Camera: 85mm f/1.8"],
    },
    {
      id: "step-4",
      step: 4,
      phase: "PARAMETER TUNING",
      title: "Tune Guidance & Sampler",
      description: "Adjust Guidance Scale (CFG: 6.5–8.0) and generation steps (28–40 steps) for crisp photoreal detail.",
      params: ["CFG: 7.0", "Steps: 35", "Sampler: Euler a / DPM++ 2M"],
    },
    {
      id: "step-5",
      step: 5,
      phase: "SYNTHESIS",
      title: "Execute Generation Batch",
      description: "Trigger the initial generation batch to produce a 4-variation conceptual grid.",
      params: ["Batch Size: 4", "Seed: Random"],
    },
    {
      id: "step-6",
      step: 6,
      phase: "QUALITY INSPECTION",
      title: "Evaluate Anatomical & Lighting Fidelity",
      description: "Inspect the output grid for anatomical consistency, reflections, and composition balance.",
      tip: "Look closely at edges, hands, text, and specular highlights before committing to an upscale.",
    },
    {
      id: "step-7",
      step: 7,
      phase: "ENHANCEMENT",
      title: "Upscale & High-Frequency Polish",
      description: "Upscale your best variation to 4K resolution using subtle creative upscaling to preserve texture.",
      params: ["Upscale: 2x / 4x", "Denoising: 0.25"],
    },
    {
      id: "step-8",
      step: 8,
      phase: "DELIVERY",
      title: "Export Production Asset",
      description: "Download the uncompressed PNG/TIFF deliverable ready for commercial usage or compositing.",
      params: ["Format: PNG (Lossless)", "Color Space: sRGB"],
    },
  ],

  "video-generation": [
    {
      id: "step-1",
      step: 1,
      phase: "WORKSPACE",
      title: "Open AI Video Studio",
      description: "Launch Runway Gen-3, Luma Dream Machine, Kling AI, or Sora console.",
      params: ["Platform: Gen-3 / Luma / Kling", "Mode: Text / Image to Video"],
    },
    {
      id: "step-2",
      step: 2,
      phase: "ASSET INITIALIZATION",
      title: "Upload Keyframe Reference",
      description: "Provide the primary source visual or let the AI synthesize the opening frame directly from prompt text.",
      tip: "High-contrast keyframes produce significantly steadier motion trajectories.",
      params: ["Initial Frame: 1080p+", "Orientation: Horizontal 16:9"],
    },
    {
      id: "step-3",
      step: 3,
      phase: "MOTION DIRECTIVES",
      title: "Define Dynamic Motion Prompt",
      description: "Specify camera movement (dolly zoom, orbital pan, aerial push-in) and subject velocity.",
      tip: "Describe camera trajectory and subject actions as separate clauses for smoother rendering.",
      params: ["Camera: Slow Orbit + Push-in", "Motion Velocity: 4.5/10"],
    },
    {
      id: "step-4",
      step: 4,
      phase: "TEMPORAL CONTROLS",
      title: "Configure Duration & Frame Rate",
      description: "Set timeline length to 5s–10s with smooth frame interpolation at 24fps or 60fps.",
      params: ["Duration: 5-10s", "FPS: 24/60", "Loop: Off"],
    },
    {
      id: "step-5",
      step: 5,
      phase: "SYNTHESIS",
      title: "Render Motion Sequence",
      description: "Queue video generation and allow temporal neural layers to simulate fluid camera dynamics.",
      params: ["Engine: Temporal Diffusion", "Render Queue: Priority"],
    },
    {
      id: "step-6",
      step: 6,
      phase: "MOTION AUDIT",
      title: "Inspect Coherence & Artifacts",
      description: "Review playback at 0.5x speed to check for frame flickering, morphing, or perspective warp.",
      tip: "If warping occurs, lower motion intensity by 15% and re-render.",
    },
    {
      id: "step-7",
      step: 7,
      phase: "POST-PROCESSING",
      title: "Interpolate & Enhance Clarity",
      description: "Apply motion stabilization and AI resolution upscaling (Topaz Video AI / runway enhancer).",
      params: ["Enhancer: 4K UHD", "Stabilization: Active"],
    },
    {
      id: "step-8",
      step: 8,
      phase: "DELIVERY",
      title: "Export Master MP4",
      description: "Download the final cinema-grade ProRes or H.265 master file ready for social or commercial broadcast.",
      params: ["Codec: H.264/H.265", "Bitrate: 25 Mbps"],
    },
  ],

  "website-generation": [
    {
      id: "step-1",
      step: 1,
      phase: "ENVIRONMENT",
      title: "Launch AI Web Builder",
      description: "Open your AI web platform (v0 by Vercel, Lovable, Bolt.new, or Claude 3.7 Artifacts).",
      params: ["Stack: Next.js + Tailwind CSS", "Components: Radix / Lucide"],
    },
    {
      id: "step-2",
      step: 2,
      phase: "ARCHITECTURE",
      title: "Initialize Project Sandbox",
      description: "Create a fresh Next.js App Router workspace with dark mode and responsive container setup.",
      params: ["Framework: Next.js 15+", "Styling: Tailwind CSS v4"],
    },
    {
      id: "step-3",
      step: 3,
      phase: "PROMPT DIRECTIVE",
      title: "Submit Blueprint Specification",
      description: "Paste the complete architectural blueprint containing layout hierarchy, theme colors, and interactivity.",
      tip: "Structure your prompt with clear sections: Header, Hero, Bento Grid, Features, and Responsive Breakpoints.",
      params: ["Dark Obsidian Theme", "Bento Grid Layout", "Framer Motion"],
    },
    {
      id: "step-4",
      step: 4,
      phase: "CODE SYNTHESIS",
      title: "Synthesize Components & Logic",
      description: "Watch the AI generate clean React components, typed props, state hooks, and accessible markup.",
      params: ["TypeScript: Strict", "Accessibility: WCAG AA"],
    },
    {
      id: "step-5",
      step: 5,
      phase: "PREVIEW & AUDIT",
      title: "Verify Responsive Breakpoints",
      description: "Test interactive viewport states across desktop (1440px), tablet (768px), and mobile (375px).",
      tip: "Verify touch-friendly buttons, hamburger navigation, and text wrapping on mobile viewports.",
    },
    {
      id: "step-6",
      step: 6,
      phase: "ITERATION",
      title: "Refine Micro-Interactions",
      description: "Use conversational follow-up prompts to polish hover glows, glassmorphism blur, and transitions.",
      params: ["Hover: Scale 1.02", "Transitions: Spring 300ms"],
    },
    {
      id: "step-7",
      step: 7,
      phase: "INTEGRATION",
      title: "Connect Real APIs & Data",
      description: "Link live database endpoints, authentication sessions, and webhooks into your generated components.",
      params: ["Data: REST / Supabase", "State: React Hooks"],
    },
    {
      id: "step-8",
      step: 8,
      phase: "DEPLOYMENT",
      title: "Ship Live to Vercel",
      description: "Deploy with a single command to a production edge domain with instant SSL and worldwide CDN.",
      params: ["Deployment: Vercel Edge", "SSL: Active ✓"],
    },
  ],

  "slides": [
    {
      id: "step-1",
      step: 1,
      phase: "INITIALIZE",
      title: "Open Slide AI Studio",
      description: "Launch Gamma AI, Beautiful.ai, or Pitch workspace.",
      params: ["Platform: Gamma / Beautiful.ai", "Format: 16:9 Deck"],
    },
    {
      id: "step-2",
      step: 2,
      phase: "OUTLINE",
      title: "Input Presentation Blueprint",
      description: "Paste the outline and target audience parameters into the AI generator.",
      tip: "State whether the deck is meant for investors, sales clients, or internal technical reviews.",
    },
    {
      id: "step-3",
      step: 3,
      phase: "DESIGN SYSTEM",
      title: "Pick Brand Typography & Palette",
      description: "Select typography pairings and high-contrast dark or light themes matching your brand.",
      params: ["Theme: Obsidian Cyan", "Font: Inter + Mono"],
    },
    {
      id: "step-4",
      step: 4,
      phase: "GENERATION",
      title: "Synthesize Complete Deck",
      description: "Generate 10–15 slides with data cards, stat counters, and visual hierarchy.",
    },
    {
      id: "step-5",
      step: 5,
      phase: "POLISH",
      title: "Refine Key Takeaways",
      description: "Review each slide to ensure one clear focal metric or insight per slide.",
      tip: "Reduce text density by 30% to maximize viewer engagement.",
    },
    {
      id: "step-6",
      step: 6,
      phase: "DELIVERY",
      title: "Export PDF & Keynote",
      description: "Download vector PDF or editable PowerPoint/Keynote file.",
      params: ["Format: PDF / PPTX", "Vector Graphics: Intact"],
    },
  ],

  "poster-design": [
    {
      id: "step-1",
      step: 1,
      phase: "SETUP",
      title: "Open Graphic Workspace",
      description: "Open Recraft AI, Midjourney, or Canva AI studio.",
      params: ["Format: Poster / Cover", "DPI: 300 Print Ready"],
    },
    {
      id: "step-2",
      step: 2,
      phase: "DIMENSIONS",
      title: "Select Print Dimensions",
      description: "Set aspect ratio to A4 (1:1.414), 2:3, or custom billboard dimensions.",
      params: ["Ratio: 2:3 / A3 / A4", "Bleed: 3mm"],
    },
    {
      id: "step-3",
      step: 3,
      phase: "PROMPT INPUT",
      title: "Input Typography & Visual Theme",
      description: "Paste the design prompt specifying graphic style, color palettes, and typographic accents.",
      tip: "Explicitly specify Swiss minimalism, cyberpunk brutalism, or retro synthwave aesthetic in the prompt.",
    },
    {
      id: "step-4",
      step: 4,
      phase: "SYNTHESIS",
      title: "Generate High-Impact Compositions",
      description: "Synthesize initial candidates focusing on visual weight and negative space.",
    },
    {
      id: "step-5",
      step: 5,
      phase: "TYPOGRAPHY",
      title: "Typeset Title & Metadata",
      description: "Align display headers, dates, and credits with laser-sharp vector text.",
    },
    {
      id: "step-6",
      step: 6,
      phase: "EXPORT",
      title: "Export High-Resolution Print File",
      description: "Export lossless CMYK or sRGB 300 DPI PDF ready for printing or high-res display.",
      params: ["Resolution: 300 DPI", "Format: PDF / PNG"],
    },
  ],
};

// Tool-specific custom overrides
const toolGuideConfig: Record<string, Record<string, GuideStep[]>> = {
  midjourney: {
    "image-generation": [
      {
        id: "step-1",
        step: 1,
        phase: "COMMUNICATION",
        title: "Access Midjourney Interface",
        description: "Open Discord to the Midjourney Bot or launch the Midjourney Web alpha.",
        params: ["Discord: /imagine", "Web: alpha.midjourney.com"],
      },
      {
        id: "step-2",
        step: 2,
        phase: "COMMAND INITIATION",
        title: "Invoke /imagine Command",
        description: "Type `/imagine` in the chat input to activate the prompt argument box.",
        params: ["Prefix: /imagine prompt:"],
      },
      {
        id: "step-3",
        step: 3,
        phase: "PROMPT INGESTION",
        title: "Paste Blueprint Directive",
        description: "Paste the prompt provided in this blueprint into the prompt argument field.",
        tip: "Avoid filler words like 'extremely hyper realistic'. Midjourney responds better to camera and lighting tokens.",
      },
      {
        id: "step-4",
        step: 4,
        phase: "PARAMETER VALIDATION",
        title: "Confirm Engine Parameters",
        description: "Verify essential flags: `--ar 16:9` for widescreen, `--v 6.1` for latest model, `--style raw` for photorealism.",
        params: ["--v 6.1", "--ar 16:9", "--style raw", "--stylize 250"],
      },
      {
        id: "step-5",
        step: 5,
        phase: "GRID SYNTHESIS",
        title: "Synthesize 4-Panel Grid",
        description: "Press Enter to submit. Midjourney renders a 2×2 candidate grid within 45–60 seconds.",
        params: ["Queue: Fast Mode", "Resolution: 1024×1024 base"],
      },
      {
        id: "step-6",
        step: 6,
        phase: "CANDIDATE SELECTION",
        title: "Evaluate Variations",
        description: "Compare panels 1 through 4. Determine which quadrant best matches your desired composition.",
      },
      {
        id: "step-7",
        step: 7,
        phase: "UPSCALE / VARY",
        title: "Upscale or Generate Subtle Variations",
        description: "Click `U1`–`U4` to upscale your preferred image, or `V1`–`V4` for creative variations.",
        params: ["Action: U1 / U2 / U3 / U4", "Subtle / Strong Vary"],
      },
      {
        id: "step-8",
        step: 8,
        phase: "ASSET ARCHIVAL",
        title: "Download Full-Resolution Master",
        description: "Open the upscaled image in full resolution and save to your project library.",
        tip: "Right-click and select 'Open in Browser' before saving to ensure you download the uncompressed original.",
      },
    ],
  },
};

// ============================================================================
// 2. CUSTOM REACT FLOW NODE
// ============================================================================

const CustomWorkflowNode = ({ data }: any) => {
  const { step, title, description, phase, active, completed, isNext } = data;

  return (
    <div
      className={`relative w-[280px] sm:w-[320px] rounded-2xl p-4 transition-all duration-300 ${
        active
          ? "bg-[#111222]/95 border-2 border-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.35)] ring-2 ring-indigo-500/20"
          : completed
          ? "bg-[#0c0d18]/90 border border-emerald-500/40 text-slate-300"
          : "bg-[#0c0d18]/70 border border-white/10 text-slate-400 opacity-80 hover:opacity-100"
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className={`!w-3 !h-3 !border-2 !border-[#0a0b10] transition-colors ${
          active ? "!bg-indigo-400" : completed ? "!bg-emerald-400" : "!bg-slate-700"
        }`}
      />

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span
            className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold font-mono ${
              active
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/40"
                : completed
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                : "bg-white/5 text-slate-400 border border-white/10"
            }`}
          >
            {completed ? <Check className="w-3 h-3" /> : String(step).padStart(2, "0")}
          </span>
          {phase && (
            <span className="text-[9px] uppercase tracking-wider font-mono font-semibold text-slate-400 truncate max-w-[150px]">
              {phase}
            </span>
          )}
        </div>

        {active && (
          <span className="flex items-center gap-1 text-[9px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
            ACTIVE
          </span>
        )}
      </div>

      <h4
        className={`text-xs font-bold leading-snug mb-1 transition-colors ${
          active ? "text-white" : completed ? "text-slate-200" : "text-slate-300"
        }`}
      >
        {title}
      </h4>

      <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
        {description}
      </p>

      <Handle
        type="source"
        position={Position.Right}
        className={`!w-3 !h-3 !border-2 !border-[#0a0b10] transition-colors ${
          active ? "!bg-indigo-400" : completed ? "!bg-emerald-400" : "!bg-slate-700"
        }`}
      />
    </div>
  );
};

const nodeTypes = {
  workflowStep: CustomWorkflowNode,
};

// ============================================================================
// 3. MAIN COMPONENT
// ============================================================================

interface Props {
  category?: string;
  tool?: string;
  customSteps?: GuideStep[];
}

export default function AnimatedWorkflowGuide({
  category = "website-generation",
  tool = "",
  customSteps,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-50px" });

  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [viewMode, setViewMode] = useState<"pipeline" | "canvas">("pipeline");

  // Resolve steps dynamically
  const steps: GuideStep[] = useMemo(() => {
    if (customSteps && customSteps.length > 0) return customSteps;
    const cat = category.toLowerCase().replace(/ /g, "-");
    const t = tool.toLowerCase();

    // Check specific tool match
    for (const key of Object.keys(toolGuideConfig)) {
      if (t.includes(key)) {
        if (toolGuideConfig[key][cat]) {
          return toolGuideConfig[key][cat];
        }
        // Fallback to first available category for this tool
        const firstCat = Object.keys(toolGuideConfig[key])[0];
        if (toolGuideConfig[key][firstCat]) {
          return toolGuideConfig[key][firstCat];
        }
      }
    }

    // Check category match
    if (categoryGuideConfig[cat]) {
      return categoryGuideConfig[cat];
    }

    // Generic fallback
    if (cat.includes("video") || t.includes("video") || t.includes("runway") || t.includes("kling")) {
      return categoryGuideConfig["video-generation"];
    }
    if (cat.includes("slide") || cat.includes("presentation")) {
      return categoryGuideConfig["slides"];
    }
    if (cat.includes("poster") || cat.includes("print")) {
      return categoryGuideConfig["poster-design"];
    }
    if (cat.includes("web") || cat.includes("page") || t.includes("v0") || t.includes("claude")) {
      return categoryGuideConfig["website-generation"];
    }

    return categoryGuideConfig["image-generation"];
  }, [category, tool, customSteps]);

  const activeStep = steps[activeStepIndex] || steps[0];
  const progressPercent = Math.round(((activeStepIndex + 1) / steps.length) * 100);

  // Auto-play timer
  useEffect(() => {
    if (!isInView || !isPlaying) return;

    const timer = setInterval(() => {
      setActiveStepIndex((prev) => {
        if (prev >= steps.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 4000);

    return () => clearInterval(timer);
  }, [isInView, isPlaying, steps.length]);

  // React Flow Nodes
  const nodes: Node[] = useMemo(() => {
    return steps.map((s, index) => {
      // 2 columns horizontal zigzag layout for maximum clarity and clean spacing
      const col = index % 2;
      const row = Math.floor(index / 2);

      return {
        id: s.id,
        type: "workflowStep",
        position: {
          x: col * 360 + 30,
          y: row * 180 + 30,
        },
        data: {
          ...s,
          active: index === activeStepIndex,
          completed: index < activeStepIndex,
          isNext: index === activeStepIndex + 1,
        },
        draggable: true,
      };
    });
  }, [steps, activeStepIndex]);

  // React Flow Edges
  const edges: Edge[] = useMemo(() => {
    return steps.slice(0, -1).map((s, index) => {
      const isPast = index < activeStepIndex;
      const isCurrent = index === activeStepIndex - 1;

      return {
        id: `e-${s.id}-${steps[index + 1].id}`,
        source: s.id,
        target: steps[index + 1].id,
        type: "smoothstep",
        animated: isCurrent || isPast,
        style: {
          stroke: isPast ? "#10b981" : isCurrent ? "#6366f1" : "#334155",
          strokeWidth: isCurrent ? 3 : 2,
          opacity: isPast || isCurrent ? 1 : 0.4,
          transition: "all 0.4s ease",
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: isPast ? "#10b981" : isCurrent ? "#6366f1" : "#475569",
        },
      };
    });
  }, [steps, activeStepIndex]);

  return (
    <div
      ref={containerRef}
      className="w-full rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0a0b12] shadow-xl overflow-hidden transition-all"
    >
      {/* =====================================================================
          1. COMPONENT HEADER
          ===================================================================== */}
      <div className="p-6 sm:p-8 border-b border-slate-200/80 dark:border-white/5 bg-slate-50/70 dark:bg-[#0e101a]/70">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-indigo-600 dark:text-indigo-400">
                AI Execution Architecture
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-medium">
                {tool || "AI Production Model"}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Step-by-Step Production Guide
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Verified step-by-step roadmap to reproduce, customize, and deploy this blueprint.
            </p>
          </div>

          {/* View Mode Toggle & Player Controls */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center bg-slate-200/70 dark:bg-white/5 p-1 rounded-xl border border-slate-300/50 dark:border-white/10 text-xs">
              <button
                type="button"
                onClick={() => setViewMode("pipeline")}
                className={`px-3.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === "pipeline"
                    ? "bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-indigo-500 dark:text-white" />
                <span>Pipeline View</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("canvas")}
                className={`px-3.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === "canvas"
                    ? "bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-indigo-500 dark:text-white" />
                <span>Node Canvas</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              title={isPlaying ? "Pause automated tour" : "Play automated tour"}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-emerald-500" />}
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveStepIndex(0);
                setIsPlaying(true);
              }}
              title="Restart from beginning"
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="mt-5 flex items-center gap-4">
          <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400 font-semibold shrink-0">
            Step {activeStepIndex + 1} of {steps.length} ({progressPercent}%)
          </span>
        </div>
      </div>

      {/* =====================================================================
          2. VIEW MODE: PIPELINE (Full-Width Responsive Workflow)
          ===================================================================== */}
      {viewMode === "pipeline" ? (
        <div className="p-6 sm:p-8 space-y-8">
          {/* Step Pill Stepper Bar */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
            {steps.map((s, idx) => {
              const isActive = idx === activeStepIndex;
              const isPast = idx < activeStepIndex;

              return (
                <button
                  key={s.id}
                  onClick={() => {
                    setActiveStepIndex(idx);
                    setIsPlaying(false);
                  }}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border text-xs sm:text-sm font-medium transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? "bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-500/25 ring-2 ring-indigo-500/20"
                      : isPast
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/15"
                      : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/15"
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isActive
                        ? "bg-white text-indigo-600"
                        : isPast
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-300 dark:bg-white/10 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {isPast ? "✓" : idx + 1}
                  </span>
                  <span className="whitespace-nowrap">{s.title}</span>
                </button>
              );
            })}
          </div>

          {/* Active Node Showcase Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-[#0d0e17] p-6 sm:p-8 shadow-sm"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left/Main Column: Step Details */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="px-3 py-1 rounded-xl bg-indigo-600 text-white font-mono font-bold text-xs shadow-sm">
                      STEP {String(activeStep.step).padStart(2, "0")}
                    </span>
                    {activeStep.phase && (
                      <span className="px-2.5 py-1 rounded-xl text-[11px] font-mono tracking-wider uppercase font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                        {activeStep.phase}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-mono ml-auto">
                      <Activity className="w-3.5 h-3.5" />
                      <span>Verified Procedure</span>
                    </span>
                  </div>

                  <h4 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {activeStep.title}
                  </h4>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {activeStep.description}
                  </p>

                  {/* Directives & Parameter Pills */}
                  {activeStep.params && activeStep.params.length > 0 && (
                    <div className="pt-2">
                      <div className="text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Sliders className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Directive Parameters</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {activeStep.params.map((param, pIdx) => (
                          <span
                            key={pIdx}
                            className="px-3 py-1.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 font-mono text-xs text-slate-800 dark:text-indigo-200 font-medium shadow-sm"
                          >
                            {param}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column: Pro Tip Callout & Navigation Controls */}
                <div className="lg:col-span-5 flex flex-col justify-between space-y-5 h-full">
                  {/* Pro Tip Box */}
                  {activeStep.tip ? (
                    <div className="rounded-2xl border border-amber-500/25 bg-amber-500/[0.05] p-5 shadow-sm">
                      <div className="flex items-center gap-2 mb-2 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wider font-mono">
                        <Lightbulb className="w-4 h-4 shrink-0" />
                        <span>Execution Directives &amp; Safeguards</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 dark:text-amber-200/90 leading-relaxed">
                        {activeStep.tip}
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] p-5 shadow-sm">
                      <div className="flex items-center gap-2 mb-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider font-mono">
                        <Sparkles className="w-4 h-4 shrink-0" />
                        <span>Ready for Execution</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        Follow the parameters on the left to complete this procedure accurately.
                      </p>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="pt-4 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      disabled={activeStepIndex === 0}
                      onClick={() => {
                        setActiveStepIndex((prev) => Math.max(0, prev - 1));
                        setIsPlaying(false);
                      }}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                        activeStepIndex === 0
                          ? "opacity-30 cursor-not-allowed text-slate-400"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-white/5 border border-slate-200 dark:border-white/10"
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Previous Step</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {activeStepIndex < steps.length - 1 ? (
                        <button
                          type="button"
                          onClick={() => {
                            setActiveStepIndex((prev) => Math.min(steps.length - 1, prev + 1));
                            setIsPlaying(false);
                          }}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-500/25 transition-all cursor-pointer hover:scale-[1.02]"
                        >
                          <span>Proceed to Step {activeStepIndex + 2}</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setActiveStepIndex(0);
                            setIsPlaying(false);
                          }}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-emerald-500/25 transition-all cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Complete • Restart</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      ) : (
        /* =====================================================================
           3. VIEW MODE: REACT FLOW NODE CANVAS
           ===================================================================== */
        <div className="relative w-full h-[520px] bg-slate-900 overflow-hidden">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.15, minZoom: 0.45, maxZoom: 1.1 }}
            proOptions={{ hideAttribution: true }}
            nodesConnectable={false}
            elementsSelectable={false}
            zoomOnScroll={false}
            panOnScroll={true}
            className="touch-pan-y"
          >
            <Background color="rgba(255,255,255,0.08)" gap={24} size={1} />
            <Controls className="!bg-[#0c0d18] !border-white/10 !fill-white" />
          </ReactFlow>

          <div className="absolute bottom-4 left-4 z-10 px-3.5 py-2 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 text-xs font-mono text-slate-300 flex items-center gap-2">
            <Compass className="w-4 h-4 text-indigo-400" />
            <span>Interactive Node Canvas • Pan and zoom to inspect the full architecture</span>
          </div>
        </div>
      )}

      {/* Clean Footer Bar */}
      <div className="px-6 py-4 bg-slate-50 dark:bg-[#07080d] border-t border-slate-200 dark:border-white/5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2 font-mono">
          <Terminal className="w-4 h-4 text-indigo-500" />
          <span>Category: <span className="text-slate-800 dark:text-slate-200 font-semibold uppercase">{category}</span></span>
        </div>
        <div className="font-mono text-xs text-slate-400">
          Interactive Production Architecture
        </div>
      </div>
    </div>
  );
}
