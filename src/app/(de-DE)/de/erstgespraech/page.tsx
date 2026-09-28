import { Agenda } from '@/blocks/Agenda/Agenda';
import { Call } from '@/blocks/Call/Call';
import { Commit } from '@/blocks/Commit/Commit';
import { Hours } from '@/blocks/Hours/Hours';
import { Statement } from '@/blocks/Statement/Statement';
import { Trail } from '@/blocks/Trail/Trail';
import { commit, hours } from '@/content/de-DE/common';
import { agenda, call, commitHead, hoursHead, meta, statement } from '@/content/de-DE/talk';
import { pageMetadata } from '@/content/routes';

export const metadata = pageMetadata({ id: 'talk', locale: 'de-DE', absoluteTitle: true, ...meta });

export default function Erstgespraech() {
  return (
    <>
      <Trail locale="de-DE" current="talk" ground="carbon" />
      <Statement {...statement} />
      <Agenda {...agenda} />
      <Hours locale="de-DE" copy={hours} {...hoursHead} />
      <Commit locale="de-DE" copy={commit} {...commitHead} />
      <Call {...call} />
    </>
  );
}
