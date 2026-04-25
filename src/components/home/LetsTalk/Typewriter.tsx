'use client';

import { useState, useEffect, useCallback } from 'react';

const WORDS = ['Digital Strategy', 'Website Design', 'Automation', 'AI'];

const TYPE_SPEED = 80;
const DELETE_SPEED = 50;
const PAUSE_AFTER_TYPE = 2000;
const PAUSE_AFTER_DELETE = 400;

type Phase = 'typing' | 'pausing' | 'deleting' | 'waiting';

export function Typewriter({ className }: { className?: string }) {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [phase, setPhase] = useState<Phase>('typing');

  const word = WORDS[wordIndex]!;

  const advance = useCallback(() => {
    setWordIndex((i) => (i + 1) % WORDS.length);
    setDisplayed('');
    setPhase('typing');
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    switch (phase) {
      case 'typing': {
        if (displayed.length < word.length) {
          timer = setTimeout(() => {
            setDisplayed(word.slice(0, displayed.length + 1));
          }, TYPE_SPEED);
        } else {
          setPhase('pausing');
        }
        break;
      }
      case 'pausing': {
        timer = setTimeout(() => setPhase('deleting'), PAUSE_AFTER_TYPE);
        break;
      }
      case 'deleting': {
        if (displayed.length > 0) {
          timer = setTimeout(() => {
            setDisplayed(displayed.slice(0, -1));
          }, DELETE_SPEED);
        } else {
          setPhase('waiting');
        }
        break;
      }
      case 'waiting': {
        timer = setTimeout(advance, PAUSE_AFTER_DELETE);
        break;
      }
    }

    return () => clearTimeout(timer);
  }, [phase, displayed, word, advance]);

  return (
    <span className={className} aria-label={word}>
      {displayed || ' '}
    </span>
  );
}
