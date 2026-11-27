(() => {
  'use strict';
  const key = 'hkOptionalConsent';
  const banner = document.getElementById('cookie-banner');
  const status = document.getElementById('cookie-status');
  const settings = document.querySelector('[data-cookie-settings]');
  let loaded = false;
  let remembered = '';
  let returnFocus;
  try { remembered = localStorage.getItem(key) || ''; } catch { /* Storage may be disabled. */ }
  const enableTracking = () => {
    if (loaded) return;
    loaded = true;
    const template = document.getElementById('optional-tracking');
    template?.content.querySelectorAll('script').forEach(source => {
      const script = document.createElement('script');
      [...source.attributes].forEach(attribute => script.setAttribute(attribute.name, attribute.value));
      script.textContent = source.textContent;
      document.head.append(script);
    });
  };
  const choose = choice => {
    let persisted = true;
    try { localStorage.setItem(key, choice); } catch { persisted = false; }
    banner.hidden = true;
    const focusTarget = returnFocus || document.getElementById('main-content');
    focusTarget?.focus({ preventScroll: true });
    status.textContent = `${choice === 'granted' ? 'Optional scripts allowed.' : 'Optional scripts declined.'}${persisted ? '' : ' Your browser could not save this choice; it applies to this page only.'}`;
    if (choice === 'granted') enableTracking();
    else if (loaded) {
      // Disable known GA IDs immediately; reload to stop all previously enabled scripts.
      // If storage is blocked, explain why a browser reload is still needed.
      document.querySelectorAll('#optional-tracking').forEach(template => {
        template.content.querySelectorAll('script[src]').forEach(source => {
          const url = new URL(source.src);
          const id = url.searchParams.get('id');
          if (id && url.hostname === 'www.googletagmanager.com') window[`ga-disable-${id}`] = true;
        });
      });
      if (persisted) location.reload();
      else status.textContent += ' Reload the page to stop previously enabled scripts. Existing third-party cookies may need clearing in your browser.';
    }
  };
  settings?.addEventListener('click', () => {
    returnFocus = settings;
    banner.hidden = false;
    banner.querySelector('button').focus();
  });
  document.querySelector('[data-cookie-accept]')?.addEventListener('click', () => choose('granted'));
  document.querySelector('[data-cookie-reject]')?.addEventListener('click', () => choose('denied'));
  // Consent changes apply across open tabs, including revocation and storage clearing.
  window.addEventListener('storage', event => {
    if (event.key !== key && event.key !== null) return;
    if (event.key === key && event.newValue === 'granted') {
      banner.hidden = true;
      enableTracking();
    } else if (loaded) {
      location.reload();
    } else {
      banner.hidden = event.key === key && event.newValue === 'denied';
      status.textContent = 'Privacy choices updated in another tab.';
    }
  });
  window.addEventListener('pageshow', event => {
    if (!event.persisted || !loaded) return;
    try { if (localStorage.getItem(key) !== 'granted') location.reload(); } catch { location.reload(); }
  });
  if (remembered === 'granted') enableTracking();
  else if (remembered !== 'denied') banner.hidden = false;
})();
