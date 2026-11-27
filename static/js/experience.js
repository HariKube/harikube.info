(() => {
  'use strict';
  document.documentElement.classList.remove('no-js');
  document.querySelectorAll('.prose table').forEach(table => {
    if (table.closest('.highlight, .hk-table-scroll')) return;
    const wrapper = document.createElement('div');
    wrapper.className = 'hk-table-scroll';
    wrapper.tabIndex = 0;
    wrapper.setAttribute('role', 'region');
    wrapper.setAttribute('aria-label', table.caption?.textContent || 'Scrollable data table');
    table.before(wrapper);
    wrapper.append(table);
  });
  document.querySelectorAll('.prose pre').forEach(pre => {
    pre.tabIndex = 0;
    pre.setAttribute('aria-label', 'Code example, horizontally scrollable');
  });
  const mobileButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  const closeMobile = () => {
    if (!mobileMenu || !mobileButton) return;
    mobileMenu.hidden = true;
    mobileButton.setAttribute('aria-expanded', 'false');
  };
  mobileButton?.addEventListener('click', () => {
    mobileMenu.hidden = !mobileMenu.hidden;
    mobileButton.setAttribute('aria-expanded', String(!mobileMenu.hidden));
  });
  mobileMenu?.addEventListener('click', event => { if (event.target.closest('a')) closeMobile(); });
  const desktopMenus = [...document.querySelectorAll('.hk-menu-group')];
  const setOpen = (group, open) => {
    group.toggleAttribute('data-open', open);
    group.querySelector('button').setAttribute('aria-expanded', String(open));
  };
  desktopMenus.forEach(group => {
    const button = group.querySelector('[data-menu-button]');
    button.addEventListener('click', () => setOpen(group, !group.hasAttribute('data-open')));
    group.addEventListener('mouseenter', () => setOpen(group, true));
    group.addEventListener('mouseleave', () => { if (!group.contains(document.activeElement)) setOpen(group, false); });
    group.addEventListener('focusin', event => { if (event.target !== button) setOpen(group, true); });
    group.addEventListener('focusout', event => { if (!group.contains(event.relatedTarget)) setOpen(group, false); });
  });
  document.addEventListener('click', event => {
    desktopMenus.forEach(group => { if (!group.contains(event.target)) setOpen(group, false); });
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    if (mobileMenu && !mobileMenu.hidden) { closeMobile(); mobileButton.focus(); }
    desktopMenus.forEach(group => {
      if (!group.hasAttribute('data-open')) return;
      setOpen(group, false);
      group.querySelector('button').focus();
    });
  });
  matchMedia('(min-width: 768px)').addEventListener('change', closeMobile);
})();
