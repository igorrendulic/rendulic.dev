import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { consentKey, readAnalyticsChoice, saveAnalyticsChoice, startAnalytics, stopAnalytics, type AnalyticsChoice } from '@/lib/analytics'

const dismissedKey = 'rendulic.analytics-notice-dismissed'

function shouldShowNotice() {
  if (readAnalyticsChoice() !== null) return false
  try {
    return sessionStorage.getItem(dismissedKey) !== 'true'
  } catch {
    return true
  }
}

export default function AnalyticsConsent() {
  const [open, setOpen] = useState(shouldShowNotice)
  const [editing, setEditing] = useState(false)
  const settings = useRef<HTMLButtonElement>(null)
  const reject = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (readAnalyticsChoice() === 'accepted') startAnalytics()
    else stopAnalytics()
    const syncChoice = (event: StorageEvent) => {
      if (event.key !== consentKey && event.key !== null) return
      const updated = readAnalyticsChoice()
      setOpen(shouldShowNotice())
      if (updated === 'accepted') startAnalytics()
      else if (stopAnalytics()) location.reload()
    }
    window.addEventListener('storage', syncChoice)
    return () => window.removeEventListener('storage', syncChoice)
  }, [])

  useEffect(() => {
    if (open && editing) reject.current?.focus()
  }, [open, editing])

  function close() {
    setOpen(false)
    setEditing(false)
    if (editing) settings.current?.focus()
    else document.getElementById('main')?.focus({ preventScroll: true })
  }

  function dismiss() {
    try {
      sessionStorage.setItem(dismissedKey, 'true')
    } catch {
      // Without storage, dismiss only for this page.
    }
    close()
  }

  function choose(updated: AnalyticsChoice) {
    const saved = saveAnalyticsChoice(updated)
    close()
    if (updated === 'accepted') startAnalytics()
    else if (stopAnalytics() && saved) {
      // Unload Google's event listeners too; the next page stays opted out.
      location.reload()
    }
  }

  return (
    <>
      <button ref={settings} type="button" className="min-h-11 underline underline-offset-4" onClick={() => { setEditing(true); setOpen(true) }}>
        Cookie settings
      </button>
      {open && (
        <section aria-labelledby="analytics-heading" onKeyDown={(event) => { if (event.key === 'Escape') dismiss() }} className="fixed inset-x-3 bottom-3 z-50 max-h-[85svh] overflow-y-auto border-2 bg-background p-3 font-sans text-sm shadow-md sm:right-auto sm:w-80">
          <div className="flex items-center justify-between gap-2">
            <h2 id="analytics-heading" className="font-head text-sm">Analytics cookies</h2>
            <Button variant="ghost" size="icon" onClick={dismiss} aria-label="Dismiss analytics notice" className="-mr-2 -mt-2 min-h-11 min-w-11 text-xl"><span aria-hidden="true">×</span></Button>
          </div>
          <p className="leading-relaxed">Optional Google Analytics. Off unless you accept. Keep browsing, or choose below.</p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Button ref={reject} variant="outline" size="sm" onClick={() => choose('rejected')} aria-label="Reject analytics" className="min-h-11">Reject</Button>
            <Button variant="outline" size="sm" onClick={() => choose('accepted')} aria-label="Accept analytics" className="min-h-11">Accept</Button>
            <a href="/privacy/" className="inline-flex min-h-11 items-center underline underline-offset-4">Privacy</a>
          </div>
        </section>
      )}
    </>
  )
}
