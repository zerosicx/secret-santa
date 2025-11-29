import { memo } from 'react';
import { Participant } from '../../types';

interface ParticipantCardProps {
  participant: Participant;
  onEdit: (id: string) => void;
}

export const ParticipantCard = memo(({ participant, onEdit }: ParticipantCardProps) => {
  return (
    <button
      type="button"
      className="group focus-outline rounded-2xl border border-red-100 bg-red-50 hover:bg-red-100/80 w-full text-left flex flex-col overflow-hidden transition"
      onClick={() => onEdit(participant.id)}
    >
      <div className="w-full pt-[75%] relative bg-white/60 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center bg-white">
          {participant.photoUrl ? (
            <img
              src={participant.photoUrl}
              alt={`${participant.name}'s photo`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-2xl font-bold text-red-700">
              {participant.name ? participant.name.charAt(0).toUpperCase() : '?'}
            </div>
          )}
        </div>
      </div>
      <div className="px-3 py-2 flex items-center justify-between gap-2 border-t border-red-100 bg-white/70">
        <p className="text-sm font-semibold text-slate-900 truncate">{participant.name}</p>
        <span className="inline-flex items-center text-[11px] font-medium text-red-700 hover:text-red-900 bg-red-100/70 rounded-full px-2 py-1">
          Edit
        </span>
      </div>
    </button>
  );
});

ParticipantCard.displayName = 'ParticipantCard';

