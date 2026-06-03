type ImageDef = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type WorkItem = {
  id: string;
  label: string;
  title: string;
  href: string;
  screen?: ImageDef;
  backdrop?: ImageDef;
};

export const WORK: ReadonlyArray<WorkItem> = [
  {
    id: 'sogif',
    label: 'SOGIF.au',
    title: 'Modernising a world-class fund',
    href: 'https://sogif.au',
    backdrop: {
      src: '/images/sogif/sogif-background.png',
      alt: '',
      width: 1024,
      height: 768,
    },
    screen: {
      src: '/images/sogif/sogif-showcase.png',
      alt: 'SOGIF website showing fund performance charts and property assets',
      width: 1251,
      height: 1158,
    },
  },
  {
    id: 'dyflex-hio',
    label: 'DyFlex x Hancock Iron Ore',
    title: 'Seamless SAP vendor portal',
    href: 'https://dyflex.com.au',
    backdrop: {
      src: '/images/dyflex-hio/hio-background.png',
      alt: 'Hancock Iron Ore field workers collaborating on site',
      width: 1500,
      height: 1001,
    },
    screen: {
      src: '/images/dyflex-hio/hio-showcase.png',
      alt: 'DyFlex SAP vendor portal interface for Hancock Iron Ore',
      width: 1506,
      height: 1209,
    },
  },
  {
    id: 'inlight',
    label: 'Inlight',
    title: 'Two years of agency delivery',
    href: 'https://inlight.com.au',
    screen: {
      src: '/images/inlight/inlight-showcase.png',
      alt: 'Inlight agency website hero — We create future-proof digital products',
      width: 1302,
      height: 1257,
    },
  },
  {
    id: 'propertyinvesting',
    label: 'PropertyInvesting.com',
    title: 'Strategic digital consultation',
    href: 'https://propertyinvesting.com',
    screen: {
      src: '/images/propertyinvesting/propertyinvesting-showcase.png',
      alt: 'PropertyInvesting.com project scope and strategy document',
      width: 1461,
      height: 1170,
    },
  },
  {
    id: 'stevemcknight',
    label: 'SteveMcKnight.com',
    title: 'Showcase website in a day',
    href: 'https://stevemcknight.com',
    screen: {
      src: '/images/stevemcknight.com/stevemcknight-showcase.png',
      alt: 'SteveMcKnight.com hero section with portrait and statistics',
      width: 1406,
      height: 1263,
    },
  },
];
