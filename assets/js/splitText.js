export function splitChars(el) {
  const text = el.textContent.trim();
  el.textContent = '';
  el.setAttribute('aria-label', text);
  const chars = [];
  for (const char of text) {
    const span = document.createElement('span');
    if (char === ' ') {
      span.innerHTML = '&nbsp;';
      span.style.display = 'inline-block';
      span.style.width = '0.3em';
    } else {
      span.textContent = char;
      span.style.display = 'inline-block';
    }
    span.setAttribute('aria-hidden', 'true');
    span.style.willChange = 'transform, opacity';
    el.appendChild(span);
    chars.push(span);
  }
  return chars;
}

export function splitWords(el) {
  const text = el.textContent.replace(/\s+/g, ' ').trim();
  el.textContent = '';
  el.setAttribute('aria-label', text);
  const words = text.split(' ');
  const spans = [];
  words.forEach((word, i) => {
    const span = document.createElement('span');
    span.textContent = word;
    span.style.display = 'inline-block';
    span.setAttribute('aria-hidden', 'true');
    el.appendChild(span);
    spans.push(span);
    if (i < words.length - 1) {
      el.appendChild(document.createTextNode(' '));
    }
  });
  return spans;
}

export function splitLines(el) {
  const html = el.innerHTML;
  const lines = html.split(/<br\s*\/?>/i);
  el.innerHTML = '';
  const spans = [];
  lines.forEach(lineHTML => {
    const outer = document.createElement('span');
    outer.style.display = 'block';
    outer.style.overflow = 'hidden';
    outer.style.paddingBottom = '0.08em';
    const inner = document.createElement('span');
    inner.style.display = 'inline-block';
    inner.innerHTML = lineHTML;
    inner.style.willChange = 'transform, opacity';
    outer.appendChild(inner);
    el.appendChild(outer);
    spans.push(inner);
  });
  return spans;
}
