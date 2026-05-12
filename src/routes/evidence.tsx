import { createFileRoute } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";

export const Route = createFileRoute("/evidence")({
  component: Evidence,
  head: () => ({
    meta: [
      { title: "Evidence — The Artifact Index" },
      {
        name: "description",
        content:
          "How The Pressure pipeline identifies, categorizes, and validates artifacts of impact across the Nine Axes.",
      },
    ],
  }),
});

const SOURCES = [
  {
    category: "Diaristic Records",
    examples: "Letterboxd, Personal Blogs",
    reason:
      "Captures the raw, \"unauthorized\" emotional response and rewatch frequency.",
  },
  {
    category: "Interpretive Hubs",
    examples: "Reddit (r/movies, r/truefilm), YouTube",
    reason:
      "Essential for SYM (Symbolic Density) and FRC (Friction). We track thread length and theory-crafting.",
  },
  {
    category: "Institutional Records",
    examples: "Metacritic, Rotten Tomatoes, Variety",
    reason:
      "Used primarily to establish the CNS (Consensus) baseline and identify CLT (Cult) reclamation arcs.",
  },
  {
    category: "The Dream-Net",
    examples: 'Specialized forums, Twitter/X, "Explain the Ending" search volume',
    reason:
      "Provides the data for HNT (Haunting). We look for keywords associated with intrusive memory.",
  },
  {
    category: "Technical Archives",
    examples: "American Cinematographer, IMDB Technical Specs",
    reason:
      "Feeds the FRM (Formal Risk) axis. We look for mentions of experimental lenses, unconventional sound design, or structural \"failure.\"",
  },
];

const EXAMPLES = [
  {
    axis: "HNT",
    label: "The Haunting Axis",
    low: '"That movie was scary."',
    high: '"I still see the woman from the room whenever I walk past a red door."',
    reason:
      "It demonstrates Intrusive Memory. The film has installed a \"trigger\" in the viewer's physical environment.",
  },
  {
    axis: "FRC",
    label: "The Friction Axis",
    signal: "Discourse loops.",
    detail:
      "If a film's comment sections involve the same two sides arguing the same point five years later, the FRC score remains high.",
    reason:
      "The work is an \"unsettled object.\" There is no stable cultural account of what the film is.",
  },
  {
    axis: "OBS",
    label: "The Obsession Axis",
    signal: "The Inverted Recency Curve.",
    detail:
      "Most films have a spike of mentions at release and then flatline. OBS evidence is found in the \"Long Tail.\" If people are still making 2-hour video essays about Inception's spinning top in 2026, the obsession value is calculated as a ratio of Time Passed : Mention Density.",
    reason: null,
  },
];

