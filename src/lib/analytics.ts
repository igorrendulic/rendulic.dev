export type AnalyticsChoice = 'accepted' | 'rejected'
export const consentKey = 'rendulic.analytics-consent.v1'
const measurementId = 'G-70NFLBGY8H'
const consentLifetime = 180 * 24 * 60 * 60 * 1000
const disableKey = `ga-disable-${measurementId}` as const

declare global {
  interface Window {
    dataLayer?: IArguments[]
    gtag?: (...args: unknown[]) => void
    [disableKey]?: boolean
  }
}

export function readAnalyticsChoice(): AnalyticsChoice | null {
  try {
    const saved = JSON.parse(localStorage.getItem(consentKey) ?? 'null')
    if (!saved || !['accepted', 'rejected'].includes(saved.choice)) return null
    if (typeof saved.savedAt !== 'number' || saved.savedAt > Date.now() || Date.now() - saved.savedAt >= consentLifetime) return null
    return saved.choice
  } catch {
    return null
  }
}

export function saveAnalyticsChoice(choice: AnalyticsChoice): boolean {
  try {
    localStorage.setItem(consentKey, JSON.stringify({ choice, savedAt: Date.now() }))
    return true
  } catch {
    // The choice still applies to this page when storage is unavailable.
    return false
  }
}

export function stopAnalytics(): boolean {
  window[disableKey] = true
  const script = document.getElementById('google-analytics')
  script?.remove()
  // Delete only GA cookies, including cookies set on a parent domain.
  const domains = location.hostname.split('.').map((_, index, parts) => parts.slice(index).join('.'))
  for (const cookie of document.cookie.split(';')) {
    const name = cookie.trim().split('=')[0]
    if (!/^_ga(?:_|$)/.test(name)) continue
    for (const domain of ['', ...domains]) {
      document.cookie = `${name}=; Max-Age=0; Path=/;${domain ? ` Domain=${domain};` : ''}`
    }
  }
  return script !== null
}

export function startAnalytics() {
  if (!import.meta.env.PROD || document.getElementById('google-analytics')) return
  window[disableKey] = false
  window.dataLayer ??= []
  // Google's queue expects Arguments objects, rather than named event objects.
  window.gtag = function () { window.dataLayer!.push(arguments) }
  window.gtag('consent', 'default', {
    analytics_storage: 'granted', ad_storage: 'denied',
    ad_user_data: 'denied', ad_personalization: 'denied',
  })
  window.gtag('js', new Date())
  window.gtag('config', measurementId, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    cookie_expires: 30 * 24 * 60 * 60,
    cookie_update: false,
    // Avoid sending query strings and fragments in the initial page view.
    page_location: `${location.origin}${location.pathname}`,
    page_referrer: document.referrer ? new URL(document.referrer).origin : '',
  })
  const script = document.createElement('script')
  script.id = 'google-analytics'
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
  document.head.append(script)
}
