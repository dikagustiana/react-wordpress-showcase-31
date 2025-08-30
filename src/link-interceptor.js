const WP_DOMAIN = process.env.WP_BASE_API || 'https://dikagirawan-liqpb.wpcomstaging.com';

export function installLinkInterceptor() {
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a) return;
    const href = a.getAttribute('href') || '';
    if (href.startsWith('/essay/') || href.startsWith('/excel/')) {
      e.preventDefault();
      window.top.location.href = WP_DOMAIN + href;
    }
  });
}
