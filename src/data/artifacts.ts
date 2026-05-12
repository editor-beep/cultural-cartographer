export const AXES = [
  { key: "consensus", label: "Consensus", short: "CNS" },
  { key: "friction", label: "Friction", short: "FRC" },
  { key: "obsession", label: "Obsession", short: "OBS" },
  { key: "haunting", label: "Residual Haunting", short: "HNT" },
  { key: "symbolic", label: "Symbolic Density", short: "SYM" },
  { key: "cult", label: "Cult Formation", short: "CLT" },
  { key: "formal", label: "Formal Risk", short: "FRM" },
  { key: "voltage", label: "Emotional Voltage", short: "VLT" },
  { key: "accessibility", label: "Accessibility", short: "ACC" },
] as const;

export type AxisKey = (typeof AXES)[number]["key"];

export type Metrics = Record<AxisKey, number>;

export type AfterlifeEvent = {
  year: number;
  kind:
    | "release"
    | "rejection"
    | "rediscovery"
    | "criterion"
    | "academic"
    | "meme"
    | "reissue"
    | "wound";
  label: string;
  source?: string;
};

export type Faction = {
  name: string;
  share: number; // 0..1
  voice: string;
};

export type Artifact = {
  slug: string;
  title: string;
  year: number;
  director: string;
  runtime: number;
  catalogue: string; // ARTX-001 etc
  epigraph: string;
  reading: string; // long-form prose paragraph
  metrics: Metrics;
  notes: Partial<Record<AxisKey, string>>;
  afterlife: AfterlifeEvent[];
  factions: Faction[];
  symbols: string[];
  // Atlas placement (0..1 normalized in dark field)
  pos: { x: number; y: number };
};

