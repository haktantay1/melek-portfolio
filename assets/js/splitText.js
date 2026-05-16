// Vanilla JS replacement for GSAP SplitText (Club plugin)
export function splitChars(el) {
  const text = el.textContent;
  el.textContent = '';
  el.setAttribute('aria-label', text);
  return [...text].map(char => {
    const span = document.createElement('span');
    span.textContent = char === ' ' ? ' ' : char;
    span.style.display = 'inline-block';
    span.setAttribute('aria-hidden', 'true');
    el.appendChild(span);
    return span;
  });
}

export function splitWords(el) {
  const text = el.textContent;
  el.textContent = '';
  const words = text.split(/\s+/);
  return words.map((word, i) => {
    const span = document.createElement('span');
    span.textContent = word;
    span.style.display = 'inline-block';
    el.appendChild(span);
    if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
    return span;
  });
}

export function splitLines(el) {
  const text = el.textContent;
  const span = document.createElement('span');
  span.textContent = text;
  span.style.display = 'block';
  span.style.overflow = 'hidden';
  el.textContent = '';
  el.appendChild(span);
  return [span];
}
