import Constants from 'expo-constants';

export type Page = { id: number; title: string; title_ar?: string | null; slug: string; cover_image?: string | null; publish_date?: string | null; menu?: { id: number; title: string; title_ar?: string | null; slug: string } | null };
export type PageDetail = Page & { body: string; body_ar?: string | null };
export type Menu = { id: number; parent_id?: number | null; title: string; title_ar?: string | null; slug: string; sort_order?: number; pages?: Page[]; children?: Menu[] };

const configuredUrl = Constants.expoConfig?.extra?.apiUrl as string | undefined;
const API_URL = (process.env.EXPO_PUBLIC_API_URL || configuredUrl || 'http://10.0.2.2:8000/api').replace(/\/$/, '');

function normalizePage(page: Page): Page {
  if (!page.cover_image) return page;

  try {
    const imageUrl = new URL(page.cover_image);
    const apiUrl = new URL(API_URL);
    if (imageUrl.hostname === '127.0.0.1' || imageUrl.hostname === 'localhost') {
      imageUrl.protocol = apiUrl.protocol;
      imageUrl.hostname = apiUrl.hostname;
      imageUrl.port = apiUrl.port;
      return { ...page, cover_image: imageUrl.toString() };
    }
  } catch {
    // Keep malformed or relative URLs unchanged so the image component can handle them.
  }

  return page;
}

function normalizeMenu(menu: Menu): Menu {
  return {
    ...menu,
    pages: Array.isArray(menu.pages) ? menu.pages.map(normalizePage) : [],
    children: Array.isArray(menu.children) ? menu.children.map(normalizeMenu) : [],
  };
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, { ...options, headers: { Accept: 'application/json', ...(options.headers ?? {}) } });
  } catch {
    throw new Error(`Cannot reach the API at ${API_URL}. Check EXPO_PUBLIC_API_URL and that Laravel is running.`);
  }
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || 'The request could not be completed.');
  return payload as T;
}

export async function getPublicMenus() { const response = await request<{ data: Menu[] }>('/public/menus'); return (response.data ?? []).map(normalizeMenu); }
export type PaginatedPages = { data: Page[]; meta?: { current_page: number; last_page: number; total: number } };
export async function getPublicPages({ page = 1, search = '', menuId }: { page?: number; search?: string; menuId?: number } = {}) {
  const params = new URLSearchParams({ page: String(page) });
  if (search.trim()) params.set('search', search.trim());
  if (menuId) params.set('menu_id', String(menuId));
  const response = await request<PaginatedPages>(`/public/pages?${params.toString()}`);
  return { ...response, data: (response.data ?? []).map(normalizePage) };
}
export async function getPublicPage(slug: string) { const response = await request<{ data: PageDetail }>(`/public/pages/${encodeURIComponent(slug)}`); return normalizePage(response.data) as PageDetail; }
