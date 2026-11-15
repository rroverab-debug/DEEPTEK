// Inline SVG artwork for the project demo scenes. No photos: food and ad
// creatives are drawn with gradients and a little noise so they read as
// real imagery at small sizes. Gradients and filters live once in `foodDefs`
// (rendered off-screen in the website scene) and are referenced by id.

export const foodDefs = `<svg class="defs" width="0" height="0" aria-hidden="true" focusable="false">
<defs>
<linearGradient id="fd-wood" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2b1a10"/><stop offset=".55" stop-color="#4a2c19"/><stop offset="1" stop-color="#2a170c"/></linearGradient>
<linearGradient id="fd-slate" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3a3b3f"/><stop offset="1" stop-color="#1f2023"/></linearGradient>
<radialGradient id="fd-plate" cx=".45" cy=".4" r=".6"><stop offset="0" stop-color="#ffffff"/><stop offset=".75" stop-color="#f2eee8"/><stop offset="1" stop-color="#cfc6b9"/></radialGradient>
<radialGradient id="fd-rice" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#ffd978"/><stop offset=".6" stop-color="#eeb24a"/><stop offset="1" stop-color="#c9822a"/></radialGradient>
<radialGradient id="fd-meat" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#d08a52"/><stop offset=".55" stop-color="#9a5328"/><stop offset="1" stop-color="#5e2c12"/></radialGradient>
<radialGradient id="fd-hummus" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#f7e6c4"/><stop offset="1" stop-color="#d5b27a"/></radialGradient>
<radialGradient id="fd-kunafa" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#ffb24d"/><stop offset=".65" stop-color="#e07a1f"/><stop offset="1" stop-color="#a24c0e"/></radialGradient>
<radialGradient id="fd-tea" cx=".35" cy=".3" r=".7"><stop offset="0" stop-color="#d0542a"/><stop offset="1" stop-color="#5e1606"/></radialGradient>
<radialGradient id="fd-bread" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#f0c27e"/><stop offset="1" stop-color="#b9752f"/></radialGradient>
<radialGradient id="fd-shadow" cx=".5" cy=".5" r=".5"><stop offset=".6" stop-color="#000" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<radialGradient id="fd-light" cx=".3" cy=".2" r=".9"><stop offset="0" stop-color="#fff2d6" stop-opacity=".35"/><stop offset="1" stop-color="#000" stop-opacity=".35"/></radialGradient>
<filter id="fd-grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".015 .35" numOctaves="2" seed="4"/><feColorMatrix values="0 0 0 0 .1  0 0 0 0 .05  0 0 0 0 0  0 0 0 .9 -.25"/></filter>
<filter id="fd-speck" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="1" seed="7"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 .95  0 0 0 0 .8  0 0 0 1.6 -.75"/></filter>
</defs>
</svg>`;

const leaf = (x: number, y: number, r: number) =>
  `<ellipse cx="${x}" cy="${y}" rx="2.6" ry="1.2" fill="#4f8a2e" transform="rotate(${r} ${x} ${y})"/><ellipse cx="${x + 0.5}" cy="${y - 0.3}" rx="1.4" ry=".5" fill="#86c25a" opacity=".7" transform="rotate(${r} ${x} ${y})"/>`;