function Evidence() {
  return (
    <div className="relative min-h-screen">
      <SiteHeader />
      <section className="relative z-10 mx-auto mt-16 max-w-[820px] px-8">
        <div className="font-mono text-[10px] smallcaps text-oxblood">
          Method · The Pressure Pipeline
        </div>
        <h1 className="mt-3 font-display text-6xl leading-[1.02] text-vellum">
          Evidence Practice.
        </h1>
        <p className="mt-6 max-w-2xl font-display text-xl italic text-vellum-dim">
          We aren't looking for "reviews." We are looking for{" "}
          <strong className="text-vellum not-italic">artifacts of impact</strong>.
          Evidence isn't a star rating; it's a footprint left by a film as it
          passes through the collective consciousness.
        </p>

        <div className="rule mt-12" />

        {/* Section 1 */}
        <div className="mt-12 space-y-6 text-lg leading-relaxed text-vellum/90">
          <h2 className="font-display text-3xl text-vellum">
            What qualifies as evidence?
          </h2>
          <p>
            Evidence is defined as{" "}
            <em>
              any documented linguistic or behavioral shift that can be traced
              back to a specific film
            </em>
            . We look for three primary markers:
          </p>
          <div className="space-y-5 pl-4 border-l border-vellum/20">
            <div>
              <div className="font-mono text-[10px] smallcaps text-oxblood mb-1">
                Persistence
              </div>
              <p className="text-vellum/80">
                Does the film appear in discourse long after its marketing
                budget has hit zero?
              </p>
            </div>
            <div>
              <div className="font-mono text-[10px] smallcaps text-oxblood mb-1">
                Physiology
              </div>
              <p className="text-vellum/80">
                Does the language used to describe the film involve bodily
                functions?{" "}
                <em>
                  "I felt sick," "I couldn't breathe," "I had dreams about
                  the hallway."
                </em>
              </p>
            </div>
            <div>
              <div className="font-mono text-[10px] smallcaps text-oxblood mb-1">
                Utility
              </div>
              <p className="text-vellum/80">
                Is the film used as a "language" to explain other things?{" "}
                <em>"This situation is very 'The Room' right now."</em>
              </p>
            </div>
          </div>
        </div>

        <div className="rule my-10" />

        {/* Section 2 */}
        <div className="space-y-6 text-lg leading-relaxed text-vellum/90">
          <h2 className="font-display text-3xl text-vellum">
            Where we scrape.
          </h2>
          <p>
            We don't just hit the big sites; we go where the "haunting"
            actually happens.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-vellum/20">
                  <th className="py-3 pr-6 text-left font-mono text-[10px] smallcaps text-vellum-dim font-normal">
                    Source Category
                  </th>
                  <th className="py-3 pr-6 text-left font-mono text-[10px] smallcaps text-vellum-dim font-normal">
                    Specific Examples
                  </th>
                  <th className="py-3 text-left font-mono text-[10px] smallcaps text-vellum-dim font-normal">
                    Why We Use It
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-vellum/10">
                {SOURCES.map((s) => (
                  <tr key={s.category}>
                    <td className="py-4 pr-6 align-top font-display italic text-vellum whitespace-nowrap">
                      {s.category}
                    </td>
                    <td className="py-4 pr-6 align-top text-vellum/70 text-[13px]">
                      {s.examples}
                    </td>
                    <td className="py-4 align-top text-vellum/70 text-[13px]">
                      {s.reason}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rule my-10" />

        {/* Section 3 */}
        <div className="space-y-8 text-lg leading-relaxed text-vellum/90">
          <div>
            <h2 className="font-display text-3xl text-vellum">
              Why it's evidence.
            </h2>
            <p className="mt-4">
              We use a method called{" "}
              <strong className="text-vellum">
                Contextual Sentiment Weighting
              </strong>
              . A mention is only "Evidence" if it meets specific criteria for
              the axis it's feeding.
            </p>
          </div>

          {EXAMPLES.map((ex) => (
            <div key={ex.axis} className="border-l-2 border-oxblood/40 pl-6 space-y-3">
              <div className="font-mono text-[10px] smallcaps text-oxblood">
                {ex.axis} · {ex.label}
              </div>
              {ex.low && (
                <div className="space-y-2">
                  <p className="text-vellum/60 text-base">
                    <span className="font-mono text-[10px] smallcaps mr-2">
                      Low weight:
                    </span>
                    <em>{ex.low}</em> — generic.
                  </p>
                  <p className="text-vellum text-base">
                    <span className="font-mono text-[10px] smallcaps mr-2">
                      High weight:
                    </span>
                    <em>{ex.high}</em>
                  </p>
                </div>
              )}
              {ex.signal && (
                <p className="text-vellum/80">
                  We look for <strong className="text-vellum">{ex.signal}</strong>{" "}
                  {ex.detail}
                </p>
              )}
              {ex.reason && (
                <p className="text-sm text-vellum-dim">
                  — {ex.reason}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="rule my-10" />

        {/* Section 4 */}
        <div className="space-y-6 text-lg leading-relaxed text-vellum/90">
          <h2 className="font-display text-3xl text-vellum">
            The Review Gate.
          </h2>
          <p>
            Because the web is full of noise, every piece of evidence goes
            through a{" "}
            <strong className="text-vellum">
              Confidence Check (0–1)
            </strong>
            :
          </p>
          <div className="space-y-5 pl-4 border-l border-vellum/20">
            <div>
              <div className="font-mono text-[10px] smallcaps text-oxblood mb-1">
                Bot-Filter
              </div>
              <p className="text-vellum/80">
                High-velocity, repetitive phrasing is discarded.
              </p>
            </div>
            <div>
              <div className="font-mono text-[10px] smallcaps text-oxblood mb-1">
                Sarcasm Detection
              </div>
              <p className="text-vellum/80">
                We adjust for "ironic" mentions — vital for CLT and CNS.
              </p>
            </div>
            <div>
              <div className="font-mono text-[10px] smallcaps text-oxblood mb-1">
                Weighting
              </div>
              <p className="text-vellum/80">
                A mention in a peer-reviewed cinema journal carries more
                weight for SYM than a tweet, while a tweet carries more
                weight for VLT (Voltage) if it describes a visceral
                reaction.
              </p>
            </div>
          </div>

          <blockquote className="mt-8 border-l-2 border-oxblood pl-6 font-display italic text-vellum-dim text-lg leading-relaxed">
            By the time a film is "Published" in our database, it means the
            evidence has reached a critical mass where the cultural "shape"
            of the movie is no longer an opinion — it is a measurable fact
            of how people are living with the work.
          </blockquote>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
