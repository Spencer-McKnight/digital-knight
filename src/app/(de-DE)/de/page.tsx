import { pageMetadata } from '@/content/routes';

export const metadata = pageMetadata({
  id: 'home',
  locale: 'de-DE',
  title: 'Digital Knight | Digitalstudio für Strategie, Web und KI',
  absoluteTitle: true,
  description:
    'Ein Ansprechpartner für Digitalstrategie, Website und KI-Integration. Gebaut, um weiterzuwachsen, nicht um übergeben zu werden. Kostenloses Erstgespräch.',
});

// Interim until the German pages are composed from blocks.
export default function Startseite() {
  return (
    <section data-ground="paper">
      <h1>Digitale Systeme, die Probleme lösen und mit Ihnen wachsen.</h1>
    </section>
  );
}
