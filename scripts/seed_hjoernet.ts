/**
 * Seed script: Det Litterære Hjørne
 *
 * Imports ~89 works + ~102 appearances from the bibliography document.
 *
 * Usage:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npx tsx scripts/seed_hjoernet.ts
 *
 * Requires service-role key (bypasses RLS).
 * Safe to re-run – uses upsert on slug for works and person name for persons.
 */

import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !key) {
  console.error('Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(url, key)

// ── Types ─────────────────────────────────────────────────────────────────

type WorkInput = {
  title: string
  slug: string
  type: string
  published_year: number | null
  author: string | null            // used to resolve persons; not stored on works
  bibliotek_dk_url: string | null
  link: string | null
  shelf_mark: string | null
  paywall: boolean
  notes: string | null
}

type AppearanceInput = {
  work_slug: string
  episode_date: string
  is_revisit: boolean
  extra_info: string | null
}

// ── Data ──────────────────────────────────────────────────────────────────

const WORKS: WorkInput[] = [
  { title: "Intethedens bristede illusioner", slug: "intethedens-bristede-illusioner", type: "bog", published_year: 2008, author: "Jimmy Højer", bib: "https://bibliotek.dk/materiale/intethedens-bristende-illusioner_jimmy-hoeyer/work-of:870970-basis:27225381", link: null, shelf: null, paywall: false, notes: "I dette afsnit siger Sture \"seksuelt, og nærværende\" som senere bruges i jinglen til Det Litterære Hjørne." },
  { title: "Lasse er Brøndby-fan", slug: "lasse-er-broendby-fan", type: "digt", published_year: 2021, author: "Mads Mygind", bib: "https://bibliotek.dk/materiale/i-min-hule-haand_mads-mygind/work-of:870970-basis:136067222", link: null, shelf: "86-01", paywall: false, notes: "Trykt første gang i magasinet MÅL i 2021 og senere udgivet i digtsamlingen I min hule hånd (2023)." },
  { title: "Jeg holder med AGF – ni indlæg om byens hold", slug: "jeg-holder-med-agf-ni-indlaeg-om-byens-hold", type: "bog", published_year: 2000, author: "Søren Højlund Carlsen (red.)", bib: "https://bibliotek.dk/materiale/jeg-holder-med-agf/work-of:870970-basis:22943057", link: null, shelf: "79.706", paywall: false, notes: null },
  { title: "I troede vi var døde og borte (nyt vers)", slug: "i-troede-vi-var-doede-og-borte-nyt-vers", type: "digt", published_year: null, author: "Mads Mygind, Jakob Schweppenhäuser og Kasper Brinck", bib: null, link: null, shelf: null, paywall: false, notes: "Forslag til nyt vers. I dette afsnit bringes jinglen til Det Litterære Hjørne for første gang." },
  { title: "En kok gik amok", slug: "en-kok-gik-amok", type: "bog", published_year: 2007, author: "Allan Borgvart", bib: "https://bibliotek.dk/materiale/en-kok-gik-amok_allan-borgvardt-f-1980-06-05-/work-of:870970-basis:53676960", link: null, shelf: "86-091", paywall: false, notes: null },
  { title: "Real GF", slug: "real-gf", type: "sang", published_year: 2024, author: "Den evige nedtur", bib: null, link: "https://open.spotify.com/track/4mpkkWtOkm1afMgobNh7J9", shelf: null, paywall: false, notes: null },
  { title: "AGF – min sidste rest af Århus", slug: "agf-min-sidste-rest-af-aarhus", type: "essay", published_year: 2024, author: "Troels Markussen", bib: null, link: "https://pov.international/agf-min-sidste-rest-af-arhus/", shelf: null, paywall: false, notes: null },
  { title: "Vi er våbenbrødre: min rejse igennem det ekstreme fodboldeuropa", slug: "vi-er-vaabenbroe-dre-min-rejse-igennem-det-ekstreme-fodboldeuropa", type: "bog", published_year: 2014, author: "Thomas Gravgaard", bib: "https://bibliotek.dk/materiale/vi-er-vaabenbroedre_thomas-gravgaard-f-1975-/work-of:870970-basis:51029909", link: null, shelf: "99.4 Gravgaard", paywall: false, notes: null },
  { title: "Lær at stave til byens hold: AGF", slug: "laer-at-stave-til-byens-hold-agf", type: "bog", published_year: 2025, author: "Thomas Westh", bib: "https://bibliotek.dk/materiale/laer-at-stave-til-byens-hold-agf_thomas-westh/work-of:870970-basis:61747028", link: null, shelf: "79.706", paywall: false, notes: null },
  { title: "Informatik B", slug: "informatik-b", type: "bog", published_year: 2022, author: "Lars Ljungqvist", bib: "https://bibliotek.dk/materiale/informatik-b_lars-ljungqvist/work-of:870970-basis:136214578", link: null, shelf: "19.61", paywall: false, notes: "Informatik B handler ikke om AGF, men bogen er fyldt med AGF-referencer; bl.a. \"det hviie ølskum\", \"gult er grimt\" og en rejse til Malaga." },
  { title: "Kærlighed & smerte: om passion og livet som AGF-fan", slug: "kaerlighed-smerte-om-passion-og-livet-som-agf-fan", type: "bog", published_year: 2022, author: "Jørgen Høg og Lars Bech", bib: "https://bibliotek.dk/materiale/kaerlighed-smerte_joergen-hoeg-f-1959-/work-of:870970-basis:134784768", link: null, shelf: null, paywall: false, notes: null },
  { title: "Henrik Madsen x ChatGPT – digt om Brøndby 1-0 nederlaget til AGF", slug: "henrik-madsen-x-chatgpt-digt-om-broendby-1-0-nederlaget-til-agf", type: "digt", published_year: 2024, author: "Henrik Madsen", bib: null, link: null, shelf: null, paywall: false, notes: "Henrik Madsens tekst og ChatGPTs analyse af \"Hvem handler dette digt om?\"" },
  { title: "Jeg stoppede med at spille fodbold en tirsdag aften efter træning", slug: "jeg-stoppede-med-at-spille-fodbold-en-tirsdag-aften-efter-traening", type: "digt", published_year: 2024, author: "Mads Mygind", bib: null, link: null, shelf: null, paywall: false, notes: "Digt trykt i tidsskriftet MÅL. Digtet læses op i sin helhed af forfatteren." },
  { title: "Jeg tror jeg vælger humle", slug: "jeg-tror-jeg-vaelger-humle", type: "sang", published_year: 2025, author: "Illdisposed BM Dept", bib: null, link: "https://open.spotify.com/track/7e7i6y0Ck9QFCVHzzpWuYO", shelf: null, paywall: false, notes: "Udgivet på albummet AGF Tributen 2004 (2025)." },
  { title: "Det er være Hviie er så fedt", slug: "det-er-vaere-hviie-er-saa-fedt", type: "sang", published_year: null, author: "Martin Wind", bib: null, link: "https://www.youtube.com/watch?v=CqBwdalamY0", shelf: null, paywall: false, notes: "Julesang." },
  { title: "Sård ulykke: Dumt at bygge det smukkeste fodboldstadion, men være ude af stand til at riste en pølse", slug: "saard-ulykke-dumt-at-bygge-det-smukkeste-fodboldstadion-men-vaere-ude-af-stand-til-at-riste-en-poelse", type: "essay", published_year: 2024, author: "Allan Priess Poulsen", bib: null, link: "https://stiften.dk/debat/saard-ulykke-dumt-at-bygge-det-smukkeste-fodboldstadion-men-vaere-ude-af-stand-til-at-riste-en-poelse", shelf: null, paywall: false, notes: "Læserbrev i Århus Stiftstidende d. 16. november 2024." },
  { title: "Pokalfinale (lav sol)", slug: "pokalfinale-lav-sol", type: "digt", published_year: 2022, author: "Jakob Schweppenhäuser", bib: "https://bibliotek.dk/materiale/jeres-fodboldbog_jakob-schweppenhauser-f-1983-/work-of:870970-basis:134137312", link: null, shelf: "86-06", paywall: false, notes: "Trykt i Jeres fodboldbog (2022)." },
  { title: "0 og 6. drøm", slug: "0-og-6-droem", type: "digt", published_year: 2022, author: "Jakob Schweppenhäuser", bib: "https://bibliotek.dk/materiale/jeres-fodboldbog_jakob-schweppenhauser-f-1983-/work-of:870970-basis:134137312", link: null, shelf: "86-06", paywall: false, notes: "Digte trykt i Jeres fodboldbog (2022)." },
  { title: "Jeres fodboldbog", slug: "jeres-fodboldbog", type: "bog", published_year: 2022, author: "Jakob Schweppenhäuser", bib: "https://bibliotek.dk/materiale/jeres-fodboldbog_jakob-schweppenhauser-f-1983-/work-of:870970-basis:134137312", link: null, shelf: "86-06", paywall: false, notes: null },
  { title: "Farvel til Ceres Park", slug: "farvel-til-ceres-park", type: "digt", published_year: 2024, author: "Henrik Friis Bach", bib: null, link: null, shelf: null, paywall: false, notes: "Ikke publiceret." },
  { title: "SMS fra Mathias Buck Jensen d. 3. januar 2025 kl. 08:26", slug: "sms-fra-mathias-buck-jensen-d-3-januar-2025-kl-08-26", type: "brev", published_year: 2025, author: "Mathias Buck Jensen", bib: null, link: null, shelf: null, paywall: false, notes: "SMS'en: \"Dagen begynder perfekt. Jeg hører musik i min egen verden. Rune Lykkeberg krydser mig på fortovet og råber meget højt og ud i morgenfrosten 'kom så de hviee'.\"" },
  { title: "Kampreferat af AGF – HB Køge 25. april 2010", slug: "kampreferat-af-agf-hb-koege-25-april-2010", type: "essay", published_year: 2010, author: "Miriam Kjær (TV2)", bib: null, link: "https://sport.tv2.dk/fodbold/2010-04-25-toefting-floppede-i-ren-agffarce", shelf: null, paywall: false, notes: "AGF tabte kampen 3–0 med Stig Tøfting i trænersædet." },
  { title: "4240 Vejlby", slug: "4240-vejlby", type: "bog", published_year: 2021, author: "Christian Henriksen", bib: "https://bibliotek.dk/materiale/8240-vejlby_christian-henriksen-f-1971-02-01-/work-of:870970-basis:61850937", link: null, shelf: "46.4 Vejlby", paywall: false, notes: "Christian Henriksen læser op fra afsnittet i bogen." },
  { title: "Om Fodbold", slug: "om-fodbold", type: "bog", published_year: 2021, author: "Asker Boye", bib: "https://bibliotek.dk/materiale/om-fodbold_asker-hedegaard-boye/work-of%3A870970-basis%3A61552987", link: null, shelf: "79.71", paywall: false, notes: null },
  { title: "Lydpostkort fra Michael Jøden, sendt fra Thailand (1)", slug: "lydpostkort-fra-michael-joeden-sendt-fra-thailand-1", type: "brev", published_year: 2025, author: "Michael Jøden", bib: null, link: null, shelf: null, paywall: false, notes: null },
  { title: "Lydpostkort fra Michael Jøden, sendt fra Thailand (2)", slug: "lydpostkort-fra-michael-joeden-sendt-fra-thailand-2", type: "brev", published_year: 2025, author: "Michael Jøden", bib: null, link: null, shelf: null, paywall: false, notes: null },
  { title: "Forestillingen om Patrick Mortensen – mænd i det enogtyvende århundrede", slug: "forestillingen-om-patrick-mortensen-maend-i-det-enogtyvende-aarhundrede", type: "bog", published_year: 2021, author: "Daniel Dalgaard", bib: "https://bibliotek.dk/materiale/forestillingen-om-patrick-mortensen_daniel-dalgaard-f-1987-/work-of:870970-basis:134076747", link: null, shelf: "13.2", paywall: false, notes: null },
  { title: "Aldrig færdig med fodbold", slug: "aldrig-faerdig-med-fodbold", type: "bog", published_year: 1961, author: "Aage Rou", bib: "https://bibliotek.dk/materiale/aldrig-faerdig-med-fodbold_aage-rou/work-of%3A870970-basis%3A04155785", link: null, shelf: "79.71", paywall: false, notes: null },
  { title: "Pressemeddelelse vedr. AGF 2015 Away Jersey", slug: "pressemeddelelse-vedr-agf-2015-away-jersey", type: "essay", published_year: 2015, author: "Hummel", bib: null, link: "https://jyllands-posten.dk/jpaarhus/ECE7872856/AGFerne-f%C3%A5r-ny-udebanetr%C3%B8je/", shelf: null, paywall: false, notes: "Fucking grim udebanetrøje." },
  { title: "Digt til kampprogrammet for AGF – Dila Gori 19. juli 2012", slug: "digt-til-kampprogrammet-for-agf-dila-gori-19-juli-2012", type: "digt", published_year: 2012, author: "Mads Mygind", bib: null, link: null, shelf: null, paywall: false, notes: null },
  { title: "Digt til kampprogrammet for AGF – FC Nordsjælland 3. august 2013", slug: "digt-til-kampprogrammet-for-agf-fc-nordsjaelland-3-august-2013", type: "digt", published_year: 2013, author: "Mads Mygind", bib: null, link: null, shelf: null, paywall: false, notes: null },
  { title: "Bastrup, Lunderen, Sander – og Vejlby printet permanent på huden", slug: "bastrup-lunderen-sander-og-vejlby-printet-permanent-paa-huden", type: "essay", published_year: 2025, author: "Christian Henriksen", bib: null, link: "https://jyllands-posten.dk/jpaarhus/debat/kommentarer/ECE18026906/bastrup-lunderen-sander-og-vejlby-printet-permanent-paa-huden/", shelf: null, paywall: false, notes: "Klumme i JP bragt d. 29. marts 2025." },
  { title: "AGF og alle de andre: fodboldkulturen i Århus set i et nationalt og internationalt perspektiv, 1950-2008", slug: "agf-og-alle-de-andre-fodboldkulturen-i-aarhus", type: "bog", published_year: 2008, author: "Ole Brandenborg Jensen", bib: "https://bibliotek.dk/materiale/agf-og-alle-de-andre_ole-brandenborg-jensen/work-of:870970-basis:44449838", link: null, shelf: "79.71", paywall: false, notes: null },
  { title: "Storklub på slingrekurs: bogen om AGF", slug: "storklub-paa-slingrekurs-bogen-om-agf", type: "bog", published_year: 2011, author: "Rasmus Boserup og Hans Petersen", bib: "https://bibliotek.dk/materiale/storklub-paa-slingrekurs_rasmus-boserup-f-1977-/work-of%3A870970-basis%3A29022828", link: null, shelf: "79.706", paywall: false, notes: null },
  { title: "Bluesky-besked fra Karsten Brix", slug: "bluesky-besked-fra-karsten-brix", type: "brev", published_year: 2025, author: "Karsten Brix", bib: null, link: null, shelf: null, paywall: false, notes: null },
  { title: "Jan Louise Bartram – Blå Bog-tekst fra Skive Gymnasium 1981", slug: "jan-louise-bartram-blaa-bog-tekst-fra-skive-gymnasium-1981", type: "andet", published_year: 1981, author: "Ukendt", bib: null, link: null, shelf: null, paywall: false, notes: "Jan Bartram var, ifølge den Blå Bog, også en meget flot fyr i gymnasiet." },
  { title: "Malaga", slug: "malaga", type: "sang", published_year: 1987, author: "Thomas Helmig", bib: null, link: null, shelf: null, paywall: false, notes: "Sangtekst fra 1987-albummet Vejen Væk." },
  { title: "Er Frederik Emmery skabt til at være 10'er?", slug: "er-frederik-emmery-skabt-til-at-vaere-10er", type: "essay", published_year: 2025, author: "Martin Hjort Frederiksen", bib: null, link: "https://tabellenlyver.substack.com/p/er-frederik-emmery-skabt-til-at-vre", shelf: null, paywall: false, notes: "Fra Tabellen lyver: Historier om AGF (substack)." },
  { title: "Begynderdansk 1: Tekst- og øvebog for udlændinge", slug: "begynderdansk-1-tekst-og-oevebog-for-udlaendinge", type: "bog", published_year: 1997, author: "Ulla Maria Apollo og Povl Terkelsen", bib: "https://bibliotek.dk/materiale/begynderdansk-1_ulla-maria-apollo/work-of%3A870970-basis%3A07044437", link: null, shelf: "89.699", paywall: false, notes: "Indeholder et afsnit om en fiktiv kamp mellem AGF og Milan." },
  { title: "Digt af Mads Mygind (uden titel)", slug: "digt-af-mads-mygind-uden-titel", type: "digt", published_year: 2025, author: "Mads Mygind", bib: null, link: null, shelf: null, paywall: false, notes: null },
  { title: "Jacob Poulsens afskedssalut som han udsender vinteren 2027", slug: "jacob-poulsens-afskedssalut-som-han-udsender-vinteren-2027", type: "digt", published_year: 2025, author: "Mads Mygind", bib: null, link: null, shelf: null, paywall: false, notes: "Profetisk tekst." },
  { title: "Det sidste bad på Fredensvang", slug: "det-sidste-bad-paa-fredensvang", type: "essay", published_year: 2016, author: "AGF Fanklubben", bib: null, link: null, shelf: null, paywall: false, notes: "Tekst trykt i Fæstningen om indsamling (i form af cykelløb) til det nye klubhus på Fredensvang." },
  { title: "Mail fra Kim fra fanklubben GAS om Carsten Hallum og en orm på en løbebane", slug: "mail-fra-kim-fra-fanklubben-gas", type: "brev", published_year: 2025, author: "Kim (GAS)", bib: null, link: null, shelf: null, paywall: false, notes: "Mail fra fanklubben Gammel Kongevej AGF Support." },
  { title: "HSV ehrt seinen dänischen Europapokal-Helden", slug: "hsv-ehrt-seinen-daenischen-europapokal-helden", type: "essay", published_year: 2025, author: "Jens Kragh Iversen", bib: null, link: "https://www.nordschleswiger.dk/sport/hsv-ehrt-seinen-daenischen-europapokal-helden/1320040", shelf: null, paywall: false, notes: "Artikel i Der Nordschleswiger om Lars Bastrup. Meget fornem oplæsning på tysk af Jøden i afsnittet." },
  { title: "Fredensvang: historien om AGF's klubhus og idrætsanlæg", slug: "fredensvang-historien-om-agfs-klubhus-og-idraetsanlaeg", type: "bog", published_year: 2018, author: "Hans Petersen, Ole Nielsen og Axel Schütt", bib: "https://bibliotek.dk/materiale/fredensvang/work-of:870970-basis:54862660", link: null, shelf: "79.71", paywall: false, notes: null },
  { title: "Eventyr om AGF's 5–1 sejr over OB 18. august 2025", slug: "eventyr-om-agfs-5-1-sejr-over-ob-18-august-2025", type: "andet", published_year: 2025, author: "ChatGPT (promptet af Sture Sandø)", bib: null, link: null, shelf: null, paywall: false, notes: "Promptet af Sture Sandø og forfattet af ChatGPT, oplæst af Jøden." },
  { title: "Kom så de hviie!", slug: "kom-saa-de-hviie", type: "bog", published_year: 2017, author: "Simon Randel Søndergaard", bib: "https://bibliotek.dk/materiale/kom-saa-de-hviie-_simon-randel-soendergaard/work-of%3A870970-basis%3A53664709", link: null, shelf: "79.706", paywall: false, notes: "GF-bibliotekarens første anbefaling til Det Litterære Hjørne." },
  { title: "Dødscirklen", slug: "doedscirklen", type: "bog", published_year: 2022, author: "Tania Clausager", bib: "https://bibliotek.dk/materiale/doedscirklen_tania-clausager/work-of:870970-basis:31797438", link: null, shelf: null, paywall: false, notes: null },
  { title: "AGF: Kom så de hviie (essay)", slug: "agf-kom-saa-de-hviie-essay", type: "essay", published_year: 2016, author: "Nick Horup", bib: "https://bibliotek.dk/materiale/aarhus/work-of%3A870970-basis%3A52746833", link: null, shelf: "46.4 Aarhus", paywall: false, notes: "Essay trykt i Aarhus, del af Vide verden serien (2016)." },
  { title: "AGF svigtede sine tilhængere", slug: "agf-svigtede-sine-tilhaengere", type: "essay", published_year: 2002, author: "Jens Kruse", bib: "https://bibliotek.dk/materiale/naermere-ting-til-jer_jens-kruuse/work-of%3A870970-basis%3A24054497", link: null, shelf: "04.6", paywall: false, notes: "Kampreferat trykt i bogen Nærmere, ting, til jer: Journalisten Jens Kruse (2002). AGF – Skovshoved." },
  { title: "Den som skal spise suppe med Satan, skal spise med en lang ske", slug: "den-som-skal-spise-suppe-med-satan-skal-spise-med-en-lang-ske", type: "essay", published_year: 1997, author: "Christian A. Baunvig", bib: null, link: null, shelf: null, paywall: false, notes: "Tekst i Borgen (AGF fanzine) nr. 3, 1997." },
  { title: "Som en GF Sister", slug: "som-en-gf-sister", type: "digt", published_year: 2025, author: "Anders Madsen", bib: null, link: null, shelf: null, paywall: false, notes: null },
  { title: "At spille mod stjernerne – interview med John Stampe", slug: "at-spille-mod-stjernerne-interview-med-john-stampe", type: "andet", published_year: 1981, author: "Ukendt", bib: null, link: null, shelf: null, paywall: false, notes: "Interview i kampprogrammet til AGF – HSV 7. oktober 1981." },
  { title: "Idrætten i Århus 1920–95: Aarhus Idrætspark 75 år", slug: "idraetten-i-aarhus-1920-95-aarhus-idraetspark-75-aar", type: "bog", published_year: 1995, author: "Ib Gejl (red.)", bib: "https://bibliotek.dk/materiale/idraetten-i-aarhus-1920-95/work-of%3A870970-basis%3A20925523", link: null, shelf: "79.609", paywall: false, notes: null },
  { title: "Hårde Hviievare", slug: "haarde-hviievare", type: "essay", published_year: 2025, author: "Martin Hjort Frederiksen", bib: null, link: null, shelf: null, paywall: false, notes: "Ikke udgivet." },
  { title: "Prisliste 1984 (AGF-merchandise)", slug: "prisliste-1984-agf-merchandise", type: "andet", published_year: 1984, author: "AGF", bib: null, link: null, shelf: null, paywall: false, notes: "Publikation med AGF-merchandise." },
  { title: "AGF vinder fodboldkamp", slug: "agf-vinder-fodboldkamp", type: "essay", published_year: 2016, author: "Rokokoposten", bib: null, link: "https://rokokoposten.dk/2016/09/17/agf-vinder-fodboldkamp/", shelf: null, paywall: false, notes: null },
  { title: "Næste år: sandheder og løgne om AGF", slug: "naeste-aar-sandheder-og-loegne-om-agf", type: "bog", published_year: 2025, author: "Martin Hjort Frederiksen og Asker Hedegaard Boye (red.)", bib: "https://bibliotek.dk/materiale/naeste-aar/work-of%3A870970-basis%3A142118203", link: null, shelf: "79.706", paywall: false, notes: null },
  { title: "Legenderne: de 50 største i AGF's historie. Bind 2", slug: "legenderne-de-50-stoerste-i-agfs-historie-bind-2", type: "bog", published_year: 2024, author: "Hans Petersen, Peter Vestergaard og Steffen Olesen", bib: "https://bibliotek.dk/materiale/legenderne-bind-2_hans-petersen-f-1947-/work-of%3A870970-basis%3A138058786", link: null, shelf: "79.706", paywall: false, notes: null },
  { title: "Det artistiske instinkt: hullede erindringer om Pelé og andre", slug: "det-artistiske-instinkt-hullede-erindringer-om-pele-og-andre", type: "essay", published_year: 2003, author: "Peter Poulsen", bib: "https://bibliotek.dk/materiale/fodbold-/work-of%3A870970-basis%3A24631788", link: null, shelf: "79.71", paywall: false, notes: "Tekst trykt i antologien Fodbold! forfattere om fænomenet fodbold (2003)." },
  { title: "Besked fra Terry aka Troels", slug: "besked-fra-terry-aka-troels", type: "brev", published_year: 2025, author: "Terry (Troels)", bib: null, link: null, shelf: null, paywall: false, notes: null },
  { title: "Juleeventyr om AGF", slug: "juleeventyr-om-agf", type: "andet", published_year: 2025, author: "Morten Koch", bib: null, link: null, shelf: null, paywall: false, notes: "Publiceret på Facebook." },
  { title: "Alt er permanent indtil det hører op", slug: "alt-er-permanent-indtil-det-hoerer-op", type: "digt", published_year: 2026, author: "Mads Mygind", bib: null, link: null, shelf: null, paywall: false, notes: null },
  { title: "Sved i benene", slug: "sved-i-benene", type: "digt", published_year: 2026, author: "Albert Mygind", bib: null, link: null, shelf: null, paywall: false, notes: "Digt af Albert Mygind (5 år gammel og søn af Mads Mygind). Samme afsnit: ny AGF slagsang \"I Århus stiger håbet op\" (mel. I Østen stiger solen op) af Mads Mygind." },
  { title: "Vi sad i skoven foran Århus Stadion", slug: "vi-sad-i-skoven-foran-aarhus-stadion", type: "digt", published_year: 2025, author: "Mads Mygind", bib: "https://bibliotek.dk/materiale/naeste-aar/work-of%3A870970-basis%3A142118203", link: null, shelf: "79.706", paywall: false, notes: "Trykt i antologien Næste år: sandheder og løgne om AGF (2025)." },
  { title: "En hyldest til Anders Kure", slug: "en-hyldest-til-anders-kure", type: "digt", published_year: 2026, author: "Agnes Holst", bib: "https://bibliotek.dk/materiale/mens-aarhus-venter-paa-miraklet_agnes-holst-f-1986-/work-of:870970-basis:143298043", link: null, shelf: "79.706", paywall: false, notes: "Trykt i bogen Mens Aarhus venter på miraklet (2026)." },
  { title: "From klarer", slug: "from-klarer", type: "bog", published_year: 1961, author: "Henry From", bib: "https://bibliotek.dk/materiale/from-klarer_henry-from/work-of%3A870970-basis%3A04155688", link: null, shelf: "79.706", paywall: false, notes: null },
  { title: "ATS fra fremtiden: Afdød og udstoppet Kasper Schmeichel skal stå på mål for Danmark ved fodbold-VM i Nordkorea", slug: "ats-fra-fremtiden-afdoed-og-udstoppet-kasper-schmeichel", type: "essay", published_year: 2026, author: "Politiken", bib: null, link: "https://politiken.dk/underholdning/bagsiden/atsbagsiden/art10749040/ATS-fra-fremtiden-Afd%C3%B8d-og-udstoppet-Kasper-Schmeichel-skal-st%C3%A5-p%C3%A5-m%C3%A5l-for-Danmark-ved-fodbold-VM-i-Nordkorea", shelf: null, paywall: false, notes: null },
  { title: "Vi bør gå all-in de næste tre måneder", slug: "vi-boer-gaa-all-in-de-naeste-tre-maaneder", type: "essay", published_year: 2026, author: "Frej Elbæk", bib: null, link: "https://stiften.dk/debat/smid-toejlerne-vi-skylder-os-selv-at-gaa-all-in-paa-agf-de-naeste-tre-maaneder", shelf: null, paywall: true, notes: "Debatindlæg i Århus Stiftstidende (bag betalingsmur)." },
  { title: "Kom så de hviie (sang af Kasper Kristensen)", slug: "kom-saa-de-hviie-sang-af-kasper-kristensen", type: "sang", published_year: 2026, author: "Kasper Kristensen", bib: null, link: null, shelf: null, paywall: false, notes: "Ny AGF-sang på melodien \"Hvor skal vi sove i nat\"." },
  { title: "Dramatisering af interview med Patrick Pentz på bold.dk", slug: "dramatisering-af-interview-med-patrick-pentz-paa-bolddk", type: "andet", published_year: 2026, author: "Mads Wehlast", bib: null, link: "https://bold.dk/fodbold/klubber/broendby-if/nyheder/pentz-star-fast-agf-er-ikke-ligaens-bedste-hold", shelf: null, paywall: false, notes: "Sture spiller Mads, Michael spiller Pentz." },
  { title: "Hvem er mest Back, Man?", slug: "hvem-er-mest-back-man", type: "essay", published_year: 2026, author: "Martin Hjort Frederiksen", bib: null, link: "https://tabellenlyver.substack.com/p/hvem-er-mest-back-man", shelf: null, paywall: false, notes: "Fra Tabellen Lyver." },
  { title: "Til Silkeborg af Søvejen", slug: "til-silkeborg-af-soevevejen", type: "digt", published_year: 2026, author: "Agnes Holst", bib: "https://bibliotek.dk/materiale/mens-aarhus-venter-paa-miraklet_agnes-holst-f-1986-/work-of:870970-basis:143298043", link: null, shelf: "79.706", paywall: false, notes: "Agnes Holst oplæser sin tekst." },
  { title: "Tekst om at være fan (indsendt af Nikolaj)", slug: "tekst-om-at-vaere-fan-indsendt-af-nikolaj", type: "andet", published_year: 2026, author: "Nikolaj", bib: null, link: null, shelf: null, paywall: false, notes: null },
  { title: "Haiku digt (om AGF)", slug: "haiku-digt-om-agf", type: "digt", published_year: 2026, author: "Jakob Tven", bib: null, link: null, shelf: null, paywall: false, notes: "Samme afsnit: forslag fra Erik Brandt om indsamling så Andreas Kraul kan skifte navn til Andreas Bavl." },
  { title: "Fra vangen til skoven", slug: "fra-vangen-til-skoven", type: "digt", published_year: 2026, author: "Sune fra Tossehjørnet", bib: null, link: null, shelf: null, paywall: false, notes: null },
  { title: "Mens Aarhus venter på miraklet", slug: "mens-aarhus-venter-paa-miraklet", type: "bog", published_year: 2026, author: "Agnes Holst", bib: "https://bibliotek.dk/materiale/mens-aarhus-venter-paa-miraklet_agnes-holst-f-1986-/work-of:870970-basis:143298043", link: null, shelf: "79.706", paywall: false, notes: null },
  { title: "Medløber", slug: "medloeber", type: "digt", published_year: 2026, author: "Thomas Brink Siim", bib: null, link: null, shelf: null, paywall: false, notes: null },
  { title: "Da Vejlby vækkede de Hviie", slug: "da-vejlby-vaekkede-de-hviie", type: "bog", published_year: 2026, author: "Christian Henriksen", bib: "https://bibliotek.dk/materiale/da-vejlby-vaekkede-de-hviie_christian-henriksen-f-1971-02-01-/work-of%3A870970-basis%3A143524426", link: null, shelf: "79.706", paywall: false, notes: null },
  { title: "Hvidt guld: fortællingen om det første AGF-mesterskab i 40 år", slug: "hvidt-guld-fortaellingen-om-det-foerste-agf-mesterskab-i-40-aar", type: "bog", published_year: 2026, author: "Kim Robin Graahede, Dennis Bjerre Christiansen og Mathias Maznikar-Hansen", bib: "https://bibliotek.dk/materiale/hvidt-guld_kim-robin-graahede-f-1975-/work-of%3A870970-basis%3A143389871", link: null, shelf: "79.706", paywall: false, notes: null },
  { title: "Til ungdommen 2", slug: "til-ungdommen-2", type: "digt", published_year: 2026, author: "Agnes Holst", bib: "https://bibliotek.dk/materiale/mens-aarhus-venter-paa-miraklet_agnes-holst-f-1986-/work-of:870970-basis:143298043", link: null, shelf: "79.706", paywall: false, notes: "Fra bogen Mens Aarhus venter på miraklet (2026). Oplæst af Ahmed Omar." },
  { title: "Man vælger ikke selv, hvem man elsker", slug: "man-vaelger-ikke-selv-hvem-man-elsker", type: "essay", published_year: 2026, author: "Daniel Dalgaard", bib: null, link: "https://atlasmag.dk/kultur/sport/man-v%C3%A6lger-ikke-selv-hvem-man-elsker", shelf: null, paywall: true, notes: "Essay i Atlas Magasin (bag betalingsmur)." },
  { title: "Kens brors digt om nederlaget til Sabah", slug: "kens-brors-digt-om-nederlaget-til-sabah", type: "digt", published_year: 2026, author: "Kens bror", bib: null, link: null, shelf: null, paywall: false, notes: "Samme afsnit: oversat græsk bloginlæg om AGF sejr over Lech Poznan med overskriften \"Mirakuløs fra Danmark\"." },
  { title: "Kristjánssons søn fik en søn", slug: "kristjanssons-soen-fik-en-soen", type: "essay", published_year: 2026, author: "Martin Hjort Frederiksen", bib: null, link: "https://tabellenlyver.substack.com/p/kristjanssons-sn-fik-en-sn", shelf: null, paywall: false, notes: "Fra Tabellen Lyver." },
  { title: "AGF-medaljer i hus: ny ejermand måtte hoste op med et stort beløb", slug: "agf-medaljer-i-hus-ny-ejermand-maatte-hoste-op-med-et-stort-beloeb", type: "essay", published_year: 2023, author: "Gunnar Lind / Stiftstidende", bib: null, link: "https://stiften.dk/agf/agf-medaljer-er-i-hus-ny-ejermand-maatte-hoste-op-med-et-stort-millionbeloeb", shelf: null, paywall: true, notes: "Om Gunnar Linds salg af sine medaljer. Trykt i Århus Stiftstidende maj 2023." },
  { title: "Genrejsningen", slug: "genrejsningen", type: "digt", published_year: 2026, author: "Den hviie poet", bib: null, link: null, shelf: null, paywall: false, notes: null },
  { title: "Hundens ejer", slug: "hundens-ejer", type: "essay", published_year: 1989, author: "Thomas Winding", bib: "https://bibliotek.dk/materiale/min-lille-hund-mester-og-andre-dyr/work-of:870970-basis:06827284", link: null, shelf: "86-096", paywall: false, notes: "Fra bogen Min lille hund Mester og andre dyr." },
  { title: "Ti vilde heste", slug: "ti-vilde-heste", type: "bog", published_year: 2026, author: "Stine Pilgaard", bib: "https://bibliotek.dk/materiale/ti-vilde-heste_stine-pilgaard/work-of%3A870970-basis%3A143445933", link: null, shelf: null, paywall: false, notes: "Politiken-anmeldelse." },
  { title: "Uden at være bange for at få bank", slug: "uden-at-vaere-bange-for-at-faa-bank", type: "essay", published_year: 2011, author: "Erik Rasmussen", bib: "https://bibliotek.dk/materiale/tilgiv-mig_erik-rasmussen-f-1960-/work-of%3A870970-basis%3A29510997", link: null, shelf: "79.71", paywall: false, notes: "Fra bogen Tilgiv mig: Historier fra livet uden for linjerne (2011). Oplæst af Victor Lander." },
].map(w => ({
  ...w,
  bibliotek_dk_url: (w as any).bib ?? null,
  shelf_mark: (w as any).shelf ?? null,
}))

// ── Appearances ───────────────────────────────────────────────────────────

const APPEARANCES: AppearanceInput[] = [
  { work_slug: "intethedens-bristede-illusioner",                            episode_date: "2024-05-13", is_revisit: false, extra_info: null },
  { work_slug: "intethedens-bristede-illusioner",                            episode_date: "2024-05-22", is_revisit: true,  extra_info: null },
  { work_slug: "lasse-er-broendby-fan",                                      episode_date: "2024-05-27", is_revisit: false, extra_info: null },
  { work_slug: "jeg-holder-med-agf-ni-indlaeg-om-byens-hold",               episode_date: "2024-08-04", is_revisit: false, extra_info: "Særligt fokus på afsnittet \"AGF – lidt af ens identitet\" af Kjeld Holm." },
  { work_slug: "jeg-holder-med-agf-ni-indlaeg-om-byens-hold",               episode_date: "2024-08-12", is_revisit: true,  extra_info: "Særligt fokus på afsnittet \"Stjerner og vandbærer\" af Jan Bartram." },
  { work_slug: "i-troede-vi-var-doede-og-borte-nyt-vers",                   episode_date: "2024-08-20", is_revisit: false, extra_info: null },
  { work_slug: "en-kok-gik-amok",                                            episode_date: "2024-08-25", is_revisit: false, extra_info: null },
  { work_slug: "en-kok-gik-amok",                                            episode_date: "2024-09-02", is_revisit: true,  extra_info: "Genbesøg og oplæsning fra bogen." },
  { work_slug: "real-gf",                                                     episode_date: "2024-09-09", is_revisit: false, extra_info: null },
  { work_slug: "agf-min-sidste-rest-af-aarhus",                              episode_date: "2024-09-16", is_revisit: false, extra_info: null },
  { work_slug: "vi-er-vaabenbroe-dre-min-rejse-igennem-det-ekstreme-fodboldeuropa", episode_date: "2024-09-23", is_revisit: false, extra_info: null },
  { work_slug: "laer-at-stave-til-byens-hold-agf",                          episode_date: "2024-09-30", is_revisit: false, extra_info: null },
  { work_slug: "informatik-b",                                                episode_date: "2024-10-07", is_revisit: false, extra_info: null },
  { work_slug: "kaerlighed-smerte-om-passion-og-livet-som-agf-fan",         episode_date: "2024-10-14", is_revisit: false, extra_info: null },
  { work_slug: "henrik-madsen-x-chatgpt-digt-om-broendby-1-0-nederlaget-til-agf", episode_date: "2024-10-22", is_revisit: false, extra_info: null },
  { work_slug: "jeg-stoppede-med-at-spille-fodbold-en-tirsdag-aften-efter-traening", episode_date: "2024-10-28", is_revisit: false, extra_info: null },
  { work_slug: "jeg-tror-jeg-vaelger-humle",                                 episode_date: "2024-11-04", is_revisit: false, extra_info: null },
  { work_slug: "det-er-vaere-hviie-er-saa-fedt",                             episode_date: "2024-11-12", is_revisit: false, extra_info: null },
  { work_slug: "saard-ulykke-dumt-at-bygge-det-smukkeste-fodboldstadion-men-vaere-ude-af-stand-til-at-riste-en-poelse", episode_date: "2024-11-18", is_revisit: false, extra_info: null },
  { work_slug: "pokalfinale-lav-sol",                                         episode_date: "2024-11-24", is_revisit: false, extra_info: null },
  { work_slug: "0-og-6-droem",                                                episode_date: "2024-12-02", is_revisit: false, extra_info: null },
  { work_slug: "jeg-holder-med-agf-ni-indlaeg-om-byens-hold",               episode_date: "2024-12-09", is_revisit: true,  extra_info: "Mogens Krogh er i studiet. Fokus på 'AGF – lidt af ens identitet' og 'Fodbold i Kænonzokium'." },
  { work_slug: "jeres-fodboldbog",                                            episode_date: "2024-12-09", is_revisit: true,  extra_info: "Mogens Krogh er i studiet." },
  { work_slug: "farvel-til-ceres-park",                                       episode_date: "2024-12-16", is_revisit: false, extra_info: null },
  { work_slug: "sms-fra-mathias-buck-jensen-d-3-januar-2025-kl-08-26",      episode_date: "2025-01-14", is_revisit: false, extra_info: null },
  { work_slug: "kampreferat-af-agf-hb-koege-25-april-2010",                  episode_date: "2025-01-20", is_revisit: false, extra_info: null },
  { work_slug: "4240-vejlby",                                                  episode_date: "2025-02-03", is_revisit: false, extra_info: null },
  { work_slug: "om-fodbold",                                                   episode_date: "2025-02-11", is_revisit: false, extra_info: null },
  { work_slug: "lydpostkort-fra-michael-joeden-sendt-fra-thailand-1",        episode_date: "2025-02-18", is_revisit: false, extra_info: null },
  { work_slug: "lydpostkort-fra-michael-joeden-sendt-fra-thailand-2",        episode_date: "2025-02-25", is_revisit: false, extra_info: null },
  { work_slug: "forestillingen-om-patrick-mortensen-maend-i-det-enogtyvende-aarhundrede", episode_date: "2025-02-25", is_revisit: false, extra_info: null },
  { work_slug: "aldrig-faerdig-med-fodbold",                                  episode_date: "2025-03-03", is_revisit: false, extra_info: null },
  { work_slug: "pressemeddelelse-vedr-agf-2015-away-jersey",                  episode_date: "2025-03-10", is_revisit: false, extra_info: null },
  { work_slug: "digt-til-kampprogrammet-for-agf-dila-gori-19-juli-2012",    episode_date: "2025-03-17", is_revisit: false, extra_info: null },
  { work_slug: "digt-til-kampprogrammet-for-agf-fc-nordsjaelland-3-august-2013", episode_date: "2025-03-25", is_revisit: false, extra_info: null },
  { work_slug: "bastrup-lunderen-sander-og-vejlby-printet-permanent-paa-huden", episode_date: "2025-03-31", is_revisit: false, extra_info: null },
  { work_slug: "agf-og-alle-de-andre-fodboldkulturen-i-aarhus",              episode_date: "2025-04-09", is_revisit: false, extra_info: null },
  { work_slug: "agf-og-alle-de-andre-fodboldkulturen-i-aarhus",              episode_date: "2025-04-15", is_revisit: true,  extra_info: null },
  { work_slug: "storklub-paa-slingrekurs-bogen-om-agf",                      episode_date: "2025-04-18", is_revisit: false, extra_info: null },
  { work_slug: "storklub-paa-slingrekurs-bogen-om-agf",                      episode_date: "2025-04-22", is_revisit: true,  extra_info: null },
  { work_slug: "bluesky-besked-fra-karsten-brix",                             episode_date: "2025-04-28", is_revisit: false, extra_info: null },
  { work_slug: "jan-louise-bartram-blaa-bog-tekst-fra-skive-gymnasium-1981", episode_date: "2025-05-05", is_revisit: false, extra_info: null },
  { work_slug: "malaga",                                                       episode_date: "2025-05-13", is_revisit: false, extra_info: null },
  { work_slug: "er-frederik-emmery-skabt-til-at-vaere-10er",                 episode_date: "2025-05-19", is_revisit: false, extra_info: null },
  { work_slug: "begynderdansk-1-tekst-og-oevebog-for-udlaendinge",           episode_date: "2025-05-26", is_revisit: false, extra_info: null },
  { work_slug: "digt-af-mads-mygind-uden-titel",                             episode_date: "2025-06-03", is_revisit: false, extra_info: null },
  { work_slug: "jacob-poulsens-afskedssalut-som-han-udsender-vinteren-2027", episode_date: "2025-06-24", is_revisit: false, extra_info: null },
  { work_slug: "det-sidste-bad-paa-fredensvang",                             episode_date: "2025-07-21", is_revisit: false, extra_info: null },
  { work_slug: "mail-fra-kim-fra-fanklubben-gas",                            episode_date: "2025-07-29", is_revisit: false, extra_info: null },
  { work_slug: "hsv-ehrt-seinen-daenischen-europapokal-helden",              episode_date: "2025-08-04", is_revisit: false, extra_info: null },
  { work_slug: "fredensvang-historien-om-agfs-klubhus-og-idraetsanlaeg",     episode_date: "2025-08-11", is_revisit: false, extra_info: null },
  { work_slug: "eventyr-om-agfs-5-1-sejr-over-ob-18-august-2025",           episode_date: "2025-08-19", is_revisit: false, extra_info: null },
  { work_slug: "kom-saa-de-hviie",                                            episode_date: "2025-08-25", is_revisit: false, extra_info: null },
  { work_slug: "doedscirklen",                                                 episode_date: "2025-09-01", is_revisit: false, extra_info: null },
  { work_slug: "agf-kom-saa-de-hviie-essay",                                  episode_date: "2025-09-09", is_revisit: false, extra_info: null },
  { work_slug: "agf-svigtede-sine-tilhaengere",                               episode_date: "2025-09-15", is_revisit: false, extra_info: null },
  { work_slug: "den-som-skal-spise-suppe-med-satan-skal-spise-med-en-lang-ske", episode_date: "2025-09-22", is_revisit: false, extra_info: null },
  { work_slug: "som-en-gf-sister",                                             episode_date: "2025-09-29", is_revisit: false, extra_info: null },
  { work_slug: "at-spille-mod-stjernerne-interview-med-john-stampe",         episode_date: "2025-10-06", is_revisit: false, extra_info: null },
  { work_slug: "idraetten-i-aarhus-1920-95-aarhus-idraetspark-75-aar",       episode_date: "2025-10-14", is_revisit: false, extra_info: null },
  { work_slug: "haarde-hviievare",                                             episode_date: "2025-10-20", is_revisit: false, extra_info: null },
  { work_slug: "prisliste-1984-agf-merchandise",                              episode_date: "2025-10-27", is_revisit: false, extra_info: null },
  { work_slug: "agf-vinder-fodboldkamp",                                       episode_date: "2025-11-04", is_revisit: false, extra_info: null },
  { work_slug: "naeste-aar-sandheder-og-loegne-om-agf",                      episode_date: "2025-11-17", is_revisit: false, extra_info: null },
  { work_slug: "legenderne-de-50-stoerste-i-agfs-historie-bind-2",           episode_date: "2025-11-24", is_revisit: false, extra_info: null },
  { work_slug: "det-artistiske-instinkt-hullede-erindringer-om-pele-og-andre", episode_date: "2025-12-01", is_revisit: false, extra_info: null },
  { work_slug: "naeste-aar-sandheder-og-loegne-om-agf",                      episode_date: "2025-12-01", is_revisit: true,  extra_info: null },
  { work_slug: "besked-fra-terry-aka-troels",                                  episode_date: "2025-12-08", is_revisit: false, extra_info: null },
  { work_slug: "juleeventyr-om-agf",                                           episode_date: "2025-12-15", is_revisit: false, extra_info: null },
  { work_slug: "fredensvang-historien-om-agfs-klubhus-og-idraetsanlaeg",     episode_date: "2026-01-09", is_revisit: true,  extra_info: "Kapitel: Hvorfor hedder det Fredensvang?" },
  { work_slug: "alt-er-permanent-indtil-det-hoerer-op",                      episode_date: "2026-01-24", is_revisit: false, extra_info: null },
  { work_slug: "sved-i-benene",                                                episode_date: "2026-01-27", is_revisit: false, extra_info: null },
  { work_slug: "vi-sad-i-skoven-foran-aarhus-stadion",                       episode_date: "2026-01-30", is_revisit: false, extra_info: null },
  { work_slug: "en-hyldest-til-anders-kure",                                  episode_date: "2026-02-10", is_revisit: false, extra_info: null },
  { work_slug: "from-klarer",                                                  episode_date: "2026-02-19", is_revisit: false, extra_info: null },
  { work_slug: "from-klarer",                                                  episode_date: "2026-02-24", is_revisit: true,  extra_info: null },
  { work_slug: "from-klarer",                                                  episode_date: "2026-03-05", is_revisit: true,  extra_info: null },
  { work_slug: "ats-fra-fremtiden-afdoed-og-udstoppet-kasper-schmeichel",    episode_date: "2026-03-12", is_revisit: false, extra_info: null },
  { work_slug: "vi-boer-gaa-all-in-de-naeste-tre-maaneder",                  episode_date: "2026-03-19", is_revisit: false, extra_info: null },
  { work_slug: "kom-saa-de-hviie-sang-af-kasper-kristensen",                  episode_date: "2026-03-19", is_revisit: false, extra_info: null },
  { work_slug: "dramatisering-af-interview-med-patrick-pentz-paa-bolddk",    episode_date: "2026-03-26", is_revisit: false, extra_info: null },
  { work_slug: "hvem-er-mest-back-man",                                        episode_date: "2026-04-02", is_revisit: false, extra_info: null },
  { work_slug: "til-silkeborg-af-soevevejen",                                  episode_date: "2026-04-10", is_revisit: false, extra_info: null },
  { work_slug: "tekst-om-at-vaere-fan-indsendt-af-nikolaj",                  episode_date: "2026-04-16", is_revisit: false, extra_info: null },
  { work_slug: "haiku-digt-om-agf",                                            episode_date: "2026-04-24", is_revisit: false, extra_info: null },
  { work_slug: "fra-vangen-til-skoven",                                        episode_date: "2026-04-30", is_revisit: false, extra_info: null },
  { work_slug: "mens-aarhus-venter-paa-miraklet",                             episode_date: "2026-05-07", is_revisit: false, extra_info: null },
  { work_slug: "medloeber",                                                     episode_date: "2026-05-11", is_revisit: false, extra_info: null },
  { work_slug: "da-vejlby-vaekkede-de-hviie",                                 episode_date: "2026-05-21", is_revisit: false, extra_info: null },
  { work_slug: "hvidt-guld-fortaellingen-om-det-foerste-agf-mesterskab-i-40-aar", episode_date: "2026-06-02", is_revisit: false, extra_info: null },
  { work_slug: "til-ungdommen-2",                                              episode_date: "2026-06-11", is_revisit: false, extra_info: null },
  { work_slug: "da-vejlby-vaekkede-de-hviie",                                 episode_date: "2026-06-18", is_revisit: true,  extra_info: "Udsnit oplæst af U$O." },
  { work_slug: "legenderne-de-50-stoerste-i-agfs-historie-bind-2",           episode_date: "2026-06-25", is_revisit: true,  extra_info: "Særligt fokus på legenden Jørgen Olesen." },
  { work_slug: "man-vaelger-ikke-selv-hvem-man-elsker",                       episode_date: "2026-08-03", is_revisit: false, extra_info: null },
  { work_slug: "hvidt-guld-fortaellingen-om-det-foerste-agf-mesterskab-i-40-aar", episode_date: "2026-08-09", is_revisit: true,  extra_info: null },
  { work_slug: "kens-brors-digt-om-nederlaget-til-sabah",                    episode_date: "2026-08-15", is_revisit: false, extra_info: null },
  { work_slug: "kristjanssons-soen-fik-en-soen",                              episode_date: "2026-09-01", is_revisit: false, extra_info: null },
  { work_slug: "agf-medaljer-i-hus-ny-ejermand-maatte-hoste-op-med-et-stort-beloeb", episode_date: "2026-09-07", is_revisit: false, extra_info: null },
  { work_slug: "genrejsningen",                                                episode_date: "2026-09-16", is_revisit: false, extra_info: null },
  { work_slug: "hundens-ejer",                                                 episode_date: "2026-09-21", is_revisit: false, extra_info: null },
  { work_slug: "ti-vilde-heste",                                               episode_date: "2026-09-21", is_revisit: false, extra_info: null },
  { work_slug: "uden-at-vaere-bange-for-at-faa-bank",                        episode_date: "2026-10-06", is_revisit: false, extra_info: null },
]

// ── Helpers ───────────────────────────────────────────────────────────────

function splitAuthors(authorStr: string | null): { name: string; role: string }[] {
  if (!authorStr) return []
  return authorStr
    .split(/ og | og\s|,\s*/)
    .map(s => s.trim())
    .filter(Boolean)
    .map(s => {
      const isEditor = /\(red\.?\)/i.test(s)
      const name = s.replace(/\s*\(red\.?\)/i, '').trim()
      return { name, role: isEditor ? 'redaktør' : 'forfatter' }
    })
}

// ── Seed ──────────────────────────────────────────────────────────────────

async function main() {
  console.log('▶ Seeding Det Litterære Hjørne...\n')

  // 1. Upsert works (keyed on slug)
  const worksToInsert = WORKS.map(w => ({
    title: w.title,
    slug: w.slug,
    type: w.type,
    published_year: w.published_year,
    bibliotek_dk_url: w.bibliotek_dk_url,
    link: w.link,
    shelf_mark: w.shelf_mark,
    paywall: w.paywall,
    notes: w.notes,
  }))

  const { data: insertedWorks, error: worksErr } = await supabase
    .from('works')
    .upsert(worksToInsert, { onConflict: 'slug', ignoreDuplicates: false })
    .select('id, slug')

  if (worksErr) { console.error('Works error:', worksErr); process.exit(1) }
  console.log(`✓ Upserted ${insertedWorks?.length} works`)

  const slugToId = Object.fromEntries((insertedWorks ?? []).map(w => [w.slug, w.id]))

  // 2. Upsert persons + work_authors
  let personCount = 0, authorLinkCount = 0
  for (const w of WORKS) {
    const workId = slugToId[w.slug]
    if (!workId) continue
    const authors = splitAuthors(w.author)
    for (const { name, role } of authors) {
      // Find or create person (avoids needing a unique constraint on name)
      let personId: string | null = null

      const { data: existing } = await supabase
        .from('persons')
        .select('id')
        .eq('name', name)
        .maybeSingle()

      if (existing) {
        personId = existing.id
      } else {
        const { data: created, error: pErr } = await supabase
          .from('persons')
          .insert({ name })
          .select('id')
          .single()
        if (pErr) { console.warn(`  Person insert failed for "${name}":`, pErr.message); continue }
        personId = created.id
      }
      personCount++

      // Link work ↔ person (ignore if already exists)
      const { error: waErr } = await supabase
        .from('work_authors')
        .upsert({ work_id: workId, person_id: personId, role }, {
          onConflict: 'work_id,person_id',
          ignoreDuplicates: true,
        })
      if (waErr) console.warn(`  work_authors link failed for ${w.slug} ↔ ${name}:`, waErr.message)
      else authorLinkCount++
    }
  }
  console.log(`✓ Upserted persons (${personCount} ops) + ${authorLinkCount} author links`)

  // 3. Insert appearances (skip if work not found)
  let appCount = 0, appSkipped = 0
  for (const a of APPEARANCES) {
    const workId = slugToId[a.work_slug]
    if (!workId) {
      console.warn(`  ⚠ Unknown work slug: ${a.work_slug}`)
      appSkipped++
      continue
    }
    const { error: appErr } = await supabase
      .from('appearances')
      .insert({
        work_id: workId,
        episode_date: a.episode_date,
        is_revisit: a.is_revisit,
        extra_info: a.extra_info,
      })
    if (appErr) {
      console.warn(`  Appearance insert failed (${a.work_slug} @ ${a.episode_date}):`, appErr.message)
    } else {
      appCount++
    }
  }
  console.log(`✓ Inserted ${appCount} appearances (${appSkipped} skipped)`)

  console.log('\n✅ Seed complete.')
}

main().catch(e => { console.error(e); process.exit(1) })
