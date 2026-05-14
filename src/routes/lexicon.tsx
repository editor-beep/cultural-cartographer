import { createFileRoute } from "@tanstack/react-router";
import { AXES } from "@/data/artifacts";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { SHAPE_BY_AXIS } from "./attune";

export const Route = createFileRoute("/lexicon")({
  component: Lexicon,
  head: () => ({
    meta: [
      { title: "Lexicon — The Artifact Index" },
      {
        name: "description",
        content:
          "The thirteen axes of the Artifact Index, defined as language rather than formula.",
      },
    ],
  }),
});

const DEFINITIONS: Record<(typeof AXES)[number]["key"], { gloss: string; reads: string; warns: string }> = {
  consensus: {
    gloss: "How aligned the public reading is across critic, audience, and diaristic record.",
    reads: "Stable approval across populations. A flat, agreed-upon object.",
    warns: "High consensus is not endorsement. It often marks a work that has been settled — perhaps prematurely.",
  },
  friction: {
    gloss: "The width and durability of disagreement around the work.",
    reads: "Sustained interpretive war. The work refuses to be assimilated.",
    warns: "Distinct from controversy at release. Friction here means the gap is still open years on.",
  },
  obsession: {
    gloss: "Mention density across time, with the recency curve inverted: older works that keep being discussed score higher.",
    reads: "The artifact is being lived with, not consumed and dropped.",
    warns: "Volume alone does not produce this. A film can be famous and unobsessed-over.",
  },
  haunting: {
    gloss: "Frequency of language indicating the work is returning to viewers without invitation: dreams, intrusive memory, unease.",
    reads: "The work has installed something in the reader that they did not authorize.",
    warns: "This is the most superstitiously-named axis. It is also the most consistent across genres.",
  },
  symbolic: {
    gloss: "Density of interpretive activity: theory threads, motif-tracking, disagreement about meaning.",
    reads: "The work is being read as a system, not consumed as a story.",
    warns: "Marvel films can score high consensus and near-zero symbolic density. The two are independent.",
  },
  cult: {
    gloss: "The slope of devotion-formation, especially after institutional rejection.",
    reads: "A reclamation arc; a community that has chosen the work against its initial reception.",
    warns: "Some works are born cult. Others become cult after being abandoned. We do not distinguish.",
  },
  formal: {
    gloss: "Risk taken in form, structure, sound, image — independent of how that risk lands.",
    reads: "The work refused a known shape and chose another.",
    warns: "A film can be formally radical and emotionally inert. This axis says nothing about love.",
  },
  voltage: {
    gloss: "Sustained intensity of reaction, regardless of polarity. Crying, panic, awe, nausea.",
    reads: "The artifact moves bodies. Discussion language is physiological.",
    warns: "Voltage is not quality. A bad work can be high-voltage. We measure the current, not the source.",
  },
  accessibility: {
    gloss: "How available the work is to a viewer arriving without context.",
    reads: "Easy to enter; no glossary required.",
    warns: "Inversely correlated with most other axes here. This is a feature, not a defect.",
  },
  reach: {
    gloss: "How far the work's imagery, references, and language have spread into the general cultural record, beyond dedicated film discourse.",
    reads: "The work has escaped its own medium; it circulates in registers that do not require having seen it.",
    warns: "Reach is not depth. A work can achieve enormous reach on a single image while remaining largely unseen.",
  },
  progeny: {
    gloss: "The density of documented generative influence: how many works explicitly cite it, how many aesthetics it has defined, how often it appears as an originating reference.",
    reads: "The work is not just remembered — it is being inherited.",
    warns: "Influence is frequently uncredited. This measures acknowledged lineage, not silent borrowing.",
  },
  arc: {
    gloss: "The degree to which time has revised the work's initial verdict — not current volume of discussion, but the distance between original and current reading.",
    reads: "The work was not finished at release. Its reputation continued to be written.",
    warns: "Not about current esteem — that is obsession. A well-received film that holds steady scores low. A condemned film that becomes essential scores high.",
  },
  transgression: {
    gloss: "The degree to which the work's content operated at or beyond social, moral, or political limits — independent of its formal choices or interpretive difficulty.",
    reads: "The work was considered dangerous, not merely difficult.",
    warns: "Distinct from formal risk and friction. A formally conventional film can score high transgression. A formally radical film can score near zero.",
  },
};

function Lexicon() {
  return (
    <div className="relative min-h-screen">
      <SiteHeader />
      <section className="relative z-10 mx-auto mt-16 max-w-[1100px] px-8">
        <div className="font-mono text-[10px] smallcaps text-oxblood">Method · v0.1</div>
        <h1 className="mt-3 font-display text-6xl leading-[1.02] text-vellum">
          The thirteen axes.
</h1>
        <p className="mt-6 max-w-2xl font-display text-xl italic text-vellum-dim">
          Each axis is a language before it is a number. The number is a
          summary; the language is the claim. Disagree with the language.
        </p>
        <div className="rule mt-12" />
        <Accordion type="multiple" className="mt-4 w-full">
          {AXES.map((axis, i) => {
            const d = DEFINITIONS[axis.key];
            return (
              <AccordionItem key={axis.key} value={axis.key} className="border-vellum/10">
                <AccordionTrigger className="hover:no-underline py-5 group">
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono text-[10px] text-vellum-dim smallcaps shrink-0">
                      {String(i + 1).padStart(2, "0")} · {axis.short}
                    </span>
                    <span className="font-display text-2xl text-vellum group-hover:underline">
                      {axis.label}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-6">
                  <div className="grid grid-cols-12 gap-8 pl-12">
                    <div className="col-span-12 space-y-3">
                      <p className="font-display text-lg italic text-vellum">{d.gloss}</p>
                      <p className="text-vellum/90">{d.reads}</p>
                      <p className="text-sm text-vellum-dim">— {d.warns}</p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>

        <div className="rule mt-16" />
        <h2 className="mt-10 font-display text-5xl leading-[1.02] text-vellum">
          The viewer shapes.
        </h2>
        <p className="mt-4 max-w-2xl font-display text-xl italic text-vellum-dim">
          Each axis produces an archetype when it dominates a viewer's fingerprint. These are tendencies, not diagnoses.
        </p>
        <Accordion type="multiple" className="mt-8 w-full">
          {AXES.map((axis) => {
            const shape = SHAPE_BY_AXIS[axis.key];
            return (
              <AccordionItem key={axis.key} value={`shape-${axis.key}`} className="border-vellum/10">
                <AccordionTrigger className="hover:no-underline py-5 group">
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono text-[10px] text-vellum-dim smallcaps shrink-0">
                      via {axis.label} · {axis.short}
                    </span>
                    <span className="font-display text-2xl text-vellum group-hover:underline">
                      {shape.name}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-6">
                  <p className="pl-12 text-vellum/90">{shape.description}</p>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </section>
      <SiteFooter />
    </div>
  );
}
