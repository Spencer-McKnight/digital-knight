import type { CaseCopyMap } from '../case-copy';

export const cases: CaseCopyMap = {
  sogif: {
    meta: {
      title: 'SOGIF: Website-Relaunch für einen Investmentfonds',
      description:
        'Relaunch der Website des SOGIF-Fonds: neues Design, neue Architektur, gleiche Inhaltsstruktur für die Compliance und eine Partnerschaft, die weiterläuft.',
    },
    h1: 'SOGIF.au: ein Fonds, modern aufgestellt',
    headline: 'Ein Investmentfonds, neu gebaut.',
    line: 'Neues Design und neue Architektur für einen Investmentfonds, auf der Inhaltsstruktur, die seine Compliance bereits kannte.',
    tagline:
      'Neues Design und neue Architektur für den Strategic Opportunities (Growth and Income) Fund, bei unveränderter Inhaltsstruktur für die Compliance-Prüfung.',
    siteLabel: 'sogif.au besuchen',
    built: [
      [
        'Der Fonds war auf einem praktischen Template gestartet. Er brauchte eine Website, die der Stärke der Marke entspricht und mit der Zeit mehr Aufgaben übernehmen kann.',
      ],
      [
        'Ich habe sie mit Next.js und einem Headless-CMS neu gebaut: eine neue visuelle Sprache, Charts zur Wertentwicklung, ein Immobilienportfolio und ein klarer Weg zum Zeichnungsantrag. Die Seitenstruktur blieb nah am Original, damit nicht jede Seite erneut durch die Compliance-Prüfung musste.',
      ],
    ],
    context: [
      [
        'Der Strategic Opportunities (Growth and Income) Fund, kurz SOGIF, wollte ein zeitgemäßes Design und eine tragfähige Architektur für seine Website.',
      ],
      [
        'SOGIF war auf einem praktischen Website-Template gestartet, ein schneller und günstiger Anfang. Mit dem Wachstum des Fonds sollte die Website die Stärke der Marke und den vorausschauenden Anlageansatz zeigen.',
      ],
    ],
    criteria: [
      'Eine Website, die den strategischen Anspruch der Anlagepraxis von SOGIF trägt',
      'Hoher Kontrast, gute Bedienbarkeit und klare Navigation für ein Publikum über 40',
      'Eine Inhaltsstruktur nah am Original, damit das Compliance-Risiko gering bleibt',
    ],
    outcomes: [
      ['Die gesamte Website wurde in weniger als zwei Monaten geliefert, einschließlich mehrerer Änderungsrunden, die den Umfang erweitert haben.'],
      ['Jede Seite trägt strukturierte Daten und vollständige Metadaten, damit Suchmaschinen und KI-Assistenten das Angebot des Fonds lesen können.'],
      [
        'Die Zusammenarbeit läuft als Retainer weiter. Auf der neuen Website entstehen Automatisierungen für die Geschäftsprozesse des Fonds, eine KI-Integration ist im Gespräch.',
      ],
    ],
    alt: {
      lead: 'Die SOGIF-Website mit Charts zur Wertentwicklung und Immobilien',
      before: 'Die ursprüngliche SOGIF-Website vor dem Relaunch',
      after: 'Die neue SOGIF-Website mit neuem Design und Datenvisualisierung',
      application: 'Die SOGIF-Antragsseite mit Angaben zum Fonds',
      properties: 'Das Immobilienportfolio von SOGIF',
    },
    captions: { application: 'Zeichnungsantrag', properties: 'Immobilienportfolio' },
    stackUse: [
      'Full-Stack-React-Framework, statisches und serverseitiges Rendering, Routing',
      'Oberflächenkomponenten und Rendering',
      'Typsicherheit im gesamten Code',
      'Utility-First-Styling',
      'DatoCMS-Inhalte über den Next.js-Daten-Cache',
      'Interaktionsanimation',
      'Charts zur Wertentwicklung',
      'Unit-Tests',
      'Hosting, Performance-Monitoring und Core Web Vitals',
    ],
  },

  dyflex: {
    meta: {
      title: 'DyFlex: SAP-Lieferantenportal mit Next.js',
      description:
        'Next.js-Frontend für ein SAP-Lieferantenportal über BTP, S/4HANA und OData V4, mit einem wiederverwendbaren, KI-gestützten Prototyping-Workflow.',
    },
    h1: 'DyFlex: ein SAP-Lieferantenportal in React',
    headline: 'Ein SAP-Portal, Prototyp in vier Tagen.',
    line: 'Ein Next.js-Frontend für Lieferanten, angebunden an mehrere SAP-Systeme, mit einem Prototyping-Workflow zum Wiederverwenden.',
    tagline: 'Ein responsives Next.js-Frontend, das mehrere SAP-Systeme für Lieferanten in ganz Australien zusammenführt.',
    siteLabel: 'dyflex.com.au besuchen',
    built: [
      [
        'DyFlex implementiert SAP für Kunden in ganz Australien. Ich kam als leitender Next.js-Entwickler zu einem Lieferantenportal, das mehrere SAP-Systeme hinter einem responsiven Frontend verbindet.',
      ],
      [
        'Einen funktionsfähigen Prototyp der Oberfläche habe ich in vier Arbeitstagen gebaut, mit einem Workflow von den Figma-Entwürfen über Claude zum Code. Diesen Workflow habe ich als Leitfaden für weitere Entwickler dokumentiert, die SAP-Integrationen mit Next.js bauen.',
      ],
    ],
    context: [
      ['DyFlex ist ein SAP-Implementierungspartner mit Kunden in ganz Australien.'],
      [
        'Das Portal sollte mehrere SAP-Systeme (Cloud Foundry, S/4HANA und BTP) hinter einem responsiven Frontend zusammenführen, für Lieferanten im ganzen Land.',
      ],
    ],
    criteria: [
      'Eine Oberfläche, die dem Entwurf exakt entspricht',
      'Geschäftslogik, die jede vorgesehene User Story abbildet',
      'Anbindung externer APIs über die SAP-Landschaft hinweg',
      'Ein schnelles, skalierbares und barrierearmes Portal',
    ],
    outcomes: [
      ['Ein Prototyp der gesamten Oberfläche in vier Arbeitstagen, gebaut aus den Figma-Entwürfen mit einem KI-gestützten Workflow.'],
      ['Dieser Workflow ist als Leitfaden dokumentiert, dem künftige Next.js-Entwickler für SAP-Integrationen folgen können.'],
    ],
    alt: { lead: 'Die Oberfläche des SAP-Lieferantenportals von DyFlex' },
    stackUse: [
      'App Router, hybrides Server- und Client-Rendering, Standalone-Deployment',
      'Server Components mit Interaktivität im Client',
      'Strikte Typsicherheit im gesamten Code',
      'Enterprise-Komponenten mit eigenen Design-Tokens',
      'Globaler Zustand',
      'Cloud-Hosting mit Multi-Target-Deployment',
      'OAuth2-Gateway mit rollenbasiertem Zugriff',
      'Bestell- und Leistungserfassungs-APIs auf S/4HANA',
      'Unit- und Komponententests',
    ],
  },

  propertyinvesting: {
    meta: {
      title: 'PropertyInvesting.com: Bot-Traffic- und Kostenanalyse',
      description:
        'Die Quelle massiven Bot-Traffics gefunden, ein günstigerer Weg nach vorn und drei Designrichtungen für eine langjährige Immobilien-Community.',
    },
    h1: 'PropertyInvesting.com: eine Community, neu ausgerichtet',
    headline: 'Woher der Traffic kam.',
    line: 'Woher der Bot-Traffic kam, ein günstigerer Weg nach vorn und drei Designrichtungen.',
    tagline:
      'Eine Analyse für eine der langjährigsten Immobilien-Communitys Australiens: woher ihr Traffic kam, was er kostete und wohin es gehen kann.',
    siteLabel: 'propertyinvesting.com besuchen',
    built: [
      [
        'Nach zwanzig Jahren online war die Website der Community teuer im Betrieb und schwer zu verändern, und ihre Server waren mit Traffic beschäftigt, der nicht von Menschen kam.',
      ],
      [
        'Ich habe diesen Traffic auf automatisierte Direktaufrufe und Spam im Forum zurückgeführt, einen günstigeren Weg für Hosting und Wartung aufgezeigt und drei Designrichtungen als Prototypen gebaut, um das Gespräch über die nächsten Schritte zu eröffnen.',
      ],
    ],
    context: [
      [
        'PropertyInvesting.com wurde von Steve McKnight gegründet und war eine der ersten Stimmen für Immobilien mit positivem Cashflow in Australien und Amerika.',
      ],
      [
        'Nach zwanzig Jahren war die Website schwer zu verändern, jedes Jahr teurer und voller falschem Traffic, der die Server belastete. Ich wurde als Berater geholt, um den weiteren Weg zu empfehlen.',
      ],
    ],
    criteria: [
      'Herausfinden, was die Community bremst',
      'Wege aufzeigen, die Community zu vergrößern und die Betreuung zu erleichtern',
      'Kosten für Server, Hosting und Wartung senken',
      'Eine Designrichtung für die nächsten Schritte vorgeben',
    ],
    outcomes: [
      ['Die Quelle des Bot-Traffics gefunden: automatisierte Direktaufrufe von URLs und Spam im Forum.'],
      ['Einen Weg nach vorn mit geringeren laufenden Kosten für Hosting und Wartung aufgezeigt.'],
      ['Drei Designrichtungen mit KI-Werkzeugen als Prototypen gebaut, ohne Mehrkosten, als Grundlage für das nächste Gespräch.'],
      ['Aus der Arbeit entstand das nächste Projekt: der Relaunch der ', { text: 'Website des SOGIF-Fonds', href: '/de/referenzen/sogif' }, '.'],
    ],
    alt: {
      lead: 'Das Scoping- und Strategiedokument für PropertyInvesting.com',
      courses: 'Designrichtung für einen Kursbereich',
      ctas: 'Designrichtung für Handlungsaufforderungen',
      community: 'Designrichtung für eine spielerische Community',
    },
    captions: { courses: 'Kurse', ctas: 'Handlungsaufforderungen', community: 'Community' },
    stackUse: [
      'Traffic auswerten, um die Richtung festzulegen',
      'Die alte WordPress-Installation auf Sicherheitsprobleme prüfen',
      'Die Designrichtungen als Prototypen bauen',
      'Scoping und Aufwandsschätzung',
    ],
  },

  stevemcknight: {
    meta: {
      title: 'SteveMcKnight.com: Persönliche Website, zügig umgesetzt',
      description:
        'Eine persönliche Website, zügig von der Idee zum Launch, auf einem schlanken statischen Stack, der einfach zu betreiben ist.',
    },
    h1: 'SteveMcKnight.com: von der Idee zum Launch',
    headline: 'Von der Idee zum Launch an einem Tag.',
    line: 'Eine persönliche Website an einem Tag von der Idee zum Launch, auf einem schlanken statischen Stack.',
    tagline: 'Eine persönliche Website für einen Autor und Investor, an einem Tag von der Idee zum Launch.',
    siteLabel: 'stevemcknight.com besuchen',
    built: [
      [
        'Steve McKnight wollte eine persönliche Website, die zeigt, wer er heute ist. Ich habe den Umfang festgelegt, die Erfolgskriterien formuliert und sie mit reinem HTML, CSS und JavaScript auf statischem Hosting gebaut, damit kaum Wartung anfällt.',
      ],
      [
        'Damit seine Stimme erhalten bleibt, flossen die gesamte alte Website und einige seiner eigenen Notizen in die Texte ein. Aus ihnen entstand auch die neue Designsprache.',
      ],
    ],
    context: [
      ['Steve McKnight wollte eine neue persönliche Website. Die alte zeigte nicht mehr, wer er ist und woran er arbeitet.'],
      [
        'Zu einem offenen Briefing habe ich den Umfang festgelegt und die Erfolgskriterien geschrieben. Es war ein schnelles Projekt, kostenlos angeboten, um die Zusammenarbeit zu beginnen.',
      ],
    ],
    criteria: [
      'Ein sehr einfacher technischer Stack',
      'Steves Geschichte, Sprache und Identität auf jeder Seite',
      'Klare Wege zu seinen Büchern und aktuellen Projekten',
      'Weiterführende Texte zu seiner Haltung und seinen Gedanken',
    ],
    outcomes: [
      ['Die Website ging an einem Tag von der Idee zum Launch, auf statischem Hosting, das einfach zu betreiben ist.'],
      ['Die Inhalte der alten Website und einige Notizen von Steve flossen in die Texte ein, damit sie nach ihm klingen.'],
      ['Sie ist mit Analytics verbunden, leitet Anfragen an sein Postfach weiter und funktioniert auf jeder Bildschirmgröße.'],
    ],
    alt: {
      lead: 'Die Startseite von SteveMcKnight.com mit Porträt',
      before: 'Die ursprüngliche Website von Steve McKnight',
      after: 'Der neue Bücherbereich mit klarer Typografie',
      insights: 'Der Bereich mit ausgewählten Artikeln',
      cta: 'Die Handlungsaufforderung mit Newsletter-Anmeldung',
    },
    captions: { insights: 'Artikel', cta: 'Handlungsaufforderung' },
    stackUse: [
      'Handgeschriebenes Markup',
      'Farbmodus-Umschalter und gemeinsames Verhalten',
      'Styles und Design-Tokens, Mobile First',
      'Typografie',
      'Besucheranalyse',
      'Statisches Hosting, CDN und Deployment',
      'Inhaltsquelle und Referenz für die Tonalität',
    ],
  },

  inlight: {
    meta: {
      title: 'Inlight: Handwerk in einer Produktagentur',
      description:
        "Full-Stack-Entwicklung für Chadstone, Nando's, Urban Rest und AHM, ausgezeichnet mit dem Inlight Rising Star Award.",
    },
    h1: 'Inlight: wo das Handwerk entstand',
    headline: 'Zwei Jahre in einer Produktagentur.',
    line: 'Zwei Jahre Full-Stack-Entwicklung in einer Produktagentur in Melbourne, vor dem Studio.',
    tagline: 'Zwei Jahre als Full-Stack-Entwickler in einer digitalen Produktagentur in Melbourne, bevor das Studio begann.',
    siteLabel: 'inlight.com.au besuchen',
    indexKind: 'Vor dem Studio',
    built: [
      [
        'Inlight entwickelt digitale Produkte für Kunden aus Handel, Gastronomie, Gesundheit, Reise und Verwaltung. Dort habe ich zwei Jahre als Full-Stack-Entwickler gearbeitet, bevor ich Digital Knight gegründet habe.',
      ],
      [
        'Dort habe ich gelernt, wie echte Lieferung funktioniert: für große Kunden, mit festen Terminen, im Web und auf Mobilgeräten, Hand in Hand mit Strategie, Design und Test.',
      ],
    ],
    context: [
      [
        'Inlight ist eine digitale Produktagentur in Melbourne, die auf komponierbare Architektur und Produkte setzt, die sich laufend verbessern. Ihre Kunden kommen aus Handel, Automobil, Gastronomie, Gesundheit, Verwaltung, Reise und Logistik.',
      ],
      [
        'Dort ist mein technisches Fundament entstanden. Zwei Jahre als Full-Stack-Entwickler haben mir den Rhythmus der Agenturarbeit beigebracht, neue Stacks und Produkte, die viele Menschen nutzen.',
      ],
    ],
    criteria: [
      'Sorgfältige Arbeit für bekannte Kunden, zu festen Terminen',
      'Enge Zusammenarbeit von Design, Strategie, Projektleitung und Entwicklung',
      'Entwicklung über den gesamten Stack mehrerer Produkte',
      'Performance- und Sicherheitsarbeit für große Anwendungen',
    ],
    engagements: [
      { name: 'Die Chadstone-App von Vicinity', description: 'React-Native-Komponenten für die Shopping-App von Chadstone.' },
      {
        name: "Nando's Australien und Neuseeland",
        description: 'Feature-Releases für Web und React Native, mit Blue-Green-Deployments und sorgfältigen Tests für sichere Releases.',
      },
      {
        name: 'Urban Rest',
        description:
          'Der Check-in-Prozess von Anfang bis Ende, mit einem kundenfertigen Prototyp in zwei Wochen, danach ein KI-Workshop im kleinen Team für eine Empfehlungs-Engine zur Unterkunftssuche.',
      },
      {
        name: 'AHM',
        description:
          'Migration eines individuellen Sanity-v2-CMS auf Sanity v3, mit einem Update von Node 14 auf 20 und vollständiger Paketmodernisierung, geplant entlang der Risiken.',
      },
    ],
    outcomes: [
      ['Arbeit über Strategie, Design, Führung und Test hinweg in mehreren Kundenprojekten.'],
      ['Eine typisierte, sichere Schicht zwischen Backend-APIs und Frontend, damit Oberflächen komplexe Dienste sauber nutzen können.'],
      ['Präsentationen und Demos für Kunden sowie Wissensaustausch in der Agentur.'],
      ['Ausgezeichnet mit dem Inlight Rising Star Award.'],
    ],
    alt: { lead: 'Die Agentur-Website von Inlight' },
    stackUse: [
      'Webanwendungen und serverseitiges Rendering',
      'Plattformübergreifende Mobile Apps',
      'Cloud-Infrastruktur, Staging-Umgebungen und Datenbanken',
      'Web-Deployment und Hosting',
      'Legacy- und CMS-basiertes Backend',
      'Abfragen für Inhalts- und Datenschichten',
      'Headless und strukturiertes Content-Management',
      'Authentifizierung und sichere Tokens',
      'Container für Entwicklung und Deployment',
      'Serverseitige Skripte und API-Vermittlung',
      'CI/CD-Automatisierung',
    ],
  },
};
