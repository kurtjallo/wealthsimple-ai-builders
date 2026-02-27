'use client';

import { motion } from 'framer-motion';
import { FileSearch, UserCheck, ShieldAlert, BarChart3, FileText } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// ---------------------------------------------------------------------------
// Layout constants
// ---------------------------------------------------------------------------

const VB_W = 600;
const VB_H = 400;

const ORANGE = '#f35c1d';
const BORDER_INACTIVE = '#E5E5E3';
const TEXT_PRIMARY = '#1A1A1A';
const TEXT_MUTED = '#6B7280';
const NODE_BG = '#FFFFFF';

// Node dimensions
const NW = 146;
const NH = 62;
const R = 12; // border-radius

// Node positions (x, y are center-points)
interface NodeDef {
  id: string;
  label: string;
  Icon: LucideIcon;
  cx: number;
  cy: number;
  /** When this node activates (seconds into cycle) */
  activeStart: number;
  /** When this node deactivates (seconds into cycle) */
  activeEnd: number;
}

const NODES: NodeDef[] = [
  { id: 'doc',       label: 'Document Processing',    Icon: FileSearch,  cx: 80,  cy: 200, activeStart: 0,   activeEnd: 2 },
  { id: 'identity',  label: 'Identity Verification',  Icon: UserCheck,   cx: 260, cy: 120, activeStart: 2,   activeEnd: 5 },
  { id: 'sanctions', label: 'Sanctions Screening',     Icon: ShieldAlert, cx: 260, cy: 280, activeStart: 2,   activeEnd: 5 },
  { id: 'risk',      label: 'Risk Scoring',            Icon: BarChart3,   cx: 440, cy: 200, activeStart: 5,   activeEnd: 7 },
  { id: 'narrative', label: 'Case Narrative',           Icon: FileText,    cx: 560, cy: 200, activeStart: 7,   activeEnd: 9 },
];

// Connecting paths (from center of source to center of target)
interface PathDef {
  from: string;
  to: string;
  d: string;
  /** When the flow animation starts */
  flowStart: number;
}

// Build curved SVG paths
const PATHS: PathDef[] = [
  // Doc -> Identity (fork up)
  {
    from: 'doc',
    to: 'identity',
    d: `M ${80 + NW / 2} 200 C ${170} 200, ${190} 120, ${260 - NW / 2} 120`,
    flowStart: 1.5,
  },
  // Doc -> Sanctions (fork down)
  {
    from: 'doc',
    to: 'sanctions',
    d: `M ${80 + NW / 2} 200 C ${170} 200, ${190} 280, ${260 - NW / 2} 280`,
    flowStart: 1.5,
  },
  // Identity -> Risk (join up)
  {
    from: 'identity',
    to: 'risk',
    d: `M ${260 + NW / 2} 120 C ${350} 120, ${370} 200, ${440 - NW / 2} 200`,
    flowStart: 4.5,
  },
  // Sanctions -> Risk (join down)
  {
    from: 'sanctions',
    to: 'risk',
    d: `M ${260 + NW / 2} 280 C ${350} 280, ${370} 200, ${440 - NW / 2} 200`,
    flowStart: 4.5,
  },
  // Risk -> Narrative
  {
    from: 'risk',
    to: 'narrative',
    d: `M ${440 + NW / 2} 200 L ${560 - NW / 2} 200`,
    flowStart: 6.5,
  },
];

const CYCLE_DURATION = 10; // seconds

// ---------------------------------------------------------------------------
// A single pipeline node
// ---------------------------------------------------------------------------

