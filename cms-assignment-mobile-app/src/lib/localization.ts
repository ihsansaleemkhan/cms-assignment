export type Localized = { title?: string | null; title_ar?: string | null };
export function localizedTitle(item: Localized | null | undefined, isArabic: boolean) { return isArabic ? item?.title_ar || item?.title || '' : item?.title || item?.title_ar || ''; }
