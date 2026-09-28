import { Agenda } from '@/blocks/Agenda/Agenda';
import { Call } from '@/blocks/Call/Call';
import { Commit } from '@/blocks/Commit/Commit';
import { Hours } from '@/blocks/Hours/Hours';
import { Statement } from '@/blocks/Statement/Statement';
import { Trail } from '@/blocks/Trail/Trail';
import { commit, hours } from '@/content/en-AU/common';
import { agenda, call, commitHead, hoursHead, meta, statement } from '@/content/en-AU/talk';
import { pageMetadata } from '@/content/routes';

export const metadata = pageMetadata({ id: 'talk', locale: 'en-AU', ...meta });

export default function Talk() {
  return (
    <>
      <Trail locale="en-AU" current="talk" ground="carbon" />
      <Statement {...statement} />
      <Agenda {...agenda} />
      <Hours locale="en-AU" copy={hours} {...hoursHead} />
      <Commit locale="en-AU" copy={commit} {...commitHead} />
      <Call {...call} />
    </>
  );
}