function PipelineNode({ node }: { node: NodeDef }) {
  const x = node.cx - NW / 2;
  const y = node.cy - NH / 2;

  return (
    <g className="pipeline-hero-node">
      {/* Glow layer (behind the rect) */}
      <rect
        x={x - 3}
        y={y - 3}
        width={NW + 6}
        height={NH + 6}
        rx={R + 2}
        ry={R + 2}
        fill="none"
        className="pipeline-hero-glow"
      />

      {/* Main rounded rect */}
      <rect
        x={x}
        y={y}
        width={NW}
        height={NH}
        rx={R}
        ry={R}
        fill={NODE_BG}
        className="pipeline-hero-rect"
        stroke={BORDER_INACTIVE}
        strokeWidth={1.5}
      />

      {/* Icon + label via foreignObject for crisp React rendering */}
      <foreignObject x={x} y={y} width={NW} height={NH}>
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
            padding: '4px 8px',
            pointerEvents: 'none',
            color: TEXT_MUTED,
          }}
        >
          <node.Icon
            size={18}
            strokeWidth={1.5}
            className="pipeline-hero-icon"
          />
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: TEXT_PRIMARY,
              textAlign: 'center',
              lineHeight: 1.2,
              letterSpacing: '-0.01em',
            }}
          >
            {node.label}
          </span>
        </div>
      </foreignObject>
    </g>
  );
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export function HeroPipelineAnimation() {
  return (
    <motion.div
      className="w-full max-w-[600px] mx-auto"
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        className="w-full h-auto"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="AI pipeline visualization showing document processing, identity verification, sanctions screening, risk scoring, and case narrative generation"
      >
        <defs>
          {/* Glow filter for active nodes */}
          <filter id="hero-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="0 0 0 0 0.953  0 0 0 0 0.361  0 0 0 0 0.114  0 0 0 0.35 0"
            />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Re-usable path definitions for offset-path particles */}
          {PATHS.map((p, i) => (
            <path key={i} id={`hero-path-${i}`} d={p.d} fill="none" />
          ))}

          {/* Animated dash pattern for connecting lines */}
          <style>{`
            /* --------------------------------------------------------- */
            /* Connecting path dash animation                            */
            /* --------------------------------------------------------- */
            .hero-connect-path {
              stroke-dasharray: 6 4;
              animation: hero-pipeline-flow ${CYCLE_DURATION}s linear infinite;
            }
            @keyframes hero-pipeline-flow {
              to { stroke-dashoffset: -100; }
            }

            /* --------------------------------------------------------- */
            /* Particle dots flowing along paths                         */
            /* --------------------------------------------------------- */
            .hero-particle {
              opacity: 0;
            }
            ${PATHS.map(
              (p, i) => `
              .hero-particle-${i}-0 {
                offset-path: path('${p.d}');
                animation: hero-particle-travel 2s ease-in-out ${p.flowStart}s infinite;
                animation-duration: ${CYCLE_DURATION}s;
              }
              .hero-particle-${i}-1 {
                offset-path: path('${p.d}');
                animation: hero-particle-travel 2s ease-in-out ${p.flowStart + 0.3}s infinite;
                animation-duration: ${CYCLE_DURATION}s;
              }
              .hero-particle-${i}-2 {
                offset-path: path('${p.d}');
                animation: hero-particle-travel 2s ease-in-out ${p.flowStart + 0.6}s infinite;
                animation-duration: ${CYCLE_DURATION}s;
              }
            `,
            ).join('')}

            @keyframes hero-particle-travel {
              0% {
                offset-distance: 0%;
                opacity: 0;
              }
              2% {
                opacity: 1;
              }
              18% {
                opacity: 1;
              }
              20% {
                offset-distance: 100%;
                opacity: 0;
              }
              100% {
                offset-distance: 100%;
                opacity: 0;
              }
            }

            /* --------------------------------------------------------- */
            /* Node activation cycle                                     */
            /* --------------------------------------------------------- */
            .pipeline-hero-node {
              opacity: 0.55;
            }

            .pipeline-hero-glow {
              opacity: 0;
              stroke: ${ORANGE};
              stroke-width: 0;
              filter: url(#hero-glow);
            }

            .pipeline-hero-rect {
              transition: stroke 0.3s ease, stroke-width 0.3s ease;
            }

            .pipeline-hero-icon {
              transition: color 0.3s ease;
            }

            /* Per-node activation using animation-delay */
            ${NODES.map(
              (n) => {
                // Calculate keyframe percentages for this node's active window
                const startPct = (n.activeStart / CYCLE_DURATION) * 100;
                const peakPct = ((n.activeStart + 0.3) / CYCLE_DURATION) * 100;
                const holdPct = ((n.activeEnd - 0.3) / CYCLE_DURATION) * 100;
                const endPct = (n.activeEnd / CYCLE_DURATION) * 100;
                // Keep "complete" state briefly at end of cycle
                const completeStartPct = (9 / CYCLE_DURATION) * 100;
                const completeEndPct = (9.8 / CYCLE_DURATION) * 100;

                return `
                  /* --- ${n.label} --- */
                  .pipeline-hero-node-${n.id} {
                    animation: hero-activate-${n.id} ${CYCLE_DURATION}s ease infinite;
                  }
                  .pipeline-hero-node-${n.id} .pipeline-hero-rect {
                    animation: hero-rect-${n.id} ${CYCLE_DURATION}s ease infinite;
                  }
                  .pipeline-hero-node-${n.id} .pipeline-hero-glow {
                    animation: hero-glow-${n.id} ${CYCLE_DURATION}s ease infinite;
                  }

                  @keyframes hero-activate-${n.id} {
                    0%, ${Math.max(startPct - 1, 0)}% { opacity: 0.55; transform: scale(1); }
                    ${startPct}% { opacity: 0.55; transform: scale(1); }
                    ${peakPct}% { opacity: 1; transform: scale(1.02); }
                    ${holdPct}% { opacity: 1; transform: scale(1); }
                    ${endPct}% { opacity: 0.7; transform: scale(1); }
                    ${completeStartPct}% { opacity: 0.85; transform: scale(1); }
                    ${completeEndPct}% { opacity: 1; transform: scale(1.01); }
                    100% { opacity: 0.55; transform: scale(1); }
                  }

                  @keyframes hero-rect-${n.id} {
                    0%, ${Math.max(startPct - 1, 0)}% { stroke: ${BORDER_INACTIVE}; stroke-width: 1.5; }
                    ${peakPct}% { stroke: ${ORANGE}; stroke-width: 2; }
                    ${holdPct}% { stroke: ${ORANGE}; stroke-width: 2; }
                    ${endPct}% { stroke: ${BORDER_INACTIVE}; stroke-width: 1.5; }
                    ${completeStartPct}% { stroke: ${BORDER_INACTIVE}; stroke-width: 1.5; }
                    ${completeEndPct}% { stroke: ${ORANGE}; stroke-width: 1.8; }
                    ${Math.min(completeEndPct + 2, 100)}% { stroke: ${BORDER_INACTIVE}; stroke-width: 1.5; }
                    100% { stroke: ${BORDER_INACTIVE}; stroke-width: 1.5; }
                  }

                  @keyframes hero-glow-${n.id} {
                    0%, ${Math.max(startPct - 1, 0)}% { opacity: 0; stroke-width: 0; }
                    ${peakPct}% { opacity: 0.6; stroke-width: 4; }
                    ${holdPct}% { opacity: 0.4; stroke-width: 3; }
                    ${endPct}% { opacity: 0; stroke-width: 0; }
                    ${completeStartPct}% { opacity: 0; stroke-width: 0; }
                    ${completeEndPct}% { opacity: 0.3; stroke-width: 2; }
                    ${Math.min(completeEndPct + 2, 100)}% { opacity: 0; stroke-width: 0; }
                    100% { opacity: 0; stroke-width: 0; }
                  }
                `;
              },
            ).join('')}
          `}</style>
        </defs>

        {/* ---- Connecting Paths ---- */}
        {PATHS.map((p, i) => (
          <g key={`path-${i}`}>
            {/* Shadow/glow path underneath */}
            <path
              d={p.d}
              fill="none"
              stroke={ORANGE}
              strokeWidth={3}
              strokeOpacity={0.08}
              strokeLinecap="round"
            />
            {/* Main dashed path */}
            <path
              d={p.d}
              fill="none"
              stroke={BORDER_INACTIVE}
              strokeWidth={1.5}
              strokeLinecap="round"
              className="hero-connect-path"
            />
          </g>
        ))}

        {/* ---- Particle Dots ---- */}
        {PATHS.map((_, i) =>
          [0, 1, 2].map((j) => (
            <circle
              key={`particle-${i}-${j}`}
              r={2.5}
              fill={ORANGE}
              className={`hero-particle hero-particle-${i}-${j}`}
            />
          )),
        )}

        {/* ---- Fork/Join Labels ---- */}
        <text
          x={170}
          y={155}
          textAnchor="middle"
          fill={TEXT_MUTED}
          fontSize={9}
          fontWeight={500}
          opacity={0.6}
        >
          FORK
        </text>
        <text
          x={380}
          y={155}
          textAnchor="middle"
          fill={TEXT_MUTED}
          fontSize={9}
          fontWeight={500}
          opacity={0.6}
        >
          JOIN
        </text>

        {/* ---- Pipeline Nodes ---- */}
        {NODES.map((node) => (
          <g key={node.id} className={`pipeline-hero-node-${node.id}`}>
            <PipelineNode node={node} />
          </g>
        ))}

        {/* ---- Decorative elements ---- */}
        {/* Subtle grid dots in background */}
        {Array.from({ length: 12 }).map((_, i) =>
          Array.from({ length: 8 }).map((_, j) => (
            <circle
              key={`dot-${i}-${j}`}
              cx={i * 55 + 10}
              cy={j * 55 + 15}
              r={0.8}
              fill={BORDER_INACTIVE}
              opacity={0.3}
            />
          )),
        )}

        {/* Timing indicator bar at bottom */}
        <rect
          x={40}
          y={375}
          width={520}
          height={2}
          rx={1}
          fill={BORDER_INACTIVE}
          opacity={0.3}
        />
        <rect
          x={40}
          y={375}
          width={520}
          height={2}
          rx={1}
          fill={ORANGE}
          opacity={0.5}
          style={{
            transformOrigin: '40px 376px',
            animation: `hero-progress-bar ${CYCLE_DURATION}s linear infinite`,
          }}
        />

        {/* Progress bar keyframes embedded */}
        <style>{`
          @keyframes hero-progress-bar {
            0% { clip-path: inset(0 100% 0 0); }
            100% { clip-path: inset(0 0% 0 0); }
          }
        `}</style>

        {/* Time labels */}
        <text x={40} y={392} fontSize={8} fill={TEXT_MUTED} opacity={0.5}>
          0s
        </text>
        <text x={550} y={392} fontSize={8} fill={TEXT_MUTED} opacity={0.5} textAnchor="end">
          ~3 min
        </text>
      </svg>
    </motion.div>
  );
}
