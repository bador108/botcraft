(function () {
  var script = document.currentScript;
  var botId = script.getAttribute('data-bot-id');
  if (!botId) return;

  var appUrl = new URL(script.src).origin;
  var domain = window.location.hostname;
  var isOpen = false;
  var iframeLoaded = false;

  // Container
  var container = document.createElement('div');
  container.id = 'botcraft-container';
  container.style.cssText =
    'position:fixed;bottom:20px;right:20px;z-index:2147483647;display:flex;flex-direction:column;align-items:flex-end;';

  // Iframe
  var iframe = document.createElement('iframe');
  iframe.src = appUrl + '/widget/' + botId + '?domain=' + encodeURIComponent(domain);
  iframe.allow = 'microphone';
  iframe.style.cssText =
    'display:none;width:380px;height:600px;max-height:80vh;border:none;border-radius:16px;' +
    'box-shadow:0 20px 60px rgba(0,0,0,0.15),0 0 0 1px rgba(0,0,0,0.05);' +
    'margin-bottom:12px;background:#fff;' +
    'transition:opacity 0.2s ease,transform 0.2s ease;opacity:0;transform:translateY(8px) scale(0.98);';

  // Toggle button
  var btn = document.createElement('button');
  btn.style.cssText =
    'width:56px;height:56px;border-radius:50%;border:none;cursor:pointer;' +
    'display:flex;align-items:center;justify-content:center;' +
    'box-shadow:0 4px 16px rgba(0,0,0,0.18);transition:transform 0.2s ease,box-shadow 0.2s ease;' +
    'background:#6366f1;outline:none;';

  var chatSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
  var closeSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

  btn.innerHTML = chatSvg;

  btn.addEventListener('mouseenter', function () {
    btn.style.transform = 'scale(1.08)';
    btn.style.boxShadow = '0 6px 20px rgba(0,0,0,0.22)';
  });
  btn.addEventListener('mouseleave', function () {
    btn.style.transform = 'scale(1)';
    btn.style.boxShadow = '0 4px 16px rgba(0,0,0,0.18)';
  });

  btn.addEventListener('click', function () {
    isOpen = !isOpen;
    if (isOpen) {
      iframe.style.display = 'block';
      requestAnimationFrame(function () {
        iframe.style.opacity = '1';
        iframe.style.transform = 'translateY(0) scale(1)';
      });
      btn.innerHTML = closeSvg;
    } else {
      iframe.style.opacity = '0';
      iframe.style.transform = 'translateY(8px) scale(0.98)';
      setTimeout(function () { iframe.style.display = 'none'; }, 200);
      btn.innerHTML = chatSvg;
    }
  });

  // Receive theme color from iframe
  window.addEventListener('message', function (e) {
    if (e.data && e.data.type === 'botcraft-theme' && e.data.color) {
      btn.style.background = e.data.color;
    }
  });

  // Mobile: full width bottom sheet
  function applyMobile() {
    if (window.innerWidth < 480) {
      container.style.bottom = '0';
      container.style.right = '0';
      container.style.left = '0';
      container.style.alignItems = 'flex-end';
      iframe.style.width = '100%';
      iframe.style.height = (window.innerHeight - 76) + 'px';
      iframe.style.maxHeight = 'none';
      iframe.style.borderRadius = '16px 16px 0 0';
      iframe.style.marginBottom = '0';
      btn.style.marginRight = '16px';
      btn.style.marginBottom = '12px';
    } else {
      container.style.bottom = '20px';
      container.style.right = '20px';
      container.style.left = '';
      iframe.style.width = '380px';
      iframe.style.height = '600px';
      iframe.style.maxHeight = '80vh';
      iframe.style.borderRadius = '16px';
      iframe.style.marginBottom = '12px';
      btn.style.marginRight = '';
      btn.style.marginBottom = '';
    }
  }

  applyMobile();
  window.addEventListener('resize', applyMobile);

  container.appendChild(iframe);
  container.appendChild(btn);
  document.body.appendChild(container);
})();
