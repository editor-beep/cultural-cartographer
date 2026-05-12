import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { ARTIFACTS } from "@/data/artifacts";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/directory")({
  component: Directory,
  head: () => ({
    meta: [
      { title: "Directory — The Artifact Index" },
      {
        name: "description",
        content: "An alphabetical directory of all films in the Artifact Index.",
      },
    ],
  }),
});

type ArtifactListItem = {
  slug: string;
  title: string;
  year: number;
  director: string;
  catalogue: string;
};

function Directory() {
  const sorted = [...ARTIFACTS]
    .map(
      (a): ArtifactListItem => ({
        slug: a.slug,
        title: a.title,
        year: a.year,
        director: a.director,
        catalogue: a.catalogue,
      }),
    )
    .sort((a, b) => a.title.localeCompare(b.title));

  const grouped = sorted.reduce<Record<string, ArtifactListItem[]>>((acc, item) => {
    const first = item.title.trim().charAt(0).toUpperCase();
    const key = /^[A-Z]$/.test(first) ? first : "#";
    acc[key] ??= [];
    acc[key].push(item);
    return acc;
  }, {});

  const letters = Object.keys(grouped).sort((a, b) => {
    if (a === "#") return 1;
    if (b === "#") return -1;
    return a.localeCompare(b);
  });

  return (
    <div className="relative min-h-screen">
      <SiteHeader />
      <section className="relative z-10 mx-auto mt-16 max-w-[1100px] px-8">
        <div className="font-mono text-[10px] smallcaps text-oxblood">Catalogue directory</div>
        <h1 className="mt-3 font-display text-6xl leading-[1.02] text-vellum">A–Z Directory</h1>
        <p className="mt-6 max-w-2xl font-display text-xl italic text-vellum-dim">
          All films currently in the database, grouped alphabetically.
        </p>
        <div className="rule mt-12" />

        <Accordion type="multiple" className="mt-8 w-full">
          {letters.map((letter) => (
            <AccordionItem key={letter} value={letter} className="border-border">
              <AccordionTrigger className="font-display text-2xl text-vellum hover:no-underline">
                <span>{letter}</span>
                <span className="mr-3 font-mono text-[10px] text-vellum-dim smallcaps">
                  {grouped[letter].length} entries
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="divide-y divide-border">
                  {grouped[letter].map((a) => (
                    <li key={a.slug}>
                      <Link
                        to="/artifact/$slug"
                        params={{ slug: a.slug }}
                        className="group grid grid-cols-12 items-baseline gap-4 py-4 transition-colors hover:bg-umber/40"
                      >
                        <div className="col-span-3 font-mono text-[10px] text-vellum-dim smallcaps">
                          {a.catalogue}
                        </div>
                        <div className="col-span-9 font-display text-xl text-vellum group-hover:text-oxblood">
                          {a.title}
                          <span className="ml-3 font-body text-xs text-vellum-dim">
                            {a.year} · {a.director}
                          </span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
      <SiteFooter />
    </div>
  );
}