const CURATED: Artifact[] = [
  {
    slug: "fire-walk-with-me",
    title: "Twin Peaks: Fire Walk with Me",
    year: 1992,
    director: "David Lynch",
    runtime: 134,
    catalogue: "ARTX-001",
    epigraph: "Through the darkness of futures past, the magician longs to see.",
    reading:
      "Booed at Cannes, abandoned by its own audience, then exhumed and canonized. The film's pressure has only intensified — what looked like indulgence in 1992 reads now as the most sustained depiction of trauma in American cinema. It does not sit still.",
    metrics: {
      consensus: 38,
      friction: 92,
      obsession: 96,
      haunting: 98,
      symbolic: 94,
      cult: 99,
      formal: 91,
      voltage: 97,
      accessibility: 14,
    },
    notes: {
      consensus: "Critic and audience opinion still violently disagree thirty years on.",
      haunting: "Discussion language is dominated by dream, return, possession.",
      cult: "Reclamation arc among the steepest tracked in the index.",
    },
    afterlife: [
      { year: 1992, kind: "release", label: "Premieres at Cannes; booed in the press screening." },
      { year: 1992, kind: "rejection", label: "Critical consensus: indulgent, incoherent." },
      { year: 2002, kind: "rediscovery", label: "First academic re-readings appear." },
      { year: 2014, kind: "criterion", label: "Criterion release, restored." },
      { year: 2017, kind: "reissue", label: "Re-evaluated alongside Twin Peaks: The Return." },
      { year: 2022, kind: "academic", label: "Standard text in trauma-cinema syllabi." },
    ],
    factions: [
      { name: "The Devoted", share: 0.51, voice: "“The only film about grief that does not lie.”" },
      { name: "The Repulsed", share: 0.27, voice: "“Cruelty mistaking itself for revelation.”" },
      { name: "The Formalists", share: 0.22, voice: "“Sound design as theology.”" },
    ],
    symbols: ["the ring", "the lodge", "electricity", "the angel", "creamed corn", "the photograph"],
    pos: { x: 0.18, y: 0.32 },
  },
  {
    slug: "mulholland-dr",
    title: "Mulholland Dr.",
    year: 2001,
    director: "David Lynch",
    runtime: 147,
    catalogue: "ARTX-002",
    epigraph: "It is a strange world.",
    reading:
      "A failed television pilot rebuilt into a stable cultural object that refuses to stabilize. Two decades on, the dominant interpretive framework has shifted three times. Mention volume has not declined.",
    metrics: {
      consensus: 78,
      friction: 64,
      obsession: 95,
      haunting: 93,
      symbolic: 96,
      cult: 92,
      formal: 89,
      voltage: 88,
      accessibility: 28,
    },
    notes: {
      symbolic: "Highest theory-post density in the post-2000 film set.",
    },
    afterlife: [
      { year: 2001, kind: "release", label: "Released after pilot rejection; immediate critical embrace." },
      { year: 2010, kind: "rediscovery", label: "Decade-end polls place it among the canonical works." },
      { year: 2016, kind: "academic", label: "Sight & Sound critics' poll: top ten of the century." },
      { year: 2022, kind: "meme", label: "Club Silencio sequence circulates as TikTok loop." },
    ],
    factions: [
      { name: "Dream-Logic Readers", share: 0.46, voice: "“It is a wish that knows it is a wish.”" },
      { name: "Hollywood-as-Hell", share: 0.34, voice: "“The industry eats its own.”" },
      { name: "Pure-Surface", share: 0.2, voice: "“Stop solving it.”" },
    ],
    symbols: ["the blue box", "club silencio", "the cowboy", "the diner", "winkie's"],
    pos: { x: 0.62, y: 0.22 },
  },
  {
    slug: "hereditary",
    title: "Hereditary",
    year: 2018,
    director: "Ari Aster",
    runtime: 127,
    catalogue: "ARTX-003",
    epigraph: "I am your mother.",
    reading:
      "A grief engine with unusually predatory afterlife behavior: the film does not just linger, it reactivates. A single cluck can reopen the whole structure days later, making Hereditary less a watched object than a recurring event in the viewer's nervous system.",
    metrics: {
      consensus: 88,
      friction: 28,
      obsession: 81,
      haunting: 98,
      symbolic: 85,
      cult: 54,
      formal: 72,
      voltage: 99,
      accessibility: 64,
    },
    notes: {
      voltage: "Impact language is physiological: nausea, panic, cold-sweat dread.",
      haunting: "The cluck functions like a recall trigger that reopens the film without warning.",
    },
    afterlife: [
      { year: 2018, kind: "release", label: "Sundance premiere; immediate critical uptake." },
      { year: 2018, kind: "wound", label: "Word-of-mouth circulates as a warning protocol." },
      { year: 2021, kind: "meme", label: "The cluck and pole sequence become persistent shorthand." },
      { year: 2025, kind: "academic", label: "Canonized in grief-horror discourse and teaching." },
    ],
    factions: [
      { name: "The Wounded", share: 0.5, voice: "“I cannot rewatch it, but it keeps replaying anyway.”" },
      { name: "The Ritualists", share: 0.28, voice: "“The architecture is occult precision, not shock tactics.”" },
      { name: "The Skeptics", share: 0.22, voice: "“The final movement overexplains what the family drama built.”" },
    ],
    symbols: ["the cluck", "the model house", "the pole", "the treehouse", "paimon"],
    pos: { x: 0.42, y: 0.78 },
  },
  {
    slug: "the-thing-1982",
    title: "The Thing",
    year: 1982,
    director: "John Carpenter",
    runtime: 109,
    catalogue: "ARTX-040",
    epigraph: "Watch Clark.",
    reading:
      "A high-consensus terror object that now reads as a near-perfect symbolic machine for institutional collapse and social paranoia. The blood-test sequence remains a benchmark for sustained voltage through practical form alone.",
    metrics: {
      consensus: 94,
      friction: 6,
      obsession: 92,
      haunting: 95,
      symbolic: 88,
      cult: 96,
      formal: 84,
      voltage: 93,
      accessibility: 82,
    },
    notes: {
      haunting: "Practical body horror still produces long-tail recall decades later.",
      consensus: "Initial rejection has inverted into near-total reclamation.",
    },
    afterlife: [
      { year: 1982, kind: "release", label: "Released to hostile critical response." },
      { year: 1982, kind: "rejection", label: "Dismissed as excessive in the E.T. summer shadow." },
      { year: 1998, kind: "rediscovery", label: "Home-video era reframes it as a masterpiece." },
      { year: 2017, kind: "academic", label: "Common case study for paranoia and social-contract collapse." },
    ],
    factions: [
      { name: "The Purists", share: 0.45, voice: "“The practical effects are still untouched.”" },
      { name: "The Paranoids", share: 0.35, voice: "“It is governance failure, not just creature horror.”" },
      { name: "The Holdouts", share: 0.2, voice: "“Brilliant craft, emotionally cold.”" },
    ],
    symbols: ["blood test", "the kennel", "norwegian camp", "flamethrower", "containment"],
    pos: { x: 0.15, y: 0.66 },
  },
  {
    slug: "barbie-2023",
    title: "Barbie",
    year: 2023,
    director: "Greta Gerwig",
    runtime: 114,
    catalogue: "ARTX-041",
    epigraph: "She's everything. He's just Ken.",
    reading:
      "A hyper-accessible monolith that preserved symbolic density at global scale. Friction is concentrated around ideological durability and intent rather than basic quality, making it one of the clearest mass-market culture-war objects of the decade.",
    metrics: {
      consensus: 84,
      friction: 76,
      obsession: 89,
      haunting: 21,
      symbolic: 91,
      cult: 22,
      formal: 48,
      voltage: 75,
      accessibility: 98,
    },
    notes: {
      symbolic: "Mojo Dojo Casa House operates as a portable critique system.",
      friction: "Debate centers on framework durability, not craftsmanship alone.",
    },
    afterlife: [
      { year: 2023, kind: "release", label: "Global event launch with immediate discourse saturation." },
      { year: 2023, kind: "meme", label: "Ken discourse and pink iconography become platform-native shorthand." },
      { year: 2024, kind: "academic", label: "Adopted in media-and-gender pedagogy as a case text." },
    ],
    factions: [
      { name: "The Embracers", share: 0.44, voice: "“A rare blockbuster that speaks in symbols without losing clarity.”" },
      { name: "The Skeptical Left", share: 0.31, voice: "“Critique is constrained by brand enclosure.”" },
      { name: "The Reactionaries", share: 0.25, voice: "“Its gender satire is itself the provocation.”" },
    ],
    symbols: ["mojo dojo casa house", "pink void", "barbieland", "kendom", "high heel / birkenstock"],
    pos: { x: 0.67, y: 0.44 },
  },
  {
    slug: "eraserhead-1977",
    title: "Eraserhead",
    year: 1977,
    director: "David Lynch",
    runtime: 89,
    catalogue: "ARTX-033",
    epigraph: "In Heaven, everything is fine.",
    reading:
      "A defining formal-risk object that declined every conventional cinematic shape available to its era. It remains a creator's blueprint for industrial dread, sustained by atmosphere, sonic abrasion, and nightmare logic rather than narrative comfort.",
    metrics: {
      consensus: 82,
      friction: 15,
      obsession: 91,
      haunting: 96,
      symbolic: 94,
      cult: 89,
      formal: 99,
      voltage: 87,
      accessibility: 14,
    },
    notes: {
      formal: "Near-maximum risk profile through anti-linear structure and texture-first design.",
      accessibility: "Requires high tolerance for non-narrative pressure and industrial noise.",
    },
    afterlife: [
      { year: 1977, kind: "release", label: "Midnight-circuit emergence and immediate cult fixation." },
      { year: 1985, kind: "rediscovery", label: "Filmmaker advocacy turns it into an apprenticeship text." },
      { year: 2010, kind: "academic", label: "Entrenched in sound-and-atmosphere formal studies." },
    ],
    factions: [
      { name: "The Apprentices", share: 0.52, voice: "“Every dread filmmaker studies this as a technical map.”" },
      { name: "The Dreamers", share: 0.3, voice: "“It is pure subconscious architecture.”" },
      { name: "The Refusers", share: 0.18, voice: "“A hostile object by design.”" },
    ],
    symbols: ["radiator stage", "industrial haze", "the baby", "the pencil", "electric hum"],
    pos: { x: 0.24, y: 0.18 },
  },
  {
    slug: "groundhog-day-1993",
    title: "Groundhog Day",
    year: 1993,
    director: "Harold Ramis",
    runtime: 101,
    catalogue: "ARTX-034",
    epigraph: "What would you do if you were stuck in one place?",
    reading:
      "A philosophical virus that migrated from high-accessibility comedy into durable existential shorthand. Its symbolic and obsession readings continue to climb because the title now names a lived human condition across cultures.",
    metrics: {
      consensus: 97,
      friction: 4,
      obsession: 96,
      haunting: 38,
      symbolic: 93,
      cult: 31,
      formal: 62,
      voltage: 68,
      accessibility: 99,
    },
    notes: {
      symbolic: "Title functions as global shorthand for recursive lived experience.",
      consensus: "One of the most stable consensus objects in the catalogue.",
    },
    afterlife: [
      { year: 1993, kind: "release", label: "Mainstream comedy success with immediate repeat-viewing behavior." },
      { year: 2006, kind: "academic", label: "Adopted into philosophy and theology classroom frameworks." },
      { year: 2020, kind: "meme", label: "Pandemic discourse revives the loop metaphor at global scale." },
    ],
    factions: [
      { name: "The Existentialists", share: 0.42, voice: "“A comedy shell containing a theory of becoming.”" },
      { name: "The Comfort Rewatchers", share: 0.4, voice: "“It resets the nervous system every time.”" },
      { name: "The Literalists", share: 0.18, voice: "“A near-perfect script machine, no metaphysics required.”" },
    ],
    symbols: ["the loop", "the alarm clock", "punxsutawney square", "piano lesson", "ice sculpture"],
    pos: { x: 0.81, y: 0.61 },
  },
  {
    slug: "synecdoche-new-york",
    title: "Synecdoche, New York",
    year: 2008,
    director: "Charlie Kaufman",
    runtime: 124,
    catalogue: "ARTX-004",
    epigraph: "The Infinite System.",
    reading:
      "The map is the same size as the territory it describes. Time and space collapse until the viewer is stranded inside the same existential machinery as its protagonist, producing profound symbolic overload and exhausting emotional grief.",
    metrics: {
      consensus: 72,
      friction: 38,
      obsession: 91,
      haunting: 94,
      symbolic: 99,
      cult: 95,
      formal: 96,
      voltage: 98,
      accessibility: 12,
    },
    notes: {
      symbolic: "Peak symbolic density: recursive representation expands until map and world become indistinguishable.",
      voltage: "Emotional intensity reads as sustained existential grief rather than catharsis.",
      formal: "Narrative architecture deliberately collapses chronology and spatial orientation.",
    },
    afterlife: [
      { year: 2008, kind: "release", label: "Initial response mixes admiration with confusion over its structural scale." },
      { year: 2013, kind: "rediscovery", label: "Essay culture reframes it as a foundational 21st-century grief text." },
      { year: 2020, kind: "wound", label: "Mortality-era viewership surge deepens its reputation as an existential endurance object." },
      { year: 2025, kind: "academic", label: "Now regularly taught in courses on temporality, representation, and cinematic systems." },
    ],
    factions: [
      { name: "System Readers", share: 0.41, voice: "“It is a universe-scale model of consciousness breaking under self-representation.”" },
      { name: "The Devastated", share: 0.37, voice: "“No film leaves me more emotionally emptied.”" },
      { name: "The Resistant", share: 0.22, voice: "“Its brilliance is undeniable, but the burden can feel total.”" },
    ],
    symbols: ["the warehouse city", "the recursive stage", "adenoid timeline", "the cleaning woman", "total simulation"],
    pos: { x: 0.79, y: 0.57 },
  },
  {
    slug: "in-the-mood-for-love",
    title: "In the Mood for Love",
    year: 2000,
    director: "Wong Kar-wai",
    runtime: 98,
    catalogue: "ARTX-005",
    epigraph: "It is a restless moment.",
    reading:
      "Stable consensus, low friction, but the obsession signal climbs every year. Held by its viewers in the way certain perfumes are held — recalled at a distance and revised by memory.",
    metrics: {
      consensus: 94,
      friction: 22,
      obsession: 87,
      haunting: 88,
      symbolic: 80,
      cult: 71,
      formal: 96,
      voltage: 76,
      accessibility: 68,
    },
    notes: {
      consensus: "One of the most tightly-agreed-upon films of the century.",
      formal: "Shot composition and color discipline studied as primary material.",
    },
    afterlife: [
      { year: 2000, kind: "release", label: "Cannes premiere." },
      { year: 2012, kind: "academic", label: "Sight & Sound: top 25." },
      { year: 2022, kind: "rediscovery", label: "Sight & Sound poll moves it into the top five." },
    ],
    factions: [
      { name: "The Romantics", share: 0.58, voice: "“The most exquisite film about restraint.”" },
      { name: "The Formalists", share: 0.32, voice: "“The frame is the love affair.”" },
      { name: "The Distant", share: 0.1, voice: "“Beautiful, but hermetic.”" },
    ],
    symbols: ["the qipao", "the staircase", "noodles", "smoke", "the wall in angkor"],
    pos: { x: 0.32, y: 0.58 },
  },
  {
    slug: "stalker",
    title: "Stalker",
    year: 1979,
    director: "Andrei Tarkovsky",
    runtime: 162,
    catalogue: "ARTX-006",
    epigraph: "Let everything that's been planned come true.",
    reading:
      "The ultimate endurance monolith, demanding a total shift in the viewer's biological rhythm. Its residual haunting is absolute — the damp, industrial atmosphere of the Zone installs itself and refuses removal. Held as a sacred text of formal risk where the journey into the Zone mirrors a psychological initiation: the writer, the scientist, the stalker all pass through it and emerge changed in ways none can name.",
    metrics: {
      consensus: 88,
      friction: 8,
      obsession: 94,
      haunting: 97,
      symbolic: 98,
      cult: 85,
      formal: 96,
      voltage: 62,
      accessibility: 15,
    },
    notes: { symbolic: "Highest interpretive-divergence index in the catalogue." },
    afterlife: [
      { year: 1979, kind: "release", label: "Released; restricted distribution." },
      { year: 1986, kind: "wound", label: "Tarkovsky's death intensifies reception." },
      { year: 2007, kind: "rediscovery", label: "Restoration; festival circuit." },
      { year: 2017, kind: "criterion", label: "Criterion release." },
      { year: 2023, kind: "meme", label: "The Zone enters general visual vocabulary." },
    ],
    factions: [
      { name: "The Pilgrims", share: 0.5, voice: "“A liturgy disguised as a film.”" },
      { name: "The Materialists", share: 0.3, voice: "“The Zone is a labor camp.”" },
      { name: "The Patient", share: 0.2, voice: "“It teaches you to wait.”" },
    ],
    symbols: ["the room", "the zone", "the dog", "the nut", "rain on tile"],
    pos: { x: 0.08, y: 0.7 },
  },
  {
    slug: "killers-of-the-flower-moon",
    title: "Killers of the Flower Moon",
    year: 2023,
    director: "Martin Scorsese",
    runtime: 206,
    catalogue: "ARTX-007",
    epigraph: "Can you find the wolves in this picture?",
    reading:
      "Late-period scale collides with a refusal of the genre's expected satisfactions. Discourse split between historical-witness reading and structural-critique reading; Osage commentary reframed both.",
    metrics: {
      consensus: 68,
      friction: 74,
      obsession: 64,
      haunting: 78,
      symbolic: 70,
      cult: 38,
      formal: 78,
      voltage: 80,
      accessibility: 52,
    },
    notes: {},
    afterlife: [
      { year: 2023, kind: "release", label: "Cannes premiere; theatrical-then-streaming release." },
      { year: 2023, kind: "rejection", label: "Awards season undervalues; framing debated." },
      { year: 2024, kind: "academic", label: "Adopted into adaptation-and-witness courses." },
    ],
    factions: [
      { name: "The Witnesses", share: 0.45, voice: "“Refusal of catharsis is the point.”" },
      { name: "The Critics", share: 0.4, voice: "“The white perspective is still the camera.”" },
      { name: "The Tired", share: 0.15, voice: "“Magisterial, indulgent, both.”" },
    ],
    symbols: ["the radio show", "the wolves", "the train", "the oil"],
    pos: { x: 0.88, y: 0.82 },
  },
  {
    slug: "the-master",
    title: "The Master",
    year: 2012,
    director: "Paul Thomas Anderson",
    runtime: 137,
    catalogue: "ARTX-008",
    epigraph: "Free winds and no tyranny for you, Freddie, sailor of the seas.",
    reading:
      "The film is more discussed than agreed about. Twelve years on, no stable interpretation has won; the absence is itself the artifact's signature.",
    metrics: {
      consensus: 62,
      friction: 78,
      obsession: 86,
      haunting: 84,
      symbolic: 90,
      cult: 80,
      formal: 92,
      voltage: 82,
      accessibility: 30,
    },
    notes: {
      friction: "Critic/audience gap is durable; neither side concedes ground.",
    },
    afterlife: [
      { year: 2012, kind: "release", label: "Venice premiere; respectful confusion." },
      { year: 2017, kind: "rediscovery", label: "First serious essay-film readings." },
      { year: 2022, kind: "academic", label: "Adopted into post-war American myth syllabi." },
    ],
    factions: [
      { name: "The Devotees", share: 0.4, voice: "“A film about the failure of every container.”" },
      { name: "The Confused", share: 0.35, voice: "“Beautiful, opaque, frustrating.”" },
      { name: "The Phoenix Camp", share: 0.25, voice: "“His face is the screenplay.”" },
    ],
    symbols: ["the sandwoman", "the processing", "the motorcycle", "the navy"],
    pos: { x: 0.5, y: 0.42 },
  },
  {
    slug: "annihilation",
    title: "Annihilation",
    year: 2018,
    director: "Alex Garland",
    runtime: 115,
    catalogue: "ARTX-009",
    epigraph: "It's not destroying. It's making something new.",
    reading:
      "A studio film dumped to streaming internationally; built an underground audience that reads it as a parable of depression, dissolution, and rewriting. The bear scene is its own object.",
    metrics: {
      consensus: 64,
      friction: 70,
      obsession: 78,
      haunting: 86,
      symbolic: 84,
      cult: 82,
      formal: 80,
      voltage: 88,
      accessibility: 48,
    },
    notes: {},
    afterlife: [
      { year: 2018, kind: "release", label: "Theatrical US, streaming international." },
      { year: 2019, kind: "rediscovery", label: "Reddit and tumblr essay-rounds." },
      { year: 2022, kind: "meme", label: "The bear; the lighthouse double." },
    ],
    factions: [
      { name: "The Self-Annihilators", share: 0.5, voice: "“It is a film about wanting to dissolve.”" },
      { name: "The Sci-Fi Faithful", share: 0.3, voice: "“A rare adult science-fiction.”" },
      { name: "The Disappointed", share: 0.2, voice: "“The book is the better object.”" },
    ],
    symbols: ["the shimmer", "the bear", "the lighthouse", "the double"],
    pos: { x: 0.7, y: 0.7 },
  },
  {
    slug: "possession",
    title: "Possession",
    year: 1981,
    director: "Andrzej Żuławski",
    runtime: 124,
    catalogue: "ARTX-010",
    epigraph: "I cannot exist by myself because I am afraid of myself.",
    reading:
      "Banned in the UK, mutilated in the US, restored decades later. The Adjani subway sequence has become a free-standing artifact circulating beyond the film.",
    metrics: {
      consensus: 52,
      friction: 88,
      obsession: 90,
      haunting: 94,
      symbolic: 88,
      cult: 96,
      formal: 86,
      voltage: 99,
      accessibility: 9,
    },
    notes: {
      voltage: "Highest sustained-intensity reading in the catalogue.",
      cult: "Born cult; became canonical without losing cult status.",
    },
    afterlife: [
      { year: 1981, kind: "release", label: "Cannes; immediate scandal." },
      { year: 1983, kind: "rejection", label: "Banned in the UK as a 'video nasty.'" },
      { year: 2010, kind: "rediscovery", label: "Restoration; midnight circuit." },
      { year: 2021, kind: "meme", label: "Subway sequence circulates indefinitely." },
      { year: 2023, kind: "criterion", label: "Restored 4K release." },
    ],
    factions: [
      { name: "The Initiated", share: 0.55, voice: "“There is nothing else like it.”" },
      { name: "The Repulsed", share: 0.25, voice: "“Hysteria as aesthetic.”" },
      { name: "The Adjani Faithful", share: 0.2, voice: "“A performance that should not be possible.”" },
    ],
    symbols: ["the subway", "the doppelgänger", "the apartment", "the creature"],
    pos: { x: 0.22, y: 0.88 },
  },
  {
    slug: "eyes-wide-shut",
    title: "Eyes Wide Shut",
    year: 1999,
    director: "Stanley Kubrick",
    runtime: 159,
    catalogue: "ARTX-011",
    epigraph: "No dream is ever just a dream.",
    reading:
      "Released into a culture that wanted a thriller; delivered a marriage. Twenty-five years of slow rehabilitation; the conspiracy reading and the marriage reading remain in unresolved tension.",
    metrics: {
      consensus: 60,
      friction: 80,
      obsession: 85,
      haunting: 87,
      symbolic: 89,
      cult: 84,
      formal: 90,
      voltage: 78,
      accessibility: 40,
    },
    notes: {},
    afterlife: [
      { year: 1999, kind: "release", label: "Posthumous release; misread as erotic thriller." },
      { year: 2009, kind: "rediscovery", label: "First revisionist essays." },
      { year: 2019, kind: "meme", label: "20th-anniversary discourse cycle." },
      { year: 2024, kind: "academic", label: "Marriage-and-ritual studies adopt the text." },
    ],
    factions: [
      { name: "The Marital", share: 0.4, voice: "“A film about not knowing your wife.”" },
      { name: "The Conspiratorial", share: 0.32, voice: "“The mask is real.”" },
      { name: "The Formalists", share: 0.28, voice: "“Every interior is a stage.”" },
    ],
    symbols: ["the mask", "the password", "the christmas lights", "the rainbow"],
    pos: { x: 0.55, y: 0.12 },
  },
  {
    slug: "tar",
    title: "Tár",
    year: 2022,
    director: "Todd Field",
    runtime: 158,
    catalogue: "ARTX-012",
    epigraph: "Time is the thing.",
    reading:
      "A film whose discourse outpaced its viewership. Read as defense, indictment, satire, and document — sometimes by the same viewer in successive viewings.",
    metrics: {
      consensus: 76,
      friction: 84,
      obsession: 80,
      haunting: 75,
      symbolic: 86,
      cult: 60,
      formal: 88,
      voltage: 74,
      accessibility: 38,
    },
    notes: {
      friction: "Polarization driven by political reading more than aesthetic disagreement.",
    },
    afterlife: [
      { year: 2022, kind: "release", label: "Venice premiere; awards-season frontrunner." },
      { year: 2023, kind: "rejection", label: "Loses Best Picture; discourse intensifies." },
      { year: 2024, kind: "academic", label: "Power, gender, classical-music studies adopt it." },
    ],
    factions: [
      { name: "The Defenders", share: 0.38, voice: "“The film is more honest than its critics.”" },
      { name: "The Indicters", share: 0.34, voice: "“It romances what it claims to interrogate.”" },
      { name: "The Formal", share: 0.28, voice: "“Structure as moral accounting.”" },
    ],
    symbols: ["the metronome", "the apartment", "the running shoe", "the question"],
    pos: { x: 0.85, y: 0.32 },
  },
  {
    slug: "the-goonies-1985",
    title: "The Goonies",
    year: 1985,
    director: "Richard Donner",
    runtime: 114,
    catalogue: "ARTX-031",
    epigraph: "Goonies never say die.",
    reading:
      "A structural anchor for the kids-on-an-adventure template: a machine of traps, pirate myth, and child-logic architecture that still calibrates nostalgic self-construction for its audience.",
    metrics: {
      consensus: 92,
      friction: 8,
      obsession: 94,
      haunting: 61,
      symbolic: 71,
      cult: 68,
      formal: 52,
      voltage: 88,
      accessibility: 96,
    },
    notes: {
      obsession: "Functions as a nostalgic compass rather than a one-time watch.",
      formal: "Its tonal braid (slapstick + peril + mythology) remains hard to replicate cleanly.",
    },
    afterlife: [
      { year: 1985, kind: "release", label: "Wide theatrical release; immediate family-adventure touchstone." },
      { year: 2001, kind: "rediscovery", label: "DVD era cements multi-generational repeat viewing." },
      { year: 2023, kind: "academic", label: "Regularly cited as archetype engineering in adventure storytelling." },
    ],
    factions: [
      { name: "The Calibrators", share: 0.52, voice: "“This is how childhood adventure should feel.”" },
      { name: "The Builders", share: 0.3, voice: "“Every beat is mechanical setup and payoff.”" },
      { name: "The Skeptics", share: 0.18, voice: "“Nostalgia does half the work.”" },
    ],
    symbols: ["the map", "one-eyed willie", "the truffle shuffle", "booby traps", "the cave"],
    pos: { x: 0.14, y: 0.46 },
  },
  {
    slug: "fight-club-1999",
    title: "Fight Club",
    year: 1999,
    director: "David Fincher",
    runtime: 139,
    catalogue: "ARTX-032",
    epigraph: "It's only after we've lost everything that we're free to do anything.",
    reading:
      "A split-shadow object whose symbolic load is enormous and permanently contested: satire and instruction-manual readings continue to weaponize each other across generations.",
    metrics: {
      consensus: 74,
      friction: 91,
      obsession: 88,
      haunting: 79,
      symbolic: 94,
      cult: 45,
      formal: 82,
      voltage: 93,
      accessibility: 78,
    },
    notes: {
      friction: "Interpretive conflict is structural and durable, not transient.",
      haunting: "Its anti-consumer domestic aesthetic remains culturally installed.",
    },
    afterlife: [
      { year: 1999, kind: "release", label: "Divisive theatrical reception and immediate controversy cycle." },
      { year: 2003, kind: "rediscovery", label: "Home-video circulation amplifies second-wave interpretation battles." },
      { year: 2026, kind: "academic", label: "Frequently taught as a case study in hostile reception splits." },
    ],
    factions: [
      { name: "Satire Readers", share: 0.41, voice: "“It indicts the fantasy it stages.”" },
      { name: "Literalists", share: 0.31, voice: "“It offers a model, not a warning.”" },
      { name: "Aesthetic Formalists", share: 0.28, voice: "“The ad-language void is the thesis.”" },
    ],
    symbols: ["project mayhem", "the narrator", "soap", "ikea catalog", "paper street"],
    pos: { x: 0.67, y: 0.49 },
  },
  {
    slug: "under-the-skin-2013",
    title: "Under the Skin",
    year: 2013,
    director: "Jonathan Glazer",
    runtime: 108,
    catalogue: "ARTX-042",
    epigraph: "The Biological Black Hole.",
    reading:
      "A cold, nauseatic mechanism of cosmic dread that refuses explanatory taxonomy. Its hidden-camera and non-actor method pushes formal risk to the limit, and the void sequence lodges as permanent mental hardware.",
    metrics: {
      consensus: 81,
      friction: 22,
      obsession: 56,
      haunting: 98,
      symbolic: 89,
      cult: 74,
      formal: 97,
      voltage: 84,
      accessibility: 15,
    },
    notes: {
      formal: "Hidden-camera capture and non-actor architecture drive its extreme formal-risk score.",
      voltage: "A cold voltage: nausea and cosmic dread rather than sentimental heat.",
      haunting: "The void sequence produces near-permanent mnemonic imprinting.",
    },
    afterlife: [
      { year: 2013, kind: "release", label: "Festival rollout marked by polarized immediate response." },
      { year: 2014, kind: "rediscovery", label: "Slow-burn critical ascent through essay culture." },
      { year: 2020, kind: "academic", label: "Canonized in courses on alien embodiment and post-human cinema." },
    ],
    factions: [
      { name: "The Entranced", share: 0.45, voice: "“The void sequence rewired my brain.”" },
      { name: "The Resistant", share: 0.3, voice: "“Brilliant but too withholding.”" },
      { name: "Body-Horror Readers", share: 0.25, voice: "“Its dread is biological, not narrative.”" },
    ],
    symbols: ["the void", "the black room", "the van", "the beach", "the skin"],
    pos: { x: 0.39, y: 0.16 },
  },
  {
    slug: "coherence-2013",
    title: "Coherence",
    year: 2013,
    director: "James Ward Byrkit",
    runtime: 89,
    catalogue: "ARTX-045",
    epigraph: "The Low-Budget Mirror to Primer.",
    reading:
      "Improvised, jagged dialogue and collapsing physics make entry difficult but rewarding. It demands active tracking of each character-state across branching realities and lingers as an intimate identity fracture long after viewing.",
    metrics: {
      consensus: 78,
      friction: 11,
      obsession: 92,
      haunting: 79,
      symbolic: 95,
      cult: 81,
      formal: 68,
      voltage: 74,
      accessibility: 42,
    },
    notes: {
      symbolic: "State-tracking across realities drives its high symbolic workload.",
      haunting: "Residual effect is strongest for viewers with identity-dislocation sensitivity.",
      accessibility: "Improvised delivery and unstable causal logic lower immediate legibility.",
    },
    afterlife: [
      { year: 2013, kind: "release", label: "Festival circulation establishes it as a high-concept microbudget anomaly." },
      { year: 2016, kind: "rediscovery", label: "Streaming-era word of mouth expands repeat-viewing communities." },
      { year: 2022, kind: "academic", label: "Frequently cited in low-budget formal innovation discussions." },
    ],
    factions: [
      { name: "State Mappers", share: 0.44, voice: "“The pleasure is diagramming the identity branches.”" },
      { name: "The Unsettled", share: 0.33, voice: "“It feels like being displaced from your own timeline.”" },
      { name: "The Skeptics", share: 0.23, voice: "“Conceptually sharp, but intentionally rough-edged.”" },
    ],
    symbols: ["the glow sticks", "the box", "duplicate dinner party", "broken state continuity", "quantum fracture"],
    pos: { x: 0.56, y: 0.27 },
  },
  {
    slug: "the-lighthouse-2019",
    title: "The Lighthouse",
    year: 2019,
    director: "Robert Eggers",
    runtime: 109,
    catalogue: "ARTX-046",
    epigraph: "The High-Friction Myth.",
    reading:
      "The boxy frame and archaic maritime dialect impose a deliberate entry barrier, then trap the viewer in a symbolic labyrinth of Greek myth and Freudian dread. It arrived nearly pre-formed as a sacred object for salt-and-madness devotees.",
    metrics: {
      consensus: 86,
      friction: 14,
      obsession: 89,
      haunting: 82,
      symbolic: 97,
      cult: 88,
      formal: 93,
      voltage: 95,
      accessibility: 31,
    },
    notes: {
      formal: "1.19:1 framing and period dialect are core to the film's high formal-risk profile.",
      symbolic: "Mythic and psychoanalytic motifs stack densely with little interpretive handholding.",
      cult: "Cult trajectory was steep from release due to instantly quotable ritual texture.",
    },
    afterlife: [
      { year: 2019, kind: "release", label: "Immediate critical attention centers on performance duel and formal extremity." },
      { year: 2020, kind: "meme", label: "Quote fragments and visual motifs become persistent online ritual language." },
      { year: 2024, kind: "academic", label: "Widely taught as a mythic-psychological chamber text." },
    ],
    factions: [
      { name: "Myth Cartographers", share: 0.4, voice: "“It is Greek tragedy smuggled through maritime grime.”" },
      { name: "Performance Devotees", share: 0.35, voice: "“A two-body possession match staged in pure form.”" },
      { name: "The Repelled", share: 0.25, voice: "“Formidable craft, but the abrasion is relentless.”" },
    ],
    symbols: ["the lantern room", "the gull", "the mermaid", "promethean fire", "the foghorn"],
    pos: { x: 0.51, y: 0.19 },
  },
  {
    slug: "beyond-the-black-rainbow-2010",
    title: "Beyond the Black Rainbow",
    year: 2010,
    director: "Panos Cosmatos",
    runtime: 110,
    catalogue: "ARTX-047",
    epigraph: "The Aesthetic Virus.",
    reading:
      "Near-zero narrative accessibility is traded for total sensory occupation: oppressive synth-drone, analog glow, and a controlled psychedelic texture that behaves less like plot and more like a lived environment. Its haunting survives as atmosphere rather than event.",
    metrics: {
      consensus: 54,
      friction: 48,
      obsession: 74,
      haunting: 96,
      symbolic: 81,
      cult: 92,
      formal: 98,
      voltage: 72,
      accessibility: 9,
    },
    notes: {
      accessibility: "Refuses traditional narrative arc in favor of texture and durational atmosphere.",
      haunting: "Lingers through sound design and chromatic mood rather than plot mechanics.",
      formal: "A near-maximal commitment to audiovisual world-building over exposition.",
    },
    afterlife: [
      { year: 2010, kind: "release", label: "Initial reception splits between visual awe and narrative refusal fatigue." },
      { year: 2015, kind: "rediscovery", label: "Home-viewing audiences elevate it as a cult sensory object." },
      { year: 2024, kind: "academic", label: "Cited in discussions of vibe-centric and affect-forward genre cinema." },
    ],
    factions: [
      { name: "Atmosphere Absolutists", share: 0.47, voice: "“Plot is irrelevant; the texture is the text.”" },
      { name: "Cult Neonists", share: 0.31, voice: "“The Cosmatos glow is a permanent habitat.”" },
      { name: "Narrative Holdouts", share: 0.22, voice: "“Mesmeric image, but too little structural payoff.”" },
    ],
    symbols: ["arboria institute", "red chamber", "synth drone", "chromatic haze", "psychic containment"],
    pos: { x: 0.23, y: 0.15 },
  },
  {
    slug: "starship-troopers-1997",
    title: "Starship Troopers",
    year: 1997,
    director: "Paul Verhoeven",
    runtime: 129,
    catalogue: "ARTX-043",
    epigraph: "Would you like to know more?",
    reading:
      "A consensus-migration landmark: once dismissed as dumb spectacle, now broadly decoded as a propaganda machine whose satire arrived before its audience could tune to it.",
    metrics: {
      consensus: 86,
      friction: 14,
      obsession: 72,
      haunting: 31,
      symbolic: 92,
      cult: 82,
      formal: 78,
      voltage: 76,
      accessibility: 81,
    },
    notes: {
      consensus: "Public interpretation converged over decades rather than at release.",
      symbolic: "Now read systemically as propaganda grammar, not only action cinema.",
    },
    afterlife: [
      { year: 1997, kind: "release", label: "Initial reception frames it as hollow militarist action." },
      { year: 2010, kind: "rediscovery", label: "Critical reappraisal emphasizes satirical intent." },
      { year: 2026, kind: "academic", label: "Stable inclusion in propaganda and media-literacy curricula." },
    ],
    factions: [
      { name: "Satire Converts", share: 0.5, voice: "“It was always laughing at us.”" },
      { name: "Action Loyalists", share: 0.28, voice: "“Satire or not, the spectacle still rules.”" },
      { name: "Political Readers", share: 0.22, voice: "“Its fake-news form predicts the present tense.”" },
    ],
    symbols: ["federal network", "bugs", "mobile infantry", "recruitment ads", "uniforms"],
    pos: { x: 0.74, y: 0.68 },
  },
  {
    slug: "jennifers-body-2009",
    title: "Jennifer's Body",
    year: 2009,
    director: "Karyn Kusama",
    runtime: 102,
    catalogue: "ARTX-044",
    epigraph: "Hell is a teenage girl.",
    reading:
      "A reclamation spike object: institutional rejection at birth followed by high-velocity cult canonization through survivor communities and horror-theory discourse.",
    metrics: {
      consensus: 79,
      friction: 38,
      obsession: 89,
      haunting: 82,
      symbolic: 85,
      cult: 96,
      formal: 44,
      voltage: 91,
      accessibility: 88,
    },
    notes: {
      cult: "One of the steepest reclamation trajectories in the catalogue.",
      voltage: "Dialogue rhythm and gore deliver a persistent high-frequency shiver effect.",
    },
    afterlife: [
      { year: 2009, kind: "release", label: "Marketed against its own tonal register; underperforms critically." },
      { year: 2018, kind: "rediscovery", label: "Feminist-horror reassessment accelerates online." },
      { year: 2024, kind: "academic", label: "Widely taught as a reclamation-era genre text." },
    ],
    factions: [
      { name: "Reclaimers", share: 0.56, voice: "“The misread was the point of the wound.”" },
      { name: "Horror Formalists", share: 0.24, voice: "“Tone-switching is the weapon.”" },
      { name: "Late Converts", share: 0.2, voice: "“I dismissed it, then it clicked years later.”" },
    ],
    symbols: ["the knife", "the school fire", "the lake", "the tongue", "the band"],
    pos: { x: 0.58, y: 0.84 },
  },
  {
    slug: "secretary-2002",
    title: "Secretary",
    year: 2002,
    director: "Steven Shainberg",
    runtime: 111,
    catalogue: "ARTX-035",
    epigraph: "A Subversive Anchor.",
    reading:
      "A high-consensus classic that still carries active friction in the reading of its power dynamics. Its emotional voltage is specific and bodily, and its after-effect lingers as an unresolved question about domesticity, service, and desire.",
    metrics: {
      consensus: 84,
      friction: 32,
      obsession: 68,
      haunting: 59,
      symbolic: 71,
      cult: 74,
      formal: 48,
      voltage: 89,
      accessibility: 86,
    },
    notes: {
      voltage: "High-frequency erotic tension remains the film's live wire.",
      haunting: "The domestic contract it stages continues to echo after viewing.",
    },
    afterlife: [
      { year: 2002, kind: "release", label: "Release reframes BDSM as art-house intimacy." },
      { year: 2010, kind: "academic", label: "Power, labor, and gender readings expand." },
      { year: 2020, kind: "rediscovery", label: "Reappraised as an early-2000s psychosexual touchstone." },
    ],
    factions: [
      { name: "The Tender Subversives", share: 0.44, voice: "“It is radical precisely because it is intimate.”" },
      { name: "The Skeptics", share: 0.31, voice: "“Its power dynamic is still too unstable to settle.”" },
      { name: "The Formal Moderates", share: 0.25, voice: "“Conventional craft, volatile implications.”" },
    ],
    symbols: ["the typewriter", "the red pen", "the desk", "the contract"],
    pos: { x: 0.7, y: 0.58 },
  },
  {
    slug: "donnie-darko-2001",
    title: "Donnie Darko",
    year: 2001,
    director: "Richard Kelly",
    runtime: 113,
    catalogue: "ARTX-036",
    epigraph: "Teenage Symbolic Singularity.",
    reading:
      "A cult engine built from suburban dread and high-concept mystery. Attempts to over-explain its system only intensified obsession, and its failed theatrical start became one of the sharpest reclamation arcs of the era.",
    metrics: {
      consensus: 88,
      friction: 14,
      obsession: 97,
      haunting: 82,
      symbolic: 95,
      cult: 99,
      formal: 79,
      voltage: 74,
      accessibility: 75,
    },
    notes: {
      cult: "Near-maximal rite-of-passage status in suburban-surrealist canon.",
      symbolic: "Director's Cut explanations increased, rather than resolved, symbolic demand.",
    },
    afterlife: [
      { year: 2001, kind: "rejection", label: "Theatrical run underperforms." },
      { year: 2004, kind: "rediscovery", label: "Home-media circulation turns it into a cult staple." },
      { year: 2017, kind: "meme", label: "Frank imagery and quotes become persistent internet tokens." },
    ],
    factions: [
      { name: "The Devotees", share: 0.53, voice: "“An adolescent metaphysics text disguised as genre.”" },
      { name: "The Literalists", share: 0.22, voice: "“The system should resolve cleanly if explained.”" },
      { name: "The Ambiguists", share: 0.25, voice: "“Mystery is the mechanism, not a flaw.”" },
    ],
    symbols: ["frank the rabbit", "the tangent universe", "the jet engine", "the countdown"],
    pos: { x: 0.62, y: 0.78 },
  },
  {
    slug: "no-country-for-old-men-2007",
    title: "No Country for Old Men",
    year: 2007,
    director: "Joel Coen, Ethan Coen",
    runtime: 122,
    catalogue: "ARTX-037",
    epigraph: "Nihilistic Monolith.",
    reading:
      "A near-settled object of mastery with predatory residual dread. The refusal of a traditional climax and strategic silence over score create a cold panic that does not dissipate; Chigurh reads less like character than biological threat.",
    metrics: {
      consensus: 97,
      friction: 8,
      obsession: 91,
      haunting: 96,
      symbolic: 93,
      cult: 35,
      formal: 89,
      voltage: 95,
      accessibility: 92,
    },
    notes: {
      formal: "Anti-climax and sonic austerity carry the film's core risk.",
      symbolic: "The coin toss functions as a compact model of chaotic fate.",
    },
    afterlife: [
      { year: 2007, kind: "release", label: "Wide critical consolidation; awards momentum." },
      { year: 2008, kind: "criterion", label: "Canonization cycle begins immediately." },
      { year: 2024, kind: "academic", label: "Frequently taught in fate-and-violence film curricula." },
    ],
    factions: [
      { name: "The Canonists", share: 0.57, voice: "“A definitive modern American film.”" },
      { name: "The Existentialists", share: 0.24, voice: "“Its terror is metaphysical, not plot-driven.”" },
      { name: "The Moralists", share: 0.19, voice: "“The ending's withdrawal is its ethical strike.”" },
    ],
    symbols: ["the coin toss", "the cattle gun", "the motel corridor", "the dream"],
    pos: { x: 0.4, y: 0.2 },
  },
  {
    slug: "django-unchained-2012",
    title: "Django Unchained",
    year: 2012,
    director: "Quentin Tarantino",
    runtime: 165,
    catalogue: "ARTX-038",
    epigraph: "High-Heat Lightning Rod.",
    reading:
      "Its friction remains massive and renewable: every mention reopens conflict over language, representation, and historical trauma. At the same time, the film's revenge-folk-tale clarity and kinetic style sustain extreme emotional voltage.",
    metrics: {
      consensus: 76,
      friction: 94,
      obsession: 85,
      haunting: 41,
      symbolic: 62,
      cult: 44,
      formal: 67,
      voltage: 98,
      accessibility: 97,
    },
    notes: {
      friction: "Discourse conflict reliably reactivates across contexts and years.",
      formal: "Tonal whiplash is the governing structural gamble.",
    },
    afterlife: [
      { year: 2012, kind: "release", label: "Commercial and awards success with immediate controversy." },
      { year: 2013, kind: "wound", label: "Debates over historical language and spectacle intensify." },
      { year: 2025, kind: "meme", label: "Select scenes circulate detached from historical frame." },
    ],
    factions: [
      { name: "The Applauders", share: 0.39, voice: "“Operatic retaliation made legible to everyone.”" },
      { name: "The Critics", share: 0.37, voice: "“Style metabolizes trauma too aggressively.”" },
      { name: "The Split Readers", share: 0.24, voice: "“Form exhilarating, ethics unresolved.”" },
    ],
    symbols: ["the bounty poster", "the blue suit", "candieland", "the exploding house"],
    pos: { x: 0.9, y: 0.64 },
  },
  {
    slug: "inherent-vice-2014",
    title: "Inherent Vice",
    year: 2014,
    director: "Paul Thomas Anderson",
    runtime: 148,
    catalogue: "ARTX-039",
    epigraph: "The Fog Machine.",
    reading:
      "Deliberately low-accessibility by design, it stages confusion as method. Its symbolic load is atmospheric rather than logical, and its cult curve rose vertically as viewers reclaimed the sprawl as a formal risk worth defending.",
    metrics: {
      consensus: 58,
      friction: 62,
      obsession: 74,
      haunting: 51,
      symbolic: 89,
      cult: 88,
      formal: 92,
      voltage: 54,
      accessibility: 22,
    },
    notes: {
      accessibility: "Opacity is intentional and structural, not incidental.",
      cult: "Public incoherence verdict was reversed by committed repeat viewers.",
    },
    afterlife: [
      { year: 2014, kind: "rejection", label: "Early response centers on incoherence complaints." },
      { year: 2019, kind: "rediscovery", label: "Critical reappraisal names it a major late-period PTA work." },
      { year: 2024, kind: "academic", label: "Noir-afterlife and vibe-theory readings expand." },
    ],
    factions: [
      { name: "The Vibe Cartographers", share: 0.46, voice: "“It is a map of loss, not a puzzle box.”" },
      { name: "The Proceduralists", share: 0.2, voice: "“The plot haze blocks too much signal.”" },
      { name: "The PTA Maximalists", share: 0.34, voice: "“Mess is the point, and the form.”" },
    ],
    symbols: ["the haze", "gold fang", "the sax line", "the missing map"],
    pos: { x: 0.28, y: 0.74 },
  },
  {
    slug: "the-shining-1980",
    title: "The Shining",
    year: 1980,
    director: "Stanley Kubrick",
    runtime: 144,
    catalogue: "ARTX-031",
    epigraph: "The Permanent Architectural Structure.",
    reading:
      "The Overlook Hotel is no longer a movie — it is a permanent architectural structure in the human subconscious. Its residual haunting is the benchmark against which all others in this catalogue are measured, its iconography functioning as unauthorized mental installs now immune to deliberate removal. The theory industry that has grown around it — every carpet, every door number, every eyeline — is simultaneously the film's greatest tribute and its most faithful haunting.",
    metrics: {
      consensus: 94,
      friction: 12,
      obsession: 98,
      haunting: 99,
      symbolic: 96,
      cult: 71,
      formal: 88,
      voltage: 92,
      accessibility: 81,
    },
    notes: {
      haunting: "The benchmark Haunting score in the catalogue — its iconography is immune to removal.",
      symbolic: "Symbolic density driven by exhaustive over-reading; the theory apparatus is now as large as the film.",
    },
    afterlife: [
      { year: 1980, kind: "release", label: "Release to mixed critical reception; King's disavowal begins." },
      { year: 1982, kind: "wound", label: "Stephen King publicly rejects Kubrick's adaptation as emotionally vacant." },
      { year: 2012, kind: "academic", label: "Room 237 documentary catalogs competing conspiracy interpretations." },
      { year: 2019, kind: "reissue", label: "Doctor Sleep sequel extends the Overlook mythology into a new generation." },
      { year: 2025, kind: "academic", label: "The Overlook carpet becomes a design-culture reference decades after release." },
    ],
    factions: [
      { name: "The Room 237 School", share: 0.38, voice: ""Every frame is a message. The carpet. The maze. Nothing is accidental."" },
      { name: "The Purists", share: 0.34, voice: ""It is a perfect horror film. The theory apparatus around it is both evidence and parasite."" },
      { name: "The King Loyalists", share: 0.28, voice: ""Kubrick removed the emotional core. The hotel should have wanted the family dead."" },
    ],
    symbols: ["Room 237", "the hedge maze", "the carpet", "the axe", "the Overlook Hotel", "the twins", "all work and no play"],
    pos: { x: 0.32, y: 0.22 },
  },
  {
    slug: "beetlejuice-1988",
    title: "Beetlejuice",
    year: 1988,
    director: "Tim Burton",
    runtime: 92,
    catalogue: "ARTX-053",
    epigraph: "The Netherworld Waiting Room.",
    reading:
      "A high-voltage bureaucratic nightmare that has installed itself into the collective lizard brain of multiple generations. Its formal risk — German Expressionist angles paired with 1950s calypso — is now invisible because the film has fully settled into cultural memory. The netherworld waiting room is one of cinema's most durable architectural installs: a space visitors did not choose to enter and cannot fully leave.",
    metrics: {
      consensus: 88,
      friction: 14,
      obsession: 92,
      haunting: 84,
      symbolic: 67,
      cult: 95,
      formal: 79,
      voltage: 81,
      accessibility: 91,
    },
    notes: {
      cult: "Multi-generational cult formation; high accessibility drives the broadest possible initiation base.",
      formal: "Expressionist angles and calypso score now invisible through familiarity — formal risk absorbed into brand.",
    },
    afterlife: [
      { year: 1988, kind: "release", label: "Immediate commercial success; Tim Burton's mainstream breakthrough." },
      { year: 2000, kind: "academic", label: "Gothic aesthetic and Expressionist architecture enter design culture." },
      { year: 2024, kind: "reissue", label: "Beetlejuice Beetlejuice sequel released; original's canonical status renewed." },
    ],
    factions: [
      { name: "The Nostalgia Chamber", share: 0.52, voice: ""It rewired my visual language before I knew what visual language was."" },
      { name: "The Horror Taxonomists", share: 0.3, voice: ""It is horror for people who don't admit they like horror."" },
      { name: "The Design Readers", share: 0.18, voice: ""The Expressionist architecture and the calypso score is a formal argument in itself."" },
    ],
    symbols: ["the netherworld waiting room", "the calypso number", "the model town", "the ghost handbook", "the sandworms", "the black-and-white stripes"],
    pos: { x: 0.6, y: 0.88 },
  },
  {
    slug: "the-big-lebowski-1998",
    title: "The Big Lebowski",
    year: 1998,
    director: "Joel Coen & Ethan Coen",
    runtime: 117,
    catalogue: "ARTX-054",
    epigraph: "The Social Tool.",
    reading:
      "The gold standard for a film being lived with as a social tool, The Big Lebowski possesses a theoretical maximum obsession score. Its symbolic density remains high but is intentionally empty — a system that connects everyone and commits to nothing. The reclamation arc from initial commercial failure to cultural religion is the steepest in the catalogue, achieved entirely through community formation, not critical reappraisal.",
    metrics: {
      consensus: 97,
      friction: 5,
      obsession: 99,
      haunting: 71,
      symbolic: 92,
      cult: 100,
      formal: 68,
      voltage: 74,
      accessibility: 96,
    },
    notes: {
      cult: "Theoretical maximum Cult Formation — Lebowski Fest, Dudeism, and annual rituals constitute a genuine religion.",
      obsession: "The highest obsession score derives from social repetition, not interpretive complexity.",
      formal: "Low formal risk is part of the point — the Coens deploy genre grammar ironically.",
    },
    afterlife: [
      { year: 1998, kind: "release", label: "Release to commercial disappointment and lukewarm critical reception." },
      { year: 2002, kind: "rediscovery", label: "Lebowski Fest begins in Louisville; community formation accelerates." },
      { year: 2009, kind: "academic", label: "Dudeism officially registered as a religion; the Dude enters philosophical discourse." },
      { year: 2018, kind: "reissue", label: "20th anniversary re-releases; discourse and ritual observance peak." },
    ],
    factions: [
      { name: "The Dudeists", share: 0.58, voice: ""The Dude abides. This is a complete philosophy of life."" },
      { name: "The Film Readers", share: 0.27, voice: ""It is the most structurally sophisticated Coen film, disguised as a shaggy dog."" },
      { name: "The Resisters", share: 0.15, voice: ""I cannot explain why people treat this as a sacred object."" },
    ],
    symbols: ["the rug", "the White Russian", "Donnie's ashes", "the Dude's bathrobe", "the nihilists", "bowling lanes"],
    pos: { x: 0.95, y: 0.82 },
  },
  {
    slug: "parasite-2019",
    title: "Parasite",
    year: 2019,
    director: "Bong Joon-ho",
    runtime: 132,
    catalogue: "ARTX-035",
    epigraph: "The Global Connector.",
    reading:
      "A rare global connector, Parasite bridged linguistic gaps through universal symbolic power. Its symbolic density — the viewing stone, the smell, the flooding basement — operates as the gears of a perfectly tuned social machine. The consensus record is nearly perfect: a rare alignment where critical, audience, and institutional records all agree on the object's mastery within a single year of release.",
    metrics: {
      consensus: 96,
      friction: 9,
      obsession: 78,
      haunting: 86,
      symbolic: 92,
      cult: 45,
      formal: 82,
      voltage: 94,
      accessibility: 88,
    },
    notes: {
      consensus: "Near-perfect consensus — the rarest reading in the catalogue for a formally ambitious work.",
      symbolic: "The viewing stone and the smell operate as precision-engineered symbolic anchors, not ambient atmosphere.",
    },
    afterlife: [
      { year: 2019, kind: "release", label: "Palme d'Or at Cannes; first Korean-language film to win." },
      { year: 2020, kind: "academic", label: "Academy Awards Best Picture; first non-English film to win; global cinema discourse peaks." },
      { year: 2021, kind: "academic", label: "Class-war symbols — the stone, the smell — enter film theory as primary objects." },
      { year: 2024, kind: "rediscovery", label: "HBO series adaptation reignites comparison with the original." },
    ],
    factions: [
      { name: "The Social Machine Readers", share: 0.47, voice: ""It is a perfectly tuned machine. Every symbol is load-bearing."" },
      { name: "The Global Optimists", share: 0.3, voice: ""The first foreign-language film that felt genuinely global, not foreign."" },
      { name: "The Genre Readers", share: 0.23, voice: ""It is simultaneously thriller, comedy, and horror, and never fails at any of them."" },
    ],
    symbols: ["the viewing stone", "the smell", "the flooding basement", "the semi-basement", "the garden rock", "the plan"],
    pos: { x: 0.82, y: 0.38 },
  },
  {
    slug: "funny-games-1997",
    title: "Funny Games",
    year: 1997,
    director: "Michael Haneke",
    runtime: 108,
    catalogue: "ARTX-055",
    epigraph: "The Rigged Contract.",
    reading:
      "A theoretical maximum in friction, designed to explicitly punish the viewer for their own obsession with cinematic violence. By breaking the fourth wall at the precise moment the viewer most needs relief — the remote control scene — it cancels the contract of cinema and installs an unauthorized intervention in reality. Its accessibility is deliberately sealed: the film refuses to be consumed by anyone who approaches it as entertainment.",
    metrics: {
      consensus: 81,
      friction: 98,
      obsession: 92,
      haunting: 99,
      symbolic: 95,
      cult: 94,
      formal: 97,
      voltage: 96,
      accessibility: 15,
    },
    notes: {
      friction: "Near-maximum friction; the film's entire architecture is designed to generate and sustain irresolvable viewer discomfort.",
      haunting: "The remote-control scene produces the highest single-moment trauma-image in the catalogue.",
      formal: "The fourth-wall rupture is deployed not as device but as indictment — Haneke breaks the form to indict the viewer.",
    },
    afterlife: [
      { year: 1997, kind: "release", label: "Cannes premiere; immediate controversy and walkouts." },
      { year: 1997, kind: "rejection", label: "Widely described as unwatchable; large portion of audiences abandon viewing." },
      { year: 2007, kind: "reissue", label: "Haneke directs English-language shot-for-shot remake; the theoretical debate intensifies." },
      { year: 2020, kind: "academic", label: "Pandemic discourse amplifies 'punishing cinema' and viewer-as-accomplice readings." },
    ],
    factions: [
      { name: "The Complicit", share: 0.41, voice: ""I knew I should stop. I didn't. That was the point."" },
      { name: "The Refused", share: 0.37, voice: ""I turned it off. I think that was the correct response. The film agrees."" },
      { name: "The Theorists", share: 0.22, voice: ""It is the most rigorous examination of the ethics of cinematic violence ever made."" },
    ],
    symbols: ["the remote control", "the eggs", "the fourth wall", "the golf club", "the white gloves", "the rewind"],
    pos: { x: 0.18, y: 0.55 },
  },
  {
    slug: "the-royal-tenenbaums-2001",
    title: "The Royal Tenenbaums",
    year: 2001,
    director: "Wes Anderson",
    runtime: 110,
    catalogue: "ARTX-056",
    epigraph: "The Protective Dollhouse.",
    reading:
      "The monolith of the Anderson aesthetic. Its residual haunting is driven by the specific look of familial disappointment — childhood stagnation arrested and preserved in amber. A high-density symbolic system in which the house functions as a map of the characters' internal decline, read simultaneously as grief comedy and installation of preserved loss. It formalized a visual grammar that would go on to define an entire decade of design.",
    metrics: {
      consensus: 94,
      friction: 6,
      obsession: 91,
      haunting: 82,
      symbolic: 88,
      cult: 42,
      formal: 74,
      voltage: 85,
      accessibility: 88,
    },
    notes: {
      formal: "The formal grammar Anderson established here became so widespread it is now invisible — absorbed into the broader aesthetic vocabulary.",
      haunting: "Haunting driven by the specific aesthetic of familial disappointment, not supernatural or existential threat.",
    },
    afterlife: [
      { year: 2001, kind: "release", label: "Strong critical reception; the Anderson aesthetic codified in a single film." },
      { year: 2005, kind: "academic", label: "The Anderson visual system becomes a design and aesthetic reference for a generation." },
      { year: 2015, kind: "meme", label: "Aesthetic widely copied across film, design, and fashion; Anderson becomes an adjective." },
      { year: 2022, kind: "academic", label: "Film studies formally address the 'Anderson effect' and its cultural saturation." },
    ],
    factions: [
      { name: "The Aesthetes", share: 0.46, voice: ""The house is a character. The music is grief. The slowness is the argument."" },
      { name: "The Autobiographers", share: 0.33, voice: ""I grew up in that family. I have never said that out loud before."" },
      { name: "The Skeptics", share: 0.21, voice: ""Style is doing the work that feeling should be doing."" },
    ],
    symbols: ["the Lindbergh Palace Hotel", "the red tracksuit", "the funerary suit", "the staircase", "the ashram", "the bullet"],
    pos: { x: 0.86, y: 0.70 },
  },
  {
    slug: "the-man-who-wasnt-there-2001",
    title: "The Man Who Wasn't There",
    year: 2001,
    director: "Joel Coen & Ethan Coen",
    runtime: 116,
    catalogue: "ARTX-057",
    epigraph: "The Invisible Protagonist.",
    reading:
      "A stark companion to the Coen 'Serious Man' archetype, tracking the invisible protagonist trapped in an administrative death sentence. Its formal risk is achieved through high-contrast monochrome that gives the film the texture of a found artifact. The haunting is derived from cosmic indifference — a life swallowed by a typo in the system, witnessed without comment by a barber who stopped speaking long before the film began.",
    metrics: {
      consensus: 82,
      friction: 31,
      obsession: 76,
      haunting: 94,
      symbolic: 95,
      cult: 81,
      formal: 92,
      voltage: 58,
      accessibility: 42,
    },
    notes: {
      formal: "High-contrast monochrome creates the feel of a found artifact — cinema as forensic document.",
      haunting: "Cosmic indifference produces sustained haunting: no explanation, no relief, no verdict on the universe's silence.",
      cult: "A devotee film — its cult is formed by those who find the Coen 'Serious Man' mode its most rigorous expression.",
    },
    afterlife: [
      { year: 2001, kind: "release", label: "Cannes Best Director for the Coens; muted commercial reception." },
      { year: 2010, kind: "academic", label: "Existentialist readings emerge in Coen retrospectives; neo-noir classification solidified." },
      { year: 2024, kind: "rediscovery", label: "Identified as a companion text to A Serious Man and No Country for Old Men." },
    ],
    factions: [
      { name: "The Existentialists", share: 0.48, voice: ""Ed Crane is the invisible man in all of us. The system ate him quietly."" },
      { name: "The Formalists", share: 0.35, voice: ""The monochrome cinematography is the finest in the Coen catalogue."" },
      { name: "The Underrated Camp", share: 0.17, voice: ""This is their best film and no one talks about it."" },
    ],
    symbols: ["the barber's chair", "the box", "the flying saucer", "the hot dogs", "Doris's typing", "the hair"],
    pos: { x: 0.55, y: 0.18 },
  },
  {
    slug: "a-serious-man-2009",
    title: "A Serious Man",
    year: 2009,
    director: "Joel Coen & Ethan Coen",
    runtime: 106,
    catalogue: "ARTX-058",
    epigraph: "Receive with Simplicity Everything.",
    reading:
      "A masterpiece of unresolved dread in which the systems of religion and physics both fail to deliver clarity. The film's conclusion — the tornado, the failing grade, the phone call arriving simultaneously — is an unauthorized intrusion of chaos that ensures the tension remains active in the cultural subconscious permanently. A definitive treatise on the indifference of the universe and the infinite obligation of the individual who keeps seeking.",
    metrics: {
      consensus: 82,
      friction: 48,
      obsession: 88,
      haunting: 94,
      symbolic: 98,
      cult: 79,
      formal: 85,
      voltage: 81,
      accessibility: 54,
    },
    notes: {
      symbolic: "The density is in the system: Schrödinger's cat and the Dybbuk serve as dual cosmological frameworks that cancel each other.",
      haunting: "The simultaneous tornado and phone call is one of the most deliberately unresolved endings in the catalogue.",
    },
    afterlife: [
      { year: 2009, kind: "release", label: "Festival circuit and limited release; polarized critical reception." },
      { year: 2010, kind: "academic", label: "Jewish theology and Schrödinger's cat readings emerge as the dominant frameworks." },
      { year: 2020, kind: "rediscovery", label: "Pandemic-era uncertainty amplifies the 'indifferent universe' reading significantly." },
      { year: 2024, kind: "academic", label: "Embedded in philosophy and film courses as a study in theological uncertainty." },
    ],
    factions: [
      { name: "The Theologians", share: 0.43, voice: ""It is the most honest film about God since the Book of Job."" },
      { name: "The Existentialists", share: 0.36, voice: ""The universe is indifferent. Larry Gopnik is the proof."" },
      { name: "The Comedians", share: 0.21, voice: ""It is the funniest film I have ever seen. I mean that as a horror statement."" },
    ],
    symbols: ["Schrödinger's cat", "the roof aerial", "the Dybbuk", "the tornado", "the parking lot", "the letter"],
    pos: { x: 0.62, y: 0.52 },
  },
  {
    slug: "primer-2004",
    title: "Primer",
    year: 2004,
    director: "Shane Carruth",
    runtime: 77,
    catalogue: "ARTX-059",
    epigraph: "The Cryptographic Puzzle.",
    reading:
      "Occupies the absolute floor of accessibility, operating as a cryptographic puzzle rather than a conventional narrative. Its symbolic density is effectively its only mode of existence — overlapping timelines so complex that the film has become a benchmark of cinematic difficulty and a community-binding object for those who treat cinema as decryption. Obsessed over as a technical blueprint for the total refusal of audience hand-holding.",
    metrics: {
      consensus: 82,
      friction: 9,
      obsession: 97,
      haunting: 74,
      symbolic: 99,
      cult: 92,
      formal: 94,
      voltage: 52,
      accessibility: 3,
    },
    notes: {
      accessibility: "The absolute floor of accessibility in the catalogue — a deliberate act of formal exclusion.",
      symbolic: "Symbolic density as the film's primary mode of existence; the timeline is the symbol.",
      obsession: "The obsession score is entirely driven by the compulsion to re-watch until understanding arrives — or is abandoned.",
    },
    afterlife: [
      { year: 2004, kind: "release", label: "Sundance Grand Jury Prize; audience bewilderment is immediate." },
      { year: 2008, kind: "academic", label: "Timeline diagrams begin circulating online as collaborative puzzle-solving artifacts." },
      { year: 2013, kind: "rediscovery", label: "Reddit and forum communities canonize it as the benchmark of hard science fiction." },
      { year: 2020, kind: "academic", label: "Embedded in film courses as the reference point for maximal formal opacity." },
    ],
    factions: [
      { name: "The Diagram Builders", share: 0.55, voice: ""I have the timeline on my wall. I still don't fully understand it."" },
      { name: "The Surrendered", share: 0.3, voice: ""I gave up following it and it became a better film."" },
      { name: "The Gatekeepers", share: 0.15, voice: ""If you cannot follow it, it was not made for you."" },
    ],
    symbols: ["the timeline", "the box", "the briefcase", "the failsafe", "the duplicate", "the recording"],
    pos: { x: 0.45, y: 0.08 },
  },
  {
    slug: "2001-a-space-odyssey-1968",
    title: "2001: A Space Odyssey",
    year: 1968,
    director: "Stanley Kubrick",
    runtime: 149,
    catalogue: "ARTX-048",
    epigraph: "The Unauthorized Mental Install.",
    reading:
      "The closest cinema comes to a Rorschach test administered in Cinerama. Its silence speaks louder than most scores; its final sequence has produced more interpretive text than almost any other filmed event. Fifty-eight years on, the mention density shows no decay curve — it functions as a perennial initiation rite into what cinema can do with its face turned away from narrative.",
    metrics: {
      consensus: 98,
      friction: 2,
      obsession: 99,
      haunting: 99,
      symbolic: 100,
      cult: 15,
      formal: 98,
      voltage: 81,
      accessibility: 52,
    },
    notes: {
      symbolic: "The monolith refuses to mean any single thing, guaranteeing infinite symbolic re-entry.",
      cult: "Its low cult score reflects near-universal consecration — it transcended the cult phase into the canon.",
      accessibility: "Deliberate pacing and refusal of expository dialogue form a genuine entry barrier.",
    },
    afterlife: [
      { year: 1968, kind: "release", label: "Roadshow premiere; Kubrick's pacing divides early critics." },
      { year: 1972, kind: "academic", label: "Structuralist readings begin; the monolith enters film-theory canon." },
      { year: 2001, kind: "meme", label: "HAL 9000 voice becomes cultural shorthand for predatory AI." },
      { year: 2018, kind: "reissue", label: "70mm roadshow restoration for the 50th anniversary." },
      { year: 2024, kind: "academic", label: "AI discourse amplifies HAL readings; monolith symbol enters a new cultural wave." },
    ],
    factions: [
      { name: "The Monolith Mystics", share: 0.45, voice: "“It is the only film that makes you feel the scale of geological time.”" },
      { name: "The Structuralists", share: 0.35, voice: "“The four-part structure is cinema grammar at its purest.”" },
      { name: "The Detached", share: 0.2, voice: "“I respect it completely and feel nothing.”" },
    ],
    symbols: ["the monolith", "HAL's red eye", "the star gate", "the Starchild", "the bone weapon", "the pod bay doors"],
    pos: { x: 0.52, y: 0.12 },
  },
  {
    slug: "the-blair-witch-project-1999",
    title: "The Blair Witch Project",
    year: 1999,
    director: "Daniel Myrick & Eduardo Sánchez",
    runtime: 81,
    catalogue: "ARTX-049",
    epigraph: "The Nothingness in the Woods.",
    reading:
      "The first film to weaponize the internet itself as a formal element — the marketing blurred ontological categories months before the credits rolled. Its formal risk lies not in virtuosity but in total subtraction: the threat is never shown, the resolution never given. The corner sequence is one of cinema's most durable trauma-images despite being, literally, nothing.",
    metrics: {
      consensus: 81,
      friction: 50,
      obsession: 94,
      haunting: 96,
      symbolic: 68,
      cult: 92,
      formal: 97,
      voltage: 89,
      accessibility: 79,
    },
    notes: {
      formal: "Formal risk by radical subtraction: no score, no resolution, no monster, no explanation.",
      cult: "Generates passionate partisanship; the 'it's just bad footage' faction persists alongside the devoted.",
      haunting: "The unseen threat produces sustained haunting because the imagination completes the horror.",
    },
    afterlife: [
      { year: 1999, kind: "release", label: "Viral marketing blurs real/fake categories before theatrical release." },
      { year: 1999, kind: "wound", label: "“Is it real?” debate splits critics and audiences at release." },
      { year: 2009, kind: "academic", label: "Found-footage genre codified backward to Blair Witch as ur-text." },
      { year: 2016, kind: "rediscovery", label: "Direct sequel released; original's reputation re-assessed." },
      { year: 2020, kind: "academic", label: "Pandemic-era isolation discourse amplifies the 'unseen threat' reading." },
    ],
    factions: [
      { name: "The Traumatized", share: 0.42, voice: "“The corner. That's it. I never recovered.”" },
      { name: "The Skeptics", share: 0.33, voice: "“Overrated marketing achievement, not a film.”" },
      { name: "The Found Footage Scholars", share: 0.25, voice: "“Everything in the genre traces back to this.”" },
    ],
    symbols: ["the stick figures", "the corner", "the map", "the tape", "the silence", "the woods"],
    pos: { x: 0.22, y: 0.32 },
  },
  {
    slug: "portrait-of-a-lady-on-fire-2019",
    title: "Portrait of a Lady on Fire",
    year: 2019,
    director: "Céline Sciamma",
    runtime: 122,
    catalogue: "ARTX-050",
    epigraph: "The Burning Gaze.",
    reading:
      "The Linguistic Scrapers flag an unusual density of physiological language in its discourse: 'heartbeat,' 'breathless,' 'staring.' Its Orpheus and Eurydice structural system operates as the film's organizing metaphor — looking as loss, the backward glance as choice. As a visual and emotional environment it is still being lived in, not merely referenced.",
    metrics: {
      consensus: 91,
      friction: 6,
      obsession: 88,
      haunting: 74,
      symbolic: 92,
      cult: 44,
      formal: 81,
      voltage: 94,
      accessibility: 85,
    },
    notes: {
      voltage: "Physiological language ('heartbeat', 'breathless') dominates the discourse at an unusual rate.",
      symbolic: "The Orpheus/Eurydice myth operates as an explicit structural and thematic system.",
    },
    afterlife: [
      { year: 2019, kind: "release", label: "Cannes Un Certain Regard win; received to widespread critical acclaim." },
      { year: 2020, kind: "academic", label: "Queer cinema and 'female gaze' theory anchor the dominant reading." },
      { year: 2022, kind: "meme", label: "The 'Burning' sequence becomes a viral reference for physiological cinema." },
      { year: 2024, kind: "academic", label: "Enters film schools as a primary text for gaze theory and period cinema." },
    ],
    factions: [
      { name: "The Devoted", share: 0.51, voice: "“I live inside this film. I return to it to remember how to feel.”" },
      { name: "The Gaze Theorists", share: 0.29, voice: "“The female gaze as political and formal act, not just theme.”" },
      { name: "The Aesthetic Readers", share: 0.2, voice: "“The painterly attention to surface is the entire argument.”" },
    ],
    symbols: ["the burning dress", "the backward glance", "the portrait", "the Eurydice myth", "the fire", "the gaze"],
    pos: { x: 0.88, y: 0.55 },
  },
  {
    slug: "barbarian-2022",
    title: "Barbarian",
    year: 2022,
    director: "Zach Cregger",
    runtime: 102,
    catalogue: "ARTX-051",
    epigraph: "The Rupture at Minute Forty.",
    reading:
      "A structural anomaly whose primary source of friction is a single narrative cut. The film stages a tonal rupture so severe that discourse has permanently bifurcated between those who accept the second half and those who read it as a betrayal of the premise. Its Emotional Voltage is nearly all shock-derived — the film produces a physiological event first and asks for analysis afterward.",
    metrics: {
      consensus: 82,
      friction: 64,
      obsession: 72,
      haunting: 81,
      symbolic: 71,
      cult: 38,
      formal: 88,
      voltage: 96,
      accessibility: 89,
    },
    notes: {
      formal: "The tonal-rupture structure is the film's primary formal gamble — genre implosion by mid-film recontextualization.",
      friction: "Durable discourse bifurcation over whether the second half redeems or destroys the premise.",
      voltage: "Almost entirely shock-derived; the film produces a physiological response before analysis is possible.",
    },
    afterlife: [
      { year: 2022, kind: "release", label: "Surprise release with no spoilers in marketing; immediate box-office success." },
      { year: 2022, kind: "wound", label: "The tonal shift at minute 40 triggers immediate online discourse bifurcation." },
      { year: 2023, kind: "rediscovery", label: "Video essay culture dissects the structural rupture as genre subversion." },
      { year: 2025, kind: "academic", label: "Horror theory courses adopt it as a case study in genre subversion and real-estate metaphor." },
    ],
    factions: [
      { name: "The First-Half Camp", share: 0.38, voice: "“The second half destroyed what the first built.”" },
      { name: "The Genre Subversionists", share: 0.44, voice: "“The rupture is the point. The discomfort is structural.”" },
      { name: "The Thematic Readers", share: 0.18, voice: "“It is an Airbnb film. It is about real estate and who owns fear.”" },
    ],
    symbols: ["the basement", "the tape measure", "the tonal rupture", "the tunnel", "the drain", "the property"],
    pos: { x: 0.72, y: 0.26 },
  },
  {
    slug: "idiocracy-2006",
    title: "Idiocracy",
    year: 2006,
    director: "Mike Judge",
    runtime: 84,
    catalogue: "ARTX-052",
    epigraph: "The Prophetic Inversion.",
    reading:
      "The Friction score is produced almost entirely by temporal delta: in 2006 it was read as broad satire, by 2026 the diaristic record treats it as primary source material. The Linguistic Scrapers find an extraordinary frequency of 'real life,' 'happening now,' and 'they predicted this' in modern Idiocracy discourse. Its Cult Formation slope is nearly vertical — a film buried on release and elevated to prophetic text over two decades.",
    metrics: {
      consensus: 74,
      friction: 88,
      obsession: 96,
      haunting: 58,
      symbolic: 91,
      cult: 98,
      formal: 21,
      voltage: 78,
      accessibility: 95,
    },
    notes: {
      friction: "Friction is entirely temporal: the delta between its 2006 reading (dumb comedy) and 2026 reading (documentary).",
      cult: "Cult Formation slope is near-vertical; buried release to prophetic-text status is the steepest arc in the catalogue.",
      formal: "Low formal risk is part of the argument — it uses the flattest possible form to make its point.",
    },
    afterlife: [
      { year: 2006, kind: "release", label: "Limited release; essentially buried by Fox without promotion." },
      { year: 2008, kind: "rediscovery", label: "Election cycle discourse: 'Idiocracy was right' begins circulating." },
      { year: 2016, kind: "meme", label: "Becomes a primary cultural reference point; Camacho memes peak." },
      { year: 2020, kind: "meme", label: "Brawndo and the presidency become viral language during COVID discourse." },
      { year: 2026, kind: "academic", label: "Media literacy courses use it as a standard text on satire and prophecy." },
    ],
    factions: [
      { name: "The Prophets", share: 0.55, voice: "“This is a documentary. It happened.”" },
      { name: "The Misanthropists", share: 0.28, voice: "“It is shallow, and its contempt for ordinary people is its blind spot.”" },
      { name: "The Political Weaponizers", share: 0.17, voice: "“The left and right both deploy it as evidence of the other side.”" },
    ],
    symbols: ["Brawndo", "the presidency", "Ow My Balls", "the crops", "Camacho", "the time machine"],
    pos: { x: 0.78, y: 0.80 },
  },
];

// Merge curated narrative entries with pipeline-generated entries beyond the curated set.
import generatedData from "../../data/generated/frontend-artifacts.json";

type GeneratedArtifact = {
  slug: string;
  title: string;
  year: number;
  director: string;
  runtime: number;
  catalogue: string;
  metrics: Record<string, number>;
  symbols?: string[];
  factions?: { name: string; share: number; voice: string }[];
  afterlife?: { year?: number; occurredAt?: string; kind: string; label: string; source?: string }[];
};

// Deterministic pseudo-random in [0,1) from a string (for atlas placement of generated entries).
function hash01(seed: string, salt = 0): number {
  let h = 2166136261 ^ salt;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 100000) / 100000;
}

function fillMetrics(m: Record<string, number>, slug: string): Metrics {
  const out = {} as Metrics;
  for (const axis of AXES) {
    const v = m?.[axis.key];
    out[axis.key] =
      typeof v === "number" && v > 0 ? Math.round(v) : Math.round(20 + hash01(slug, axis.key.length) * 60);
  }
  return out;
}

const ALLOWED_KINDS = new Set([
  "release",
  "rejection",
  "rediscovery",
  "criterion",
  "academic",
  "meme",
  "reissue",
  "wound",
]);

function adaptGenerated(g: GeneratedArtifact): Artifact {
  const metrics = fillMetrics(g.metrics ?? {}, g.slug);
  const afterlife: AfterlifeEvent[] =
    g.afterlife && g.afterlife.length > 0
      ? g.afterlife
          .map((e) => {
            const year =
              typeof e.year === "number"
                ? e.year
                : e.occurredAt
                  ? new Date(e.occurredAt).getUTCFullYear()
                  : g.year;
            return {
              year,
              kind: (ALLOWED_KINDS.has(e.kind) ? e.kind : "rediscovery") as AfterlifeEvent["kind"],
              label: (e.label || "").slice(0, 160),
              source: e.source,
            };
          })
          .sort((a, b) => a.year - b.year)
      : [{ year: g.year, kind: "release", label: `${g.title} released.` }];
  const factions: Faction[] =
    g.factions && g.factions.length > 0
      ? g.factions.slice(0, 4).map((f) => ({
          name: f.name || "unnamed cluster",
          share: f.share || 0.25,
          voice: f.voice || "—",
        }))
      : [
          { name: "Provisional readers", share: 0.6, voice: "Pressure signal too sparse to cluster." },
          { name: "The unread", share: 0.4, voice: "No durable interpretive faction has formed." },
        ];
  return {
    slug: g.slug,
    title: g.title,
    year: g.year,
    director: g.director,
    runtime: g.runtime,
    catalogue: g.catalogue,
    epigraph: "—",
    reading:
      `Provisional dossier. Metrics derived from the systematic pipeline (method ${(generatedData as { methodVersion?: string }).methodVersion ?? "v?"}); curatorial reading pending. The shape below is what the open record has produced so far — read it as a draft, not a verdict.`,
    metrics,
    notes: {},
    afterlife,
    factions,
    symbols: (g.symbols ?? []).slice(0, 8),
    pos: {
      x: 0.06 + hash01(g.slug, 1) * 0.88,
      y: 0.08 + hash01(g.slug, 2) * 0.84,
    },
  };
}

const curatedSlugs = new Set(CURATED.map((a) => a.slug));
const generatedExtras: Artifact[] = (generatedData.artifacts as unknown as GeneratedArtifact[])
  .filter((g) => !curatedSlugs.has(g.slug))
  .map(adaptGenerated);

export const ARTIFACTS: Artifact[] = [...CURATED, ...generatedExtras];

export const getArtifact = (slug: string) =>
  ARTIFACTS.find((a) => a.slug === slug);
