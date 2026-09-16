import { useId, useState } from 'react'
import { Button } from '@/components/ui/button'
import './HaloVisionDiagram.css'

// Artwork and 5-second dashed-line animation adapted from https://www.halovision.us/.
export default function HaloVisionDiagram() {
  const arrowId = useId()
  const [paused, setPaused] = useState(false)

  return (
    <figure className="halo-vision-diagram my-8 border-2 bg-white p-4 text-black shadow-md sm:p-6" data-paused={paused}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <span className="text-sm font-bold">How it works, in one picture</span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="min-h-11 motion-reduce:hidden"
          onClick={() => setPaused(!paused)}
        >
          {paused ? 'Play animation' : 'Pause animation'}
        </Button>
      </div>
      <div className="overflow-x-auto" role="region" aria-label="HaloVision workflow diagram, scroll horizontally to explore" tabIndex={0}>
        <svg viewBox="0 0 670 396" role="img" aria-label="Six people, leaders and senior ICs, each in a private conversation with Halo. Halo sends personalized follow-ups back and one picture to the CEO." className="block h-auto w-full min-w-140">
          <defs>
            <marker id={arrowId} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#5B2ED0" />
            </marker>
          </defs>
          <g>
            <rect x="24" y="26" width="168" height="40" rx="12" fill="#FFFFFF" stroke="#D8D3C7" strokeWidth="1" />
            <text x="38" y="44" fontSize="13" fontWeight="600" fill="#15141B">CEO</text>
            <text x="38" y="59" fontSize="10" letterSpacing="0.08em" fill="#625F70">LEADER</text>
            <path d="M 192 46 C 259 46, 259 191, 326 191" fill="none" stroke="#5B2ED0" strokeWidth="1.4" strokeDasharray="4 6" className="halo-conversation-flow" opacity="0.9" />
            <g transform="translate(206 39)">
              <rect width="14" height="14" rx="4" fill="#FFFFFF" stroke="#D8D3C7" />
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#5B2ED0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock" x="2" y="2">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </g>
          </g>
          <g>
            <rect x="24" y="84" width="168" height="40" rx="12" fill="#FFFFFF" stroke="#D8D3C7" strokeWidth="1" />
            <text x="38" y="102" fontSize="13" fontWeight="600" fill="#15141B">CFO</text>
            <text x="38" y="117" fontSize="10" letterSpacing="0.08em" fill="#625F70">LEADER</text>
            <path d="M 192 104 C 259 104, 259 191, 326 191" fill="none" stroke="#5B2ED0" strokeWidth="1.4" strokeDasharray="4 6" className="halo-conversation-flow" opacity="0.9" />
            <g transform="translate(206 97)">
              <rect width="14" height="14" rx="4" fill="#FFFFFF" stroke="#D8D3C7" />
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#5B2ED0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock" x="2" y="2">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </g>
          </g>
          <g>
            <rect x="24" y="142" width="168" height="40" rx="12" fill="#FFFFFF" stroke="#D8D3C7" strokeWidth="1" />
            <text x="38" y="160" fontSize="13" fontWeight="600" fill="#15141B">Regional GM</text>
            <text x="38" y="175" fontSize="10" letterSpacing="0.08em" fill="#625F70">LEADER</text>
            <path d="M 192 162 C 259 162, 259 191, 326 191" fill="none" stroke="#5B2ED0" strokeWidth="1.4" strokeDasharray="4 6" className="halo-conversation-flow" opacity="0.9" />
            <g transform="translate(206 155)">
              <rect width="14" height="14" rx="4" fill="#FFFFFF" stroke="#D8D3C7" />
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#5B2ED0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock" x="2" y="2">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </g>
          </g>
          <g>
            <rect x="24" y="200" width="168" height="40" rx="12" fill="#FFFFFF" stroke="#D8D3C7" strokeWidth="1" />
            <text x="38" y="218" fontSize="13" fontWeight="600" fill="#15141B">VP Sales</text>
            <text x="38" y="233" fontSize="10" letterSpacing="0.08em" fill="#625F70">LEADER</text>
            <path d="M 192 220 C 259 220, 259 191, 326 191" fill="none" stroke="#5B2ED0" strokeWidth="1.4" strokeDasharray="4 6" className="halo-conversation-flow" opacity="0.9" />
            <g transform="translate(206 213)">
              <rect width="14" height="14" rx="4" fill="#FFFFFF" stroke="#D8D3C7" />
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#5B2ED0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock" x="2" y="2">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </g>
          </g>
          <g>
            <rect x="24" y="258" width="168" height="40" rx="12" fill="#EEE9FB" stroke="#5B2ED0" strokeWidth="1" />
            <text x="38" y="276" fontSize="13" fontWeight="600" fill="#15141B">Lead engineer</text>
            <text x="38" y="291" fontSize="10" letterSpacing="0.08em" fill="#5B2ED0">SENIOR IC</text>
            <path d="M 192 278 C 259 278, 259 191, 326 191" fill="none" stroke="#5B2ED0" strokeWidth="1.4" strokeDasharray="4 6" className="halo-conversation-flow" opacity="0.9" />
            <g transform="translate(206 271)">
              <rect width="14" height="14" rx="4" fill="#FFFFFF" stroke="#D8D3C7" />
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#5B2ED0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock" x="2" y="2">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </g>
          </g>
          <g>
            <rect x="24" y="316" width="168" height="40" rx="12" fill="#EEE9FB" stroke="#5B2ED0" strokeWidth="1" />
            <text x="38" y="334" fontSize="13" fontWeight="600" fill="#15141B">Ops controller</text>
            <text x="38" y="349" fontSize="10" letterSpacing="0.08em" fill="#5B2ED0">SENIOR IC</text>
            <path d="M 192 336 C 259 336, 259 191, 326 191" fill="none" stroke="#5B2ED0" strokeWidth="1.4" strokeDasharray="4 6" className="halo-conversation-flow" opacity="0.9" />
            <g transform="translate(206 329)">
              <rect width="14" height="14" rx="4" fill="#FFFFFF" stroke="#D8D3C7" />
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#5B2ED0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock" x="2" y="2">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </g>
          </g>
          <circle cx="372" cy="191" r="60" fill="#EEE9FB" opacity="1" />
          <circle cx="372" cy="191" r="46" fill="#FFFFFF" stroke="#5B2ED0" strokeWidth="1.5" />
          <circle cx="372" cy="191" r="34" fill="none" stroke="#5B2ED0" strokeWidth="2.5" strokeDasharray="150 40" />
          <text x="372" y="196" textAnchor="middle" fontSize="15" fontWeight="600" fill="#15141B">Halo</text>
          <path d="M 362 249 C 252 372, 232 372, 200 358" fill="none" stroke="#625F70" strokeWidth="1.2" strokeDasharray="2 5" markerEnd={`url(#${arrowId})`} />
          <text x="222" y="390" fontSize="11" fill="#625F70">personalized follow-ups, no attribution</text>
          <path d="M 418 191 L 452 191" stroke="#5B2ED0" strokeWidth="2" markerEnd={`url(#${arrowId})`} />
          <g transform="translate(462 129)">
            <rect width="196" height="124" rx="14" fill="#FFFFFF" stroke="#D8D3C7" />
            <text x="14" y="24" fontSize="10" letterSpacing="0.12em" fill="#5B2ED0" fontWeight="600">ONE PICTURE FOR THE CEO</text>
            <text x="14" y="46" fontSize="12" fontWeight="600" fill="#15141B">Where value is leaking</text>
            <rect x="14" y="52" width="118" height="5" rx="2.5" fill="#D97706" />
            <text x="14" y="76" fontSize="12" fontWeight="600" fill="#15141B">Who is talking past whom</text>
            <rect x="14" y="82" width="84" height="5" rx="2.5" fill="#5B2ED0" opacity="0.7" />
            <text x="14" y="106" fontSize="12" fontWeight="600" fill="#15141B">What to decide, and when</text>
            <rect x="14" y="112" width="56" height="5" rx="2.5" fill="#5B2ED0" opacity="0.4" />
          </g>
        </svg>
      </div>
      <figcaption className="mt-4 text-sm leading-relaxed text-muted-foreground">
        Private conversations with leaders and senior contributors inform Halo’s follow-ups
        and a combined picture for the CEO, without attributing individual comments.
        {' '}<a href="https://www.halovision.us/" target="_blank" rel="noopener noreferrer">HaloVision</a>
      </figcaption>
    </figure>
  )
}
