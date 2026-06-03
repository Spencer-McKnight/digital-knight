import { CASE_STUDIES, type ImageDef } from '@/app/work/[slug]/content';

export type WorkItem = {
  id: string;
  label: string;
  title: string;
  screen?: ImageDef;
  backdrop?: ImageDef;
};

const WORK_ORDER = ['sogif', 'dyflex-hio', 'inlight', 'propertyinvesting', 'stevemcknight'] as const;

const OVERRIDES: Record<string, { label?: string; backdrop?: ImageDef }> = {
  sogif: {
    backdrop: {
      src: '/images/sogif/sogif-background.avif',
      alt: '',
      width: 1024,
      height: 768,
    },
  },
  'dyflex-hio': {
    label: 'DyFlex x Hancock Iron Ore',
    backdrop: {
      src: '/images/dyflex-hio/hio-background.avif',
      alt: 'Hancock Iron Ore field workers collaborating on site',
      width: 1500,
      height: 1001,
    },
  },
};

export const WORK: ReadonlyArray<WorkItem> = WORK_ORDER.map((slug) => {
  const cs = CASE_STUDIES.find((c) => c.slug === slug)!;
  const overrides = OVERRIDES[slug];
  const lead = cs.figures.find((f) => f.variant === 'lead') ?? cs.figures[0];

  return {
    id: cs.slug,
    label: overrides?.label ?? cs.label,
    title: cs.title,
    screen: lead
      ? { src: lead.src, alt: lead.alt, width: lead.width, height: lead.height }
      : undefined,
    backdrop: overrides?.backdrop,
  };
});
