import { AXES, type Artifact, type Metrics } from "@/data/artifacts";

const C = {
  ink: "#1c160d",
  vellum: "#d3c7a0",
  vellumDim: "#968b72",
  oxblood: "#742d2d",
  blue: "#5b8db8",
  gold: "#c9a84c",
};

const OVERLAY_STROKE = [C.oxblood, C.blue, C.gold] as const;

function escXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function buildSigilPaths(metrics: Metrics, size: number) {
  const cx = size / 2;
  const cy = size / 2;
  const R = size * 0.4;
  const innerR = size * 0.06;

  const points = AXES.map((axis, i) => {
    const angle = (i / AXES.length) * Math.PI * 2 - Math.PI / 2;
    const v = Math.max(0, Math.min(100, metrics[axis.key])) / 100;
    const r = innerR + (R - innerR) * v;
    return {
      x: cx + Math.cos(angle) * r,
      y: cy + Math.sin(angle) * r,
      ox: cx + Math.cos(angle) * R,
      oy: cy + Math.sin(angle) * R,
      tx1: cx + Math.cos(angle) * (R + 4),
      ty1: cy + Math.sin(angle) * (R + 4),
      tx2: cx + Math.cos(angle) * (R + 10),
      ty2: cy + Math.sin(angle) * (R + 10),
      lx: cx + Math.cos(angle) * (R + 26),
      ly: cy + Math.sin(angle) * (R + 26),
      short: axis.short,
    };
  });

  const pathD =
    points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ") + " Z";

  return { cx, cy, R, innerR, points, pathD };
}

function sigilChrome(cx: number, cy: number, R: number, innerR: number, points: ReturnType<typeof buildSigilPaths>["points"]): string {
  const ringRs = [0.25, 0.5, 0.75, 1].map((f) => innerR + (R - innerR) * f);
  return [
    `<circle cx="${cx}" cy="${cy}" r="${R + 16}" fill="none" stroke="${C.vellum}" stroke-opacity="0.18" stroke-width="0.5"/>`,
    `<circle cx="${cx}" cy="${cy}" r="${R + 14}" fill="none" stroke="${C.vellum}" stroke-opacity="0.1" stroke-width="0.5" stroke-dasharray="1 4"/>`,
    ringRs.map((r, i) => `<circle cx="${cx}" cy="${cy}" r="${r.toFixed(2)}" fill="none" stroke="${C.vellum}" stroke-opacity="${(0.08 + i * 0.02).toFixed(2)}" stroke-width="0.5"/>`).join(""),
    points.map((p) => `<line x1="${cx}" y1="${cy}" x2="${p.ox.toFixed(2)}" y2="${p.oy.toFixed(2)}" stroke="${C.vellum}" stroke-opacity="0.14" stroke-width="0.5"/>`).join(""),
    points.map((p) => `<line x1="${p.tx1.toFixed(2)}" y1="${p.ty1.toFixed(2)}" x2="${p.tx2.toFixed(2)}" y2="${p.ty2.toFixed(2)}" stroke="${C.vellum}" stroke-opacity="0.5" stroke-width="0.6"/>`).join(""),
  ].join("");
}

