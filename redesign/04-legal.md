# 04 · Legal obligations

What the site owes each market, and what the build has to do about it. This is a working checklist, not legal advice. Have a lawyer who practises German IT and data-protection law review the Impressum and the privacy text before de-DE goes live.

## Copy rule: describe the work, not outcomes

- **No outcome metrics anywhere:** copy, metadata, structured data, `llms.txt`, OG images, emails. That means no percentages, multipliers, savings, traffic shares, or engagement and conversion changes.
- **Describe what was done:** what the client asked for, what was built, which systems it touches, how the partnership continues.
- **Also out:** "guaranteed", "free forever", "without hallucinations", and claims about what other agencies do.
- **Allowed:**
  - the offer's own terms (free, 30 minutes, no obligation), which must be honoured
  - tenure and dates (two years at Inlight)
  - named awards (Inlight Rising Star Award)
  - client names already published with their case studies
- **DyFlex asked that portal details stay private.** Publish nothing beyond what is live today.

Why: every outcome figure is a representation that has to be substantiated. In Australia that is ACL s 18 (misleading or deceptive conduct) and s 29 (false or misleading representations about services). In Germany it is UWG § 5 (misleading commercial practices), which competitors and associations can enforce with an Abmahnung.

## Australia

- **Privacy Act 1988 (Cth).** The Australian Privacy Principles bind businesses with annual turnover above $3 million. Most small businesses are exempt (s 6D), with exceptions such as trading in personal information. A clear policy is still expected, and the site already has one. It needs the fixes listed below.
- **Spam Act 2003.** Booking confirmations and enquiry replies are transactional. Marketing email needs consent and an unsubscribe.
- **Australian Consumer Law.** The copy rule above.

## Germany and the EU

### What applies

- **GDPR** applies to a controller outside the EU who offers services to people in the EU (Art. 3(2)(a)). A German-language site aimed at German buyers meets that test. So GDPR covers the de-DE pages and any EU visitor on the English ones.
- **EU representative (Art. 27).** Non-EU controllers under Art. 3(2) need one, unless the processing is occasional, involves no large-scale special-category data, and is unlikely to put anyone at risk (Art. 27(2)(a)). A contact form and a booking grid very likely qualify for the exemption. Write that reasoning down and confirm it in the review.
- **Impressum (§ 5 DDG,** which replaced § 5 TMG in May 2024). Strictly, it binds providers established in Germany. For a provider in Australia selling to German customers, publishing one is expected practice, and it closes an easy Abmahnung route under UWG. Publish one.

### Impressum draft

Page `/de/impressum`, linked from the colophon of every de-DE page, so it is easy to find, one click away, and always available. Content lives in `src/content/legal.ts`. Empty fields render nothing, and the build logs a warning until they are filled.

```text
Impressum

Angaben gemäß § 5 DDG

Spencer McKnight
Digital Knight
[Straße und Hausnummer]
[Postleitzahl und Ort]
Australien

Kontakt
E-Mail: hello@digital-knight.au
Kontaktformular: digital-knight.au/de/kontakt
[Telefon, optional]

[ABN, optional]

Verbraucherstreitbeilegung
Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren
vor einer Verbraucherschlichtungsstelle teilzunehmen.
```

- **The address must be a ladungsfähige Anschrift,** a street address where documents can be served. A PO box does not count. Spencer adds it later.
- **Email plus one more fast channel.** The contact form covers this (CJEU C-298/07). A phone number is optional.
- **No USt-IdNr.;** leave the line out. An ABN is optional.
- **No link to the EU online dispute resolution platform.** It closed on 20 July 2025 under Regulation (EU) 2024/3228, and a leftover link can itself be read as misleading.
- **The dispute-resolution statement is optional** for a business with ten or fewer staff (§ 36 Abs. 3 VSBG). One sentence removes any doubt.
- **No § 18 Abs. 2 MStV line** unless the site adds editorial articles, such as a journal.
- **No "Haftung für Links" boilerplate.** It has no legal effect and breaks the voice.

### Privacy policy, both languages

Write one policy to GDPR standard, in English at `/privacy` and German at `/de/datenschutz`, so EU visitors reading English are covered too. Art. 13 requires the parts below.

**Controller.** Spencer McKnight, trading as Digital Knight, [address], hello@digital-knight.au.

**Processing, purpose, legal basis, retention:**

