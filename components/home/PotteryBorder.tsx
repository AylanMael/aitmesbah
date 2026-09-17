/** Contemporary geometry inspired by regional painted pottery, with subtle micro-interactions. */
export default function PotteryBorder() {
  const motifs = [
    "M8 2 14 8 8 14 2 8Z",
    "M2 5 8 11 14 5M2 9 8 15 14 9",
    "M2 13 8 3 14 13ZM5 13 8 8 11 13",
    "M3 3h10v10H3ZM8 3v10M3 8h10",
    "M3 4h10M3 8h10M3 12h10",
  ];
  return (
    <div className="pottery-border group transition-all duration-300 hover:opacity-80" aria-hidden="true">
      {motifs.map((path, i) => (
        <svg
          key={i}
          viewBox="0 0 16 18"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinejoin="round"
          className="transition-transform duration-300 group-hover:scale-110"
          style={{ transitionDelay: `${i * 40}ms` }}
        >
          <path d={path} />
        </svg>
      ))}
    </div>
  );
}

