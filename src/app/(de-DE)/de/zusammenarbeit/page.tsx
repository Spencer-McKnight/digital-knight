import { Credential } from '@/blocks/Credential/Credential';
import { Dialogue } from '@/blocks/Dialogue/Dialogue';
import { Ledger } from '@/blocks/Ledger/Ledger';
import { Method } from '@/blocks/Method/Method';
import { Statement } from '@/blocks/Statement/Statement';
import { Ticket } from '@/blocks/Ticket/Ticket';
import { Trail } from '@/blocks/Trail/Trail';
import { credentialFull, dialogue, meta, method, statement, terms, ticket } from '@/content/de-DE/partnership';
import { pageMetadata } from '@/content/routes';

export const metadata = pageMetadata({ id: 'partnership', locale: 'de-DE', ...meta });

export default function Zusammenarbeit() {
  return (
    <>
      <Trail locale="de-DE" current="partnership" />
      <Statement {...statement} />
      <Method {...method} />
      <Ledger {...terms} />
      <Credential {...credentialFull} />
      <Dialogue {...dialogue} />
      <Ticket {...ticket} />
    </>
  );
}