function buildArtifactSVG(metrics: Metrics, title: string, director: string, year: number): string {
  const W = 560;
  const H = 620;
  const sigilSize = 460;
  const offsetX = (W - sigilSize) / 2;
  const offsetY = 36;

  const { cx, cy, R, innerR, points, pathD } = buildSigilPaths(metrics, sigilSize);
  const chrome = sigilChrome(cx, cy, R, innerR, points);

  const titleSize = Math.min(34, Math.max(14, Math.floor(480 / Math.max(1, title.length * 0.58))));
  const textY = offsetY + sigilSize + 22;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<rect width="${W}" height="${H}" fill="${C.ink}"/>
<line x1="40" y1="22" x2="${W - 40}" y2="22" stroke="${C.vellum}" stroke-opacity="0.15" stroke-width="0.5"/>
<g transform="translate(${offsetX},${offsetY})">
  ${chrome}
  <path d="${pathD}" fill="${C.oxblood}" fill-opacity="0.18" stroke="none"/>
  <path d="${pathD}" fill="none" stroke="${C.oxblood}" stroke-width="1.25" stroke-linejoin="miter"/>
  ${points.map((p) => `<circle cx="${p.x.toFixed(2)}" cy="${p.y.toFixed(2)}" r="1.6" fill="${C.vellum}"/><circle cx="${p.x.toFixed(2)}" cy="${p.y.toFixed(2)}" r="3" fill="none" stroke="${C.vellum}" stroke-opacity="0.4" stroke-width="0.5"/>`).join("")}
  <circle cx="${cx}" cy="${cy}" r="${innerR.toFixed(2)}" fill="${C.ink}" stroke="${C.vellum}" stroke-opacity="0.4" stroke-width="0.5"/>
  <circle cx="${cx}" cy="${cy}" r="${(innerR * 0.45).toFixed(2)}" fill="${C.oxblood}"/>
  ${points.map((p) => `<text x="${p.lx.toFixed(2)}" y="${p.ly.toFixed(2)}" text-anchor="middle" dominant-baseline="middle" font-size="9" font-family="monospace" fill="${C.vellumDim}" letter-spacing="0.18em">${escXml(p.short)}</text>`).join("")}
</g>
<line x1="40" y1="${textY - 6}" x2="${W - 40}" y2="${textY - 6}" stroke="${C.vellum}" stroke-opacity="0.12" stroke-width="0.5"/>
<text x="${W / 2}" y="${textY + titleSize}" text-anchor="middle" font-size="${titleSize}" font-family="Georgia, 'Times New Roman', serif" font-style="italic" fill="${C.vellum}">${escXml(title)}</text>
<text x="${W / 2}" y="${textY + titleSize + 26}" text-anchor="middle" font-size="9" font-family="monospace" fill="${C.vellumDim}" letter-spacing="0.2em">${escXml(director.toUpperCase())}  ·  ${year}</text>
<line x1="40" y1="${H - 26}" x2="${W - 40}" y2="${H - 26}" stroke="${C.vellum}" stroke-opacity="0.15" stroke-width="0.5"/>
<text x="${W / 2}" y="${H - 11}" text-anchor="middle" font-size="7.5" font-family="monospace" fill="${C.vellumDim}" letter-spacing="0.28em" opacity="0.5">THE ARTIFACT INDEX</text>
</svg>`;
}

function buildOverlaySVG(artifacts: Artifact[]): string {
  const W = 560;
  const H = 620;
  const sigilSize = 460;
  const offsetX = (W - sigilSize) / 2;
  const offsetY = 36;

  const { cx, cy, R, innerR, points: chromePoints } = buildSigilPaths(artifacts[0].metrics, sigilSize);
  const chrome = sigilChrome(cx, cy, R, innerR, chromePoints);

  const allPoints = artifacts.map((a) => buildSigilPaths(a.metrics, sigilSize));

  const textY = offsetY + sigilSize + 22;
  const legendItems = artifacts
    .map((a, i) => {
      const lx = W / 2 - ((artifacts.length - 1) * 130) / 2 + i * 130;
      return [
        `<rect x="${(lx - 4).toFixed(0)}" y="${textY + 8}" width="8" height="8" fill="${OVERLAY_STROKE[i]}"/>`,
        `<text x="${lx + 8}" y="${textY + 16}" font-size="10" font-family="Georgia, serif" font-style="italic" fill="${C.vellum}">${escXml(a.title)}</text>`,
      ].join("");
    })
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<rect width="${W}" height="${H}" fill="${C.ink}"/>
<line x1="40" y1="22" x2="${W - 40}" y2="22" stroke="${C.vellum}" stroke-opacity="0.15" stroke-width="0.5"/>
<g transform="translate(${offsetX},${offsetY})">
  ${chrome}
  ${allPoints.map((s, i) => `<path d="${s.pathD}" fill="${OVERLAY_STROKE[i]}" fill-opacity="0.10" stroke="none"/>`).join("")}
  ${allPoints.map((s, i) => `<path d="${s.pathD}" fill="none" stroke="${OVERLAY_STROKE[i]}" stroke-width="1.5" stroke-linejoin="miter"/>`).join("")}
  ${allPoints.map((s, i) => s.points.map((p) => `<circle cx="${p.x.toFixed(2)}" cy="${p.y.toFixed(2)}" r="2" fill="${OVERLAY_STROKE[i]}" opacity="0.85"/>`).join("")).join("")}
  <circle cx="${cx}" cy="${cy}" r="${innerR.toFixed(2)}" fill="${C.ink}" stroke="${C.vellum}" stroke-opacity="0.4" stroke-width="0.5"/>
  <circle cx="${cx}" cy="${cy}" r="${(innerR * 0.45).toFixed(2)}" fill="${C.oxblood}"/>
  ${chromePoints.map((p) => `<text x="${p.lx.toFixed(2)}" y="${p.ly.toFixed(2)}" text-anchor="middle" dominant-baseline="middle" font-size="9" font-family="monospace" fill="${C.vellumDim}" letter-spacing="0.18em">${escXml(p.short)}</text>`).join("")}
</g>
<line x1="40" y1="${textY - 6}" x2="${W - 40}" y2="${textY - 6}" stroke="${C.vellum}" stroke-opacity="0.12" stroke-width="0.5"/>
${legendItems}
<line x1="40" y1="${H - 26}" x2="${W - 40}" y2="${H - 26}" stroke="${C.vellum}" stroke-opacity="0.15" stroke-width="0.5"/>
<text x="${W / 2}" y="${H - 11}" text-anchor="middle" font-size="7.5" font-family="monospace" fill="${C.vellumDim}" letter-spacing="0.28em" opacity="0.5">THE ARTIFACT INDEX</text>
</svg>`;
}

