export interface SEOConfig {
  title: string;
  description: string;
  canonicalPath?: string;
  ogType?: string;
  noindex?: boolean;
  structuredData?: object;
}

export function updateSEO({
  title,
  description,
  canonicalPath,
  ogType = 'website',
  noindex = false,
  structuredData,
}: SEOConfig) {
  if (typeof document === 'undefined') return;

  // 1. Update Page Title
  document.title = title;

  // 2. Update Meta Description
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    document.head.appendChild(metaDesc);
  }
  metaDesc.setAttribute('content', description);

  // 3. Update Robots Meta Tag (prevent indexing on 404 or admin pages)
  let robotsTag = document.querySelector('meta[name="robots"]');
  if (!robotsTag) {
    robotsTag = document.createElement('meta');
    robotsTag.setAttribute('name', 'robots');
    document.head.appendChild(robotsTag);
  }
  robotsTag.setAttribute('content', noindex ? 'noindex, nofollow' : 'index, follow');

  // 4. Update Canonical Link & Canonical URL string
  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  const currentOrigin = window.location.origin;
  const canonicalUrl = canonicalPath
    ? `${currentOrigin}${canonicalPath}`
    : window.location.href.split('?')[0];
  canonicalLink.setAttribute('href', canonicalUrl);

  // 5. Update OpenGraph Tags
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', title);

  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', description);

  const ogTypeTag = document.querySelector('meta[property="og:type"]');
  if (ogTypeTag) ogTypeTag.setAttribute('content', ogType);

  let ogUrl = document.querySelector('meta[property="og:url"]');
  if (!ogUrl) {
    ogUrl = document.createElement('meta');
    ogUrl.setAttribute('property', 'og:url');
    document.head.appendChild(ogUrl);
  }
  ogUrl.setAttribute('content', canonicalUrl);

  // 6. Update Twitter Card Tags
  const twTitle = document.querySelector('meta[name="twitter:title"]');
  if (twTitle) twTitle.setAttribute('content', title);

  const twDesc = document.querySelector('meta[name="twitter:description"]');
  if (twDesc) twDesc.setAttribute('content', description);

  let twUrl = document.querySelector('meta[name="twitter:url"]');
  if (!twUrl) {
    twUrl = document.createElement('meta');
    twUrl.setAttribute('name', 'twitter:url');
    document.head.appendChild(twUrl);
  }
  twUrl.setAttribute('content', canonicalUrl);

  // 7. Structured Data (JSON-LD) injection
  if (structuredData) {
    let scriptTag = document.getElementById('dynamic-jsonld') as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'dynamic-jsonld';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(structuredData);
  }
}
