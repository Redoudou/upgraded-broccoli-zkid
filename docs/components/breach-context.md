# The August 2026 license-scan breach context
_Researched 2026-09-01. Every claim carries a source link. Unverified statements are marked [unverified]._

Session note: fetches ran on the evening of 2026-09-01 and past midnight into 2026-09-02 local time; the Wayback snapshot cited below is stamped 2026-09-02 01:36 UTC. This component is not software. It is the event that SPEC.md section 0 uses as the reason Green Light exists, so this page verifies the spec's paragraph line by line against the primary source.

## What it is (3-6 sentences)
On Monday 2026-08-31 a source alerted KrebsOnSecurity to a new user on the Russian cybercrime forum Exploit advertising an identity-theft service called Nexus, which claimed scans of identity documents for more than 170 million people in North America ([S1](#sources)). Brian Krebs's story, dated 2026-09-01, reports that Nexus claimed more than 153 million drivers licenses from the US and Canada, more than 10 million identification cards, more than three million travel documents and/or international IDs, and at least 579,000 medical cards; that about 1.1 million of the licenses are Canadian (473,673 from Ontario); that the seller said it had been exfiltrating new data for over a year; and that the license count grew by nearly 400,000 in 24 hours ([S1](#sources)). Each record is a set of image files with a date and timestamp appended to the filename; Krebs's own record held six images, front and back under visible, infrared and ultraviolet light ([S1](#sources)). By matching timestamps to the days that he and other volunteers had handed over a license (Hertz rental counters for Krebs, his mother, Larry Baldwin and two federal employees; for Zach Edwards a Las Vegas day on which he showed his license at a TSA checkpoint, the Planet 13 dispensary and the Aria hotel, of which Edwards said only the dispensary "for sure" scanned it into a device; Krebs himself showed a passport, not his license, at TSA), Krebs concluded the images were being siphoned from the New Orleans identity-verification vendor idscan.net, whose Trust Center lists Hertz, Target, FedEx, Motorola Solutions, Jack Henry and Caesars Entertainment as customers ([S1](#sources), [S6](#sources)). Krebs writes that on a conference call the FBI told him its New Orleans field office had that day (2026-09-01) opened an official investigation into an apparent breach involving idscan.net; the vendor's only on-record comment is one sentence from a marketing and operations leader saying she could not share more; and by 8:56 p.m. ET the Nexus site had gone offline with a "no longer available" notice ([S1](#sources)). As of this research there is no statement on idscan.net's site, Trust Center or press page, no FBI press release could be found, and no independent original reporting exists beyond re-posts of Krebs ([S5](#sources), [S6](#sources), [S7](#sources), [S17](#sources), [S18](#sources), [S20](#sources)).

## Where it lives (table: item | URL | licence | version/tag/commit seen today)
| Item | URL | Licence | Version/tag/commit seen today |
|---|---|---|---|
| Primary report: "FBI Probes Service Selling 153M+ Drivers Licenses" | https://krebsonsecurity.com/2026/09/fbi-probes-service-selling-153m-drivers-licenses/ | © Krebs on Security (site footer); facts used, text paraphrased [S4] | Dated 2026-09-01 (post stamp "Tuesday 1st of September 2026 06:40 PM"); carries an "Update, 8:56 p.m. ET" paragraph; footer says "This is a potentially fast-moving story" and updates will be timestamped; 9 reader comments at last read [S1] |
| Archived copy (stable reference for citations) | http://web.archive.org/web/20260902013634/https://krebsonsecurity.com/2026/09/fbi-probes-service-selling-153m-drivers-licenses/ | Internet Archive | Snapshot 20260902013634, status 200 [S2] |
| Krebs "Nexus" tag page (follow-up watch) | https://krebsonsecurity.com/tag/nexus/ | © Krebs on Security | Two posts; only the 2026-09-01 story concerns this breach; no follow-up as of today [S3] |
| Krebs front page | https://krebsonsecurity.com/ | © Krebs on Security | Newest post is the 2026-09-01 story; previous post 2026-08-27 [S4] |
| Vendor site (no notice) | https://idscan.net/ | Proprietary marketing site | Homepage sitemap lastmod 2026-07-31; no incident text [S5][S17] |
| Vendor Trust Center (no notice) | https://trust.idscan.net/ | SafeBase-hosted | Lists CCPA, GDPR, ISO/IEC 27001:2022, SOC 2 and SOC 2 Type 2, NIST IAL2, PIPEDA, NZ Privacy Act 2020; twelve customer logos incl. Caesars, Hertz, FedEx, Target, Jack Henry, Motorola Solutions, US Coast Guard; "Powered by SafeBase"; no incident notice (the word "incident" appears once, in the "Incident Response" controls heading) [S6] |
| Vendor press releases (no notice) | https://idscan.net/press-release/ | Proprietary | Latest item 2026-08-27 (ScrapWare / ParseLink); press sitemap (`press_releases-sitemap.xml`) lastmod 2026-08-27; post sitemap lastmod 2026-08-28 [S7][S8][S17] |
| Vendor HQ and scale claims | https://idscan.net/contact-us/ ; https://idscan.net/press-release/enhance-scrap-operation-efficiency-with-idscan-net/ | Proprietary | US HQ 2045 Lakeshore Drive, Suite 526, New Orleans, LA 70122; boilerplate: 21,000,000+ verifications monthly at 20,000+ locations [S8][S9] |
| Vendor retention default (KB) | https://support.idscan.net/veriscan-cloud-portal/data-collection-and-retention | Proprietary | Default for new customers is to retain all records in the vendor cloud; Basic plan cannot change it [S13] |
| Vendor IR/UV capture and image storage pages | https://idscan.net/id-authentication/ ; https://idscan.net/veriscan-age-verification-visitor-management-software/ ; https://idscan.net/id-scanners-for-dispensaries/ | Proprietary | UV, white and infrared checks; ID photos saved to visitor profiles; multi-device sync to a cloud portal; 3,000+ dispensaries [S11][S12][S15] |
| Vendor / Planet 13 release Krebs cites | https://idscan.net/press-release/planet-13-partners-with-idscan-net/ | Proprietary | Dated 2022-08-04; CEO Denis Petrov quoted; no "exclusive" wording found [S16] |
| Aggregator re-post (secondary) | https://blog.rankiteo.com/fedthecaeids1788312186-idscannet-caesars-entertainment-hertz-fedex-breach-august-2026/ | Rankiteo | Dated 2026-08-31 by the aggregator; reproduces Krebs, adds no facts [S18] |
| Louisiana breach-notification statute | https://legis.la.gov/Legis/Law.aspx?d=322030 | Public law | La. R.S. 51:3074; notice within 60 days of discovery; law-enforcement delay allowed [S19] |
| FBI New Orleans field office | https://www.fbi.gov/contact-us/field-offices/neworleans | US government | HTTP 403 to our fetcher; fbi.gov search found no release [S20] |

## How Green Light uses it (tie to SPEC.md sections and the milestone in docs/PLAN.md)
- SPEC section 0 "Context" is a one-paragraph retelling of [S1]. Line-by-line check against the primary source:
  - "On August 31, 2026 ... Nexus began selling": Krebs says the service launched "this week" and that the Exploit ad was reported to him on Monday 2026-08-31. Exact launch date [unverified]; "advertised by 2026-08-31" is what the source supports [S1].
  - "153 million ... 10 million ... 3 million ... 579,000": all four figures match, but they are the seller's claims as relayed by Krebs (more than 153M, more than 10M, more than 3M, at least 579k), not counts verified by anyone [S1]. Recommend "claimed" in the spec.
  - "traced by KrebsOnSecurity to a Louisiana-based vendor; secondary reporting names idscan.net": inaccurate. Krebs names idscan.net directly and reports the FBI naming it on the call. No secondary outlet with original reporting was found; the only other pages are re-posts [S1][S3][S18]. Recommend "named by Krebs, and by the FBI as relayed by Krebs".
  - "hotel desks, car-rental counters, dispensaries, casinos and retail checkouts": rental (Hertz) and dispensary (Planet 13) come from traced records; the hotel (Aria) is only one of three places Edwards showed his license that day, and he told Krebs the dispensary was the only one that "for sure" scanned it into a device, so hotels are [unverified] as a breach site; casinos (Caesars) and retail (Target) are inferred from the vendor's customer list, not from a traced record [S1][S6]. [unverified] for hotels, casinos and retail as breach sites.
  - "FBI's New Orleans office opened an inquiry the same day": per Krebs, opened 2026-09-01, the day of his story and the day after the ad was spotted. No FBI public statement exists; the source is Krebs's account of a call [S1][S20].
  - "high-resolution front and back images, some with infrared and UV captures": front/back, infrared and ultraviolet are confirmed for Krebs's own record; "high-resolution" does not appear in the article [unverified] (the phrase does appear in the Rankiteo aggregator's summary [S18], which is the likely origin of the spec wording); Krebs says "some" of the scans, including his, have six image files and "not all records include photos", so the share of records with IR/UV is not stated [S1].
  - "timestamps that match the day the victim rented a car or bought cannabis": confirmed (Hertz rentals for Larry Baldwin of Cybera and two federal employees; a Las Vegas day with dispensary, hotel and TSA for Zach Edwards) [S1].
  - "Krebs found his own license in it; so did a sitting cabinet secretary": Krebs found his own. He also found the license of U.S. Defense Secretary Pete Hegseth, one of several high-ranking officials, and an FBI assistant director's; Hegseth did not "find" it [S1]. Recommend "Krebs found his own license, and the Defense Secretary's".
  - "One vendor, one database": the breach mechanism and storage architecture are not described by Krebs [unverified]; the vendor's own KB says the default is to retain all records in its cloud, which is the closest supporting fact [S13].
- SPEC sections 4, 8 and 9 and the metric "PII in venue database after audit: 0" are the engineering answer to the breach; TEST-PLAN group F (F1 to F5) and DOD M2 ("exactly two columns: timestamp and proof_hash") are where that answer is tested.
- PLAN M0 (week 0 = the week of the breach): the partner asks in PARTNERS.md gain urgency from this story; the corrections above should land in SPEC section 0 before any ask goes out with the spec attached.
- PLAN M6 (handout and video) and M9 (public report): every number quoted to venues must carry "claimed by the seller, reported by Krebs" and a re-verification date, because the story is marked fast-moving and the site has already vanished [S1].
- PLAN M7 (legal memo) and ADR-0004 (age-gated retail first): the vendor's own pages show why venues store scans: affirmative-defense framing and state record-keeping rules for some transactions, with retention windows that vary by state [S14]. The memo should say whether a ZK proof plus a hash-only record satisfies those rules in the pilot state.

## How to build or integrate (concrete commands or API calls, copied from the source with the source linked)
Nothing to compile. The integration is citation hygiene and a watch for changes.

```bash
# Cite the archived copy, not the live page (story is flagged as fast-moving) [S1][S2]
curl -sL "http://web.archive.org/web/20260902013634/https://krebsonsecurity.com/2026/09/fbi-probes-service-selling-153m-drivers-licenses/" -o krebs-nexus-20260902.html

# Check whether a newer snapshot exists (Wayback availability API, as fetched today) [S2]
curl -s "https://archive.org/wayback/available?url=krebsonsecurity.com/2026/09/fbi-probes-service-selling-153m-drivers-licenses/"

# Watch for Krebs follow-ups on the tag page [S3]
curl -sL https://krebsonsecurity.com/tag/nexus/ | grep -o '<h2[^>]*>.*</h2>' | head

# Watch the vendor for a statement: sitemaps carry lastmod; nothing after 2026-08-28 today [S17]
curl -s https://idscan.net/post-sitemap.xml | grep -o '<lastmod>[^<]*' | sort | tail -3
curl -s https://idscan.net/page-sitemap.xml | grep -o '<lastmod>[^<]*' | sort | tail -3
curl -sL https://trust.idscan.net/ | grep -i -c 'incident'   # baseline on 2026-09-02 is 1 ("Incident Response" controls heading), so watch for >1 [S6]
```

Wording to reuse in the M6 handout and the M9 report, with the qualifiers the source supports [S1]:
"On 31 August 2026 a dark-web service, Nexus, advertised scans it claimed covered more than 153 million US and Canadian drivers licenses. KrebsOnSecurity matched timestamps in the records to license scans at rental counters, a dispensary and a hotel, and reported that the FBI opened an investigation into an apparent breach at the New Orleans ID-verification vendor idscan.net. The seller's counts are unverified."

## Status and risks (maturity, reviews, maintenance, anything that threatens the plan)
- Single-source event. Every figure, the attribution and the FBI inquiry rest on one article by one reporter [S1]. No vendor confirmation, no FBI release, no second outlet with original reporting was found. Several large outlets block our fetcher (AP, Reuters, Wired, Ars Technica, The Verge, NYT, WSJ, NOLA.com, Politico), so absence there is not evidence of absence.
- Attribution is "apparent". Krebs's chain is timestamp matching plus the vendor's public customer list; the FBI wording relayed is "apparent breach involving idscan.net" [S1]. A customer-notification email reproduced in a reader comment on the article says the vendor received information on 2026-09-01 that it "may be implicated" and had begun incident response, engaged counsel and a forensic firm, and was coordinating with law enforcement [unverified: reader comment, not on the vendor's site; contact given there is privacy@idscan.net] [S1].
- Counts are the seller's and were rising (about 400,000 added in 24 hours) [S1]. Records may include repeat scans of the same person, so "153M licenses" should not be read as 153M people [unverified either way].
- The evidence is disappearing. Nexus went offline within hours of publication [S1]. If the story is later corrected, SPEC section 0 must follow; re-verify before M6 and M9.
- Vendor disclosure will be slow. Louisiana's statute allows up to 60 days from discovery and permits delay at law enforcement's request [S19]. Do not gate any milestone on a vendor statement.
- The "business model" argument needs precision. The vendor's default is retain-everything ("Collect all" plus "Do not delete") in its cloud and the Basic plan cannot change either setting, but Premium, Enterprise and ID Authentication plans can choose "Do not collect data" or "Collect anonymized data only", and can "Delete all" after 8 hours, 1 day, 7, 30, 60 or 90 days, or 1 year; the "Retain" option (purge PII automatically, keep anonymised or custom fields) is Enterprise and ID Authentication only [S13]. The KB page does not mention any tokenised or zero-retention mode; that phrase was an error in the first draft of this page and has been removed. The honest claim is that retention is the default and the cheapest tier, not that it is the only option.
- Minor source inconsistencies: Krebs cites a 2022 "exclusive ... nationally" Planet 13 agreement; the vendor's 2022-08-04 release contains no such wording [S1][S16]. Krebs's "more than 1,000 marijuana dispensaries in 19 U.S. states" reads as a merge of two vendor claims (dispensary count, now "more than 3,000", and "medical marijuana cards from 19 states"); the vendor's own MMJ-compatibility list on the same page names only 18 states [S1][S15]. The VeriScan page says 19,000,000 IDs monthly while boilerplate says 21,000,000 [S8][S12]. None of these affect the plan.

## Open questions for the partner call (bullets; these feed docs/PARTNERS.md)
- Venue chain (PARTNERS row 8): which ID-scan vendor and plan do your sites use today, and is the retention setting the default "retain all" [S13]? Were you notified on 2026-09-01 or 2026-09-02? Do you have a contractual right to demand deletion of stored images?
- Law firm (M7 memo): does the pilot state's age-verification rule require keeping a scan or record, or only performing a check? Does a ZK proof plus a hash-only log meet the "affirmative defense" standard the vendor markets [S14]? Which states restrict retention of scanned images (the vendor says some do without naming them) [S14]?
- State DMV: has the DMV issued guidance to relying parties since 2026-09-01? Does a stolen image set (visible, IR, UV) raise the risk of fraudulent re-issuance, and does that change the DMV's view of a status list for individual licenses (SPEC section 8, revocation hole)?
- AAMVA DTS: does the breach change the case for relying-party access to VICAL for a hash-only verifier?
- PSE zkID and Google longfellow: any independent knowledge of follow-up reporting? Agreement to cite the event in the co-published report only with the qualifiers above?
- Convener: who owns the weekly re-check of [S1], [S3], [S6] and [S7], and by what date is SPEC section 0 corrected (suggest before the first ask is sent, PARTNERS reply-by 2026-09-08)?
- Everyone: does anyone have a primary source beyond Krebs (FBI, vendor, a second outlet with its own reporting)? Today there is none.

## Sources (numbered list of every URL you fetched, with the date)
1. https://krebsonsecurity.com/2026/09/fbi-probes-service-selling-153m-drivers-licenses/ (fetched 2026-09-01/02, three reads incl. reader comments)
2. https://archive.org/wayback/available?url=krebsonsecurity.com/2026/09/fbi-probes-service-selling-153m-drivers-licenses/ (2026-09-02) -> snapshot http://web.archive.org/web/20260902013634/https://krebsonsecurity.com/2026/09/fbi-probes-service-selling-153m-drivers-licenses/
3. https://krebsonsecurity.com/tag/nexus/ (2026-09-01)
4. https://krebsonsecurity.com/ (2026-09-02)
5. https://idscan.net/ (2026-09-01)
6. https://trust.idscan.net/ (2026-09-02)
7. https://idscan.net/press-release/ (2026-09-02)
8. https://idscan.net/press-release/enhance-scrap-operation-efficiency-with-idscan-net/ (2026-09-02)
9. https://idscan.net/contact-us/ (2026-09-02)
10. https://idscan.net/about-us/ (2026-09-02)
11. https://idscan.net/id-authentication/ (2026-09-02)
12. https://idscan.net/veriscan-age-verification-visitor-management-software/ (2026-09-02)
13. https://support.idscan.net/veriscan-cloud-portal/data-collection-and-retention (2026-09-02)
14. https://idscan.net/us-id-scanning-laws/ (2026-09-02)
15. https://idscan.net/id-scanners-for-dispensaries/ (2026-09-02)
16. https://idscan.net/press-release/planet-13-partners-with-idscan-net/ (2026-09-02)
17. https://idscan.net/sitemap.xml ; https://idscan.net/page-sitemap.xml ; https://idscan.net/post-sitemap.xml (2026-09-02)
18. https://blog.rankiteo.com/fedthecaeids1788312186-idscannet-caesars-entertainment-hertz-fedex-breach-august-2026/ (2026-09-01)
19. https://legis.la.gov/Legis/Law.aspx?d=322030 (2026-09-02)
20. https://www.fbi.gov/contact-us/field-offices/neworleans and https://www.fbi.gov/contact-us/field-offices/neworleans/news (2026-09-01/02; both HTTP 403; https://www.fbi.gov/news/press-releases also HTTP 403 on 2026-09-02; fbi.gov site search returned nothing on this breach)
21. https://www.sec.gov/Archives/edgar/data/1813452/000165495422010685/plth_991.htm (2026-09-02; HTTP 403; Planet 13 2022 8-K, not read)
22. https://law.justia.com/codes/louisiana/revised-statutes/title-51/rs-51-3074/ (2026-09-02; HTTP 403; replaced by source 19)

Seen only in search results and not fetched (re-posts of source 1, no original reporting): infosectoday.io, thomasharris6.wordpress.com, malware.news, kortex-consulting.com, arnewsnoticias.com (Portuguese translation). Searches restricted to bleepingcomputer.com, therecord.media, techcrunch.com, securityweek.com, theregister.com, cyberscoop.com, databreaches.net, darkreading.com, scworld.com, bankinfosecurity.com, helpnetsecurity.com, securityaffairs.com, hackread.com, cbc.ca, globalnews.ca, ctvnews.ca, washingtonpost.com, bloomberg.com, cnn.com, nbcnews.com, cbsnews.com, abcnews.go.com, axios.com, thehill.com, 404media.co, wwltv.com, fox8live.com, theadvocate.com returned nothing on this breach as of 2026-09-02.

## Verification
_Re-verified 2026-09-02 by an independent pass: every URL in the Sources list was fetched again (WebFetch plus raw curl and grep of the Krebs article, the vendor KB page, the Trust Center and the vendor sitemaps), and web searches were re-run for a second primary source. 61 claims checked (article date, all seven counts, the Canadian and Ontario figures, the 24-hour growth, the six-image record, the forum and service names, the alert date, the four traced venues and the named volunteers, the vendor name, city, address, customer list and scale boilerplate, the FBI field office, date and "apparent breach" wording, the Kossman quote and title, the 8:56 p.m. update and "no longer available" text, the fast-moving footer, the Hegseth and FBI assistant-director mentions, the "exclusive ... nationally" and "1,000 dispensaries in 19 states" sentences, the reader-comment notification email, the Wayback snapshot id and status, the tag page and front page contents, the vendor homepage / press / Trust Center silence, the three sitemap lastmods, the retention KB defaults and plan matrix, the IR/UV and visitor-profile page text, the 19,000,000 vs 21,000,000 figures, the 3,000+ dispensaries and state list, the Planet 13 release date, quote and absence of "exclusive", the Rankiteo date, the Louisiana statute number, 60-day window and law-enforcement delay, the HTTP 403s on fbi.gov, sec.gov and justia, the fetcher-blocked outlet list, and the absence of coverage on the listed domains)._

Corrections made:
- "How Green Light uses it", venues bullet, and the "What it is" paragraph: the Aria hotel was listed as a traced record. Krebs reports that Edwards showed his license at TSA, the dispensary and the hotel that day but said only the dispensary "for sure" scanned it; hotels are now [unverified] as a breach site. Krebs himself showed a passport at TSA. Source: [S1].
- "Status and risks", business-model bullet: the page claimed the vendor KB offers "a tokenised zero-retention mode". The KB page contains no such text; removed. The plan matrix was also corrected: "Delete all" is available on Premium as well as Enterprise; "Retain" (purge PII, keep anonymised/custom) is Enterprise and ID Authentication only; Premium and above can also set "Do not collect data". Source: [S13].
- "Status and risks", minor-inconsistencies bullet: the vendor's dispensary page says "medical marijuana cards from 19 states" in one sentence but its MMJ-compatibility list names 18 states; noted. Source: [S15].
- "How Green Light uses it", high-resolution bullet: added that the phrase "high-resolution" appears in the Rankiteo aggregator [S18], not in Krebs, so the spec wording probably came from a re-post.
- "Where it lives" table: named the actual press sitemap file (`press_releases-sitemap.xml`; the guessed `press-release-sitemap.xml` returns 404), added Motorola Solutions, SOC 2, NZ Privacy Act and the "Powered by SafeBase" footer to the Trust Center row, and added the article's post stamp and comment count.
- Build section: the `grep -c 'incident'` watch on the Trust Center returns 1 today from the "Incident Response" controls heading, so the baseline is recorded to avoid a false alarm.
- Sources: added the fbi.gov press-release index (also 403) and two further re-posts seen in search.

Left unverified (unchanged from the first draft unless noted):
- Exact launch date of Nexus (Krebs: "this week"; ad seen 2026-08-31).
- All counts (153M, 10M, 3M, 579k, 170M, 1.1M Canadian, 473,673 Ontario, +400k/24h) are the seller's claims relayed by Krebs; no independent verification exists.
- The FBI investigation rests on Krebs's account of a conference call; fbi.gov returns 403 to our fetcher and site search finds no release.
- Any vendor statement: none on idscan.net, trust.idscan.net or the press page as of 2026-09-02; the customer-notification email exists only as a reader comment on [S1].
- "High-resolution" as a description of the images.
- Hotels, casinos and retail checkouts as breach sites.
- The breach mechanism and storage architecture ("one database").
- Whether the 153M licenses are distinct people or include repeat scans.
- Any second outlet with original reporting: none found; AP, Reuters, Wired, Ars Technica, The Verge, NYT, WSJ, NOLA.com and Politico block the fetcher, so their silence is unknown, not confirmed.
- Planet 13's 2022 8-K [S21] (sec.gov 403) was not read.
