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
    symbols: [
      "the ring",
      "the lodge",
      "electricity",
      "the angel",
      "creamed corn",
      "the photograph",
    ],
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
      {
        year: 2001,
        kind: "release",
        label: "Released after pilot rejection; immediate critical embrace.",
      },
      {
        year: 2010,
        kind: "rediscovery",
        label: "Decade-end polls place it among the canonical works.",
      },
      {
        year: 2016,
        kind: "academic",
        label: "Sight & Sound critics' poll: top ten of the century.",
      },
      { year: 2022, kind: "meme", label: "Club Silencio sequence circulates as TikTok loop." },
    ],
    factions: [
      {
        name: "Dream-Logic Readers",
        share: 0.46,
        voice: "“It is a wish that knows it is a wish.”",
      },
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
      "An immediate domestic event that has become, in seven years, a load-bearing reference point for a generation's grief vocabulary. The pole sequence persists in dreams more than in essays.",
    metrics: {
      consensus: 71,
      friction: 73,
      obsession: 82,
      haunting: 91,
      symbolic: 76,
      cult: 78,
      formal: 84,
      voltage: 95,
      accessibility: 41,
    },
    notes: {
      voltage: "Sustained physiological language: nausea, panic, sleep disruption.",
    },
    afterlife: [
      { year: 2018, kind: "release", label: "Sundance premiere; critical canonization." },
      { year: 2018, kind: "wound", label: "Word-of-mouth becomes a warning." },
      { year: 2021, kind: "meme", label: "The pole; the clucking; the model house." },
      { year: 2024, kind: "academic", label: "Standard text in horror-as-grief syllabi." },
    ],
    factions: [
      {
        name: "The Wounded",
        share: 0.55,
        voice: "“I cannot watch it again. I think about it weekly.”",
      },
      { name: "The Skeptics", share: 0.25, voice: "“Cult mechanics undercut the family drama.”" },
      { name: "The Aesthetes", share: 0.2, voice: "“The miniatures are the film.”" },
    ],
    symbols: ["the model", "the pole", "the treehouse", "decapitation", "the necklace"],
    pos: { x: 0.42, y: 0.78 },
  },
  {
    slug: "synecdoche-new-york",
    title: "Synecdoche, New York",
    year: 2008,
    director: "Charlie Kaufman",
    runtime: 124,
    catalogue: "ARTX-004",
    epigraph: "I will be dying and so will you.",
    reading:
      "Released to confused respect; reread annually by a small, intense readership that does not stop growing. The film is more cited than seen.",
    metrics: {
      consensus: 56,
      friction: 81,
      obsession: 88,
      haunting: 95,
      symbolic: 92,
      cult: 88,
      formal: 88,
      voltage: 85,
      accessibility: 18,
    },
    notes: {},
    afterlife: [
      { year: 2008, kind: "release", label: "Mixed reviews; modest theatrical run." },
      { year: 2012, kind: "rediscovery", label: "Late-night essay form embraces it." },
      { year: 2020, kind: "wound", label: "Pandemic-era viewing surge." },
      { year: 2023, kind: "academic", label: "Mortality-and-form courses adopt it." },
    ],
    factions: [
      { name: "The Mourners", share: 0.62, voice: "“It rehearses dying.”" },
      { name: "The Exhausted", share: 0.23, voice: "“Sad-man maximalism.”" },
      { name: "The Architects", share: 0.15, voice: "“A theory of containers.”" },
    ],
    symbols: ["the warehouse", "the burning house", "millicent weems", "ellen's mother"],
    pos: { x: 0.78, y: 0.55 },
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
      "A film whose production conditions became part of its meaning. Forty years of accumulated symbolic weight; a slow object that has not slowed in cultural metabolism.",
    metrics: {
      consensus: 84,
      friction: 48,
      obsession: 90,
      haunting: 96,
      symbolic: 98,
      cult: 86,
      formal: 95,
      voltage: 70,
      accessibility: 12,
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
      {
        name: "The Self-Annihilators",
        share: 0.5,
        voice: "“It is a film about wanting to dissolve.”",
      },
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
      {
        name: "The Adjani Faithful",
        share: 0.2,
        voice: "“A performance that should not be possible.”",
      },
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
    slug: "blade-runner-1982",
    title: "Blade Runner",
    year: 1982,
    director: "Ridley Scott",
    runtime: 117,
    catalogue: "ARTX-031",
    epigraph: "All those moments will be lost in time, like tears in rain.",
    reading:
      "Forty years ago it was a commercial disappointment and a critical confusion; now it is the foundational text of a genre and the primary template for how cinema imagines the near future. The \u201cDeckard as replicant\u201d debate is not a footnote \u2014 it is the film\u2019s second plot, running in parallel since 1982 and showing no signs of resolution.",
    metrics: {
      consensus: 89,
      friction: 41,
      obsession: 95,
      haunting: 86,
      symbolic: 88,
      cult: 94,
      formal: 82,
      voltage: 76,
      accessibility: 58,
    },
    notes: {
      symbolic: "The Deckard-as-replicant debate: a meta-textual war lasting four decades.",
      haunting:
        "\u201cTears in rain\u201d monologue \u2014 permanent resident in the collective unconscious.",
      accessibility:
        "Pace functions as a gate; the uninitiated exit before the film reveals itself.",
    },
    afterlife: [
      {
        year: 1982,
        kind: "release",
        label: "Opens to mixed reviews and a disappointing box office.",
      },
      {
        year: 1992,
        kind: "reissue",
        label: "Director's Cut restores the unicorn dream; reframes the debate.",
      },
      {
        year: 2007,
        kind: "criterion",
        label: "The Final Cut — Scott's definitive version released.",
      },
      {
        year: 2017,
        kind: "rediscovery",
        label: "Blade Runner 2049 reignites the Deckard question for a new generation.",
      },
    ],
    factions: [
      {
        name: "The Replicant Theorists",
        share: 0.44,
        voice: "\u201cThe unicorn is not ambiguous. The film has always known.\u201d",
      },
      {
        name: "The Empiricists",
        share: 0.29,
        voice: "\u201cDeckard is human. The clues are misdirection.\u201d",
      },
      {
        name: "The Aesthetes",
        share: 0.27,
        voice: "\u201cThe argument is irrelevant. The city is the answer.\u201d",
      },
    ],
    symbols: [
      "tears in rain",
      "the unicorn",
      "the replicant test",
      "the origami",
      "the eyes",
      "the owl",
    ],
    pos: { x: 0.28, y: 0.15 },
  },
  {
    slug: "titanic-1997",
    title: "Titanic",
    year: 1997,
    director: "James Cameron",
    runtime: 194,
    catalogue: "ARTX-032",
    epigraph: "I'll never let go.",
    reading:
      "The rare object that was engineered for totality and achieved it. Its narrative is traditional; its production was a formal gamble at unprecedented scale; its emotional response data is anomalous — physiological sobbing indicators have not degraded across three decades of re-watches. Not a cult object. A shared myth.",
    metrics: {
      consensus: 94,
      friction: 18,
      obsession: 88,
      haunting: 42,
      symbolic: 31,
      cult: 22,
      formal: 45,
      voltage: 98,
      accessibility: 99,
    },
    notes: {
      voltage:
        "Physiological sobbing response documented consistently across decades of re-watches.",
      accessibility:
        "Designed to be parsed by every demographic simultaneously — and it succeeded.",
    },
    afterlife: [
      {
        year: 1997,
        kind: "release",
        label: "Record-breaking box office; cultural saturation from opening weekend.",
      },
      { year: 1998, kind: "academic", label: "Eleven Academy Awards — ties the all-time record." },
      { year: 2012, kind: "reissue", label: "3D re-release marks the centenary of the disaster." },
      { year: 2023, kind: "reissue", label: "25th anniversary theatrical return." },
    ],
    factions: [
      {
        name: "The Weepers",
        share: 0.55,
        voice: "\u201cThe body responds the same way every time. That is not nothing.\u201d",
      },
      {
        name: "The Cynics",
        share: 0.29,
        voice: "\u201cA perfectly engineered machine for producing tears.\u201d",
      },
      {
        name: "The Formalists",
        share: 0.16,
        voice: "\u201cThe iceberg sequences are where the filmmaking lives.\u201d",
      },
    ],
    symbols: ["the necklace", "the door", "the bow", "the iceberg", "the sketch"],
    pos: { x: 0.58, y: 0.82 },
  },
  {
    slug: "mulholland-drive-2001",
    title: "Mulholland Drive",
    year: 2001,
    director: "David Lynch",
    runtime: 147,
    catalogue: "ARTX-033",
    epigraph: "This is the girl.",
    reading:
      "A systematic recomputation of this artifact under the v1 methodology. The symbolic density approaches the ceiling of the index — no other entry in the current batch generates more theory per minute. Its predatory haunting does not diminish with repeated viewing; viewers report the film reinstalling its unease on each return. At the midpoint, linear time is abandoned without announcement.",
    metrics: {
      consensus: 82,
      friction: 34,
      obsession: 79,
      haunting: 97,
      symbolic: 99,
      cult: 81,
      formal: 96,
      voltage: 89,
      accessibility: 24,
    },
    notes: {
      symbolic:
        "Highest symbolic density in the current batch — theory-per-minute approaches the index ceiling.",
      haunting: "Self-reinstalling: the unease does not diminish across viewings.",
      formal:
        "Abandons linear time at the midpoint — the most structurally radical move in this cohort.",
    },
    afterlife: [
      {
        year: 2001,
        kind: "release",
        label: "Palme d'Or-adjacent critical embrace after pilot rejection.",
      },
      { year: 2010, kind: "rediscovery", label: "Decade-end polls canonize it." },
      { year: 2016, kind: "academic", label: "Sight & Sound top ten of the century." },
      { year: 2022, kind: "meme", label: "Club Silencio sequence circulates as a TikTok loop." },
    ],
    factions: [
      {
        name: "The Decoders",
        share: 0.48,
        voice: "\u201cEverything maps. Every object is a key.\u201d",
      },
      {
        name: "The Surrendered",
        share: 0.32,
        voice: "\u201cStop decoding. Let it install itself.\u201d",
      },
      {
        name: "Hollywood-as-Hell",
        share: 0.2,
        voice: "\u201cThe dream factory eating the dreamer.\u201d",
      },
    ],
    symbols: [
      "the blue box",
      "the red curtain",
      "the cowboy",
      "the diner",
      "club silencio",
      "the key",
    ],
    pos: { x: 0.72, y: 0.42 },
  },
  {
    slug: "mean-girls-2004",
    title: "Mean Girls",
    year: 2004,
    director: "Mark Waters",
    runtime: 97,
    catalogue: "ARTX-034",
    epigraph: "That's so fetch.",
    reading:
      "It does not live in dreams; it lives in the mouth. The dialogue has replaced standard English for a measurable population segment — a rare feat that places it alongside advertising copy and scripture as texts that are spoken rather than remembered. Its cultural utility is active and ongoing. It is not nostalgia; it is infrastructure.",
    metrics: {
      consensus: 97,
      friction: 5,
      obsession: 98,
      haunting: 12,
      symbolic: 45,
      cult: 15,
      formal: 11,
      voltage: 72,
      accessibility: 98,
    },
    notes: {
      obsession:
        "Mention density sustained by daily deployment — the dialogue is still in active use.",
      consensus: "Near-universal agreement on its utility as a social tool.",
      accessibility: "Total — no barrier to entry, no prior knowledge required.",
    },
    afterlife: [
      {
        year: 2004,
        kind: "release",
        label: "Immediate cultural saturation; quotation begins on opening weekend.",
      },
      {
        year: 2013,
        kind: "meme",
        label: "\u201cOn Wednesdays we wear pink\u201d enters the calendar as ritual.",
      },
      { year: 2018, kind: "reissue", label: "Broadway musical adaptation." },
      {
        year: 2024,
        kind: "rediscovery",
        label: "Film remake confirms franchise status and renewed quotation cycle.",
      },
    ],
    factions: [
      { name: "The Speakers", share: 0.62, voice: "\u201cI do not quote it. I speak it.\u201d" },
      {
        name: "The Formalists",
        share: 0.24,
        voice: "\u201cTina Fey operating at situation comedy\u2019s highest formal register.\u201d",
      },
      {
        name: "The Nostalgics",
        share: 0.14,
        voice: "\u201cA document of an exact cultural moment that cannot be revisited.\u201d",
      },
    ],
    symbols: ["the burn book", "the plastics", "the halloween costume", "fetch", "october 3rd"],
    pos: { x: 0.08, y: 0.22 },
  },
  {
    slug: "skinamarink-2022",
    title: "Skinamarink",
    year: 2022,
    director: "Kyle Edward Ball",
    runtime: 100,
    catalogue: "ARTX-035",
    epigraph: "Do you want to play?",
    reading:
      "A film made for $15,000 that refuses to behave as a film. It does not tell a story; it administers an address — specifically the memory-frequency of childhood night terrors. Viewers either report nothing or everything. No middle ground has been documented. The formal radicalism is the content: prolonged static, ceilings, the carpet pattern as landscape.",
    metrics: {
      consensus: 31,
      friction: 92,
      obsession: 54,
      haunting: 96,
      symbolic: 77,
      cult: 84,
      formal: 98,
      voltage: 85,
      accessibility: 8,
    },
    notes: {
      accessibility:
        "The lowest of any current entry — formal radicalism requires extraordinary patience.",
      haunting:
        "The highest predatory coefficient in the batch — imagery self-installs without narrative logic.",
      formal: "Tied for the highest formal risk score in this cohort.",
    },
    afterlife: [
      {
        year: 2022,
        kind: "release",
        label: "Fantasia Film Festival premiere; immediate cult formation.",
      },
      {
        year: 2023,
        kind: "rediscovery",
        label: "Shudder release triggers a second wave of discourse.",
      },
      {
        year: 2023,
        kind: "rejection",
        label:
          "\u201cThere is nothing here\u201d vs. \u201cit destroyed me\u201d \u2014 the binary hardens.",
      },
    ],
    factions: [
      {
        name: "The Destroyed",
        share: 0.44,
        voice: "\u201cIt reached something I did not know was still accessible.\u201d",
      },
      {
        name: "The Unmoved",
        share: 0.42,
        voice: "\u201cUnwatchable \u2014 and not in the way that matters.\u201d",
      },
      {
        name: "The Formalists",
        share: 0.14,
        voice: "\u201cA threshold object in the history of horror form.\u201d",
      },
    ],
    symbols: ["the ceiling", "the carpet", "the door", "the tv static", "the voice"],
    pos: { x: 0.45, y: 0.92 },
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
  afterlife?: {
    year?: number;
    occurredAt?: string;
    kind: string;
    label: string;
    source?: string;
  }[];
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
      typeof v === "number" && v > 0
        ? Math.round(v)
        : Math.round(20 + hash01(slug, axis.key.length) * 60);
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
          {
            name: "Provisional readers",
            share: 0.6,
            voice: "Pressure signal too sparse to cluster.",
          },
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
    reading: `Provisional dossier. Metrics derived from the systematic pipeline (method ${(generatedData as { methodVersion?: string }).methodVersion ?? "v?"}); curatorial reading pending. The shape below is what the open record has produced so far — read it as a draft, not a verdict.`,
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

export const getArtifact = (slug: string) => ARTIFACTS.find((a) => a.slug === slug);
