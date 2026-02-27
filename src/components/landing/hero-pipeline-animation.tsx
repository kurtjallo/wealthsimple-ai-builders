'use client';

import { motion } from 'framer-motion';

// ---------------------------------------------------------------------------
// Design tokens
// ---------------------------------------------------------------------------

const BLUE = '#2563EB';
const GOLD = '#C4A962';
const CARD_BG = '#FFFFFF';
const BORDER_INACTIVE = '#E2E8F0';
const TEXT_PRIMARY = '#1A1A1A';
const TEXT_MUTED = '#6B7280';
const GREEN = '#22C55E';
const AMBER = '#F59E0B';
const BG = '#F8FAFC';

// ---------------------------------------------------------------------------
// ViewBox & card layout
// ---------------------------------------------------------------------------

const VB_W = 800;
const VB_H = 380;
const CW = 120;
const CH = 90;
const CR = 8;
const GOLD_BAR_H = 4;
const CYCLE = 12; // seconds

// Card positions (top-left corner)
// [Doc] → fork → [Identity] + [Sanctions] → join → [Risk] → [Narrative]
const POS = {
  doc:       { x: 30,  y: 145 },
  identity:  { x: 225, y: 38  },
  sanctions: { x: 225, y: 252 },
  risk:      { x: 435, y: 145 },
  narrative: { x: 630, y: 145 },
};

const MID_Y = POS.doc.y + CH / 2; // 190

// Edge-midpoint anchors for connections
const A = {
  docR:  { x: POS.doc.x + CW,       y: MID_Y },
  idL:   { x: POS.identity.x,       y: POS.identity.y + CH / 2 },
  idR:   { x: POS.identity.x + CW,  y: POS.identity.y + CH / 2 },
  sanL:  { x: POS.sanctions.x,      y: POS.sanctions.y + CH / 2 },
  sanR:  { x: POS.sanctions.x + CW, y: POS.sanctions.y + CH / 2 },
  riskL: { x: POS.risk.x,           y: MID_Y },
  riskR: { x: POS.risk.x + CW,      y: MID_Y },
  narL:  { x: POS.narrative.x,      y: MID_Y },
};

// Cubic bezier paths
const PATH = {
  forkUp:   `M ${A.docR.x} ${A.docR.y} C ${A.docR.x + 42} ${A.docR.y}, ${A.idL.x - 42} ${A.idL.y}, ${A.idL.x} ${A.idL.y}`,
  forkDown: `M ${A.docR.x} ${A.docR.y} C ${A.docR.x + 42} ${A.docR.y}, ${A.sanL.x - 42} ${A.sanL.y}, ${A.sanL.x} ${A.sanL.y}`,
  joinUp:   `M ${A.idR.x} ${A.idR.y} C ${A.idR.x + 42} ${A.idR.y}, ${A.riskL.x - 42} ${A.riskL.y}, ${A.riskL.x} ${A.riskL.y}`,
  joinDown: `M ${A.sanR.x} ${A.sanR.y} C ${A.sanR.x + 42} ${A.sanR.y}, ${A.riskL.x - 42} ${A.riskL.y}, ${A.riskL.x} ${A.riskL.y}`,
  final:    `M ${A.riskR.x} ${A.riskR.y} C ${A.riskR.x + 32} ${A.riskR.y}, ${A.narL.x - 32} ${A.narL.y}, ${A.narL.x} ${A.narL.y}`,
};

// All paths as array for rendering
const ALL_PATHS = [
  { id: 'fork-up',   d: PATH.forkUp,   group: 'fork' },
  { id: 'fork-down', d: PATH.forkDown, group: 'fork' },
  { id: 'join-up',   d: PATH.joinUp,   group: 'join' },
  { id: 'join-down', d: PATH.joinDown, group: 'join' },
  { id: 'final',     d: PATH.final,    group: 'final' },
];

// Pill labels on connections
const PILLS = [
  { label: 'Verify',  x: (A.docR.x + A.idL.x) / 2,  y: (A.docR.y + A.idL.y) / 2 - 14,  group: 'fork' },
  { label: 'Screen',  x: (A.docR.x + A.sanL.x) / 2,  y: (A.docR.y + A.sanL.y) / 2 + 14,  group: 'fork' },
  { label: 'Score',   x: (A.idR.x + A.riskL.x) / 2,  y: MID_Y - 16,                       group: 'join' },
  { label: 'Narrate', x: (A.riskR.x + A.narL.x) / 2, y: MID_Y - 14,                       group: 'final' },
];