const platter = (cx: number, cy: number, r: number) => {
  const s = r / 30;
  const p = (dx: number, dy: number) => [cx + dx * s, cy + dy * s];
  const meat = [
    [-6, -4, 9, 6.5, -20],
    [7, -6, 7.5, 5.5, 25],
    [2, 7, 8, 5.5, 10],
  ]
    .map(([dx, dy, rx, ry, rot]) => {
      const [x, y] = p(dx, dy);
      return `<ellipse cx="${x}" cy="${y}" rx="${rx * s}" ry="${ry * s}" fill="url(#fd-meat)" transform="rotate(${rot} ${x} ${y})"/>`;
    })
    .join('');
  const nuts = [
    [-14, 6], [12, 10], [-4, -15], [15, -3], [-11, -9],
  ]
    .map(([dx, dy], i) => {
      const [x, y] = p(dx, dy);
      return `<ellipse cx="${x}" cy="${y}" rx="${1.8 * s}" ry="${0.9 * s}" fill="#f4e6c6" transform="rotate(${i * 40} ${x} ${y})"/>`;
    })
    .join('');
  const raisins = [[-16, -2], [9, 15], [17, 4], [-8, 14], [4, -17]]
    .map(([dx, dy]) => {
      const [x, y] = p(dx, dy);
      return `<circle cx="${x}" cy="${y}" r="${1.1 * s}" fill="#3b1a10"/>`;
    })
    .join('');
  const herbs = [[-18, 10, 30], [14, 16, -20], [18, -10, 60], [-12, -16, 10], [-2, 18, 80]]
    .map(([dx, dy, rot]) => {
      const [x, y] = p(dx, dy);
      return leaf(x, y, rot);
    })
    .join('');
  const [lx, ly] = p(16, -17);
  return `<ellipse cx="${cx + 3 * s}" cy="${cy + 4 * s}" rx="${r * 1.12}" ry="${r * 1.1}" fill="url(#fd-shadow)"/>
<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#fd-plate)"/>
<circle cx="${cx}" cy="${cy}" r="${r * 0.86}" fill="none" stroke="#e3dccf" stroke-width="${0.6 * s}"/>
<circle cx="${cx}" cy="${cy}" r="${r * 0.76}" fill="url(#fd-rice)"/>
<circle cx="${cx}" cy="${cy}" r="${r * 0.76}" filter="url(#fd-speck)" opacity=".55"/>
${nuts}${raisins}${meat}${herbs}
<path d="M${lx} ${ly}l${6 * s} ${-4 * s}a${7 * s} ${7 * s} 0 0 1 ${3 * s} ${9 * s}z" fill="#f6e27a" stroke="#e7c94a" stroke-width="${0.4 * s}"/>`;
};

const hummus = (cx: number, cy: number, r: number) => {
  const s = r / 17;
  return `<ellipse cx="${cx + 2 * s}" cy="${cy + 3 * s}" rx="${r * 1.15}" ry="${r * 1.1}" fill="url(#fd-shadow)"/>
<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#fd-plate)"/>
<circle cx="${cx}" cy="${cy}" r="${r * 0.78}" fill="url(#fd-hummus)"/>
<path d="M${cx - 8 * s} ${cy}a${8 * s} ${8 * s} 0 1 1 ${8 * s} ${8 * s}a${5 * s} ${5 * s} 0 1 1 ${-3 * s} ${-9 * s}" fill="none" stroke="#c49a5a" stroke-width="${0.9 * s}" opacity=".7"/>
<circle cx="${cx + 1 * s}" cy="${cy - 1 * s}" r="${3.6 * s}" fill="#c9a227" opacity=".75"/>
<circle cx="${cx + 1 * s}" cy="${cy - 1 * s}" r="${1.4 * s}" fill="#e6c34a" opacity=".8"/>
${[[-5, 5], [5, 4], [-3, -6], [6, -5]].map(([dx, dy]) => `<circle cx="${cx + dx * s}" cy="${cy + dy * s}" r="${1.4 * s}" fill="#e2c084" stroke="#c49a5a" stroke-width="${0.3 * s}"/>`).join('')}
${[[-7, -2], [3, 8], [8, 1], [-1, -9]].map(([dx, dy]) => `<circle cx="${cx + dx * s}" cy="${cy + dy * s}" r="${0.6 * s}" fill="#b5301b"/>`).join('')}
${leaf(cx - 2 * s, cy + 3 * s, 20)}`;
};

