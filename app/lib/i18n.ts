import type {I18nBase} from '@shopify/hydrogen';

export interface I18nLocale extends I18nBase {
  pathPrefix: string;
}

export function getLocaleFromRequest(request: Request): I18nLocale {
  const url = new URL(request.url);
  const firstPathPart = url.pathname.split('/')[1]?.toUpperCase() ?? '';

  type I18nFromUrl = [I18nLocale['language'], I18nLocale['country']];

  let pathPrefix = '';
  let [language, country]: I18nFromUrl = ['EN', 'GB'];

  // Check for locale in URL path first
  if (/^[A-Z]{2}-[A-Z]{2}$/i.test(firstPathPart)) {
    pathPrefix = '/' + firstPathPart;
    [language, country] = firstPathPart.split('-') as I18nFromUrl;
    return {language, country, pathPrefix};
  }

  // Fall back to CF-IPCountry header (set automatically by Cloudflare/Oxygen)
  const cfCountry = request.headers.get('CF-IPCountry');
  if (cfCountry && cfCountry !== 'XX') {
    country = cfCountry as I18nLocale['country'];
  }

  return {language, country, pathPrefix};
}