// Endpoint dots (deduplicated shared anchors)
const ENDPOINTS = [
  { ...A.docR,  group: 'fork' },
  { ...A.idL,   group: 'fork' },
  { ...A.sanL,  group: 'fork' },
  { ...A.idR,   group: 'join' },
  { ...A.sanR,  group: 'join' },
  { ...A.riskL, group: 'join' },
  { ...A.riskR, group: 'final' },
  { ...A.narL,  group: 'final' },
];

// ---------------------------------------------------------------------------
// Card data
// ---------------------------------------------------------------------------

interface CardData {
  id: string;
  code: string;
  type: string;
  owner: string;
  statusLabel: string;
  statusColor: string;
  metricLabel: string;
  metricValue: string;
  pos: { x: number; y: number };
  activeStart: number;
  activeEnd: number;
}

const CARDS: CardData[] = [
  {
    id: 'doc', code: 'KYC-1', type: 'Documents', owner: 'Applicant Review',
    statusLabel: 'Processing', statusColor: AMBER,
    metricLabel: 'Files', metricValue: '3',
    pos: POS.doc, activeStart: 0, activeEnd: 2.5,
  },
  {
    id: 'identity', code: 'KYC-2', type: 'Identity', owner: 'Sean Holland',
    statusLabel: 'Verified', statusColor: GREEN,
    metricLabel: 'Confidence', metricValue: '94%',
    pos: POS.identity, activeStart: 2.5, activeEnd: 5.5,
  },
  {
    id: 'sanctions', code: 'KYC-3', type: 'Screening', owner: 'Compliance Check',
    statusLabel: 'Clear', statusColor: GREEN,
    metricLabel: 'Matches', metricValue: '0',
    pos: POS.sanctions, activeStart: 2.5, activeEnd: 5.5,
  },
  {
    id: 'risk', code: 'KYC-4', type: 'Risk', owner: 'Risk Engine',
    statusLabel: 'Low Risk', statusColor: GREEN,
    metricLabel: 'Score', metricValue: '12',
    pos: POS.risk, activeStart: 5.5, activeEnd: 8,
  },
  {
    id: 'narrative', code: 'KYC-5', type: 'Narrative', owner: 'Case Summary',
    statusLabel: 'Generated', statusColor: GREEN,
    metricLabel: 'Sections', metricValue: '4',
    pos: POS.narrative, activeStart: 8, activeEnd: 10,
  },
];

// ---------------------------------------------------------------------------
// CSS animation keyframes
// ---------------------------------------------------------------------------

