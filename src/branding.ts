import { useSyncExternalStore } from 'react';

export type BrandImage = { name: string; dataUrl: string };
export type BrandingSettings = {
  loginBackground: BrandImage | null;
  loginOverlayOpacity: number;
  loginBackgroundPosition: '58% center' | 'center center' | 'left center' | 'right center';
  sidebarColor: string;
  favicon: BrandImage | null;
  loginLogo: BrandImage | null;
  sidebarLogo: BrandImage | null;
  avatarColor: string;
};

export const brandingStorageKey = 'n1-prototype-branding';
export const defaultBranding: BrandingSettings = {
  loginBackground: null,
  loginOverlayOpacity: 40,
  loginBackgroundPosition: '58% center',
  sidebarColor: '#16213e',
  favicon: null,
  loginLogo: null,
  sidebarLogo: null,
  avatarColor: '#efc07b',
};

const imageKeys = ['loginBackground', 'favicon', 'loginLogo', 'sidebarLogo'] as const;
const isColor = (value: unknown): value is string => typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value);
const isImage = (value: unknown): value is BrandImage => value !== null && typeof value === 'object'
  && typeof (value as BrandImage).name === 'string'
  && typeof (value as BrandImage).dataUrl === 'string'
  && /^data:image\/(png|jpeg|webp|x-icon|vnd\.microsoft\.icon);base64,/i.test((value as BrandImage).dataUrl);

export function loadBranding(): BrandingSettings {
  try {
    const stored = JSON.parse(localStorage.getItem(brandingStorageKey) || 'null') as Partial<BrandingSettings> | null;
    if (!stored) return defaultBranding;
    const next = { ...defaultBranding };
    if (isColor(stored.sidebarColor)) next.sidebarColor = stored.sidebarColor;
    if (isColor(stored.avatarColor)) next.avatarColor = stored.avatarColor;
    if (typeof stored.loginOverlayOpacity === 'number' && Number.isFinite(stored.loginOverlayOpacity) && stored.loginOverlayOpacity >= 0 && stored.loginOverlayOpacity <= 80) next.loginOverlayOpacity = stored.loginOverlayOpacity;
    if (stored.loginBackgroundPosition === '58% center' || stored.loginBackgroundPosition === 'center center' || stored.loginBackgroundPosition === 'left center' || stored.loginBackgroundPosition === 'right center') next.loginBackgroundPosition = stored.loginBackgroundPosition;
    for (const key of imageKeys) {
      const image = stored[key];
      if (image === null || isImage(image)) next[key] = image;
    }
    return next;
  } catch {
    return defaultBranding;
  }
}

const listeners = new Set<() => void>();
let current = loadBranding();

function applyBranding(settings: BrandingSettings) {
  document.documentElement.style.setProperty('--brand-sidebar-color', settings.sidebarColor);
  document.documentElement.style.setProperty('--brand-avatar-color', settings.avatarColor);
  const icon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
  if (icon) icon.href = settings.favicon?.dataUrl || new URL('./favicon.ico', document.baseURI).href;
}

applyBranding(current);

export function saveBranding(settings: BrandingSettings) {
  localStorage.setItem(brandingStorageKey, JSON.stringify(settings));
  current = settings;
  applyBranding(current);
  listeners.forEach(listener => listener());
}

if (typeof window !== 'undefined') window.addEventListener('storage', event => {
  if (event.key !== brandingStorageKey) return;
  current = loadBranding();
  applyBranding(current);
  listeners.forEach(listener => listener());
});

export function useBranding() {
  return useSyncExternalStore(listener => { listeners.add(listener); return () => listeners.delete(listener); }, () => current);
}
