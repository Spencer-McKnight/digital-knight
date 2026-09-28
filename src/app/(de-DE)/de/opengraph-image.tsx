import { OG_SIZE, ogCard } from '@/og/card';

export const alt = 'Digital Knight: Digitale Systeme, die Probleme lösen und mit Ihnen wachsen.';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return ogCard({ kicker: 'Digitalstudio aus Melbourne', title: 'Digitale Systeme, die Probleme lösen und mit Ihnen wachsen.' });
}
