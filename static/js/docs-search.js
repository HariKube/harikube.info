(() => {
  'use strict';
  let indexPromise;
  const normalize = value => value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  document.querySelectorAll('[data-doc-search]').forEach(search => {
    const input = search.querySelector('input');
    const status = search.querySelector('[role=status]');
    const results = search.querySelector('ul');
    let timer;
    let generation = 0;
    input.disabled = false;
    status.textContent = 'Search docs, features, guides and articles. Enter at least 2 characters.';
    input.addEventListener('input', () => {
      clearTimeout(timer);
      const current = ++generation;
      const query = normalize(input.value.trim());
      results.replaceChildren();
      results.hidden = true;
      if (query.length < 2) {
        status.textContent = 'Enter at least 2 characters to search.';
        return;
      }
      status.textContent = 'Searching…';
      timer = setTimeout(async () => {
        try {
          indexPromise ||= fetch(search.dataset.index).then(response => {
            if (!response.ok) throw new Error('Search index unavailable');
            return response.json();
          }).then(pages => pages.map(page => ({ ...page,
            titleText: normalize(page.title),
            summaryText: normalize(page.description),
            bodyText: normalize(page.content)
          }))).catch(error => { indexPromise = undefined; throw error; });
          const pages = await indexPromise;
          if (current !== generation) return;
          const words = query.split(/\s+/).slice(0, 12);
          const matches = pages.map(page => ({ page, score: words.reduce((score, word) =>
            score + (page.titleText.includes(word) ? 8 : 0) + (page.summaryText.includes(word) ? 3 : 0) + (page.bodyText.includes(word) ? 1 : 0), 0)
          })).filter(({ page }) => words.every(word => (page.titleText + ' ' + page.summaryText + ' ' + page.bodyText).includes(word)))
            .sort((a, b) => b.score - a.score || a.page.title.localeCompare(b.page.title));
          matches.slice(0, 10).forEach(({ page }) => {
            const url = new URL(page.url, location.href);
            if (url.origin !== location.origin || !['https:', 'http:'].includes(url.protocol)) return;
            const item = document.createElement('li');
            const link = document.createElement('a');
            link.href = url.href;
            link.textContent = page.title;
            const summary = document.createElement('small');
            summary.textContent = `${page.section} · ${page.description}`;
            link.append(summary);
            item.append(link);
            results.append(item);
          });
          results.hidden = !results.children.length;
          status.textContent = matches.length ? `${matches.length} results. Showing up to 10. Tab to browse the links.` : 'No results. Try a broader term or browse the links below.';
        } catch {
          if (current !== generation) return;
          status.textContent = 'Search is temporarily unavailable. Browse the documentation links below or try again.';
        }
      }, 120);
    });
    input.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        input.value = '';
        input.dispatchEvent(new Event('input'));
      }
    });
  });
})();
