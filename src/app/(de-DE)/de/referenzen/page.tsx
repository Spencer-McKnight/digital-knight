import { Call } from '@/blocks/Call/Call';
import { Concordance } from '@/blocks/Concordance/Concordance';
import { Index } from '@/blocks/Index/Index';
import { Proof } from '@/blocks/Proof/Proof';
import { Statement } from '@/blocks/Statement/Statement';
import { Trail } from '@/blocks/Trail/Trail';
import { call, concordance, index, meta, proof, statement } from '@/content/de-DE/work';
import { pageMetadata } from '@/content/routes';

export const metadata = pageMetadata({ id: 'work', locale: 'de-DE', ...meta });

export default function Referenzen() {
  return (
    <>
      <Trail locale="de-DE" current="work" />
      <Statement {...statement} />
      <Proof {...proof} />
      <Index {...index} />
      <Concordance {...concordance} />
      <Call {...call} />
    </>
  );
}