| Processing | Data | Purpose | Legal basis | Retention |
| --- | --- | --- | --- | --- |
| Hosting, server logs (Vercel) | IP address, user agent, time, URL | Deliver the site, keep it secure | Art. 6(1)(f) | [confirm Vercel's log retention] |
| Booking (Supabase, Resend) | Name, email, chosen slot, time zone | Arrange and confirm the call | Art. 6(1)(b), steps before a contract | [Spencer to set] |
| Enquiry (Resend; Supabase if stored) | Name, email, message | Reply to the enquiry | Art. 6(1)(b) | [Spencer to set] |
| Form protection | Fill time, honeypot field, email domain | Keep spam out | Art. 6(1)(f) | Not stored beyond the request |
| Vercel Web Analytics | Page views, referrer, device type, country. No cookies. | Improve the site | Art. 6(1)(f) | [confirm with Vercel] |
| Google Analytics (en-AU only, if kept) | Cookie identifiers, usage data | Measure the site | Art. 6(1)(a) consent, § 25 TDDDG | [GA setting] |

**Recipients and transfers.**

- **Vercel, Supabase, Resend and Google** (if GA stays) are processors, each under a data processing agreement. For each, state its transfer basis: certification under the EU-US Data Privacy Framework, or standard contractual clauses. Confirm the Supabase project region.
- **The controller is in Australia,** and Australia has no EU adequacy decision. Say so plainly.

**Rights.** Access (Art. 15), rectification (16), erasure (17), restriction (18), portability (20), objection (21), withdrawing consent (7(3)), and complaint to a supervisory authority (77). Keep the existing OAIC route for Australian visitors.

**Other statements.**

- Giving data is voluntary; without a name and email a booking cannot be made.
- No automated decisions or profiling.
- Cookies: only Google Analytics sets them, and only where it runs.
- Fonts are self-hosted and make no request to Google (LG München I, 20 January 2022, 3 O 17493/20).
- No third-party embeds (maps, video) without click-to-load consent.

**Fixes to the current English policy:**

- Name the controller and add the address field.
- Stop calling Google Analytics "anonymised" and "not personally identifying". It sets cookies with client identifiers, which GDPR treats as personal data.
- Remove "phone number". No form collects one.
- Add legal bases, retention periods, transfer information, EU rights and the complaint route.
- Say what is stored in Supabase: bookings, and enquiries if the `contact_submissions` table is in use.
- Update the "last updated" date.

### Consent and analytics

- **de-DE:** no Google Analytics. Vercel Web Analytics only, so no banner is needed.
- **en-AU:** Google Analytics sets cookies for every visitor, including EU visitors reading English.
  - **Recommendation:** remove Google Analytics site-wide and track the funnel with Vercel Analytics custom events.
  - If it stays, it must load only after consent for EU and EEA visitors, which means a consent banner.
  - **Spencer's call.** Until then the build keeps Google Analytics on en-AU only, and this entry stays open.

### Accessibility

The European Accessibility Act has applied since 28 June 2025 to certain consumer services. Microenterprises providing services (fewer than 10 staff, and turnover or balance sheet of €2 million or less) are exempt, and this is a business-to-business site. The design targets WCAG 2.2 AA anyway; keep it there.

## Build tasks

- **`src/content/legal.ts`:** controller name, trading name, address fields (empty), email, contact URL per locale, ABN (empty).
- **`/de/impressum`:** built from the draft above, with an "Impressum" link in every de-DE colophon.
- **Privacy pages:** `/privacy` and `/de/datenschutz` from one structured source. Fields Spencer has to fill render nothing, and the build warns.
- **No Google Analytics** on de-DE routes.
- **Copy rule applied** to the case-study content, FAQ, `llms.txt`, OG images, structured data and emails.

## Spencer to supply

- Postal address: street, postcode, city.
- Optional: phone number, ABN.
- Retention periods for bookings and enquiries.
- Supabase project region. Confirmation that DPAs are accepted with Vercel, Supabase, Resend and Google.
- Google Analytics: remove, or keep behind consent.
- A lawyer's review of the Impressum and Datenschutzerklärung before de-DE launches.

## Sources

- Regulation (EU) 2024/3228 and the end of the ODR platform: [National Law Review](https://natlawreview.com/article/no-one-wants-dispute-consumers-end-european-online-dispute-resolution-platform-odr), [European Commission notice](https://consumer-redress.ec.europa.eu/site-relocation_en).
- GDPR Arts. 3, 6, 7, 13, 15 to 21, 27, 77. § 5 DDG. § 25 TDDDG. § 36 VSBG. UWG § 5. CJEU C-298/07. LG München I, 3 O 17493/20.
- Privacy Act 1988 (Cth) s 6D. Competition and Consumer Act 2010 (Cth) Sch 2, ss 18 and 29. Spam Act 2003 (Cth).
