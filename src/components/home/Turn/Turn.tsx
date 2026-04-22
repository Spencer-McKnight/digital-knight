'use client';

import { useMemo, useState } from 'react';
import styles from './Turn.module.scss';

/**
 * Turn — the breaking-pattern beat (`design.md` §9 beat 4).
 *
 *   An interactive. You pick three levers — a goal, a horizon, a disposition
 *   — and the studio composes a first-pass brief in front of you. The wit
 *   lives in the generated copy: each permutation must still sound like the
 *   studio.
 *
 *   This is not a toy for its own sake; it's the studio demonstrating how it
 *   thinks. The interaction is the argument.
 */
const GOAL_OPTIONS = [
  { id: 'outlast', label: 'Outlast the trend cycle' },
  { id: 'compound', label: 'Compound attention over years' },
  { id: 'operate', label: 'Operate at the speed of decisions' },
  { id: 'prevail', label: 'Prevail in a crowded market' },
] as const;

const HORIZON_OPTIONS = [
  { id: 'year', label: 'A year', word: 'within a year' },
  { id: 'two', label: 'Two years', word: 'over two years' },
  { id: 'five', label: 'Five years', word: 'across five years' },
  { id: 'decade', label: 'A decade', word: 'on a ten-year arc' },
] as const;

const DISPOSITION_OPTIONS = [
  { id: 'restrained', label: 'Restrained' },
  { id: 'cinematic', label: 'Cinematic' },
  { id: 'editorial', label: 'Editorial' },
  { id: 'technical', label: 'Technical' },
] as const;

type GoalId = (typeof GOAL_OPTIONS)[number]['id'];
type HorizonId = (typeof HORIZON_OPTIONS)[number]['id'];
type DispId = (typeof DISPOSITION_OPTIONS)[number]['id'];

const GOAL_PHRASE: Record<GoalId, string> = {
  outlast: 'outlast the trend cycle',
  compound: 'compound attention year over year',
  operate: 'operate at the speed of your own decisions',
  prevail: 'prevail in a crowded market',
};

const DISP_PHRASE: Record<DispId, string> = {
  restrained: 'restrained, quiet, and deliberate',
  cinematic: 'cinematic, atmospheric, and unhurried',
  editorial: 'editorial, structured, and trustable',
  technical: 'technically precise, with craft on the surface',
};

export function Turn() {
  const [goal, setGoal] = useState<GoalId>('outlast');
  const [horizon, setHorizon] = useState<HorizonId>('five');
  const [disp, setDisp] = useState<DispId>('cinematic');

  const horizonWord = useMemo(
    () => HORIZON_OPTIONS.find((h) => h.id === horizon)!.word,
    [horizon],
  );

  return (
    <section className={styles.root} aria-labelledby="turn-title" id="forge">
      <div className={styles.inner}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>
            <span className={styles.eyebrowDot} aria-hidden />
            Turn · The forge
          </p>
          <h2 id="turn-title" className={styles.title}>
            Compose a first-pass brief,
            <br />
            <span className={styles.titleEmber}>live</span>.
          </h2>
          <p className={styles.lede}>
            Three levers. The studio writes the rest. This is the shape every
            engagement starts with — a single sentence that survives contact
            with reality.
          </p>
        </header>

        <div className={styles.rig}>
          <Lever
            label="Goal"
            n="01"
            value={goal}
            options={GOAL_OPTIONS}
            onChange={setGoal}
          />
          <Lever
            label="Horizon"
            n="02"
            value={horizon}
            options={HORIZON_OPTIONS}
            onChange={setHorizon}
          />
          <Lever
            label="Disposition"
            n="03"
            value={disp}
            options={DISPOSITION_OPTIONS}
            onChange={setDisp}
          />
        </div>

        <figure className={styles.output} aria-live="polite">
          <span className={styles.outputLabel}>
            <span className={styles.outputLabelDot} aria-hidden />
            Brief · Draft
          </span>
          <blockquote className={styles.outputBody}>
            <span className={styles.outputOpen}>&ldquo;</span>
            We want to{' '}
            <AnimatedFragment k={goal} className={styles.emberFragment}>
              {GOAL_PHRASE[goal]}
            </AnimatedFragment>{' '}
            <AnimatedFragment k={horizon}>{horizonWord}</AnimatedFragment> — and
            we want the work to feel{' '}
            <AnimatedFragment k={disp}>{DISP_PHRASE[disp]}</AnimatedFragment>.
            <br />
            <span className={styles.outputTail}>
              The studio replies in kind.
            </span>
            <span className={styles.outputClose}>&rdquo;</span>
          </blockquote>
          <figcaption className={styles.outputMeta}>
            A composed sample — real engagements start with a real call.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

// --- Lever ----------------------------------------------------------------

function Lever<T extends string>({
  label,
  n,
  value,
  options,
  onChange,
}: {
  label: string;
  n: string;
  value: T;
  options: ReadonlyArray<{ id: T; label: string }>;
  onChange: (id: T) => void;
}) {
  return (
    <fieldset className={styles.lever}>
      <legend className={styles.leverLegend}>
        <span className={styles.leverN}>{n}</span>
        <span className={styles.leverLabel}>{label}</span>
      </legend>
      <div className={styles.leverOptions} role="radiogroup" aria-label={label}>
        {options.map((o) => {
          const selected = o.id === value;
          return (
            <button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={selected}
              data-selected={selected || undefined}
              className={styles.leverOption}
              onClick={() => onChange(o.id)}
            >
              <span className={styles.leverBullet} aria-hidden />
              {o.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

// --- AnimatedFragment -----------------------------------------------------
// A keyed span that re-mounts when `k` changes, triggering a small CSS
// animation defined in the stylesheet. Keeps the copy readable and lets
// GSAP stay out of the way.

function AnimatedFragment({
  k,
  className,
  children,
}: {
  k: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span key={k} className={[styles.fragment, className].filter(Boolean).join(' ')}>
      {children}
    </span>
  );
}