const kunafa = (cx: number, cy: number, r: number) => {
  const s = r / 20;
  return `<ellipse cx="${cx + 2 * s}" cy="${cy + 3 * s}" rx="${r * 1.15}" ry="${r * 1.1}" fill="url(#fd-shadow)"/>
<circle cx="${cx}" cy="${cy}" r="${r}" fill="#2b2b2e"/>
<circle cx="${cx}" cy="${cy}" r="${r * 0.86}" fill="url(#fd-kunafa)"/>
<circle cx="${cx}" cy="${cy}" r="${r * 0.86}" filter="url(#fd-speck)" opacity=".5"/>
${[0, 60, 120, 180, 240, 300].map((a) => `<path d="M${cx} ${cy}L${cx + Math.cos((a * Math.PI) / 180) * r * 0.86} ${cy + Math.sin((a * Math.PI) / 180) * r * 0.86}" stroke="#a24c0e" stroke-width="${0.5 * s}" opacity=".6"/>`).join('')}
${[[-4, -3], [3, 5], [6, -4], [-6, 5], [0, 0], [2, -7]].map(([dx, dy]) => `<circle cx="${cx + dx * s}" cy="${cy + dy * s}" r="${1 * s}" fill="#7fb24a"/>`).join('')}`;
};

const tea = (cx: number, cy: number, r: number) =>
  `<ellipse cx="${cx + 1.5}" cy="${cy + 2}" rx="${r * 1.5}" ry="${r * 1.45}" fill="url(#fd-shadow)"/>
<circle cx="${cx}" cy="${cy}" r="${r * 1.35}" fill="url(#fd-plate)"/>
<circle cx="${cx}" cy="${cy}" r="${r}" fill="#f6f1ea" stroke="#d7cdbf" stroke-width=".5"/>
<circle cx="${cx}" cy="${cy}" r="${r * 0.82}" fill="url(#fd-tea)"/>
<ellipse cx="${cx - r * 0.3}" cy="${cy - r * 0.35}" rx="${r * 0.3}" ry="${r * 0.14}" fill="#fff" opacity=".35" transform="rotate(-30 ${cx} ${cy})"/>`;

const bread = (cx: number, cy: number, r: number) =>
  `<ellipse cx="${cx + 2}" cy="${cy + 2.5}" rx="${r * 1.15}" ry="${r * 0.85}" fill="url(#fd-shadow)"/>
<ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r * 0.72}" fill="url(#fd-bread)"/>
${[[-4, -2], [3, 2], [5, -3], [-2, 4], [0, -4]].map(([dx, dy]) => `<ellipse cx="${cx + dx}" cy="${cy + dy}" rx="1.6" ry="1" fill="#8c4a17" opacity=".45"/>`).join('')}`;

const table = (w: number, h: number, kind: 'wood' | 'slate' = 'wood') =>
  `<rect width="${w}" height="${h}" fill="url(#fd-${kind})"/>${kind === 'wood' ? `<rect width="${w}" height="${h}" filter="url(#fd-grain)" opacity=".8"/>` : ''}`;

const light = (w: number, h: number) => `<rect width="${w}" height="${h}" fill="url(#fd-light)"/>`;

/** Wide top-down table shot for the website hero. */
export const heroPhoto = `<svg viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
${table(160, 90)}
${bread(22, 70, 15)}
${platter(98, 46, 34)}
${hummus(146, 18, 15)}
${tea(146, 74, 8)}
${leaf(40, 18, 30)}${leaf(60, 82, -40)}${leaf(130, 44, 70)}
${light(160, 90)}
</svg>`;

/** Close-up shots for the menu cards. */
export const dishPhoto = (kind: string) =>
  `<svg viewBox="0 0 60 44" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
${table(60, 44, kind === 'sweet' ? 'slate' : 'wood')}
${kind === 'rice' ? platter(30, 23, 19) : kind === 'mezze' ? hummus(30, 22, 16) + bread(6, 38, 8) : kunafa(30, 22, 17)}
${light(60, 44)}
</svg>`;

