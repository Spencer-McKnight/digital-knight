'use client';

import { useCallback, useRef, useState } from 'react';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icons';
import { Reveal } from '@/components/Reveal';
import { scrollToElement } from '@/lib/scroll';
import { FAQS, type FAQItem } from './content';
import styles from './FAQ.module.scss';

const HALF = Math.ceil(FAQS.length / 2);
const COL_1 = FAQS.slice(0, HALF);
const COL_2 = FAQS.slice(HALF);

export function FAQ() {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  const toggle = useCallback((id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  return (
    <section id="faq" data-ground="page" className={styles.root} aria-labelledby="faq-heading">
      <div className={styles.inner}>
        <Reveal as="header" className={styles.header} amount="md" enabled>
          <div className={styles.titleRow}>
            <div>
              <p className={styles.eyebrow}>FAQs</p>
              <h2 id="faq-heading" className={styles.heading}>
                Learn more
              </h2>
            </div>
            <Button href="/contact" variant="secondary" className={styles.advice}>
              Expert Advice
            </Button>
          </div>
        </Reveal>

        <div className={styles.columns}>
          <div className={styles.column} role="list">
            {COL_1.map((item, i) => (
              <Reveal key={item.id} className={styles.itemWrap} amount="md" delay={i * 60} enabled>
                <AccordionItem item={item} isOpen={openIds.has(item.id)} onToggle={toggle} />
              </Reveal>
            ))}
          </div>
          <div className={styles.column} role="list">
            {COL_2.map((item, i) => (
              <Reveal
                key={item.id}
                className={styles.itemWrap}
                amount="md"
                delay={(i + HALF) * 60}
                enabled
              >
                <AccordionItem item={item} isOpen={openIds.has(item.id)} onToggle={toggle} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function AccordionItem({
  item,
  isOpen,
  onToggle,
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: (id: string) => void;
}) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = `faq-panel-${item.id}`;
  const triggerId = `faq-trigger-${item.id}`;

  const close = useCallback(() => {
    onToggle(item.id);
    if (triggerRef.current && triggerRef.current.getBoundingClientRect().top < 0) {
      scrollToElement(triggerRef.current, 'smooth', 200);
    }
  }, [item.id, onToggle]);

  return (
    <div className={styles.item} data-state={isOpen ? 'open' : 'closed'} role="listitem">
      <button
        ref={triggerRef}
        id={triggerId}
        className={styles.trigger}
        onClick={() => {
          if (!isOpen && triggerRef.current) {
            scrollToElement(triggerRef.current, 'smooth', 200);
          }
          onToggle(item.id);
        }}
        aria-expanded={isOpen}
        aria-controls={panelId}
        type="button"
      >
        <Icon name={item.icon} size={22} className={styles.icon} aria-hidden="true" />
        <span className={styles.question}>{item.title}</span>
        <svg
          width={24}
          height={24}
          viewBox="0 0 24 24"
          fill="none"
          className={styles.chevron}
          aria-hidden="true"
        >
          <path
            className={styles.chevronPath}
            d={isOpen ? 'M 6 15 L 12 9 L 18 15' : 'M 6 9 L 12 15 L 18 9'}
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div id={panelId} role="region" aria-labelledby={triggerId} className={styles.panel}>
        <div className={styles.body}>
          {item.body}
          <button type="button" className={styles.close} onClick={close}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
