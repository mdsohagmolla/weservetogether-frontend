/**
 * Decorative header artwork: three volunteers holding hands under a heart,
 * sitting on a soft green cloud with scattered leaves.
 */
export default function CommitmentsArt({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 -36 360 280"
      className={className}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {/* Soft cloud backdrop */}
      <path
        d="M64 244c-33 0-60-24-60-55 0-29 23-53 53-57C64 62 106 2 164 2c30 0 58 12 78 33 19-16 43-26 70-26 50 0 88 34 92 80 26 7 43 30 43 56 0 58-42 99-92 99z"
        fill="#e7f6ec"
      />

      {/* Heart floating above the group */}
      <path
        d="M180 64s-31-17-31-34c0-11 8-18 18-18 7 0 12 4 13 9 1-5 5-9 13-9 10 0 18 7 18 18 0 17-31 34-31 34z"
        fill="#2f9e63"
      />

      {/* Left volunteer */}
      <circle cx="110" cy="110" r="13" fill="#6fc497" />
      <rect x="89" y="144" width="42" height="64" rx="20" fill="#6fc497" />
      <path
        d="M92 158 74 186M128 152 136 112"
        stroke="#6fc497"
        strokeWidth="11"
        strokeLinecap="round"
      />

      {/* Center volunteer */}
      <circle cx="180" cy="92" r="15" fill="#2f9e63" />
      <rect x="156" y="128" width="48" height="80" rx="22" fill="#2f9e63" />
      <path
        d="M162 140 136 112M198 140 224 112"
        stroke="#2f9e63"
        strokeWidth="12"
        strokeLinecap="round"
      />

      {/* Right volunteer */}
      <circle cx="250" cy="110" r="13" fill="#57b98a" />
      <rect x="229" y="144" width="42" height="64" rx="20" fill="#57b98a" />
      <path
        d="M268 158 286 186M232 152 224 112"
        stroke="#57b98a"
        strokeWidth="11"
        strokeLinecap="round"
      />

      {/* Joined hands */}
      <circle cx="136" cy="112" r="6.5" fill="#1f7f4d" />
      <circle cx="224" cy="112" r="6.5" fill="#1f7f4d" />

      {/* Leaves */}
      <path
        d="M21 3C10 3 3 10 3 21c11 0 18-7 18-18Z"
        transform="translate(28 148) rotate(-28) scale(1.7)"
        fill="#8ed9ab"
        opacity="0.75"
      />
      <path
        d="M21 3C10 3 3 10 3 21c11 0 18-7 18-18Z"
        transform="translate(56 196) rotate(38) scale(1.4)"
        fill="#6fc497"
        opacity="0.7"
      />
      <path
        d="M21 3C10 3 3 10 3 21c11 0 18-7 18-18Z"
        transform="translate(316 96) rotate(24) scale(1.8)"
        fill="#8ed9ab"
        opacity="0.75"
      />
      <path
        d="M21 3C10 3 3 10 3 21c11 0 18-7 18-18Z"
        transform="translate(300 168) rotate(-46) scale(1.5)"
        fill="#6fc497"
        opacity="0.65"
      />
    </svg>
  )
}
