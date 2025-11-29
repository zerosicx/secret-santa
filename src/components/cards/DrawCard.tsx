import { memo } from 'react';
import { Participant } from '../../types';

interface DrawCardProps {
  participant: Participant;
  onDraw: (id: string) => void;
}

export const DrawCard = memo(({ participant, onDraw }: DrawCardProps) => {
  if (!participant.active) {
    return null; // Don't render inactive cards in drawing phase
  }

  return (
    <button
      type="button"
      className="group focus-outline rounded-2xl border border-slate-200 bg-slate-50 card-face-down hover:bg-slate-100 cursor-pointer w-full text-left flex flex-col overflow-hidden transition"
      onClick={() => onDraw(participant.id)}
    >
      <div className="w-full pt-[75%] relative bg-slate-50 overflow-hidden">
        <div className="absolute inset-0 flex flex-col items-center justify-center px-3 py-4 gap-2">
          <svg
            viewBox="0 0 64 64"
            aria-hidden="true"
            className="w-10 h-10 text-red-600 group-hover:scale-110 transition-transform"
          >
            <path
              d="M10 42 L30 8 L54 42 Z"
              fill="#dc2626"
              stroke="#b91c1c"
              strokeWidth="2"
            />
            <rect
              x="8"
              y="40"
              width="48"
              height="8"
              rx="4"
              fill="#ffffff"
              stroke="#e5e7eb"
              strokeWidth="2"
            />
            <circle cx="30" cy="10" r="5" fill="#ffffff" stroke="#e5e7eb" strokeWidth="2" />
          </svg>
          <p className="mt-1 text-xs font-semibold text-slate-700">Tap to reveal</p>
        </div>
      </div>
    </button>
  );
});

DrawCard.displayName = 'DrawCard';

