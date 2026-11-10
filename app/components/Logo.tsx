// Logo de la ferme : un soleil au-dessus de deux sillons
export default function Logo() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
      {/* Soleil et rayons */}
      <circle cx="16" cy="13" r="5" fill="#f2c14e" />
      <g stroke="#f2c14e" strokeWidth="2" strokeLinecap="round">
        <line x1="16" y1="2" x2="16" y2="5" />
        <line x1="8.2" y1="5.2" x2="10.3" y2="7.3" />
        <line x1="23.8" y1="5.2" x2="21.7" y2="7.3" />
        <line x1="3" y1="13" x2="6" y2="13" />
        <line x1="26" y1="13" x2="29" y2="13" />
      </g>

      {/* Sillons du champ */}
      <g stroke="white" strokeWidth="2" strokeLinecap="round" fill="none">
        <path d="M3 23 Q16 18 29 23" />
        <path d="M3 28 Q16 23 29 28" />
      </g>
    </svg>
  );
}
