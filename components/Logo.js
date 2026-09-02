import Link from 'next/link';

export default function Logo({ size = 'medium', href = '/', className = '' }) {
  // Desktop vs Mobile responsive sizes via inline styles/classes
  return (
    <Link href={href} className={`logo-brand ${className}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
      {/* Plant / Seedling Icon */}
      <svg
        className="logo-icon-svg"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Soil/Stem Base - Dark Brown #5B4636 */}
        <path
          d="M15 28C15 26.3431 16.3431 25 18 25C19.6569 25 21 26.3431 21 28V31C21 31.5523 20.5523 32 20 32H16C15.4477 32 15 31.5523 15 31V28Z"
          fill="#5B4636"
        />
        <path
          d="M18 16V25"
          stroke="#5B4636"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Left Leaf - Vibrant Green #7ED321 */}
        <path
          d="M17.5 19C11.5 19 8 13.5 9.5 8C14.5 8.5 17.5 13 17.5 19Z"
          fill="#7ED321"
        />
        {/* Right Leaf - Teal/Green #19C3A3 */}
        <path
          d="M18.5 16C18.5 9.5 24 5 30 6C29.5 12 24.5 16 18.5 16Z"
          fill="#19C3A3"
        />
        {/* Center Growth Dot / Accent */}
        <circle cx="18" cy="7" r="2.5" fill="#19C3A3" />
      </svg>

      {/* Brand Text */}
      <span className="logo-text">
        <span className="logo-text-growth">Growth</span>
        <span className="logo-text-nest">Nest</span>
      </span>
    </Link>
  );
}