function buildCSS(): string {
  // Background grid
  const grid = `
    .hero-grid-line { stroke: ${BORDER_INACTIVE}; stroke-width: 0.5; opacity: 0.4; }
  `;

  // Connection line draw-in (3 groups: fork 12.5-25%, join 37.5-50%, final 58-71%)
  const connections = `
    .hero-conn-fork {
      stroke-dasharray: 500; stroke-dashoffset: 500;
      animation: hero-draw-fork ${CYCLE}s ease infinite;
    }
    @keyframes hero-draw-fork {
      0%, 12.5% { stroke-dashoffset: 500; }
      25% { stroke-dashoffset: 0; }
      83% { stroke-dashoffset: 0; }
      93% { stroke-dashoffset: 500; }
      100% { stroke-dashoffset: 500; }
    }
    .hero-conn-join {
      stroke-dasharray: 500; stroke-dashoffset: 500;
      animation: hero-draw-join ${CYCLE}s ease infinite;
    }
    @keyframes hero-draw-join {
      0%, 37.5% { stroke-dashoffset: 500; }
      50% { stroke-dashoffset: 0; }
      83% { stroke-dashoffset: 0; }
      93% { stroke-dashoffset: 500; }
      100% { stroke-dashoffset: 500; }
    }
    .hero-conn-final {
      stroke-dasharray: 500; stroke-dashoffset: 500;
      animation: hero-draw-final ${CYCLE}s ease infinite;
    }
    @keyframes hero-draw-final {
      0%, 58% { stroke-dashoffset: 500; }
      71% { stroke-dashoffset: 0; }
      83% { stroke-dashoffset: 0; }
      93% { stroke-dashoffset: 500; }
      100% { stroke-dashoffset: 500; }
    }
  `;

  // Endpoint dots (appear with their connection group)
  const endpoints = `
    .hero-ep-fork { opacity: 0; animation: hero-ep-fork-a ${CYCLE}s ease infinite; }
    @keyframes hero-ep-fork-a {
      0%, 18% { opacity: 0; } 25% { opacity: 1; } 83% { opacity: 1; } 93% { opacity: 0; } 100% { opacity: 0; }
    }
    .hero-ep-join { opacity: 0; animation: hero-ep-join-a ${CYCLE}s ease infinite; }
    @keyframes hero-ep-join-a {
      0%, 43% { opacity: 0; } 50% { opacity: 1; } 83% { opacity: 1; } 93% { opacity: 0; } 100% { opacity: 0; }
    }
    .hero-ep-final { opacity: 0; animation: hero-ep-final-a ${CYCLE}s ease infinite; }
    @keyframes hero-ep-final-a {
      0%, 63% { opacity: 0; } 71% { opacity: 1; } 83% { opacity: 1; } 93% { opacity: 0; } 100% { opacity: 0; }
    }
  `;

  // Particle dots flowing along paths (2 per path, staggered)
  const ptclGroups = [
    { ids: ['fork-up', 'fork-down'], paths: [PATH.forkUp, PATH.forkDown], kf: 'hero-ptcl-fork-kf', s: 14, e: 30 },
    { ids: ['join-up', 'join-down'], paths: [PATH.joinUp, PATH.joinDown], kf: 'hero-ptcl-join-kf', s: 39, e: 55 },
    { ids: ['final'],                paths: [PATH.final],                  kf: 'hero-ptcl-final-kf', s: 60, e: 76 },
  ];

  let particles = '';
  for (const pg of ptclGroups) {
    particles += `
      @keyframes ${pg.kf} {
        0%, ${pg.s}% { offset-distance: 0%; opacity: 0; }
        ${pg.s + 1}% { opacity: 1; }
        ${pg.e - 1}% { opacity: 1; }
        ${pg.e}% { offset-distance: 100%; opacity: 0; }
        100% { offset-distance: 100%; opacity: 0; }
      }
    `;
    for (let pi = 0; pi < pg.ids.length; pi++) {
      for (let j = 0; j < 2; j++) {
        particles += `
          .hero-ptcl-${pg.ids[pi]}-${j} {
            offset-path: path('${pg.paths[pi]}');
            animation: ${pg.kf} ${CYCLE}s ease-in-out ${j * 0.35}s infinite;
            opacity: 0;
          }
        `;
      }
    }
  }

  // Pill labels (appear after their connection group draws)
  const pills = `
    .hero-pill-fork { opacity: 0; animation: hero-pill-fork-a ${CYCLE}s ease infinite; }
    @keyframes hero-pill-fork-a {
      0%, 20% { opacity: 0; transform: scale(0.9); }
      26% { opacity: 1; transform: scale(1); }
      83% { opacity: 1; transform: scale(1); }
      91% { opacity: 0; transform: scale(0.9); }
      100% { opacity: 0; transform: scale(0.9); }
    }
    .hero-pill-join { opacity: 0; animation: hero-pill-join-a ${CYCLE}s ease infinite; }
    @keyframes hero-pill-join-a {
      0%, 44% { opacity: 0; transform: scale(0.9); }
      50% { opacity: 1; transform: scale(1); }
      83% { opacity: 1; transform: scale(1); }
      91% { opacity: 0; transform: scale(0.9); }
      100% { opacity: 0; transform: scale(0.9); }
    }
    .hero-pill-final { opacity: 0; animation: hero-pill-final-a ${CYCLE}s ease infinite; }
    @keyframes hero-pill-final-a {
      0%, 64% { opacity: 0; transform: scale(0.9); }
      71% { opacity: 1; transform: scale(1); }
      83% { opacity: 1; transform: scale(1); }
      91% { opacity: 0; transform: scale(0.9); }
      100% { opacity: 0; transform: scale(0.9); }
    }
  `;

  // Per-card activation cycle
  const cardCSS = CARDS.map((c) => {
    const s = (c.activeStart / CYCLE) * 100;
    const fadeIn = ((c.activeStart + 0.4) / CYCLE) * 100;
    const holdEnd = ((c.activeEnd - 0.4) / CYCLE) * 100;
    const e = (c.activeEnd / CYCLE) * 100;
    const compS = (10.2 / CYCLE) * 100;
    const compE = (10.8 / CYCLE) * 100;

    return `
      .hero-cg-${c.id} { animation: hero-ca-${c.id} ${CYCLE}s ease infinite; }
      @keyframes hero-ca-${c.id} {
        0%, ${Math.max(s - 1, 0)}% { opacity: 0.5; transform: scale(0.97); }
        ${fadeIn}% { opacity: 1; transform: scale(1); }
        ${holdEnd}% { opacity: 1; transform: scale(1); }
        ${e}% { opacity: 0.7; transform: scale(1); }
        ${compS}% { opacity: 0.85; }
        ${compE}% { opacity: 1; }
        93% { opacity: 0.5; transform: scale(0.97); }
        100% { opacity: 0.5; transform: scale(0.97); }
      }
      .hero-cb-${c.id} { animation: hero-bdr-${c.id} ${CYCLE}s ease infinite; }
      @keyframes hero-bdr-${c.id} {
        0%, ${Math.max(s - 1, 0)}% { stroke: ${BORDER_INACTIVE}; stroke-width: 1; }
        ${fadeIn}% { stroke: ${BLUE}; stroke-width: 1.5; }
        ${holdEnd}% { stroke: ${BLUE}; stroke-width: 1.5; }
        ${e}% { stroke: ${BORDER_INACTIVE}; stroke-width: 1; }
        ${compS}% { stroke: ${BORDER_INACTIVE}; }
        ${compE}% { stroke: ${BLUE}; stroke-width: 1.2; }
        ${Math.min(compE + 2, 100)}% { stroke: ${BORDER_INACTIVE}; stroke-width: 1; }
        100% { stroke: ${BORDER_INACTIVE}; stroke-width: 1; }
      }
      .hero-cgl-${c.id} { animation: hero-gl-${c.id} ${CYCLE}s ease infinite; }
      @keyframes hero-gl-${c.id} {
        0%, ${Math.max(s - 1, 0)}% { opacity: 0; }
        ${fadeIn}% { opacity: 1; }
        ${holdEnd}% { opacity: 0.8; }
        ${e}% { opacity: 0; }
        100% { opacity: 0; }
      }
      .hero-sd-${c.id} { animation: hero-sd-a-${c.id} ${CYCLE}s ease infinite; }
      @keyframes hero-sd-a-${c.id} {
        0%, ${Math.max(s - 1, 0)}% { r: 3.5; opacity: 0.6; }
        ${fadeIn}% { r: 4.5; opacity: 1; }
        ${((c.activeStart + 1) / CYCLE) * 100}% { r: 3.5; opacity: 1; }
        ${((c.activeStart + 1.4) / CYCLE) * 100}% { r: 4.5; opacity: 1; }
        ${((c.activeStart + 1.8) / CYCLE) * 100}% { r: 3.5; opacity: 1; }
        ${holdEnd}% { r: 3.5; opacity: 1; }
        ${e}% { r: 3.5; opacity: 0.6; }
        100% { r: 3.5; opacity: 0.6; }
      }
    `;
  }).join('');

  return grid + connections + endpoints + particles + pills + cardCSS;
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export function HeroPipelineAnimation() {
  return (
    <motion.div
      className="w-full max-w-[800px] mx-auto"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        className="w-full h-auto"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="KYC pipeline: document processing forks to identity verification and sanctions screening, joins into risk scoring, then case narrative generation"
      >
        <defs>
          {/* Glow filter for active cards */}
          <filter id="hero-card-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="0 0 0 0 0.145  0 0 0 0 0.388  0 0 0 0 0.922  0 0 0 0.25 0"
            />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Card drop shadow */}
          <filter id="hero-card-shadow" x="-5%" y="-5%" width="110%" height="120%">
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#000000" floodOpacity="0.08" />
          </filter>

          {/* Gold shimmer gradient for top bars */}
          <linearGradient id="hero-gold-shimmer" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={GOLD} stopOpacity="1" />
            <stop offset="40%" stopColor={GOLD} stopOpacity="1" />
            <stop offset="50%" stopColor="#E8D5A0" stopOpacity="1" />
            <stop offset="60%" stopColor={GOLD} stopOpacity="1" />
            <stop offset="100%" stopColor={GOLD} stopOpacity="1" />
            <animateTransform
              attributeName="gradientTransform"
              type="translate"
              values="-1 0; 2 0; -1 0"
              dur={`${CYCLE}s`}
              repeatCount="indefinite"
            />
          </linearGradient>

          <style>{buildCSS()}</style>
        </defs>

        {/* ---- Background ---- */}
        <rect x="0" y="0" width={VB_W} height={VB_H} fill={BG} />

        {/* ---- Subtle vertical grid lines ---- */}
        {Array.from({ length: 16 }).map((_, i) => (
          <line
            key={`grid-${i}`}
            x1={50 + i * 46}
            y1={20}
            x2={50 + i * 46}
            y2={VB_H - 20}
            className="hero-grid-line"
          />
        ))}

        {/* ---- Connection curves ---- */}
        {ALL_PATHS.map((p) => (
          <path
            key={p.id}
            d={p.d}
            fill="none"
            stroke={BLUE}
            strokeWidth={1.5}
            strokeOpacity={0.5}
            strokeLinecap="round"
            className={`hero-conn-${p.group}`}
          />
        ))}

        {/* ---- Endpoint dots ---- */}
        {ENDPOINTS.map((ep, i) => (
          <circle
            key={`ep-${i}`}
            cx={ep.x}
            cy={ep.y}
            r={4}
            fill={BLUE}
            className={`hero-ep-${ep.group}`}
          />
        ))}

        {/* ---- Particle dots ---- */}
        {ALL_PATHS.map((p) =>
          [0, 1].map((j) => (
            <circle
              key={`ptcl-${p.id}-${j}`}
              r={2.5}
              fill={BLUE}
              className={`hero-ptcl-${p.id}-${j}`}
            />
          )),
        )}

        {/* ---- Pill labels on paths ---- */}
        {PILLS.map((pill) => {
          const pw = Math.ceil(pill.label.length * 6.5 + 16);
          return (
            <g
              key={pill.label}
              className={`hero-pill-${pill.group}`}
              style={{ transformOrigin: `${pill.x}px ${pill.y}px` }}
            >
              <rect
                x={pill.x - pw / 2}
                y={pill.y - 10}
                width={pw}
                height={20}
                rx={10}
                fill={BLUE}
              />
              <text
                x={pill.x}
                y={pill.y + 4}
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize={11}
                fontWeight={600}
                fontFamily="system-ui, -apple-system, sans-serif"
              >
                {pill.label}
              </text>
            </g>
          );
        })}

        {/* ---- Cards ---- */}
        {CARDS.map((card) => (
          <g key={card.id} className={`hero-cg-${card.id}`}>
            {/* Owner label above the card */}
            <text
              x={card.pos.x + CW / 2}
              y={card.pos.y - 8}
              textAnchor="middle"
              fill={TEXT_MUTED}
              fontSize={10}
              fontWeight={500}
              fontFamily="system-ui, -apple-system, sans-serif"
            >
              {card.owner}
            </text>

            {/* Glow layer (behind card) */}
            <rect
              x={card.pos.x - 2}
              y={card.pos.y - 2}
              width={CW + 4}
              height={CH + 4}
              rx={CR + 1}
              fill="none"
              stroke={BLUE}
              strokeWidth={3}
              strokeOpacity={0.15}
              filter="url(#hero-card-glow)"
              className={`hero-cgl-${card.id}`}
              style={{ opacity: 0 }}
            />

            {/* Card body with shadow */}
            <g filter="url(#hero-card-shadow)">
              {/* White background */}
              <rect
                x={card.pos.x}
                y={card.pos.y}
                width={CW}
                height={CH}
                rx={CR}
                fill={CARD_BG}
                className={`hero-cb-${card.id}`}
                stroke={BORDER_INACTIVE}
                strokeWidth={1}
              />
              {/* Gold top bar (clipped to card top-radius) */}
              <clipPath id={`hero-clip-${card.id}`}>
                <rect
                  x={card.pos.x}
                  y={card.pos.y}
                  width={CW}
                  height={GOLD_BAR_H + CR}
                  rx={CR}
                />
              </clipPath>
              <rect
                x={card.pos.x}
                y={card.pos.y}
                width={CW}
                height={GOLD_BAR_H}
                fill="url(#hero-gold-shimmer)"
                clipPath={`url(#hero-clip-${card.id})`}
              />
            </g>

            {/* Card content via foreignObject */}
            <foreignObject
              x={card.pos.x}
              y={card.pos.y + GOLD_BAR_H}
              width={CW}
              height={CH - GOLD_BAR_H}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  padding: '8px 10px 6px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  pointerEvents: 'none',
                  boxSizing: 'border-box',
                }}
              >
                {/* Top row: Code + Type */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: TEXT_PRIMARY, letterSpacing: '-0.01em' }}>
                    {card.code}
                  </span>
                  <span style={{ fontSize: 9, fontWeight: 500, color: TEXT_MUTED, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {card.type}
                  </span>
                </div>

                {/* Status row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 4 }}>
                  <svg width="7" height="7" viewBox="0 0 8 8" style={{ flexShrink: 0 }}>
                    <circle cx="4" cy="4" r="3.5" fill={card.statusColor} className={`hero-sd-${card.id}`} />
                  </svg>
                  <span style={{ fontSize: 10, fontWeight: 500, color: TEXT_PRIMARY }}>
                    {card.statusLabel}
                  </span>
                </div>

                {/* Metric row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 3 }}>
                  <span style={{ fontSize: 9, color: TEXT_MUTED }}>{card.metricLabel}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: TEXT_PRIMARY }}>{card.metricValue}</span>
                </div>
              </div>
            </foreignObject>
          </g>
        ))}
      </svg>
    </motion.div>
  );
}