async function svgToPng(svgString: string, W: number, H: number): Promise<Blob> {
  const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = 2;
      const canvas = document.createElement("canvas");
      canvas.width = W * scale;
      canvas.height = H * scale;
      const ctx = canvas.getContext("2d")!;
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0, W, H);
      URL.revokeObjectURL(url);
      canvas.toBlob((pngBlob) => {
        if (pngBlob) resolve(pngBlob);
        else reject(new Error("canvas export failed"));
      }, "image/png");
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("SVG load failed"));
    };
    img.src = url;
  });
}

async function shareOrDownload(blob: Blob, filename: string, shareTitle?: string): Promise<void> {
  const file = new File([blob], filename, { type: "image/png" });
  try {
    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      await navigator.share({ title: shareTitle, files: [file] });
      return;
    }
  } catch (err) {
    if ((err as Error).name === "AbortError") return;
  }
  const a = document.createElement("a");
  const dlUrl = URL.createObjectURL(blob);
  a.href = dlUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(dlUrl), 1000);
}

export async function shareArtifactImage(
  metrics: Metrics,
  title: string,
  director: string,
  year: number,
): Promise<void> {
  const svg = buildArtifactSVG(metrics, title, director, year);
  const png = await svgToPng(svg, 560, 620);
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  await shareOrDownload(png, `${slug}-sigil.png`, title);
}

export async function shareOverlayImage(artifacts: Artifact[]): Promise<void> {
  const svg = buildOverlaySVG(artifacts);
  const png = await svgToPng(svg, 560, 620);
  const names = artifacts.map((a) => a.title).join(" · ");
  await shareOrDownload(png, "overlay-sigil.png", names);
}
