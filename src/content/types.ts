/** A run of text with inline links. Content modules stay plain data. */
export type Inline = string | { text: string; href: string };
export type Paragraph = ReadonlyArray<Inline>;

/** A link to somewhere on the site, named by where it goes. */
export type LinkTo = { href: string; label: string };

export type Picture = { src: string; width: number; height: number; alt: string };
