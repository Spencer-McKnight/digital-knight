import { describe, expect, it } from 'vitest';
import { alternatesFor, href, pairedHref, pathFor, resolvePath, stageOf } from '@/content/routes';

describe('route map', () => {
  it('maps page ids to localised paths', () => {
    expect(href('services', 'de-DE')).toBe('/de/leistungen');
    expect(href('case', 'de-DE', 'sogif')).toBe('/de/referenzen/sogif');
    expect(pathFor('imprint', 'en-AU')).toBeNull();
  });

  it('resolves paths back to page, locale and slug', () => {
    expect(resolvePath('/')).toEqual({ id: 'home', locale: 'en-AU' });
    expect(resolvePath('/de')).toEqual({ id: 'home', locale: 'de-DE' });
    expect(resolvePath('/work/dyflex')).toEqual({ id: 'case', locale: 'en-AU', slug: 'dyflex' });
    expect(resolvePath('/de/erstgespraech/')).toEqual({ id: 'talk', locale: 'de-DE' });
    expect(resolvePath('/work/unknown')).toBeNull();
  });

  it('pairs every page with the same page in the other market', () => {
    expect(pairedHref('/talk')).toBe('/de/erstgespraech');
    expect(pairedHref('/de/referenzen/inlight')).toBe('/work/inlight');
    expect(pairedHref('/de/impressum')).toBe('/');
    expect(pairedHref('/nowhere')).toBe('/de');
    expect(pairedHref('/de/nirgendwo')).toBe('/');
  });

  it('lists both markets and x-default in alternates', () => {
    expect(alternatesFor('work', 'de-DE')).toEqual({
      canonical: '/de/referenzen',
      languages: { 'en-AU': '/work', 'de-DE': '/de/referenzen', 'x-default': '/work' },
    });
    expect(alternatesFor('imprint', 'de-DE')).toEqual({ canonical: '/de/impressum' });
  });

  it('numbers the four funnel stages', () => {
    expect(stageOf('services')).toBe(1);
    expect(stageOf('case')).toBe(2);
    expect(stageOf('talk')).toBe(4);
    expect(stageOf('contact')).toBeNull();
  });
});