/** Seasonal ad creatives for the campaign scene. */
export const adArt = [
  `<svg viewBox="0 0 60 60" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
<defs><linearGradient id="ad1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0f1838"/><stop offset="1" stop-color="#2a3b7a"/></linearGradient><radialGradient id="ad1g" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffd27a" stop-opacity=".7"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient></defs>
<rect width="60" height="60" fill="url(#ad1)"/>
<circle cx="8" cy="10" r=".7" fill="#fde68a"/><circle cx="52" cy="40" r=".6" fill="#fde68a"/><circle cx="34" cy="6" r=".5" fill="#fde68a"/><circle cx="12" cy="34" r=".5" fill="#fde68a"/>
<circle cx="44" cy="16" r="8" fill="#f6d27a"/><circle cx="47.5" cy="13.5" r="7.2" fill="#15204a"/>
<circle cx="24" cy="30" r="15" fill="url(#ad1g)"/>
<path d="M24 0v15" stroke="#d6a640" stroke-width=".6"/>
<path d="M18.5 18h11l-2 3h-7z" fill="#b8862c"/>
<rect x="19.5" y="21" width="9" height="15" rx="2" fill="#d6a640"/>
<rect x="21.5" y="23" width="5" height="11" rx="2.5" fill="#fff1c4"/>
<path d="M18.5 36h11l-2 3h-7z" fill="#b8862c"/>
<path d="M0 50q8-6 16 0t16 0 16 0 12-2V60H0z" fill="#c8901f"/>
<path d="M0 54q8-5 16 0t16 0 16 0 12-1V60H0z" fill="#a8741a"/>
</svg>`,
  `<svg viewBox="0 0 60 60" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
<defs><linearGradient id="ad2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0d4a4f"/><stop offset="1" stop-color="#127077"/></linearGradient></defs>
<rect width="60" height="60" fill="url(#ad2)"/>
<path d="M10 60V30a20 20 0 0 1 40 0v30" fill="#0b3d41"/>
<path d="M15 60V32a15 15 0 0 1 30 0v28" fill="none" stroke="#e8b84a" stroke-width="1.2"/>
<path d="M30 13l1.8 4.2 4.2 1.8-4.2 1.8-1.8 4.2-1.8-4.2-4.2-1.8 4.2-1.8z" fill="#f2c14e"/>
<circle cx="30" cy="43" r="7" fill="#f7d98b"/><circle cx="32.6" cy="41" r="6.1" fill="#0b3d41"/>
<circle cx="6" cy="8" r=".8" fill="#f2c14e"/><circle cx="54" cy="10" r=".8" fill="#f2c14e"/>
</svg>`,
  `<svg viewBox="0 0 60 60" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
<defs><linearGradient id="ad3" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fbe5d6"/><stop offset="1" stop-color="#f1c6b0"/></linearGradient><linearGradient id="ad3b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d63a76"/><stop offset="1" stop-color="#a3124a"/></linearGradient></defs>
<rect width="60" height="60" fill="url(#ad3)"/>
<ellipse cx="30" cy="51" rx="19" ry="3" fill="#000" opacity=".15"/>
<rect x="15" y="27" width="30" height="23" rx="1.5" fill="url(#ad3b)"/>
<rect x="13" y="21" width="34" height="8" rx="1.5" fill="#e04d86"/>
<rect x="27" y="21" width="6" height="29" fill="#f2c14e"/>
<path d="M30 21c-4-8-12-6-9-1 2 2 6 1 9 1zm0 0c4-8 12-6 9-1-2 2-6 1-9 1z" fill="#f2c14e"/>
<circle cx="10" cy="12" r="1.2" fill="#c8901f"/><circle cx="52" cy="40" r="1" fill="#c8901f"/><circle cx="48" cy="10" r=".8" fill="#c8901f"/>
</svg>`,
];
