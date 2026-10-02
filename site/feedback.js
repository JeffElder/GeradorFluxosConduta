'use strict';
(() => {
  // Populate using the published Google Form and its prefilled-link field IDs.
  // Keep empty until the form is available and receiving responses.
  const config = {
    formUrl: '',
    protocolField: '',
    stepField: ''
  };
  let url;
  try { url = new URL(config.formUrl); } catch { return; }
  if (url.protocol !== 'https:' || url.hostname !== 'docs.google.com' ||
      !/^\/forms\/d\/(?:e\/)?[^/]+\/viewform$/.test(url.pathname) ||
      !/^entry\.\d+$/.test(config.protocolField) ||
      !/^entry\.\d+$/.test(config.stepField) ||
      config.protocolField === config.stepField) return;

  const style = document.createElement('style');
  style.textContent = `
    .report-error-link {
      position:fixed;right:16px;bottom:calc(16px + env(safe-area-inset-bottom, 0px));
      z-index:50;display:inline-flex;align-items:center;gap:8px;min-height:44px;
      padding:0 16px;border:1px solid #527683;border-radius:999px;
      background:#102e3b;color:#fff;font:600 14px/1.4 system-ui,sans-serif;
      text-decoration:none;box-shadow:0 3px 14px #0003;
    }
    .report-error-link:hover {background:#1c4657;color:#fff;}
    .report-error-link:focus-visible {outline:3px solid #23b798;outline-offset:3px;}
    .workspace {padding-bottom:80px;}
    @media print {.report-error-link {display:none;}}
  `;
  document.head.append(style);
  const link = document.createElement('a');
  link.className = 'report-error-link';
  link.textContent = 'Reportar erro';
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.setAttribute('aria-label', 'Reportar erro — abre formulário em nova aba');

  function updateLink() {
    const root = document.getElementById('consultation');
    if (!root) return;
    const target = new URL(config.formUrl);
    const protocol = root.dataset.feedbackProtocol || 'Página inicial / nenhum protocolo';
    const step = root.dataset.feedbackStep || 'Início';
    target.searchParams.set('usp', 'pp_url');
    target.searchParams.set(config.protocolField, protocol);
    target.searchParams.set(config.stepField, step);
    link.href = target.href;
  }
  const root = document.getElementById('consultation');
  if (!root) return;
  updateLink();
  new MutationObserver(updateLink).observe(root, {
    attributes:true, attributeFilter:['data-feedback-protocol','data-feedback-step']
  });
  link.addEventListener('click', updateLink);
  link.addEventListener('contextmenu', updateLink);
  document.body.append(link);
})();
