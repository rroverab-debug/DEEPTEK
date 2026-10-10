// Site-wide scroll animations. Kept deliberately restrained: short fades,
// line reveals and a few scroll-linked effects. Everything here is skipped
// when the visitor prefers reduced motion, and the content is fully usable
// without it.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

const root = document.documentElement;
const EASE = 'power3.out';

function lineReveals() {
  gsap.utils.toArray<HTMLElement>('[data-split]').forEach((el) => {
    const immediate = el.dataset.split === 'now';
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'split-line',
      autoSplit: true,
      aria: 'auto',
      onSplit(self) {
        gsap.set(el, { visibility: 'visible' });
        return gsap.from(self.lines, {
          yPercent: 110,
          duration: 1.1,
          ease: 'power4.out',
          stagger: 0.08,
          delay: immediate ? 0.15 : 0,
          scrollTrigger: immediate ? undefined : { trigger: el, start: 'top 88%', once: true },
        });
      },
    });
  });
}

function fades() {
  gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 28 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: EASE,
        delay: Number(el.dataset.delay ?? 0),
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      },
    );
  });

  gsap.utils.toArray<HTMLElement>('[data-reveal-stagger]').forEach((group) => {
    gsap.fromTo(
      group.children,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: EASE,
        stagger: 0.08,
        scrollTrigger: { trigger: group, start: 'top 88%', once: true },
      },
    );
  });
}

// Words brighten from faint to full as the paragraph scrolls through view.
function progressiveText() {
  gsap.utils.toArray<HTMLElement>('[data-scrub-text]').forEach((el) => {
    SplitText.create(el, {
      type: 'words',
      aria: 'auto',
      autoSplit: true,
      onSplit(self) {
        return gsap.fromTo(
          self.words,
          { opacity: 0.16 },
          {
            opacity: 1,
            ease: 'none',
            stagger: 0.1,
            scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: 0.6 },
          },
        );
      },
    });
  });
}

// Horizontal service rail: pinned and moved sideways on larger screens.
function rails(mm: gsap.MatchMedia) {
  mm.add('(min-width: 64rem) and (prefers-reduced-motion: no-preference)', () => {
    gsap.utils.toArray<HTMLElement>('[data-rail]').forEach((rail) => {
      const viewport = rail.querySelector<HTMLElement>('[data-rail-viewport]');
      const track = rail.querySelector<HTMLElement>('[data-rail-track]');
      const bar = rail.querySelector<HTMLElement>('[data-rail-progress]');
      const count = rail.querySelector<HTMLElement>('[data-rail-count]');
      if (!viewport || !track) return;
      const cards = track.children.length;
      const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
      // Right-to-left pages lay the cards out leftwards, so the track moves the other way.
      const dir = getComputedStyle(rail).direction === 'rtl' ? 1 : -1;

      rail.classList.add('is-pinned');
      const tween = gsap.to(track, {
        x: () => dir * distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: rail,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate(self) {
            if (bar) bar.style.transform = `scaleX(${self.progress})`;
            if (count) {
              const current = Math.min(cards, Math.floor(self.progress * cards) + 1);
              count.textContent = String(current).padStart(2, '0');
            }
          },
        },
      });

      return () => {
        rail.classList.remove('is-pinned');
        tween.scrollTrigger?.kill();
        tween.kill();
        gsap.set(track, { clearProps: 'transform' });
      };
    });
  });
}

// Project images open from a slightly inset frame as they enter.
function showcases() {
  gsap.utils.toArray<HTMLElement>('[data-showcase]').forEach((el) => {
    const media = el.querySelector<HTMLElement>('[data-showcase-media]');
    const inner = el.querySelector<HTMLElement>('[data-showcase-inner]');
    if (!media) return;
    const tl = gsap.timeline({
      scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 35%', scrub: 0.6 },
    });
    tl.fromTo(media, { clipPath: 'inset(10% 8% 10% 8%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none' }, 0);
    if (inner) tl.fromTo(inner, { scale: 1.12 }, { scale: 1, ease: 'none' }, 0);
  });
}

