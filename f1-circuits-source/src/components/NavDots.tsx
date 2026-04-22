interface NavDotsProps {
  current: number;
  total: number;
  onDotClick: (idx: number) => void;
}

const labels = ["Intro", "DC Power", "AC Systems", "Hybrid", "Future", "Outro"];

export default function NavDots({ current, total, onDotClick }: NavDotsProps) {
  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onDotClick(i)}
          title={labels[i]}
          className="group flex items-center gap-2 focus:outline-none"
          aria-label={`Go to section ${i + 1}`}
        >
          <span className={`
            text-xs font-mono uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-200
            ${i === current ? 'text-red-500 opacity-100' : 'text-gray-400'}
          `}>
            {labels[i]}
          </span>
          <span
            className={`
              block rounded-full transition-all duration-300
              ${i === current
                ? 'w-3 h-3 bg-red-500 shadow-[0_0_12px_rgba(225,6,0,0.8)]'
                : 'w-2 h-2 bg-gray-600 hover:bg-gray-400'
              }
            `}
          />
        </button>
      ))}
    </div>
  );
}
