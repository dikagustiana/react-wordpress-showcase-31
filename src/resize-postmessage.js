export function installAutoResize() {
  const postHeight = () => {
    const h = document.documentElement.scrollHeight || document.body.scrollHeight;
    window.parent?.postMessage({ type: 'DGI_APP_HEIGHT', height: h }, '*');
  };
  ['load','resize'].forEach(evt => window.addEventListener(evt, postHeight));
  const ro = new ResizeObserver(postHeight);
  ro.observe(document.body);
  setInterval(postHeight, 1000);
}
