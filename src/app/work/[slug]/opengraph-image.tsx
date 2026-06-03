import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { getCaseStudy, getAllSlugs } from './content';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Digital Knight case study';

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

const INK_STONE = '#403D39';
const INK_PAGE = '#FFEDD7';
const INK_EMBER = '#DD6637';

const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="207 208 611 611"><path fill="${INK_EMBER}" d="M613.467163,740.476990 C582.859131,767.845459 550.858521,792.848694 517.119080,815.634949 C514.232849,817.584290 512.163513,817.827576 509.168121,815.699524 C464.290344,783.817200 420.559326,750.533630 382.287079,710.708313 C349.542816,676.635315 321.143524,639.413452 301.332764,596.160156 C283.741211,557.752014 274.071655,517.585449 275.000000,475.185364 L275.000000,307.278717 C275.102325,299.860962 275.068329,300.057556 282.555115,298.604858 C336.233368,288.189423 388.165192,272.284332 437.750427,249.031921 C462.209900,237.561935 485.990173,224.842133 508.947357,210.594635 C511.257385,209.160980 513.246094,208.011658 516.197815,209.881256 C580.684204,250.726379 650.618469,277.897675 725.369629,292.902679 C731.896790,294.212891 738.400879,295.840332 744.998352,296.532837 C750.035950,297.061615 751.000000,299.249054 751.000000,303.945374 L751.000000,479.909790 C751.048218,500.411285 749.232971,520.759155 744.605957,540.858276 C737.818176,570.343628 726.372681,597.907898 711.400696,624.055542 C685.861328,668.658447 651.526184,705.916504 613.467163,740.476990 M497.374451,664.942261 L541.152832,581.273560 L669.071106,566.792847 L418.676880,357.969696 L485.240509,684.995483 L497.374451,664.942261 z"/></svg>`;

const logoDataUri = `data:image/svg+xml;base64,${Buffer.from(logoSvg).toString('base64')}`;

type Props = { params: Promise<{ slug: string }> };

export default async function CaseStudyOgImage({ params }: Props) {
  const { slug } = await params;
  const study = getCaseStudy(slug);

  const fontFile = await readFile(
    join(process.cwd(), 'public/fonts/reforma/reforma.1969-gris.ttf'),
  );

  const title = study?.title ?? 'Selected work';
  const label = study?.label ?? 'Digital Knight';
  const stat = study?.stats?.[0];

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: INK_STONE,
          padding: '64px 72px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <img src={logoDataUri} alt="" width={56} height={56} />
          <span
            style={{
              fontFamily: 'Reforma 1969',
              fontSize: 24,
              letterSpacing: '0.12em',
              color: INK_PAGE,
              textTransform: 'uppercase' as const,
            }}
          >
            Digital Knight
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <span
            style={{
              fontFamily: 'Reforma 1969',
              fontSize: 22,
              letterSpacing: '0.08em',
              color: INK_EMBER,
              textTransform: 'uppercase' as const,
            }}
          >
            {label}
          </span>
          <span
            style={{
              fontFamily: 'Reforma 1969',
              fontSize: 64,
              lineHeight: 1.05,
              color: INK_PAGE,
              maxWidth: 980,
            }}
          >
            {title}
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <span
            style={{
              fontFamily: 'Reforma 1969',
              fontSize: 16,
              letterSpacing: '0.08em',
              color: INK_PAGE,
              opacity: 0.6,
            }}
          >
            digital-knight.au
          </span>
          {stat && (
            <span
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: 4,
              }}
            >
              <span style={{ fontFamily: 'Reforma 1969', fontSize: 40, color: INK_EMBER }}>
                {stat.value}
              </span>
              <span
                style={{
                  fontFamily: 'Reforma 1969',
                  fontSize: 15,
                  color: INK_PAGE,
                  opacity: 0.7,
                  maxWidth: 360,
                  textAlign: 'right' as const,
                }}
              >
                {stat.label}
              </span>
            </span>
          )}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: 'Reforma 1969', data: fontFile, weight: 400 }],
    },
  );
}
