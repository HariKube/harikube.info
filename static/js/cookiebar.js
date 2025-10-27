const originalCookieSetter = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie') || Object.getOwnPropertyDescriptor(HTMLDocument.prototype, 'cookie');
  
let cookieAllowed = false;

function overrideCookieBlocking() {
  Object.defineProperty(document, 'cookie', {
    configurable: true,
    enumerable: true,
    get: function () {
      return '';
    },
    set: function () {
      if (cookieAllowed) {
        originalCookieSetter.set.apply(document, arguments);
      }
    }
  });
}

function enableCookies() {
  cookieAllowed = true;

  Object.defineProperty(document, 'cookie', originalCookieSetter);

  // Load cookie-using scripts dynamically here
  // Example:
  // var s = document.createElement('script');
  // s.src = "https://www.googletagmanager.com/gtag/js?id=GA-XXXX";
  // document.head.appendChild(s);
}

function acceptCookies() {
  localStorage.setItem('cookieConsent', 'true');
  document.getElementById('cookie-banner').style.display = 'none';
  enableCookies();
}

window.addEventListener('load', () => {
  if (localStorage.getItem('cookieConsent') === 'true') {
    enableCookies();
  } else {
    document.getElementById('cookie-banner').style.display = 'block';
    overrideCookieBlocking();
  }
});