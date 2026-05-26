/* ═════════════════════════════════════════════════════════════
   YULA INTRO — high-quality SVG candle close-up
   Only the top of the wax + the full flame are visible.
   Pure CSS @keyframes animate everything; JS only injects DOM
   and schedules removal after ~6s (7s hard safety).
   ═════════════════════════════════════════════════════════════ */

export function initLoader(onComplete) {
  const cb = typeof onComplete === 'function' ? onComplete : () => {};

  document.querySelectorAll('#loader, .yula-intro').forEach(el => el.remove());

  const intro = buildIntroDom();
  document.body.appendChild(intro);

  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    try { intro.remove(); } catch {}
    cb();
  };

  const isReturning = sessionStorage.getItem('yula:visited') === '1';
  sessionStorage.setItem('yula:visited', '1');

  if (isReturning) {
    intro.classList.add('yula-intro--returning');
    setTimeout(finish, 750);
  } else {
    setTimeout(finish, 6000);
  }
  // Hard safety
  setTimeout(finish, 7500);
}

function buildIntroDom() {
  const root = document.createElement('div');
  root.className = 'yula-intro';
  root.setAttribute('aria-hidden', 'true');
  root.innerHTML = `
    <div class="yula-intro__dark"   aria-hidden="true"></div>
    <div class="yula-intro__embers" aria-hidden="true"></div>
    <div class="yula-intro__blaze"  aria-hidden="true"></div>

    <div class="yula-intro__candle">
      <svg class="yula-intro__svg" viewBox="0 0 400 800" preserveAspectRatio="xMidYMax meet" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <!-- ────────── WAX (deep red) ────────── -->
          <linearGradient id="yWaxBody" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stop-color="#0E0202"/>
            <stop offset="14%"  stop-color="#5A0A0A"/>
            <stop offset="38%"  stop-color="#C9342A"/>
            <stop offset="52%"  stop-color="#E14C36"/>
            <stop offset="78%"  stop-color="#7A0E0E"/>
            <stop offset="100%" stop-color="#120202"/>
          </linearGradient>
          <radialGradient id="yWaxTop" cx="50%" cy="50%" r="55%">
            <stop offset="0%"   stop-color="#9A1A1A"/>
            <stop offset="65%"  stop-color="#D33828"/>
            <stop offset="100%" stop-color="#3A0606"/>
          </radialGradient>
          <radialGradient id="yWaxRim" cx="50%" cy="0%" r="60%">
            <stop offset="0%"   stop-color="#FFB07A" stop-opacity="0.85"/>
            <stop offset="35%"  stop-color="#D5402A" stop-opacity="0.55"/>
            <stop offset="100%" stop-color="#3A0606" stop-opacity="0"/>
          </radialGradient>
          <radialGradient id="yRecess" cx="50%" cy="50%" r="55%">
            <stop offset="0%"   stop-color="#020000"/>
            <stop offset="60%"  stop-color="#1A0404"/>
            <stop offset="100%" stop-color="#440808"/>
          </radialGradient>

          <!-- ────────── FLAME ────────── -->
          <!-- Big soft outer aura -->
          <radialGradient id="yAura" cx="50%" cy="70%" r="55%">
            <stop offset="0%"   stop-color="#FFC780" stop-opacity="0.95"/>
            <stop offset="25%"  stop-color="#FF8A22" stop-opacity="0.65"/>
            <stop offset="60%"  stop-color="#FF4A0A" stop-opacity="0.32"/>
            <stop offset="100%" stop-color="#3A0800" stop-opacity="0"/>
          </radialGradient>
          <!-- Yellow body of flame -->
          <radialGradient id="yFlameBody" cx="50%" cy="78%" r="50%">
            <stop offset="0%"   stop-color="#FFFCE4"/>
            <stop offset="15%"  stop-color="#FFF5B0"/>
            <stop offset="45%"  stop-color="#FFC044" stop-opacity="0.95"/>
            <stop offset="75%"  stop-color="#FF6A14" stop-opacity="0.7"/>
            <stop offset="100%" stop-color="#FF3400" stop-opacity="0"/>
          </radialGradient>
          <!-- White-hot core -->
          <radialGradient id="yFlameCore" cx="50%" cy="72%" r="42%">
            <stop offset="0%"   stop-color="#FFFFFF"/>
            <stop offset="35%"  stop-color="#FFFCEE"/>
            <stop offset="100%" stop-color="#FFFCEE" stop-opacity="0"/>
          </radialGradient>
          <!-- Cold blue base around wick -->
          <radialGradient id="yFlameBase" cx="50%" cy="50%" r="55%">
            <stop offset="0%"   stop-color="#D6F0FF"/>
            <stop offset="35%"  stop-color="#5DB4FF" stop-opacity="0.95"/>
            <stop offset="80%"  stop-color="#1A3A8A" stop-opacity="0.35"/>
            <stop offset="100%" stop-color="#0A1F4A" stop-opacity="0"/>
          </radialGradient>

          <!-- Filters -->
          <filter id="yAuraBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="14"/>
          </filter>
          <filter id="ySoft" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2"/>
          </filter>
          <filter id="yCoreBlur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="1.2"/>
          </filter>
          <filter id="yWickGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="3"/>
          </filter>
        </defs>

        <!-- ────────── WAX (bottom of frame) ────────── -->
        <g class="yula-intro__wax-group">
          <!-- Side body extends below viewBox so only the top is visible -->
          <rect x="48" y="660" width="304" height="200" fill="url(#yWaxBody)"/>
          <!-- Outer top rim (3D rounded top) -->
          <ellipse cx="200" cy="660" rx="152" ry="32" fill="url(#yWaxTop)"/>
          <!-- Top rim cream highlight (bright crescent) -->
          <ellipse cx="200" cy="648" rx="148" ry="9" fill="url(#yWaxRim)"/>
          <!-- Inner rim shadow line -->
          <ellipse cx="200" cy="662" rx="120" ry="20" fill="#3A0606" opacity="0.85"/>
          <!-- Melted wax recess (dark dip in middle) -->
          <ellipse cx="200" cy="660" rx="100" ry="16" fill="url(#yRecess)"/>
          <!-- Deepest center where wick sits -->
          <ellipse cx="200" cy="662" rx="44" ry="9" fill="#020000"/>
        </g>

        <!-- ────────── WICK ────────── -->
        <g class="yula-intro__wick-group">
          <!-- Wick body, slightly bent -->
          <path d="M 198 662 Q 200 620, 203 580"
                stroke="#0E0301"
                stroke-width="4.5"
                stroke-linecap="round"
                fill="none"/>
          <!-- Burning ember at wick tip -->
          <circle cx="203" cy="580" r="5" fill="#FF8030" opacity="0.9" filter="url(#yWickGlow)"/>
          <circle cx="203" cy="580" r="2.5" fill="#FFE4A0" opacity="0.95"/>
        </g>

        <!-- ────────── FLAME ────────── -->
        <g class="yula-intro__flame">
          <!-- Big soft outer aura (orange halo, heavy blur) -->
          <ellipse class="yula-intro__flame-aura"
                   cx="200" cy="430" rx="170" ry="260"
                   fill="url(#yAura)"
                   filter="url(#yAuraBlur)"/>

          <!-- Yellow flame body — asymmetric tear-drop, slight S-curve -->
          <path class="yula-intro__flame-body"
                d="M 198 130
                   C 152 240, 156 400, 180 520
                   C 192 555, 212 555, 224 520
                   C 246 400, 240 240, 198 130 Z"
                fill="url(#yFlameBody)"
                filter="url(#ySoft)"/>

          <!-- Hot white-yellow core (narrower, taller) -->
          <path class="yula-intro__flame-core"
                d="M 199 210
                   C 182 300, 184 440, 196 510
                   C 200 525, 206 525, 210 510
                   C 222 440, 220 300, 199 210 Z"
                fill="url(#yFlameCore)"
                filter="url(#yCoreBlur)"/>

          <!-- Blue base (cold flame around the wick) -->
          <ellipse class="yula-intro__flame-base"
                   cx="200" cy="568"
                   rx="20" ry="42"
                   fill="url(#yFlameBase)"
                   filter="url(#ySoft)"/>
        </g>
      </svg>
    </div>

    <div class="yula-intro__smoke" aria-hidden="true"></div>

    <h1 class="yula-intro__mark"><em>Y</em>U<em>L</em>A</h1>
    <div class="yula-intro__caption">Design · Studio · İstanbul</div>

    <div class="yula-intro__meta yula-intro__meta--tl">Edition · MMXXVI</div>
    <div class="yula-intro__meta yula-intro__meta--tr">41°00'49"N 28°57'18"E</div>
    <div class="yula-intro__meta yula-intro__meta--bl">YULA — Design Studio</div>
    <div class="yula-intro__meta yula-intro__meta--br">Architecture · Interior</div>
  `;
  return root;
}
