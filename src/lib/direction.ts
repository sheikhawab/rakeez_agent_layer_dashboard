/**
 * RTL/LTR helpers — driven by i18next language. Avoid scattering
 * `i18n.language === 'ar'` checks across the codebase; use these.
 */

import i18n from '@/i18n'

export type Direction = 'ltr' | 'rtl'

export function getDirection(): Direction {
  return i18n.language === 'ar' ? 'rtl' : 'ltr'
}

export function isRtl(): boolean {
  return getDirection() === 'rtl'
}

/** Pick a value based on current direction. */
export function pickByDir<T>(ltr: T, rtl: T): T {
  return isRtl() ? rtl : ltr
}

/** Sidebar side based on language. LTR=left, RTL=right (mirror). */
export function sidebarSide(): 'left' | 'right' {
  return isRtl() ? 'right' : 'left'
}
