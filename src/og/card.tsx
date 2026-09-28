import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { PALETTE } from '@/styles/palette';

export const OG_SIZE = { width: 1200, height: 630 };

const fontFile = (name: string) => readFile(join(process.cwd(), 'src/og', name));

type Card = {
  /** Meta line above the title: the market, the client. */
  kicker: string;
  title: string;
};

/** The shared card: carbon ground, the wordmark, one title, one signal mark. */
export async function ogCard({ kicker, title }: Card) {
  const [display, meta] = await Promise.all([fontFile('HubotSans-800-112.ttf'), fontFile('MonaSans-600-110.ttf')]);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '56px 64px',
          backgroundColor: PALETTE.carbon,
          color: PALETTE.paper,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'Hubot', fontSize: 22, letterSpacing: '0.04em' }}>
          DIGITAL KNIGHT
          <Mark size={24} color={PALETTE.paper} />
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 48 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 940 }}>
            <span style={{ fontFamily: 'Mona', fontSize: 20, letterSpacing: '0.08em', color: PALETTE.fog, textTransform: 'uppercase' }}>
              {kicker}
            </span>
            <span style={{ fontFamily: 'Hubot', fontSize: title.length > 44 ? 64 : 80, lineHeight: 0.94, letterSpacing: '-0.03em' }}>
              {title}
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 112,
              height: 112,
              flexShrink: 0,
              backgroundColor: PALETTE.signal,
            }}
          >
            <Mark size={64} color={PALETTE.carbon} />
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: 'Hubot', data: display, weight: 800, style: 'normal' },
        { name: 'Mona', data: meta, weight: 600, style: 'normal' },
      ],
    },
  );
}

function Mark({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M3.5 1.5V10.5H13M9.5 7L13 10.5L9.5 14" stroke={color} strokeWidth={2.2} strokeLinecap="square" />
    </svg>
  );
}