// Product scenes: each [data-step] group plays in order, holds, fades and
// loops. Only runs while the scene is on screen.
function scenes() {
  gsap.utils.toArray<HTMLElement>('[data-scene]').forEach((scene) => {
    const stage = scene.querySelector<HTMLElement>('[data-stage]');
    if (!stage) return;
    const groups = new Map<number, HTMLElement[]>();
    scene.querySelectorAll<HTMLElement>('[data-step]').forEach((el) => {
      const n = Number(el.dataset.step);
      groups.set(n, [...(groups.get(n) ?? []), el]);
    });

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.3, paused: true, defaults: { ease: EASE } });
    tl.fromTo(stage, { opacity: 0 }, { opacity: 1, duration: 0.5 });

    [...groups.keys()]
      .sort((a, b) => a - b)
      .forEach((n) => {
        const at = `>-0.15`;
        groups.get(n)!.forEach((el, i) => {
          const pos = i === 0 ? at : '<0.08';
          const fx = el.dataset.fx;
          if (fx === 'pop') {
            tl.from(el, { opacity: 0, scale: 0.85, duration: 0.45, ease: 'back.out(2)' }, pos);
          } else if (fx === 'wipe') {
            tl.fromTo(
              el,
              { clipPath: 'inset(0 100% 0 0)' },
              { clipPath: 'inset(0 0% 0 0)', duration: 1.6, ease: 'power1.inOut' },
              pos,
            );
          } else if (fx === 'grow-y') {
            tl.from(el, { scaleY: 0, duration: 0.7, ease: 'power2.out' }, pos);
          } else if (fx === 'grow-x') {
            tl.from(el, { scaleX: 0, duration: 0.9, ease: 'power2.inOut' }, pos);
          } else {
            tl.from(el, { opacity: 0, y: 10, duration: 0.55 }, pos);
          }
          // Effects on children that run once their parent is visible.
          el.querySelectorAll<HTMLElement>('[data-fx="type"]').forEach((t) => {
            tl.from(t, { clipPath: 'inset(0 100% 0 0)', duration: 1.3, ease: 'none' }, '>-0.1');
          });
          el.querySelectorAll<HTMLElement>('[data-fx="grow-x"]:not([data-step])').forEach((g) => {
            tl.from(g, { scaleX: 0, duration: 0.9, ease: 'power2.inOut' }, '<');
          });
          el.querySelectorAll<HTMLElement>('[data-fx="grow-y"]').forEach((g, j) => {
            tl.from(g, { scaleY: 0, duration: 0.6, ease: 'power2.out' }, j === 0 ? '<' : '<0.06');
          });
          el.querySelectorAll<SVGElement>('[data-fx="draw"]').forEach((d) => {
            tl.fromTo(d, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.4, ease: 'power1.inOut' }, '<');
          });
          el.querySelectorAll<SVGElement>('[data-fx="fade"]').forEach((f) => {
            tl.from(f, { opacity: 0, duration: 0.8 }, '<0.6');
          });
          el.querySelectorAll<HTMLElement>('[data-fx="count"]').forEach((c) => {
            const to = Number(c.dataset.to ?? c.textContent);
            const decimals = Number(c.dataset.decimals ?? 0);
            const obj = { v: 0 };
            tl.fromTo(
              obj,
              { v: 0 },
              {
                v: to,
                duration: 1.1,
                ease: 'power2.out',
                onUpdate: () => {
                  c.textContent = obj.v.toFixed(decimals);
                },
              },
              '<',
            );
          });
        });
      });

    tl.to({}, { duration: 2.8 });
    tl.to(stage, { opacity: 0, duration: 0.5, ease: 'power1.in' });

    ScrollTrigger.create({
      trigger: scene,
      start: 'top 85%',
      end: 'bottom 10%',
      onToggle: (self) => (self.isActive ? tl.play() : tl.pause()),
    });
  });
}

function parallax() {
  gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
    const amount = Number(el.dataset.parallax || 12);
    gsap.fromTo(
      el,
      { yPercent: -amount / 2 },
      {
        yPercent: amount / 2,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    );
  });
}

function init() {
  const mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    root.classList.add('motion-ok');
    lineReveals();
    fades();
    progressiveText();
    showcases();
    scenes();
    parallax();
  });

  mm.add('(prefers-reduced-motion: reduce)', () => {
    // Show everything immediately if the preference switches mid-visit.
    root.classList.remove('motion-ok');
  });

  rails(mm);
}

// The bundle has loaded, so cancel the head script's failsafe.
root.classList.add('motion-ready');

if (document.fonts?.ready) {
  document.fonts.ready.then(init, init);
} else {
  init();
}
