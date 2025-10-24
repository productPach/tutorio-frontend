export function getRegionFromUrl(pathname: string): { slug: string; isRegional: boolean } {
  const parts = pathname.split("/").filter(Boolean);
  const regionalCities = ['spb', 'ekb', 'novosibirsk', 'kazan', 'nn', 'chelyabinsk', /* ... все города из middleware */];
  const seoRoutes = ['tutors', 'subjects', 'about', 'reviews', 'pricing', 'blog', 'docs', 'site-map'];
  
  // Если URL пустой или начинается с региона
  if (parts.length === 0 || regionalCities.includes(parts[0])) {
    const slug = parts.length > 0 ? parts[0] : 'msk';
    return { slug, isRegional: true };
  }
  
  // Если URL начинается с SEO-роута
  if (seoRoutes.includes(parts[0])) {
    return { slug: 'msk', isRegional: true };
  }
  
  return { slug: 'msk', isRegional: false };
}