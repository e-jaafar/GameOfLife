const DiscoFavicon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Disco ball base */}
      <circle cx="16" cy="18" r="10" fill="#8b5cf6" />

      {/* Disco ball reflective panels */}
      <path d="M16 8 L16 28" stroke="white" strokeOpacity="0.7" />
      <path d="M11 10 L21 26" stroke="white" strokeOpacity="0.7" />
      <path d="M21 10 L11 26" stroke="white" strokeOpacity="0.7" />
      <path d="M8 18 L24 18" stroke="white" strokeOpacity="0.7" />
      <path d="M10 14 L22 22" stroke="white" strokeOpacity="0.7" />
      <path d="M22 14 L10 22" stroke="white" strokeOpacity="0.7" />

      {/* Hanging string */}
      <path d="M16 8 L16 3" stroke="#8b5cf6" />
      <circle cx="16" cy="3" r="1" fill="#8b5cf6" />

      {/* Light rays */}
      <path d="M16 18 L20 5" stroke="#fed7aa" strokeOpacity="0.7" />
      <path d="M16 18 L28 13" stroke="#a78bfa" strokeOpacity="0.7" />
      <path d="M16 18 L27 20" stroke="#bae6fd" strokeOpacity="0.7" />
      <path d="M16 18 L5 10" stroke="#fda4af" strokeOpacity="0.7" />
      <path d="M16 18 L3 21" stroke="#86efac" strokeOpacity="0.7" />
    </svg>
  );
};

export default DiscoFavicon;
