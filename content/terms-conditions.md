---
title: "Terms and Conditions"
layout: "simple"
---

<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Terms and Conditions",
    "url": "https://harikube.info/terms-conditions/",
    "description": "Review the terms and conditions governing the use of HariKube’s platform, services, and website.",
    "publisher": {
        "@type": "Organization",
        "name": "HariKube",
        "url": "https://harikube.info"
    }
}
</script>

<iframe id="tc_frame" src="/pages/terms-conditions-mail.html" style="width: 100%; height:768px;"></iframe>

<script type="text/javascript">
const iframe = document.getElementById('tc_frame');

iframe.onload = function() {
  const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
  const head = iframeDocument.head || iframeDocument.getElementsByTagName('head')[0];
  const style = iframeDocument.createElement('style');

  style.type = 'text/css';
  style.appendChild(iframeDocument.createTextNode(`
    .doc-content {
      max-width: 100% !important;
      padding: 0 !important;
    }
    td {
      width: 50% !important;
    }
  `));

  head.appendChild(style);
};
</script>